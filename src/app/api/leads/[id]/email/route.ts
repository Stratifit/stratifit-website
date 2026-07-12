import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getAdminSession } from "@/lib/admin-auth";
import { sendEmail } from "@/lib/email";

/* ------------------------------------------------------------------ */
/*  POST /api/leads/[id]/email                                         */
/*                                                                     */
/*  Admin affordance to send a manual one-off email to a single        */
/*  lead via the existing Resend pipeline (lib/email.ts).              */
/*                                                                     */
/*  Recipient is ALWAYS the lead's email — whatever the client may     */
/*  POST is ignored server-side, so a compromised admin cookie can't    */
/*  be used to spam from the UI.                                       */
/*                                                                     */
/*  Body: { subject, body } — plain text. The route wraps the plain     */
/*  text in a minimal HTML shell so Resend's html+text pair is valid.  */
/*                                                                     */
/*  Templates log to email_log.template_name = "admin_manual_email" so */
/*  /admin/email-log can filter manual sends apart from the cron-       */
/*  dispatched followups.                                              */
/* ------------------------------------------------------------------ */

const MAX_SUBJECT_LEN = 200;
const MAX_BODY_LEN = 4000;

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized \u2014 admin login required" },
      { status: 401 },
    );
  }

  const { id: leadId } = await ctx.params;
  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { data: lead, error: leadErr } = await client
    .from("leads")
    .select("id, email, name, lang")
    .eq("id", leadId)
    .maybeSingle();

  if (leadErr) {
    return NextResponse.json({ error: leadErr.message }, { status: 500 });
  }
  if (!lead?.email) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const raw = (body ?? {}) as Record<string, unknown>;

  const subject =
    typeof raw.subject === "string"
      ? raw.subject.trim().slice(0, MAX_SUBJECT_LEN)
      : "";
  const bodyText =
    typeof raw.body === "string"
      ? raw.body.trim().slice(0, MAX_BODY_LEN)
      : "";

  if (!subject || !bodyText) {
    return NextResponse.json(
      { error: "Subject and body are required." },
      { status: 400 },
    );
  }

  const bodyHtml =
    `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 15px; line-height: 1.6; color: #1a1a1a;">` +
    `<pre style="font-family: inherit; white-space: pre-wrap; margin: 0;">` +
    escapeHtml(bodyText) +
    `</pre></div>`;

  const result = await sendEmail({
    to: lead.email,
    subject,
    template: "admin_manual_email",
    bodyHtml,
    bodyText,
  });

  if (!result.ok) {
    if (result.error?.includes("Resend not configured")) {
      return NextResponse.json(
        {
          error:
            "Resend is not configured on the server. Set RESEND_API_KEY and MAIL_FROM on Vercel \u2192 Project \u2192 Settings \u2192 Environment Variables, then redeploy.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: result.error || "Send failed" },
      { status: 502 },
    );
  }

  return NextResponse.json(
    { success: true, emailLogId: result.logId ?? null },
    { status: 201 },
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
