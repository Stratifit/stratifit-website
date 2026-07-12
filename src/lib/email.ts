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
  | "launch_announcement"
  // Phase 3 \u2014 admin-scheduled follow-ups dispatched by /api/cron/followups.
  | "lead_followup_welcome"
  | "lead_followup_checkin"
  | "lead_followup_proposal"
  | "lead_followup_thanks";

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
/* ------------------------------------------------------------------ */
/*  Phase 3 — 4-language templates for admin-scheduled                */
/*  lead follow-ups. Dispatched by /api/cron/followups and             */
/*  /api/leads/[id]/followups. Variables are passed in via            */
/*  `vars` and substituted into the body before render.               */
/* ------------------------------------------------------------------ */

function renderVars(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (full, key) => {
    const v = vars[key];
    return v == null ? full : String(v);
  });
}

export interface FollowupVars {
  lead_name: string;
  topic: string;
  scheduled_for: string; // human-friendly, already formatted in caller
  // Allow ad-hoc variables to pass through renderVars without exhaustive typing.
  // Note: deliberately no `?:` markers here, since index signatures don't permit
  // `undefined` members. Callers must always pass concrete string | number values.
  [key: string]: string | number;
}

const LEAD_FOLLOWUP_WELCOME: Record<Language, LocalizedTemplate> = {
  en: makeFollowup("en", {
    subject: "{{lead_name}}, welcome to Stratifit \ud83d\ude80",
    preview: "Your project is in motion.",
    intro: "Thanks for reaching out about {{topic}}. We've added you to our system and someone from the team will get back to you shortly.",
    next: "In the meantime, reply directly to this email with any project details or timeline constraints \u2014 the more we know, the better we can scope.",
  }),
  de: makeFollowup("de", {
    subject: "{{lead_name}}, willkommen bei Stratifit \ud83d\ude80",
    preview: "Dein Projekt ist in Bewegung.",
    intro: "Danke f\u00fcr deine Anfrage zu {{topic}}. Wir haben dich in unserem System aufgenommen und jemand aus dem Team meldet sich in K\u00fcrze bei dir.",
    next: "In der Zwischenzeit kannst du direkt auf diese E-Mail antworten \u2014 je mehr wir wissen, desto besser k\u00f6nnen wir den Umfang einsch\u00e4tzen.",
  }),
  fr: makeFollowup("fr", {
    subject: "{{lead_name}}, bienvenue chez Stratifit \ud83d\ude80",
    preview: "Votre projet est en marche.",
    intro: "Merci pour votre demande concernant {{topic}}. Nous vous avons ajout\u00e9 \u00e0 notre syst\u00e8me et un membre de l'\u00e9quipe vous recontactera sous peu.",
    next: "En attendant, r\u00e9pondez directement \u00e0 cet e-mail \u2014 plus nous en savons, mieux nous pouvons \u00e9valuer le p\u00e9rim\u00e8tre.",
  }),
  es: makeFollowup("es", {
    subject: "{{lead_name}}, bienvenido a Stratifit \ud83d\ude80",
    preview: "Tu proyecto est\u00e1 en marcha.",
    intro: "Gracias por contactarnos sobre {{topic}}. Te hemos a\u00f1adido a nuestro sistema y alguien del equipo se pondr\u00e1 en contacto contigo en breve.",
    next: "Mientras tanto, responde directamente a este correo \u2014 cuanto m\u00e1s sepamos, mejor podremos delimitar el alcance.",
  }),
};

