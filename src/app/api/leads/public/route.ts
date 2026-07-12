import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

/* ------------------------------------------------------------------ */
/*  POST /api/leads/public                                            */
/*                                                                   */
/*  Public contact-form ingest endpoint. Called from ContactModal.   */
/*  No admin cookie required — gated by                              */
/*    1) Cloudflare Turnstile (server-verified per submission),      */
/*    2) honeypot input (rejects bots that fill hidden fields),      */
/*    3) per-IP rate limit (5 posts / 10 min),                       */
/*    4) per-email dedupe (same email within 60 sec is a no-op).     */
/*                                                                   */
/*  On success:                                                      */
/*    - inserts a row into `leads` (status='new', source='contact_form'), */
/*    - inserts a row into `lead_followups` (status='scheduled',    */
/*      template='lead_followup_checkin', scheduled_for = NOW + 1h), */
/*    - stamps a structured "[ISO timestamp] Contact form ..." entry */
/*      into leads.notes so LeadDetailClient can display it as a     */
/*      discrete event card.                                        */
/*                                                                   */
/*  Returns JSON so the modal can switch into the localized success */
/*  state without a navigation.                                     */
/* ------------------------------------------------------------------ */

const MAX_PER_IP = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const EMAIL_DEDUPE_MS = 60 * 1000; // 60 seconds
const PREVIEW_LEN = 200;

/**
 * Cloudflare Turnstile test keys (no challenge required; documented at
 * https://developers.cloudflare.com/turnstile/troubleshooting/testing/).
 * Used only when TURNSTILE_SECRET is unset AND we're not in production —
 * so local dev exercises the full insert path without real captcha.
 */
const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";

/* --- In-memory defense-in-depth bookkeeping. Resets on cold start;
       acceptable for a contact form (acceptable to occasionally let a bot
       through after a deploy). For higher durability, swap to Supabase or
       Upstash Redis later. --- */
const ipWindow = new Map<string, { count: number; expires: number }>();
const emailDedupe = new Map<string, number>();

// Conservative email regex — RFC-pragmatic, blocks obvious garbage.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Lang = "en" | "de" | "fr" | "es";
function pickLang(input: unknown): Lang {
  if (typeof input === "string") {
    const v = input.toLowerCase().slice(0, 2);
    if (v === "en" || v === "de" || v === "fr" || v === "es") return v;
  }
  return "en";
}

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

function rateLimitOk(ip: string): boolean {
  const now = Date.now();
  const entry = ipWindow.get(ip);
  if (entry && entry.expires > now) {
    if (entry.count >= MAX_PER_IP) return false;
    entry.count += 1;
    return true;
  }
  ipWindow.set(ip, { count: 1, expires: now + WINDOW_MS });
  return true;
}

