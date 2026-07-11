import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabase } from "@/lib/supabase";
import { getAdminSession } from "@/lib/admin-auth";

// Tables that are safe to query (whitelist)
const ALLOWED_TABLES = [
  "site_settings",
  "header_nav_links",
  "footer_content",
  "hero_content",
  "core_services",
  "service_page_content",
  "process_steps",
  "why_choose_us_content",
  "why_choose_us_benefits",
  "about_page_content",
  "about_stats",
  "about_values",
  "service_packages",
  "testimonials",
  "faq_entries",
  "projects",
  "insights",
  "buy_business_niches",
  "niche_stats",
  "niche_inclusions",
  "buy_business_brands",
  "legal_pages",
  "contact_form_config",
  "section_labels",
] as const;

type AllowedTable = (typeof ALLOWED_TABLES)[number];

function isValidTable(table: string): table is AllowedTable {
  return ALLOWED_TABLES.includes(table as AllowedTable);
}

/* ------------------------------------------------------------------ */
/*  Auth guard for write methods                                       */
/*  GET stays public so the public site can read CMS content.         */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  GET /api/cms/[section]                                            */
/*  Returns all rows (sorted) or a single row for single-row tables.  */
/* ------------------------------------------------------------------ */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> },
) {
  const { section } = await params;

  if (!isValidTable(section)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }

  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  let query = client.from(section).select("*");

  // Add ordering for list tables
  if (
    [
      "header_nav_links",
      "core_services",
      "process_steps",
      "why_choose_us_benefits",
      "about_stats",
      "about_values",
      "service_packages",
      "testimonials",
      "faq_entries",
      "projects",
      "insights",
      "buy_business_niches",
      "niche_stats",
      "niche_inclusions",
      "buy_business_brands",
    ].includes(section)
  ) {
    query = query.order("sort_order", { ascending: true });
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Single-row tables return the first row (or null)
  const singleRowTables = [
    "site_settings",
    "footer_content",
    "hero_content",
    "why_choose_us_content",
    "about_page_content",
    "contact_form_config",
    "section_labels",
  ];

  if (singleRowTables.includes(section)) {
    return NextResponse.json(data?.[0] ?? null);
  }

  return NextResponse.json(data ?? []);
}

/* ------------------------------------------------------------------ */
/*  PUT /api/cms/[section]                                            */
/*  Upserts a single row (for single-row tables) or updates by id.    */
/*  Requires an admin session cookie.                                  */
/* ------------------------------------------------------------------ */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> },
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { section } = await params;

  if (!isValidTable(section)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }

  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const body = await req.json();
  const { id, ...rest } = body;

  const singleRowTables = [
    "site_settings",
    "footer_content",
    "hero_content",
    "why_choose_us_content",
    "about_page_content",
    "contact_form_config",
    "section_labels",
  ];

  if (singleRowTables.includes(section)) {
    // Upsert the single row
    const { data, error } = await client
      .from(section)
      .upsert({ id: id || undefined, ...rest, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  }

  // List tables: update by id
  if (!id) {
    return NextResponse.json({ error: "id is required for list items" }, { status: 400 });
  }

  const { data, error } = await client
    .from(section)
    .update(rest)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

/* ------------------------------------------------------------------ */
/*  POST /api/cms/[section]                                           */
/*  Creates a new item in list tables. Requires an admin session.      */
/* ------------------------------------------------------------------ */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> },
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { section } = await params;

  if (!isValidTable(section)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }

  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const body = await req.json();

  const { data, error } = await client.from(section).insert(body).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}

/* ------------------------------------------------------------------ */
/*  DELETE /api/cms/[section]?id=xxx                                   */
/*  Requires an admin session.                                         */
/* ------------------------------------------------------------------ */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> },
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { section } = await params;

  if (!isValidTable(section)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }

  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id query parameter is required" }, { status: 400 });
  }

  const { error } = await client.from(section).delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
