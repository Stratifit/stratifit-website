import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getAdminSession } from "@/lib/admin-auth";

/* ------------------------------------------------------------------ */
/*  Admin-only llm-log API.                                            */
/*  GET /api/llm-log?limit=50&offset=0&chatbot=ai&status=ok            */
/*  DELETE /api/llm-log?days=30 [--force keeps ok rows too]            */
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
  const chatbot = url.searchParams.get("chatbot");
  const status = url.searchParams.get("status");
  const q = url.searchParams.get("q")?.trim();

  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 },
    );
  }

  let query = client
    .from("llm_log")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (chatbot && ["ai", "contact", "coming_soon", "faq"].includes(chatbot)) {
    query = query.eq("chatbot", chatbot);
  }
  if (
    status &&
    [
      "ok",
      "no_api_key",
      "rate_limited",
      "empty_response",
      "timeout",
      "error",
      "disabled",
    ].includes(status)
  ) {
    query = query.eq("status", status);
  }
  if (q) {
    query = query.or(`query.ilike.%${q}%,response.ilike.%${q}%,error.ilike.%${q}%`);
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

  let query = client.from("llm_log").delete().lt("created_at", cutoff);
  if (!force) {
    // Default policy: keep 'ok' rows for audit. Drop failed/skip rows.
    query = query.in("status", [
      "no_api_key",
      "rate_limited",
      "empty_response",
      "timeout",
      "error",
      "disabled",
    ]);
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
