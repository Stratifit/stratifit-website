import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getAdminSession } from "@/lib/admin-auth";

const ALLOWED_STATUS = ["new", "qualified", "in-review", "won", "lost"];

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

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await ctx.params;
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

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof raw.status === "string") {
    if (!ALLOWED_STATUS.includes(raw.status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed: ${ALLOWED_STATUS.join(", ")}` },
        { status: 400 },
      );
    }
    update.status = raw.status;
  }
  if (typeof raw.name === "string") update.name = raw.name.slice(0, 200);
  if (typeof raw.service === "string") update.service = raw.service.slice(0, 120);
  if (typeof raw.budget === "string") update.budget = raw.budget.slice(0, 80);
  if (typeof raw.notes === "string") update.notes = raw.notes.slice(0, 4000);

  if (Object.keys(update).length === 1) {
    return NextResponse.json(
      { error: "No recognizable fields to update." },
      { status: 400 },
    );
  }

  const { data, error } = await client
    .from("leads")
    .update(update)
    .eq("id", id)
    .select("id, status")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, id: data.id, status: data.status });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await ctx.params;
  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { error } = await client.from("leads").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
