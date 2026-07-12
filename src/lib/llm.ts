import "server-only";
import Groq from "groq-sdk";
import { getSupabaseAdmin } from "@/lib/supabase";
import { faqKnowledge, type FaqTopic } from "@/lib/faq-knowledge";
import type { Language } from "@/lib/cms-types";

/* ------------------------------------------------------------------ */
/*  Groq client — lazy. Returns null when GROQ_API_KEY is missing so */
/*  callers degrade gracefully (still log to llm_log as 'skipped').  */
/* ------------------------------------------------------------------ */
let _groq: Groq | null | undefined;
function getGroq(): Groq | null {
  if (_groq !== undefined) return _groq;
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    _groq = null;
    return null;
  }
  _groq = new Groq({ apiKey: key });
  return _groq;
}

export function isLlmConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

const DEFAULT_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const REQUEST_TIMEOUT_MS = 5_000;
const MAX_INPUT_CHARS = 500;
const DAILY_CAP_PER_CHATBOT = 100;

/* ------------------------------------------------------------------ */
/*  System prompt — FAQ knowledge base + role descriptor per chatbot */
/* ------------------------------------------------------------------ */
const ROLE_BY_CHATBOT: Record<string, Record<Language, string>> = {
  ai: {
    en: "You are the AI assistant embedded in the Stratifit marketing site. You help prospective clients understand our services and decide whether to reach out.",
    de: "Du bist der KI-Assistent der Stratifit-Marketing-Website. Du hilfst Interessenten, unsere Leistungen zu verstehen und zu entscheiden, ob sie Kontakt aufnehmen.",
    fr: "Vous \u00eates l'assistant IA int\u00e9gr\u00e9 au site marketing Stratifit. Vous aidez les prospects \u00e0 comprendre nos services et \u00e0 d\u00e9cider de nous contacter.",
    es: "Eres el asistente de IA del sitio de marketing de Stratifit. Ayudas a los clientes potenciales a entender nuestros servicios y decidir si contactarnos.",
  },
  contact: {
    en: "You are the AI assistant on Stratifit's /contact page. Help visitors scope a project and decide whether to submit the contact form.",
    de: "Du bist der KI-Assistent auf der Stratifit-/contact-Seite. Hilf Besuchern, ein Projekt zu skizzieren und zu entscheiden, ob sie das Kontaktformular absenden.",
    fr: "Vous \u00eates l'assistant IA de la page /contact de Stratifit. Aidez les visiteurs \u00e0 cadrer un projet et \u00e0 d\u00e9cider s'ils envoient le formulaire.",
    es: "Eres el asistente de IA en la p\u00e1gina /contact de Stratifit. Ayuda a los visitantes a definir un proyecto y decidir si env\u00edan el formulario.",
  },
  coming_soon: {
    en: "You are the AI assistant on Stratifit's public Coming Soon page. Answer questions about the upcoming launch.",
    de: "Du bist der KI-Assistent auf der \u00f6ffentlichen Stratifit-Coming-Soon-Seite. Beantworte Fragen zum bevorstehenden Launch.",
    fr: "Vous \u00eates l'assistant IA de la page Coming Soon publique de Stratifit. R\u00e9pondez aux questions sur le lancement \u00e0 venir.",
    es: "Eres el asistente de IA en la p\u00e1gina p\u00fablica Coming Soon de Stratifit. Responde preguntas sobre el pr\u00f3ximo lanzamiento.",
  },
  faq: {
    en: "You are the FAQ assistant on Stratifit. Answer based on the knowledge base below; if not covered, offer to connect with the team.",
    de: "Du bist der FAQ-Assistent von Stratifit. Beantworte Fragen anhand der Wissensdatenbank; wenn nicht abgedeckt, biete an, das Team zu kontaktieren.",
    fr: "Vous \u00eates l'assistant FAQ de Stratifit. R\u00e9pondez en vous appuyant sur la base de connaissances ; si elle ne couvre pas la question, proposez de contacter l'\u00e9quipe.",
    es: "Eres el asistente de FAQ de Stratifit. Responde seg\u00fan la base de conocimiento; si no la cubre, ofrece conectar con el equipo.",
  },
};