const LEAD_FOLLOWUP_CHECKIN: Record<Language, LocalizedTemplate> = {
  en: makeFollowup("en", {
    subject: "Quick check-in \u2014 {{topic}}",
    preview: "Following up on your project.",
    intro: "Just a quick note following up on {{topic}}. We wanted to make sure you have everything you need to move forward.",
    next: "If a quick call would help unblock things, reply with two or three time slots that work this week.",
  }),
  de: makeFollowup("de", {
    subject: "Kurzes Check-in \u2014 {{topic}}",
    preview: "Nachfrage zu deinem Projekt.",
    intro: "Nur eine kurze Nachfrage zu {{topic}}. Wir wollten sichergehen, dass du alles hast, um voranzukommen.",
    next: "Falls ein kurzer Anruf helfen w\u00fcrde, antworte mit zwei oder drei Zeitfenstern, die diese Woche passen.",
  }),
  fr: makeFollowup("fr", {
    subject: "Petit check-in \u2014 {{topic}}",
    preview: "Suivi de votre projet.",
    intro: "Un petit mot pour faire le point sur {{topic}}. Nous voulions nous assurer que tout est clair pour avancer.",
    next: "Si un appel rapide aiderait \u00e0 d\u00e9bloquer, r\u00e9pondez avec deux ou trois cr\u00e9neaux qui conviendraient cette semaine.",
  }),
  es: makeFollowup("es", {
    subject: "Peque\u00f1o check-in \u2014 {{topic}}",
    preview: "Seguimiento de tu proyecto.",
    intro: "Una nota r\u00e1pida para hacer un seguimiento de {{topic}}. Queremos asegurarnos de que tienes todo lo necesario para avanzar.",
    next: "Si una llamada breve ayudara a desbloquear, responde con dos o tres franjas horarias que te vengan bien esta semana.",
  }),
};

const LEAD_FOLLOWUP_PROPOSAL: Record<Language, LocalizedTemplate> = {
  en: makeFollowup("en", {
    subject: "Proposal ready for review \u2014 {{topic}}",
    preview: "Your scoped proposal is attached.",
    intro: "The proposed scope for {{topic}} is ready for review. Take a look and let us know what to adjust \u2014 line items, timeline, budget.",
    next: "We'll plan a 20-minute walk-through once you've had a chance to read through.",
  }),
  de: makeFollowup("de", {
    subject: "Angebot zur Pr\u00fcfung bereit \u2014 {{topic}}",
    preview: "Dein Vorschlag ist erstellt.",
    intro: "Der vorgeschlagene Umfang f\u00fcr {{topic}} liegt zur Pr\u00fcfung bereit. Sag uns, was angepasst werden soll \u2014 Positionen, Zeitplan, Budget.",
    next: "Wir planen ein 20-min\u00fctiges Walk-through, sobald du die Gelegenheit hattest, alles zu lesen.",
  }),
  fr: makeFollowup("fr", {
    subject: "Proposition pr\u00eate \u00e0 examiner \u2014 {{topic}}",
    preview: "Votre proposition est pr\u00eate.",
    intro: "Le p\u00e9rim\u00e8tre propos\u00e9 pour {{topic}} est pr\u00eat \u00e0 \u00eatre examin\u00e9. Dites-nous ce qu'il faut ajuster \u2014 postes, calendrier, budget.",
    next: "Nous pr\u00e9voyons un walk-through de 20 minutes d\u00e8s que vous aurez eu le temps de lire.",
  }),
  es: makeFollowup("es", {
    subject: "Propuesta lista para revisar \u2014 {{topic}}",
    preview: "Tu propuesta est\u00e1 lista.",
    intro: "El alcance propuesto para {{topic}} est\u00e1 listo para revisar. Dinos qu\u00e9 ajustar \u2014 partidas, cronograma, presupuesto.",
    next: "Programaremos un walk-through de 20 minutos en cuanto hayas tenido tiempo de leerlo.",
  }),
};

