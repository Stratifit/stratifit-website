import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getAdminSession } from "@/lib/admin-auth";

/* ------------------------------------------------------------------ */
/*  Admin-only email-log API.                                          */
/*  GET /api/email-log?limit=50&offset=0&status=sent&template=notify_welcome */
/*  DELETE /api/email-log?days=30 -- removes failed/queued rows older   */
/*   than N days. Sent rows are kept for audit; pass force=1 to delete  */
/*   everything older than N days.                                      */
/* ------------------------------------------------------------------ */

const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 50;

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

export async function GET(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const url = new URL(req.url);
  const limit = Math.min(
    Math.max(parseInt(url.searchParams.get("limit") ?? `${DEFAULT_LIMIT}`, 10), 1),
    MAX_LIMIT,
  );
  const offset = Math.max(parseInt(url.searchParams.get("offset") ?? "0", 10), 0);
  const status = url.searchParams.get("status");
  const template = url.searchParams.get("template");
  const q = url.searchParams.get("q")?.trim();

  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 },
    );
  }

  let query = client
    .from("email_log")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && ["queued", "sent", "failed"].includes(status)) {
    query = query.eq("status", status);
  }
  if (template) {
    query = query.eq("template_name", template);
  }
  if (q) {
    // Supabase ilike on recipient or subject — single wildcard form
    query = query.or(`recipient.ilike.%${q}%,subject.ilike.%${q}%`);
  }

  const { data, error, count } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    rows: data ?? [],
    total: count ?? data?.length ?? 0,
    limit,
    offset,
  });
}

export async function DELETE(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const url = new URL(req.url);
  const days = parseInt(url.searchParams.get("days") ?? "30", 10);
  const force = url.searchParams.get("force") === "1";

  if (!Number.isFinite(days) || days < 1) {
    return NextResponse.json(
      { error: "Valid ?days=N (>= 1) is required" },
      { status: 400 },
    );
  }

  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 },
    );
  }

  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  let query = client.from("email_log").delete().lt("created_at", cutoff);
  if (!force) {
    // Default policy: only purge failed/queued rows. Keep 'sent' for audit.
    query = query.in("status", ["failed", "queued"]);
  }

  const { error, count } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    deleted: count ?? null,
    cutoff,
    force,
  });
}
