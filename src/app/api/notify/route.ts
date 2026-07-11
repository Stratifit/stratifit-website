import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getAdminSession } from "@/lib/admin-auth";

/* ------------------------------------------------------------------ */
/*  POST /api/notify                                                  */
/*  Public endpoint for the Coming Soon "Notify When It's Live" form. */
/*  Validates email, upserts into notify_subscribers (idempotent on    */
/*  duplicate emails). Source + lang are tracked for analytics.       */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, lang, source } = (body ?? {}) as {
    email?: unknown;
    lang?: unknown;
    source?: unknown;
  };

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json(
      { error: "Database not configured. Please try again later." },
      { status: 503 },
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const safeLang = typeof lang === "string" && lang.length <= 8 ? lang : "en";
  const safeSource = typeof source === "string" && source.length <= 64 ? source : "coming_soon_page";

  const { error } = await client
    .from("notify_subscribers")
    .upsert(
      {
        email: normalizedEmail,
        status: "subscribed",
        source: safeSource,
        lang: safeLang,
      },
      { onConflict: "email" },
    );

  if (error) {
    return NextResponse.json(
      { error: "Could not save your email. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}

/* ------------------------------------------------------------------ */
/*  DELETE /api/notify?id=<uuid>                                      */
/*  Admin-only. Removes a subscriber row by id.                       */
/* ------------------------------------------------------------------ */

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "Missing id query parameter" },
      { status: 400 },
    );
  }

  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  const { error } = await client.from("notify_subscribers").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
