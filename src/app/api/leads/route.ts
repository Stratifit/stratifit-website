import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getAdminSession } from "@/lib/admin-auth";

/* ------------------------------------------------------------------ */
/*  Admin-only Leads API.                                              */
/*  GET  /api/leads?limit=50&offset=0&status=qualified&q=ada          */
/*  POST /api/leads  { name?, email, service?, source?, status?,       */
/*                    budget?, lang?, notes?, metadata? }             */
/*                                                                   */
/*  Used by the /admin/leads viewer and the manual entry flow.       */
/* ------------------------------------------------------------------ */

const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 50;
const ALLOWED_STATUS = ["new", "qualified", "in-review", "won", "lost"];
const ALLOWED_LANGS = ["en", "de", "fr", "es"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const service = url.searchParams.get("service");
  const source = url.searchParams.get("source");
  const q = url.searchParams.get("q")?.trim();

  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  let query = client
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && ALLOWED_STATUS.includes(status)) {
    query = query.eq("status", status);
  }
  if (service) {
    query = query.eq("service", service);
  }
  if (source) {
    query = query.eq("source", source);
  }
  if (q) {
    query = query.or(
      `name.ilike.%${q}%,email.ilike.%${q}%,notes.ilike.%${q}%`,
    );
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

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

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
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 },
    );
  }

  // Trim + bound-check each field so a stray giant string can't get into
  // the table. Status / lang validated against the table's CHECK values.
  const status =
    typeof raw.status === "string" && ALLOWED_STATUS.includes(raw.status)
      ? raw.status
      : "new";
  const lang =
    typeof raw.lang === "string" && ALLOWED_LANGS.includes(raw.lang)
      ? raw.lang
      : "en";
  const name =
    typeof raw.name === "string" ? raw.name.slice(0, 200) : "";
  const service =
    typeof raw.service === "string" ? raw.service.slice(0, 120) : "";
  const source =
    typeof raw.source === "string" ? raw.source.slice(0, 64) : "admin_manual";
  const budget =
    typeof raw.budget === "string" ? raw.budget.slice(0, 80) : "";
  const notes =
    typeof raw.notes === "string" ? raw.notes.slice(0, 4000) : "";

  const { data, error } = await client
    .from("leads")
    .insert({
      name,
      email,
      service,
      source,
      status,
      budget,
      lang,
      notes,
      metadata: {},
    })
    .select("id")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, id: data?.id ?? null }, { status: 201 });
}
