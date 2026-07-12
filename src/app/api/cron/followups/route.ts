import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getAdminSession } from "@/lib/admin-auth";
import {
  sendEmail,
  getLeadFollowupEmail,
  type EmailTemplate,
} from "@/lib/email";
import type { Language } from "@/lib/cms-types";

/* ------------------------------------------------------------------ */
/*  GET /api/cron/followups                                           */
/*                                                                   */
/*  Vercel Cron trigger (every 15 min via vercel.json).              */
/*                                                                   */
/*  Auth:                                                            */
/*    - Production: Authorization: Bearer <CRON_SECRET>             */
/*    - Local dev or admin manual trigger:                           */
/*        admin session cookie (so we can run it from /admin)       */
/*                                                                   */
/*  Flow:                                                            */
/*    1. Atomically claim up to N (=50) due rows from                */
/*       lead_followups by flipping status='scheduled' ->            */
/*       'processing' via UPDATE ... RETURNING. This avoids          */
/*       double-sends if the cron fires twice during overlap.        */
/*    2. For each claimed row, resolve the Resend template,        */
/*       call sendEmail, then set status='completed'|'failed'.      */
/*    3. Always log every attempt to email_log inside sendEmail.    */
/*                                                                   */
/*  Returns a JSON summary so misfire debugging is easy.            */
/* ------------------------------------------------------------------ */

const MAX_PER_RUN = 50;

/** Bearer-token check against env. */
function checkBearer(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  // If CRON_SECRET is unset, only allow admin-cookie callers (local dev).
  if (!expected) return false;
  const header = req.headers.get("authorization") ?? "";
  if (!header.startsWith("Bearer ")) return false;
  const got = header.slice(7).trim();
  if (got.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(got), Buffer.from(expected));
  } catch {
    return false;
  }
}

interface ClaimedFollowup {
  id: string;
  lead_id: string;
  topic: string;
  template: string;
  lang: string;
  scheduled_for: string;
  attempts: number;
}
interface JoinLead {
  id: string;
  email: string;
  name: string;
  lang: string | null;
}
interface JoinedFollowup extends ClaimedFollowup {
  leads: JoinLead | null;
}

export async function GET(req: NextRequest) {
  if (!checkBearer(req)) {
    // Fall back to admin cookie for manual local triggers.
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized \u2014 set CRON_SECRET or sign in as admin" },
        { status: 401 },
      );
    }
  }

  return runFollowupSweep();
}

/** POST alias \u2014 Vercel cron uses GET, but admins may want to fire from a button. */
export async function POST(req: NextRequest) {
  return runFollowupSweep();
}

async function runFollowupSweep(): Promise<NextResponse> {
  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 },
    );
  }

  // 1. Atomically claim due rows.
  //    Race-safe because UPDATE ... RETURNING serially evaluates the
  //    WHERE clause. Two concurrent cron firings would each see a
  //    disjoint subset of rows (minus any rows already flipped to
  //    'processing' by the other invocation).
  const { data: claimed, error: claimErr } = await client
    .from("lead_followups")
    .update({
      status: "processing",
      attempts: 1, // bumped on each retry later \u2014 currently single-shot
      updated_at: new Date().toISOString(),
    })
    .eq("status", "scheduled")
    .lte("scheduled_for", new Date().toISOString())
    .order("scheduled_for", { ascending: true })
    .limit(MAX_PER_RUN)
    .select(
      "id, lead_id, topic, template, lang, scheduled_for, attempts, leads!inner ( id, email, name, lang )",
    );

  if (claimErr) {
    return NextResponse.json(
      { error: `claim failed: ${claimErr.message}` },
      { status: 500 },
    );
  }

  const rows = ((claimed ?? []) as unknown) as JoinedFollowup[];
  const processed = rows.length;
  const errors: Array<{ id: string; reason: string }> = [];
  let sent = 0;
  let failed = 0;

  // 2. Dispatch each row serially \u2014 avoids Resend rate limits and lets us
  //    fail fast on individual rows without taking down the whole run.
  for (const row of rows) {
    const lead = row.leads;
    if (!lead?.email) {
      await markCompleted(client, row.id, "failed", "Lead row missing email");
      errors.push({ id: row.id, reason: "missing lead email" });
      failed++;
      continue;
    }

    const lang: Language = pickLang(row.lang, lead.lang);
    const template = pickTemplate(row.template);
    const tpl = getLeadFollowupEmail(
      template,
      lang,
      {
        lead_name: lead.name || lead.email.split("@")[0],
        topic: row.topic,
        scheduled_for: formatDateTime(row.scheduled_for, lang),
      },
    );

    if (!tpl) {
      await markCompleted(
        client,
        row.id,
        "failed",
        `Unknown template: ${row.template}`,
      );
      errors.push({ id: row.id, reason: `unknown template ${row.template}` });
      failed++;
      continue;
    }

    const result = await sendEmail({
      to: lead.email,
      subject: tpl.subject,
      template,
      bodyHtml: tpl.bodyHtml,
      bodyText: tpl.bodyText,
    });

    if (result.ok) {
      await client
        .from("lead_followups")
        .update({
          status: "completed",
          sent_at: new Date().toISOString(),
          email_log_id: result.logId,
          last_error: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);
      sent++;
    } else {
      await client
        .from("lead_followups")
        .update({
          status: "failed",
          last_error: result.error ?? "unknown send error",
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);
      errors.push({
        id: row.id,
        reason: result.error ?? `send failed (status=${result.status})`,
      });
      failed++;
    }
  }

  // 3. If over the cap, signal "more rows remain" so Vercel keeps the next
  //    15-min firing in mind (covered automatically by the schedule).
  const remainingDue = await countDueRows(client);

  return NextResponse.json({
    processed,
    sent,
    failed,
    errors,
    remainingDue,
    limit: MAX_PER_RUN,
    ranAt: new Date().toISOString(),
  });
}

async function markCompleted(
  client: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  id: string,
  status: "completed" | "failed",
  reason: string,
) {
  await client
    .from("lead_followups")
    .update({
      status,
      last_error: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
}

async function countDueRows(
  client: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
): Promise<number> {
  const { count } = await client
    .from("lead_followups")
    .select("id", { count: "exact", head: true })
    .eq("status", "scheduled")
    .lte("scheduled_for", new Date().toISOString());
  return count ?? 0;
}

function pickLang(a?: string | null, b?: string | null): Language {
  const normalize = (v: string | null | undefined): Language | null => {
    if (!v) return null;
    const lower = v.toLowerCase();
    if (lower === "en" || lower === "de" || lower === "fr" || lower === "es") {
      return lower;
    }
    return null;
  };
  return normalize(a) ?? normalize(b) ?? "en";
}

function pickTemplate(s: string): EmailTemplate {
  // Defensive narrowing \u2014 fall back to checkin if the row carries an
  // unfamiliar template name (e.g. added via SQL).
  const allowed: EmailTemplate[] = [
    "lead_followup_welcome",
    "lead_followup_checkin",
    "lead_followup_proposal",
    "lead_followup_thanks",
  ];
  return (allowed as string[]).includes(s)
    ? (s as EmailTemplate)
    : "lead_followup_checkin";
}

function formatDateTime(iso: string, lang: Language): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  try {
    return d.toLocaleString(
      lang === "en" ? "en-US" : lang === "de" ? "de-DE" : lang === "fr" ? "fr-FR" : "es-ES",
      {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  } catch {
    return d.toISOString();
  }
}