const INSTRUCTION_BY_LANG: Record<Language, string> = {
  en: "Output rules:\n- Reply in the user's language if possible, otherwise in English.\n- Use markdown lightly: **bold** for emphasis, short lists for multiple items.\n- Keep it short \u2014 3 to 5 short paragraphs max.\n- Be honest: do not invent pricing, timelines, or case studies not in the knowledge base.\n- If the user asks something not covered, offer to connect them with the team via the /contact page.",
  de: "Ausgaberegeln:\n- Antworte m\u00f6glichst in der Sprache des Nutzers, sonst auf Englisch.\n- Nutze Markdown sparsam: **fett** zur Hervorhebung, kurze Listen f\u00fcr mehrere Punkte.\n- Halte die Antwort kurz \u2014 maximal 3\u20135 kurze Abs\u00e4tze.\n- Sei ehrlich: erfinde keine Preise, Zeitpl\u00e4ne oder Fallstudien, die nicht in der Wissensdatenbank stehen.\n- Wenn die Frage nicht abgedeckt ist, biete an, den Nutzer per /contact-Seite mit dem Team zu verbinden.",
  fr: "R\u00e8gles de sortie :\n- R\u00e9pondez dans la langue de l'utilisateur si possible, sinon en anglais.\n- Markdown l\u00e9ger : **gras** pour l'emphase, listes courtes pour plusieurs points.\n- Restez concis : 3 \u00e0 5 paragraphes courts max.\n- Soyez honn\u00eate : n'inventez pas de prix, de d\u00e9lais ou d'\u00e9tudes de cas absents de la base.\n- Si la question n'est pas couverte, proposez de connecter l'utilisateur avec l'\u00e9quipe via /contact.",
  es: "Reglas de salida:\n- Responde en el idioma del usuario si es posible; si no, en ingl\u00e9s.\n- Markdown ligero: **negrita** para \u00e9nfasis, listas cortas para varios puntos.\n- S\u00e9 breve: 3 a 5 p\u00e1rrafos cortos como m\u00e1ximo.\n- S\u00e9 honesto: no inventes precios, plazos o casos que no est\u00e9n en la base.\n- Si la pregunta no est\u00e1 cubierta, ofrece conectar al usuario con el equipo v\u00eda /contact.",
};

function buildSystemPrompt(
  chatbot: string,
  lang: Language,
  scope?: FaqTopic | null,
): string {
  const role = ROLE_BY_CHATBOT[chatbot]?.[lang] ?? ROLE_BY_CHATBOT.ai[lang];
  const instruction = INSTRUCTION_BY_LANG[lang] ?? INSTRUCTION_BY_LANG.en;

  const kb = faqKnowledge
    .map(
      (e) =>
        `- [${e.id}][${e.category}] ${e.question}\n  Short answer: ${e.shortAnswer}`,
    )
    .join("\n");

  const scopeLine =
    scope && scope !== "all"
      ? `\nCurrent focus: ${scope}. Prefer answers in this category.`
      : "";

  return `${role}\n\nKnown topics:\n${kb}${scopeLine}\n\n${instruction}`;
}

/* ------------------------------------------------------------------ */
/*  Public types                                                       */
/* ------------------------------------------------------------------ */
export type LlmStatus =
  | "ok"
  | "no_api_key"
  | "rate_limited"
  | "empty_response"
  | "timeout"
  | "error"
  | "disabled";

export interface ChatCompletionInput {
  chatbot: string;
  query: string;
  lang: Language;
  scope?: FaqTopic | null;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ChatCompletionResult {
  ok: boolean;
  text: string | null;
  latencyMs: number;
  status: LlmStatus;
  error?: string;
}

/* ------------------------------------------------------------------ */
/*  Chat completion helper                                             */
/*  Never throws. Always writes llm_log when called (best-effort).    */
/*  Honors AI_FALLBACK_TO_LLM env flag (default on when key present). */
/*  Caps at DAILY_CAP_PER_CHATBOT calls per UTC day per chatbot.      */
/* ------------------------------------------------------------------ */
export async function chatCompletion(
  input: ChatCompletionInput,
): Promise<ChatCompletionResult> {
  const startedAt = Date.now();
  const query = (input.query || "").trim().slice(0, MAX_INPUT_CHARS);
  const lang: Language = input.lang;
  const chatbot = String(input.chatbot || "ai").slice(0, 32);
  const model = input.model || DEFAULT_MODEL;
  const maxTokens = input.maxTokens ?? 400;
  const temperature = input.temperature ?? 0.4;

  async function writeLog(
    status: LlmStatus,
    response: string | null,
    tokensIn: number | null,
    tokensOut: number | null,
    error: string | null,
  ): Promise<void> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return;
    const latencyMs = Date.now() - startedAt;
    try {
      await supabase.from("llm_log").insert({
        chatbot,
        lang,
        query,
        response,
        model,
        tokens_in: tokensIn,
        tokens_out: tokensOut,
        latency_ms: latencyMs,
        status,
        error,
      });
    } catch (err) {
      console.error("[llm] failed to write llm_log row:", err);
    }
  }

