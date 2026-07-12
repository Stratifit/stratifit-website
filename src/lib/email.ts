import "server-only";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Language } from "@/lib/cms-types";

/* ------------------------------------------------------------------ */
/*  Resend client — lazy.                                              */
/*  Returns null when RESEND_API_KEY is missing so callers can         */
/*  degrade gracefully (still write a 'failed' row to email_log).      */
/* ------------------------------------------------------------------ */
let _resend: Resend | null | undefined;
function getResend(): Resend | null {
  if (_resend !== undefined) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    _resend = null;
    return null;
  }
  _resend = new Resend(key);
  return _resend;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM);
}

/* ------------------------------------------------------------------ */
/*  Template names — extend as we add more workflows.                  */
/* ------------------------------------------------------------------ */
export type EmailTemplate =
  | "notify_welcome"
  | "notify_already_subscribed"
  | "lead_confirmation"
  | "launch_announcement";

/* ------------------------------------------------------------------ */
/*  Email log row shape — mirrors the Supabase table.                  */
/* ------------------------------------------------------------------ */
export interface EmailLogRow {
  id?: string;
  recipient: string;
  subject: string;
  body: string;
  template_name: EmailTemplate | string;
  status: "queued" | "sent" | "failed";
  resend_id?: string | null;
  error?: string | null;
  attempt_count: number;
  related_subscriber_id?: string | null;
  sent_at?: string | null;
}

export interface SendEmailInput {
  to: string;
  subject: string;
  template: EmailTemplate | string;
  bodyHtml: string;
  bodyText: string;
  relatedSubscriberId?: string;
}

export interface SendEmailResult {
  ok: boolean;
  logId: string | null;
  resendId: string | null;
  status: "sent" | "failed" | "queued";
  error?: string;
}

/* ------------------------------------------------------------------ */
/*  sendEmail — writes an email_log row FIRST (status='queued'),      */
/*  then attempts the Resend send, then updates the row.              */
/*  Never throws. Logs to console + email_log on every error.         */
/* ------------------------------------------------------------------ */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const client = getSupabaseAdmin();
  if (!client) {
    console.error("[email] Supabase not configured; cannot write email_log row");
    return { ok: false, logId: null, resendId: null, status: "failed", error: "supabase_not_configured" };
  }

  const mailFrom = process.env.MAIL_FROM;
  const resend = getResend();
  if (!mailFrom || !resend) {
    console.warn(
      "[email] RESEND_API_KEY or MAIL_FROM not set; recording as failed.",
    );
    await writeLog(client, {
      recipient: input.to,
      subject: input.subject,
      body: input.bodyHtml,
      template_name: input.template,
      status: "failed",
      error: "Resend not configured (RESEND_API_KEY / MAIL_FROM)",
      attempt_count: 0,
      related_subscriber_id: input.relatedSubscriberId ?? null,
      sent_at: null,
    });
    return {
      ok: false,
      logId: null,
      resendId: null,
      status: "failed",
      error: "Resend not configured",
    };
  }

  // 1. Write a queued log entry — gives admins visibility into the send
  //    even when Resend is slow or fails.
  const logId = await writeLog(client, {
    recipient: input.to,
    subject: input.subject,
    body: input.bodyHtml,
    template_name: input.template,
    status: "queued",
    attempt_count: 1,
    related_subscriber_id: input.relatedSubscriberId ?? null,
    sent_at: null,
  });

  // 2. Attempt the send.
  let resendId: string | null = null;
  let sendError: string | null = null;
  try {
    const result = await resend.emails.send({
      from: mailFrom,
      to: input.to,
      subject: input.subject,
      html: input.bodyHtml,
      text: input.bodyText,
    });
    if (result.error) {
      sendError = result.error.message ?? "Unknown Resend error";
    } else {
      resendId = result.data?.id ?? null;
    }
  } catch (err) {
    sendError = err instanceof Error ? err.message : "send threw";
  }

  // 3. Update the log row with the final status.
  if (logId) {
    await client
      .from("email_log")
      .update({
        status: sendError ? "failed" : "sent",
        resend_id: resendId,
        error: sendError,
        sent_at: sendError ? null : new Date().toISOString(),
      })
      .eq("id", logId);
  }

  return {
    ok: !sendError,
    logId,
    resendId,
    status: sendError ? "failed" : "sent",
    ...(sendError ? { error: sendError } : {}),
  };
}

