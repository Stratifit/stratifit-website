import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/llm";

/* ------------------------------------------------------------------ */
/*  POST /api/chat/llm                                                */
/*  Server-side proxy so client chatbots can call the Groq brain       */
/*  without shipping the API key to the bundle. Not auth-gated \u2014 */
/*  the rate limit + daily cap are the abuse deterrent.                */
/* ------------------------------------------------------------------ */

const VALID_CHATBOTS = new Set(["ai", "contact", "coming_soon", "faq"]);
const VALID_LANGS = new Set(["en", "de", "fr", "es"]);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { chatbot, query, lang, scope } = (body ?? {}) as {
    chatbot?: unknown;
    query?: unknown;
    lang?: unknown;
    scope?: unknown;
  };

  if (typeof chatbot !== "string" || !VALID_CHATBOTS.has(chatbot)) {
    return NextResponse.json(
      { error: "Invalid chatbot (must be one of: ai, contact, coming_soon, faq)" },
      { status: 400 },
    );
  }

  if (typeof query !== "string" || !query.trim()) {
    return NextResponse.json(
      { error: "Query is required" },
      { status: 400 },
    );
  }

  if (query.length > 2000) {
    return NextResponse.json(
      { error: "Query too long (max 2000 chars)" },
      { status: 400 },
    );
  }

  const langOut =
    typeof lang === "string" && VALID_LANGS.has(lang) ? lang : "en";

  const scopeOut =
    typeof scope === "string" && scope.length <= 32 ? scope : null;

  const result = await chatCompletion({
    chatbot,
    query,
    lang: langOut as "en" | "de" | "fr" | "es",
    scope: scopeOut as never,
  });

  if (!result.ok) {
    // Empty-response / disabled / rate-limited / no_api_key etc.
    // Return 200 with ok:false so the client can show a graceful
    // canned fallback without surfacing 5xx to users.
    return NextResponse.json(
      {
        ok: false,
        status: result.status,
        error: result.error,
        latencyMs: result.latencyMs,
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      text: result.text,
      latencyMs: result.latencyMs,
      status: result.status,
    },
    { status: 200 },
  );
}