  // 0. Feature flag \u2014 allow admin to disable without code change
  if (
    process.env.AI_FALLBACK_TO_LLM === "false" ||
    process.env.AI_FALLBACK_TO_LLM === "0"
  ) {
    await writeLog("disabled", null, null, null, "AI_FALLBACK_TO_LLM disabled");
    return {
      ok: false,
      text: null,
      latencyMs: Date.now() - startedAt,
      status: "disabled",
      error: "AI_FALLBACK_TO_LLM disabled",
    };
  }

  // 1. API key check
  const groq = getGroq();
  if (!groq) {
    await writeLog("no_api_key", null, null, null, "GROQ_API_KEY not set");
    return {
      ok: false,
      text: null,
      latencyMs: Date.now() - startedAt,
      status: "no_api_key",
      error: "GROQ_API_KEY not set",
    };
  }

  // 2. Daily cost guardrail
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    try {
      const { count } = await supabase
        .from("llm_log")
        .select("id", { count: "exact", head: true })
        .eq("chatbot", chatbot)
        .gte("created_at", todayStart.toISOString());
      if (typeof count === "number" && count >= DAILY_CAP_PER_CHATBOT) {
        await writeLog(
          "rate_limited",
          null,
          null,
          null,
          `Daily cap ${DAILY_CAP_PER_CHATBOT}/chatbot reached`,
        );
        return {
          ok: false,
          text: null,
          latencyMs: Date.now() - startedAt,
          status: "rate_limited",
          error: "Daily cap reached",
        };
      }
    } catch (err) {
      console.warn("[llm] cost-guardrail count failed (continuing):", err);
    }
  }

  // 3. Build messages
  const systemPrompt = buildSystemPrompt(chatbot, lang, input.scope);
  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: query },
  ];

  // 4. Call Groq with a 5s timeout
  let text = "";
  let tokensIn: number | null = null;
  let tokensOut: number | null = null;
  let callError: string | null = null;
  let timedOut = false;
  try {
    const completionPromise = groq.chat.completions.create({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
    });
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        timedOut = true;
        reject(new Error("timeout"));
      }, REQUEST_TIMEOUT_MS);
    });
    const completion = (await Promise.race([
      completionPromise,
      timeoutPromise,
    ])) as Groq.Chat.ChatCompletion;
    text = (completion.choices?.[0]?.message?.content ?? "").trim();
    tokensIn = (completion.usage?.prompt_tokens ?? null) as number | null;
    tokensOut = (completion.usage?.completion_tokens ?? null) as number | null;
  } catch (err) {
    callError =
      err instanceof Error
        ? err.message
        : typeof err === "string"
          ? err
          : "Groq call failed";
  }

  if (timedOut) {
    await writeLog("timeout", null, tokensIn, tokensOut, callError);
    return {
      ok: false,
      text: null,
      latencyMs: Date.now() - startedAt,
      status: "timeout",
      error: callError ?? "timeout",
    };
  }

  if (callError) {
    await writeLog("error", null, tokensIn, tokensOut, callError);
    return {
      ok: false,
      text: null,
      latencyMs: Date.now() - startedAt,
      status: "error",
      error: callError,
    };
  }

  if (!text) {
    await writeLog(
      "empty_response",
      null,
      tokensIn,
      tokensOut,
      "Groq returned empty content",
    );
    return {
      ok: false,
      text: null,
      latencyMs: Date.now() - startedAt,
      status: "empty_response",
      error: "Empty response",
    };
  }

  await writeLog(
    "ok",
    text.slice(0, 4000),
    tokensIn,
    tokensOut,
    null,
  );
  return {
    ok: true,
    text,
    latencyMs: Date.now() - startedAt,
    status: "ok",
  };
}