export async function POST(req: NextRequest) {
  // 1. Rate limit
  const ip = clientIp(req);
  if (!rateLimitOk(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  // 2. Body parse + length cap (so a bot can't OOM us with a giant payload)
  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > 16 * 1024) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }
    body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  // 3. Honeypot — bots that fill the hidden input get a generic 400
  if (typeof body.company_website === "string" && body.company_website.length > 0) {
    return NextResponse.json({ error: "spam" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
  const message = typeof body.message === "string" ? body.message.slice(0, 4000) : "";

  if (!name || !EMAIL_REGEX.test(email) || !message || message.length < 4) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  // 4. Per-email dedupe — if the same email submitted in the last 60s,
  //    silently return a no-op success so a frustrated retrying user doesn't
  //    see an error, but we don't create duplicate leads/followups.
  const dedupeUntil = emailDedupe.get(email) ?? 0;
  if (dedupeUntil > Date.now()) {
    return NextResponse.json({
      success: true,
      leadId: null,
      followupId: null,
      deduped: true,
    });
  }

  // 5. Turnstile verify
  const captchaToken =
    typeof body.captchaToken === "string" ? body.captchaToken : "";
  if (!captchaToken) {
    return NextResponse.json({ error: "captcha_required" }, { status: 400 });
  }

  let secret = process.env.TURNSTILE_SECRET ?? "";
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "captcha_not_configured" },
        { status: 503 },
      );
    }
    secret = TURNSTILE_TEST_SECRET; // dev-only always-pass
  }

  let verifyOk = false;
  let verifyCodes: string[] = [];
  try {
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response: captchaToken,
          remoteip: ip,
        }).toString(),
      },
    );
    const outcome = (await verifyRes.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    verifyOk = Boolean(outcome.success);
    verifyCodes = Array.isArray(outcome["error-codes"]) ? outcome["error-codes"] : [];
  } catch {
    verifyOk = false;
    verifyCodes = ["fetch-failed"];
  }

  if (!verifyOk) {
    // Note: never log the submission payload — only the verification
    // outcome codes. The PII (name/email/message) stays out of logs.
    console.warn(
      `[leads/public] Turnstile failed for ip=${ip}, codes=${verifyCodes.join(",") || "none"}`,
    );
    return NextResponse.json(
      { error: "captcha_failed", codes: verifyCodes },
      { status: 400 },
    );
  }

  // 6. Sanitize + collect extra fields
  const company = typeof body.company === "string" ? body.company.trim().slice(0, 120) : "";
  const services = Array.isArray(body.services)
    ? (body.services.filter((v) => typeof v === "string") as string[])
        .map((s) => s.slice(0, 80))
        .slice(0, 16)
    : [];
  const budgetRange =
    typeof body.budgetRange === "string" ? body.budgetRange.slice(0, 40) : "";
  const budgetCustom =
    typeof body.budgetCustom === "string" ? body.budgetCustom.slice(0, 80) : "";
  const budget = budgetRange || budgetCustom;
  const lang = pickLang(body.lang);

  // 7. Structured `notes` stamp. Keep the raw message at the end so manual
  //    editing in /admin/leads/[id] still works, and so the parser in
  //    LeadDetailClient reads only the structured header lines at the top.
  const preview = message.replace(/\s+/g, " ").slice(0, PREVIEW_LEN);
  const isoNow = new Date().toISOString();
  const notesHeader = [
    `[${isoNow}] Contact form submission`,
    `  Services: ${services.length ? services.join(", ") : "None"}`,
    `  Budget: ${budget || "None"}`,
    `  Message preview: ${preview}`,
    `  Source: contact_form, lang: ${lang}`,
    `  Company: ${company || "N/A"}`,
    `  IP: ${ip}`,
    "",
  ].join("\n");
  const notesValue = notesHeader + message;

  // 8. Insert leads row
  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json({ error: "server_error" }, { status: 503 });
  }

  const { data: lead, error: leadErr } = await client
    .from("leads")
    .insert({
      name,
      email,
      service: services[0] ?? "",
      source: "contact_form",
      status: "new",
      budget,
      lang,
      metadata: {
        services,
        budgetRange: budgetRange || null,
        budgetCustom: budgetCustom || null,
      },
      notes: notesValue,
    })
    .select("id")
    .single();

  if (leadErr || !lead?.id) {
    console.error(
      `[leads/public] insert lead failed: ${leadErr?.message ?? "no-data"}`,
    );
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const leadId = lead.id as string;

  // 9. Insert a scheduled follow-up row. scheduled_for is UTC ISO so the
  //    cron can compare directly against `now()` server-side.
  const scheduledFor = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const { data: followup, error: fuErr } = await client
    .from("lead_followups")
    .insert({
      lead_id: leadId,
      topic: "Contact form submission",
      template: "lead_followup_checkin",
      lang,
      status: "scheduled",
      scheduled_for: scheduledFor,
      scheduled_by: "contact_form",
    })
    .select("id")
    .single();

  if (fuErr) {
    // Lead was inserted but followup failed — log so admin can re-schedule
    // from the LeadDetailClient. Don't fail the user-facing response though.
    console.error(
      `[leads/public] insert followup failed: ${fuErr.message}`,
    );
  }

  // 10. Record dedupe. Cleared automatically after EMAIL_DEDUPE_MS.
  emailDedupe.set(email, Date.now() + EMAIL_DEDUPE_MS);
  // Sweep stale entries periodically (cheap O(n) on hot path).
  if (emailDedupe.size > 256) {
    const cutoff = Date.now();
    for (const [k, v] of emailDedupe) {
      if (v <= cutoff) emailDedupe.delete(k);
    }
  }

  return NextResponse.json({
    success: true,
    leadId,
    followupId: followup?.id ?? null,
  });
}