/* ------------------------------------------------------------------ */
/*  Log writer helper — returns the new row id, or null on failure.   */
/* ------------------------------------------------------------------ */
async function writeLog(
  client: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  row: EmailLogRow,
): Promise<string | null> {
  const { data, error } = await client
    .from("email_log")
    .insert({
      recipient: row.recipient,
      subject: row.subject,
      body: row.body,
      template_name: row.template_name,
      status: row.status,
      resend_id: row.resend_id ?? null,
      error: row.error ?? null,
      attempt_count: row.attempt_count,
      related_subscriber_id: row.related_subscriber_id ?? null,
      sent_at: row.sent_at ?? null,
    })
    .select("id")
    .single();
  if (error) {
    console.error("[email] failed to write email_log row:", error.message);
    return null;
  }
  return data?.id ?? null;
}

/* ------------------------------------------------------------------ */
/*  4-language templates for the Coming Soon "Notify When It's Live"   */
/*  flow. Add new templates below as new workflows light up.           */
/* ------------------------------------------------------------------ */

interface LocalizedTemplate {
  subject: string;
  preview: string;
  bodyHtml: string;
  bodyText: string;
}

const SIGNATURE_BY_LANG: Record<Language, string> = {
  en: "The Stratifit team",
  de: "Das Stratifit-Team",
  fr: "L'équipe Stratifit",
  es: "El equipo Stratifit",
};

function wrapHtml(lang: Language, inner: string): string {
  const sig = SIGNATURE_BY_LANG[lang];
  return `<!doctype html>
<html lang="${lang}">
  <body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e5e5e5;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#f5a623;margin-bottom:24px;">
        Stratifit
      </div>
      <div style="font-size:15px;line-height:1.7;">${inner}</div>
      <hr style="border:0;border-top:1px solid rgba(255,255,255,0.08);margin:32px 0 16px;" />
      <div style="font-size:11px;color:#666;">— ${sig}</div>
    </div>
  </body>
</html>`;
}

const NOTIFY_WELCOME: Record<Language, LocalizedTemplate> = {
  en: {
    subject: "You're on the Stratifit launch list 🚀",
    preview: "We'll let you know the moment we go live.",
    bodyHtml: wrapHtml(
      "en",
      `<p>Thanks for signing up — you're now on the Stratifit launch list.</p>
       <p>We'll send you a single email the day we go live. No spam, no follow-ups, no upsells.</p>
       <p>In the meantime, feel free to chat with our AI on the coming-soon page — it knows everything we do.</p>`,
    ),
    bodyText:
      "Thanks for signing up — you're now on the Stratifit launch list.\n\nWe'll send you a single email the day we go live. No spam, no follow-ups, no upsells.\n\nIn the meantime, feel free to chat with our AI on the coming-soon page — it knows everything we do.\n\n— The Stratifit team",
  },
  de: {
    subject: "Du bist auf der Stratifit-Launch-Liste 🚀",
    preview: "Wir melden uns, sobald wir live gehen.",
    bodyHtml: wrapHtml(
      "de",
      `<p>Danke fürs Eintragen — du bist jetzt auf der Stratifit-Launch-Liste.</p>
       <p>Wir schicken dir genau eine E-Mail, sobald wir live gehen. Kein Spam, keine Follow-ups, kein Upselling.</p>
       <p>In der Zwischenzeit kannst du gerne mit unserer KI auf der Coming-Soon-Seite chatten — sie weiß alles, was wir tun.</p>`,
    ),
    bodyText:
      "Danke fürs Eintragen — du bist jetzt auf der Stratifit-Launch-Liste.\n\nWir schicken dir genau eine E-Mail, sobald wir live gehen. Kein Spam, keine Follow-ups, kein Upselling.\n\nIn der Zwischenzeit kannst du gerne mit unserer KI auf der Coming-Soon-Seite chatten — sie weiß alles, was wir tun.\n\n— Das Stratifit-Team",
  },
  fr: {
    subject: "Vous êtes sur la liste de lancement Stratifit 🚀",
    preview: "Nous vous préviendrons dès que nous serons en ligne.",
    bodyHtml: wrapHtml(
      "fr",
      `<p>Merci pour votre inscription — vous faites désormais partie de la liste de lancement Stratifit.</p>
       <p>Nous vous enverrons un seul e-mail le jour du lancement. Pas de spam, pas de relance, pas d'upselling.</p>
       <p>En attendant, n'hésitez pas à discuter avec notre IA sur la page « bientôt en ligne » — elle sait tout ce que nous faisons.</p>`,
    ),
    bodyText:
      "Merci pour votre inscription — vous faites désormais partie de la liste de lancement Stratifit.\n\nNous vous enverrons un seul e-mail le jour du lancement. Pas de spam, pas de relance, pas d'upselling.\n\nEn attendant, n'hésitez pas à discuter avec notre IA sur la page « bientôt en ligne » — elle sait tout ce que nous faisons.\n\n— L'équipe Stratifit",
  },
  es: {
    subject: "Estás en la lista de lanzamiento de Stratifit 🚀",
    preview: "Te avisaremos en cuanto estemos en vivo.",
    bodyHtml: wrapHtml(
      "es",
      `<p>Gracias por registrarte — ya formas parte de la lista de lanzamiento de Stratifit.</p>
       <p>Te enviaremos un único correo el día del lanzamiento. Sin spam, sin seguimiento, sin ventas adicionales.</p>
       <p>Mientras tanto, no dudes en chatear con nuestra IA en la página de «próximamente» — conoce todo lo que hacemos.</p>`,
    ),
    bodyText:
      "Gracias por registrarte — ya formas parte de la lista de lanzamiento de Stratifit.\n\nTe enviaremos un único correo el día del lanzamiento. Sin spam, sin seguimiento, sin ventas adicionales.\n\nMientras tanto, no dudes en chatear con nuestra IA en la página de «próximamente» — conoce todo lo que hacemos.\n\n— El equipo Stratifit",
  },
};

