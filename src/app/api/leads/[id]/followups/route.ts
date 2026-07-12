import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getAdminSession } from "@/lib/admin-auth";

/* ------------------------------------------------------------------ */
/*  Admin-only per-lead followups CRUD.                               */
/*  GET  /api/leads/<id>/followups?status=scheduled                   */
/*  POST /api/leads/<id>/followups { topic, scheduled_for,            */
/*                                  template?, lang?, scheduled_by? } */
/*                                                                   */
/*  Lets admins schedule a Resend-dispatched follow-up for a         */
/*  specific lead. The cron route (/api/cron/followups) handles      */
/*  the actual send.                                                  */
/* ------------------------------------------------------------------ */

const ALLOWED_TEMPLATES = [
  "lead_followup_checkin",
  "lead_followup_welcome",
  "lead_followup_proposal",
  "lead_followup_thanks",
];
const ALLOWED_STATUS = ["scheduled", "completed", "failed", "cancelled"];
const ALLOWED_LANGS = ["en", "de", "fr", "es"];

async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized \u2014 admin login required" },
      { status: 401 },
    );
  }
  return null;
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id: leadId } = await ctx.params;
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const limit = Math.min(
    Math.max(parseInt(url.searchParams.get("limit") ?? "50", 10), 1),
    200,
  );

  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  let query = client
    .from("lead_followups")
    .select("*", { count: "exact" })
    .eq("lead_id", leadId)
    .order("scheduled_for", { ascending: false })
    .limit(limit);
  if (status && ALLOWED_STATUS.includes(status)) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    rows: data ?? [],
    total: count ?? data?.length ?? 0,
  });
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id: leadId } = await ctx.params;
  const session = await getAdminSession();
  const scheduledBy = session?.email ?? "admin";

  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const raw = (body ?? {}) as Record<string, unknown>;

  const topic =
    typeof raw.topic === "string" && raw.topic.trim().length > 0
      ? raw.topic.trim().slice(0, 200)
      : "Follow-up";
  const template =
    typeof raw.template === "string" && ALLOWED_TEMPLATES.includes(raw.template)
      ? raw.template
      : "lead_followup_checkin";
  const lang =
    typeof raw.lang === "string" && ALLOWED_LANGS.includes(raw.lang)
      ? raw.lang
      : "en";
  const scheduledForRaw =
    typeof raw.scheduled_for === "string" ? raw.scheduled_for : "";
  const scheduledFor = new Date(scheduledForRaw);
  if (Number.isNaN(scheduledFor.getTime())) {
    return NextResponse.json(
      { error: "A valid ISO scheduled_for timestamp is required." },
      { status: 400 },
    );
  }

  // Confirm lead exists \u2014 avoid orphan FK rows. (The lead_id FK will
  // also reject this, but the error message is friendlier if we check
  // first.)
  const { data: lead, error: leadErr } = await client
    .from("leads")
    .select("id")
    .eq("id", leadId)
    .maybeSingle();
  if (leadErr) {
    return NextResponse.json({ error: leadErr.message }, { status: 500 });
  }
  if (!lead) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }

  const { data, error } = await client
    .from("lead_followups")
    .insert({
      lead_id: leadId,
      topic,
      template,
      lang,
      status: "scheduled",
      scheduled_for: scheduledFor.toISOString(),
      scheduled_by: scheduledBy,
    })
    .select("id")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(
    { success: true, id: data?.id ?? null },
    { status: 201 },
  );
}
