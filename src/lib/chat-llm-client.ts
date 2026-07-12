import type { Language } from "@/lib/cms-types";

/* ------------------------------------------------------------------ */
/*  Browser-side helper: client chatbots call /api/chat/llm through  */
/*  this thin wrapper so the API key never reaches the client bundle. */
/* ------------------------------------------------------------------ */

export type ChatbotId = "ai" | "contact" | "coming_soon" | "faq";

export interface AskLlmInput {
  chatbot: ChatbotId;
  query: string;
  lang: Language;
  scope?: string | null;
  signal?: AbortSignal;
}

export interface AskLlmResult {
  ok: boolean;
  text: string | null;
  latencyMs: number;
  status: string;
  error?: string;
}

/** Fallback when network or fetch throws — return a graceful "no LLM" result. */
function fail(
  status: string,
  error: string,
  latencyMs = 0,
): AskLlmResult {
  return { ok: false, text: null, latencyMs, status, error };
}

/**
 * Ask the server-side Groq brain via /api/chat/llm.
 *
 * On any failure (network, 5xx, ok:false from server, empty text),
 * returns ok:false with a status hint — never throws. Caller should
 * show the canned fallback when ok is false.
 */
export async function askLlm(input: AskLlmInput): Promise<AskLlmResult> {
  if (!input.query.trim()) return fail("empty_response", "Empty query");
  const startedAt = Date.now();
  try {
    const res = await fetch("/api/chat/llm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatbot: input.chatbot,
        query: input.query,
        lang: input.lang,
        scope: input.scope ?? null,
      }),
      ...(input.signal ? { signal: input.signal } : {}),
    });
    const latencyMs = Date.now() - startedAt;
    if (!res.ok) {
      return fail("http_error", `HTTP ${res.status}`, latencyMs);
    }
    const data = (await res.json().catch(() => ({}))) as Partial<AskLlmResult>;
    return {
      ok: Boolean(data.ok),
      text: data.text ?? null,
      latencyMs: data.latencyMs ?? latencyMs,
      status: data.status ?? "unknown",
      ...(data.error ? { error: data.error } : {}),
    };
  } catch (err) {
    return fail(
      "fetch_error",
      err instanceof Error ? err.message : "Network error",
      Date.now() - startedAt,
    );
  }
}