const LEAD_FOLLOWUP_THANKS: Record<Language, LocalizedTemplate> = {
  en: makeFollowup("en", {
    subject: "Thanks for choosing Stratifit \u2014 {{topic}}",
    preview: "We're kicking off your project.",
    intro: "Thanks for the green light on {{topic}}. We're kicking off this week and will keep you posted at every milestone.",
    next: "If anything urgent comes up, just reply to this email \u2014 it lands directly on the project thread.",
  }),
  de: makeFollowup("de", {
    subject: "Danke f\u00fcr dein Vertrauen \u2014 {{topic}}",
    preview: "Wir starten dein Projekt.",
    intro: "Danke f\u00fcr das Go zu {{topic}}. Wir legen diese Woche los und halten dich bei jedem Meilenstein auf dem Laufenden.",
    next: "Falls etwas Dringendes dazwischenkommt, antworte direkt auf diese E-Mail.",
  }),
  fr: makeFollowup("fr", {
    subject: "Merci pour votre confiance \u2014 {{topic}}",
    preview: "Nous lan\u00e7ons votre projet.",
    intro: "Merci pour le feu vert sur {{topic}}. Nous d\u00e9marrons cette semaine et vous tiendrons inform\u00e9s \u00e0 chaque jalon.",
    next: "En cas d'urgence, r\u00e9pondez directement \u00e0 cet e-mail \u2014 il arrive sur le fil du projet.",
  }),
  es: makeFollowup("es", {
    subject: "Gracias por confiar en Stratifit \u2014 {{topic}}",
    preview: "Arrancamos tu proyecto.",
    intro: "Gracias por el visto bueno en {{topic}}. Empezamos esta semana y te mantendremos al tanto en cada hito.",
    next: "Si algo urgente surge, responde directamente a este correo \u2014 cae en el hilo del proyecto.",
  }),
};

/* Builder helper \u2014 keeps each 4-lang pair DRY. */
function makeFollowup(
  lang: Language,
  parts: { subject: string; preview: string; intro: string; next: string },
): LocalizedTemplate {
  const inner =
    `<p>${parts.intro}</p>` +
    `<p>${parts.next}</p>` +
    `<p style="font-size:13px;color:#888;margin-top:24px;">` +
    `Topic: <strong style="color:#f5a623;">${parts.subject.includes("{{topic}}") ? parts.subject : "{{topic}}"}</strong><br />` +
    `Scheduled for: {{scheduled_for}}` +
    `</p>`;
  const text =
    `${stripHtml(parts.intro)}\n\n${stripHtml(parts.next)}\n\n` +
    `Topic: {{topic}}\nScheduled for: {{scheduled_for}}\n\n\u2014 The Stratifit team`;
  return {
    subject: parts.subject,
    preview: parts.preview,
    bodyHtml: wrapHtml(lang, inner),
    bodyText: text,
  };
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export function getLeadFollowupEmail(
  template: EmailTemplate,
  lang: Language,
  vars: FollowupVars,
): LocalizedTemplate | null {
  const map: Partial<Record<EmailTemplate, Record<Language, LocalizedTemplate>>> = {
    lead_followup_welcome: LEAD_FOLLOWUP_WELCOME,
    lead_followup_checkin: LEAD_FOLLOWUP_CHECKIN,
    lead_followup_proposal: LEAD_FOLLOWUP_PROPOSAL,
    lead_followup_thanks: LEAD_FOLLOWUP_THANKS,
  };
  const bucket = map[template];
  if (!bucket) return null;
  const tpl = bucket[lang] ?? bucket.en;
  if (!tpl) return null;
  return {
    subject: renderVars(tpl.subject, vars),
    preview: renderVars(tpl.preview, vars),
    bodyHtml: renderVars(tpl.bodyHtml, vars),
    bodyText: renderVars(tpl.bodyText, vars),
  };
}

export function getNotifyWelcomeEmail(lang: Language): LocalizedTemplate {
  return NOTIFY_WELCOME[lang] ?? NOTIFY_WELCOME.en;
}

export function getNotifyAlreadySubscribedEmail(lang: Language): LocalizedTemplate {
  return NOTIFY_ALREADY[lang] ?? NOTIFY_ALREADY.en;
}