const NOTIFY_ALREADY: Record<Language, LocalizedTemplate> = {
  en: {
    subject: "You're already on the Stratifit launch list ✅",
    preview: "Good news — you signed up before.",
    bodyHtml: wrapHtml(
      "en",
      `<p>Good news — this email is already on the Stratifit launch list.</p>
       <p>You're all set. We'll send a single email the moment we go live.</p>
       <p>No need to do anything else.</p>`,
    ),
    bodyText:
      "Good news — this email is already on the Stratifit launch list.\n\nYou're all set. We'll send a single email the moment we go live.\n\nNo need to do anything else.\n\n— The Stratifit team",
  },
  de: {
    subject: "Du bist bereits auf der Stratifit-Launch-Liste ✅",
    preview: "Gute Nachricht — du bist schon angemeldet.",
    bodyHtml: wrapHtml(
      "de",
      `<p>Gute Nachricht — diese E-Mail ist bereits auf der Stratifit-Launch-Liste.</p>
       <p>Alles klar. Wir schicken eine einzige E-Mail, sobald wir live gehen.</p>
       <p>Du musst nichts weiter tun.</p>`,
    ),
    bodyText:
      "Gute Nachricht — diese E-Mail ist bereits auf der Stratifit-Launch-Liste.\n\nAlles klar. Wir schicken eine einzige E-Mail, sobald wir live gehen.\n\nDu musst nichts weiter tun.\n\n— Das Stratifit-Team",
  },
  fr: {
    subject: "Vous êtes déjà sur la liste Stratifit ✅",
    preview: "Bonne nouvelle — vous étiez déjà inscrit(e).",
    bodyHtml: wrapHtml(
      "fr",
      `<p>Bonne nouvelle — cet e-mail figure déjà sur la liste de lancement Stratifit.</p>
       <p>Tout est prêt. Nous enverrons un seul e-mail dès que nous serons en ligne.</p>
       <p>Vous n'avez rien d'autre à faire.</p>`,
    ),
    bodyText:
      "Bonne nouvelle — cet e-mail figure déjà sur la liste de lancement Stratifit.\n\nTout est prêt. Nous enverrons un seul e-mail dès que nous serons en ligne.\n\nVous n'avez rien d'autre à faire.\n\n— L'équipe Stratifit",
  },
  es: {
    subject: "Ya estás en la lista de Stratifit ✅",
    preview: "Buenas noticias — ya te habías registrado.",
    bodyHtml: wrapHtml(
      "es",
      `<p>Buenas noticias — este correo ya está en la lista de lanzamiento de Stratifit.</p>
       <p>Ya está todo listo. Te enviaremos un único correo en cuanto estemos en vivo.</p>
       <p>No tienes que hacer nada más.</p>`,
    ),
    bodyText:
      "Buenas noticias — este correo ya está en la lista de lanzamiento de Stratifit.\n\nYa está todo listo. Te enviaremos un único correo en cuanto estemos en vivo.\n\nNo tienes que hacer nada más.\n\n— El equipo Stratifit",
  },
};

/* ------------------------------------------------------------------ */
/*  Public template builders                                          */
/* ------------------------------------------------------------------ */
export function getNotifyWelcomeEmail(lang: Language): LocalizedTemplate {
  return NOTIFY_WELCOME[lang] ?? NOTIFY_WELCOME.en;
}

export function getNotifyAlreadySubscribedEmail(lang: Language): LocalizedTemplate {
  return NOTIFY_ALREADY[lang] ?? NOTIFY_ALREADY.en;
}
