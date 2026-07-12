"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiChatBubbleLeftRight,
  HiClock,
  HiSparkles,
  HiRocketLaunch,
  HiUserGroup,
  HiEnvelope,
  HiMapPin,
  HiQuestionMarkCircle,
  HiCurrencyDollar,
  HiPaperAirplane,
  HiXMark,
  HiHeart,
  HiCheck,
  HiBell,
} from "react-icons/hi2";
import { openContactModal } from "@/components/contact/ContactModal";
import { useLanguage } from "@/lib/LanguageContext";
import { tLabel } from "@/lib/stratifit-i18n";
import { askLlm } from "@/lib/chat-llm-client";
import type { Language } from "@/lib/cms-types";

export type ComingSoonRole = "bot" | "user";
export type ComingSoonIntent = "subscribe" | "team" | "info";

export type ComingSoonMessage = {
  role: ComingSoonRole;
  text: string;
  /** Only set on bot answer messages — drives the CTA chip that appears beneath the latest answer */
  intent?: ComingSoonIntent;
};

type Chip = {
  id: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
};

/* Inline subscribe state machine. Drives the email-capture flow
   triggered by the green "Subscribe" status badge in the chip rail. */
type SubscribeState = "idle" | "collecting" | "submitting" | "success";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Chip config — labels are i18n keys. The actual translated text is
   computed in getChips(lang) below so the chip rail updates when the
   user switches the language dropdown. */
const chipConfig: Chip[] = [
  { id: "launch", labelKey: "chatbot_cs_chip_launch", icon: HiClock },
  { id: "services", labelKey: "chatbot_cs_chip_services", icon: HiSparkles },
  { id: "early", labelKey: "chatbot_cs_chip_early", icon: HiRocketLaunch },
  { id: "pricing", labelKey: "chatbot_cs_chip_pricing", icon: HiCurrencyDollar },
  { id: "hiring", labelKey: "chatbot_cs_chip_hiring", icon: HiUserGroup },
  { id: "location", labelKey: "chatbot_cs_chip_location", icon: HiMapPin },
  { id: "sneakpeek", labelKey: "chatbot_cs_chip_sneakpeek", icon: HiQuestionMarkCircle },
];

function getChips(lang: Language): { id: string; label: string; icon: Chip["icon"] }[] {
  return chipConfig.map((c) => ({ id: c.id, label: tLabel(c.labelKey, lang), icon: c.icon }));
}

function getResponses(lang: Language): Record<string, ComingSoonMessage> {
  return {
    greeting: {
      role: "bot",
      text: tLabel("chatbot_cs_resp_greeting", lang),
      intent: "info",
    },
    launch: {
      role: "bot",
      text: tLabel("chatbot_cs_resp_launch", lang),
      intent: "subscribe",
    },
    services: {
      role: "bot",
      text: tLabel("chatbot_cs_resp_services", lang),
      intent: "info",
    },
    early: {
      role: "bot",
      text: tLabel("chatbot_cs_resp_early", lang),
      intent: "subscribe",
    },
    pricing: {
      role: "bot",
      text: tLabel("chatbot_cs_resp_pricing", lang),
      intent: "team",
    },
    hiring: {
      role: "bot",
      text: tLabel("chatbot_cs_resp_hiring", lang),
      intent: "team",
    },
    location: {
      role: "bot",
      text: tLabel("chatbot_cs_resp_location", lang),
      intent: "info",
    },
    sneakpeek: {
      role: "bot",
      text: tLabel("chatbot_cs_resp_sneakpeek", lang),
      intent: "subscribe",
    },
    fallback: {
      role: "bot",
      text: tLabel("chatbot_cs_resp_fallback", lang),
      intent: "team",
    },
  };
}

export function ComingSoonAIChat({
  onClose,
  scrollToSubscribe,
  scrollToServices,
}: {
  onClose?: () => void;
  scrollToSubscribe?: () => void;
  scrollToServices?: () => void;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ComingSoonMessage[]>([getResponses("en").greeting]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();

  // Recompute the greeting + responses map when the language changes so
  // the very first message the user sees is already in their language.
  // The state update is deferred via setTimeout(0) so it runs in a
  // microtask boundary instead of synchronously inside the effect body —
  // that satisfies react-compiler/react-compiler's "no cascading renders"
  // rule while preserving the existing single-greeting behaviour.
  useEffect(() => {
    const timer = setTimeout(() => {
      const greeting = getResponses(lang).greeting;
      setMessages((prev) => {
        // Only replace the opening greeting if the user hasn't sent anything yet
        if (prev.length <= 1) return [greeting];
        return prev;
      });
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const chips = getChips(lang);
  const responses = getResponses(lang);

  // Inline-subscribe state machine. Drives the green "Subscribe" status
  // badge in the chip rail and the email-capture flow.
  const [subscribeState, setSubscribeState] = useState<SubscribeState>("idle");
  const [emailError, setEmailError] = useState<string | null>(null);

  const startSubscribe = () => {
    if (subscribeState === "success" || subscribeState === "submitting") return;
    setSubscribeState("collecting");
    setEmailError(null);
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: tLabel("chat_subscribe_prompt", lang) },
    ]);
  };

  const submitEmail = async () => {
    if (subscribeState === "submitting") return;
    const email = input.trim();
    if (!email || !EMAIL_RE.test(email)) {
      setEmailError(tLabel("chat_email_invalid", lang));
      return;
    }
    setSubscribeState("submitting");
    setEmailError(null);
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          lang,
          source: "coming_soon_chat",
        }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      // Peek at the response body so we can show a tailored message
      // for already-subscribed emails. If the response is non-JSON
      // (e.g. 503 from a not-yet-configured DB), we fall through to
      // the generic success message.
      let alreadySubscribed = false;
      try {
        const data = await res.json();
        if (data && data.alreadySubscribed === true) alreadySubscribed = true;
      } catch {
        // non-JSON — keep default
      }
      // Echo the submitted email as a user bubble, then a bot confirmation
      setMessages((prev) => [
        ...prev,
        { role: "user", text: email },
        {
          role: "bot",
          text: tLabel(
            alreadySubscribed ? "chat_subscribe_already" : "chat_subscribe_success",
            lang,
          ),
        },
      ]);
      setInput("");
      setSubscribeState("success");
    } catch (err) {
      console.warn("chat subscribe failed", err);
      setEmailError(tLabel("chat_subscribe_error", lang));
      setSubscribeState("collecting");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const ask = (text: string, preMatchedId?: string) => {
    const q = text.trim();
    if (!q) return;

    // Echo user message ⇒ user-role bubble
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = q.toLowerCase();
      let key: string = preMatchedId ?? "fallback";
      if (!preMatchedId) {
        // Language-aware keyword detection. Each branch matches the
        // active language plus the English fallback so users typing in
        // their native language still land on the right scripted answer.
        if (
          lower.includes("launch") || lower.includes("when") || lower.includes("date") ||
          lower.includes("lancez") || lower.includes("lancement") || lower.includes("quand") || lower.includes("date") ||
          lower.includes("launch") || lower.includes("wann") || lower.includes("datum") ||
          lower.includes("lanzan") || lower.includes("lanzamiento") || lower.includes("cuándo") || lower.includes("fecha")
        ) key = "launch";
        else if (
          lower.includes("service") || lower.includes("offer") || lower.includes("do you do") ||
          lower.includes("service") || lower.includes("offre") || lower.includes("faites") ||
          lower.includes("dienst") || lower.includes("leistung") || lower.includes("bieten") ||
          lower.includes("servicio") || lower.includes("ofrecen") || lower.includes("hacen")
        ) key = "services";
        else if (
          lower.includes("early") || lower.includes("access") || lower.includes("beta") ||
          lower.includes("anticip") || lower.includes("accès") || lower.includes("bêta") ||
          lower.includes("früh") || lower.includes("zugang") || lower.includes("beta") ||
          lower.includes("anticip") || lower.includes("acceso") || lower.includes("beta")
        ) key = "early";
        else if (
          lower.includes("pric") || lower.includes("cost") || lower.includes("budget") ||
          lower.includes("prix") || lower.includes("coût") || lower.includes("budget") ||
          lower.includes("preis") || lower.includes("kosten") || lower.includes("budget") ||
          lower.includes("precio") || lower.includes("costo") || lower.includes("presupuesto")
        ) key = "pricing";
        else if (
          lower.includes("hire") || lower.includes("job") || lower.includes("team grow") ||
          lower.includes("recrut") || lower.includes("emploi") || lower.includes("équipe") ||
          lower.includes("einstell") || lower.includes("job") || lower.includes("team") ||
          lower.includes("contrat") || lower.includes("empleo") || lower.includes("equipo")
        ) key = "hiring";
        else if (
          lower.includes("where") || lower.includes("location") || lower.includes("office") ||
          lower.includes("où") || lower.includes("lieu") || lower.includes("bureau") ||
          lower.includes("wo") || lower.includes("standort") || lower.includes("büro") ||
          lower.includes("dónde") || lower.includes("ubicación") || lower.includes("oficina")
        ) key = "location";
        else if (
          lower.includes("sneak") || lower.includes("preview") || lower.includes("see") ||
          lower.includes("avant-première") || lower.includes("aperçu") || lower.includes("voir") ||
          lower.includes("vorschau") || lower.includes("einblick") || lower.includes("sehen") ||
          lower.includes("avance") || lower.includes("vista previa") || lower.includes("ver")
        ) key = "sneakpeek";
      }
      // No keyword match (or preMatchedId === "fallback") — route to Groq
      // via /api/chat/llm. Falls back to canned `responses.fallback` if
      // GROQ_API_KEY is missing or the call fails.
      if (key === "fallback") {
        askLlm({ chatbot: "coming_soon", query: q, lang })
          .then((r) => {
            if (r.ok && r.text) {
              setMessages((prev) => [
                ...prev,
                { role: "bot", text: r.text as string, intent: "info" },
              ]);
            } else {
              setMessages((prev) => [...prev, responses.fallback]);
            }
          })
          .catch(() => {
            setMessages((prev) => [...prev, responses.fallback]);
          });
      } else {
        setMessages((prev) => [...prev, responses[key]]);
      }
    }, 600);
  };

  const handleChipClick = (id: string) => {
    const chip = chips.find((c) => c.id === id);
    if (!chip) return;
    ask(chip.label, id);
  };

  const handleIntentClick = (intent?: ComingSoonIntent) => {
    if (intent === "subscribe" && scrollToSubscribe) {
      scrollToSubscribe();
      onClose?.();
    } else if (intent === "team") {
      openContactModal();
    } else if (intent === "info" && scrollToServices) {
      scrollToServices();
      onClose?.();
    }
  };

  const handleHumanTeam = () => {
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: tLabel("chatbot_f_human_opening", lang) },
    ]);
    setTimeout(() => openContactModal(), 700);
  };

  // Walk backwards and pick the latest bot message with an intent — that's what drives the CTA
  let lastBotIntent: ComingSoonIntent | undefined = undefined;
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role === "bot" && m.intent) {
      lastBotIntent = m.intent;
      break;
    }
  }

  return (
    <div className="flex flex-col h-full bg-card-dark rounded-2xl border border-white/10 overflow-hidden relative">
      {/* Glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex-none flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber flex items-center justify-center shadow-[0_0_18px_rgba(245,158,11,0.35)]">
            <HiChatBubbleLeftRight className="text-black text-lg" />
          </div>
          <div>
            <span className="font-heading font-black text-white text-sm">Stratifit AI</span>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              {tLabel("chatbot_cs_header_subtitle", lang)}
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Close chat"
          >
            <HiXMark size={20} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-5 py-4 space-y-3 menu-scroll overscroll-contain relative z-10"
        role="log"
        aria-live="polite"
      >
        {messages.map((msg, i) => {
          // User role ⇒ amber bubble on right
          if (msg.role === "user") {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="flex justify-end"
              >
                <div className="max-w-[85%] bg-amber text-black rounded-2xl px-4 py-2.5 text-sm font-medium">
                  {msg.text}
                </div>
              </motion.div>
            );
          }
          // Bot role ⇒ answer card on left
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex justify-start"
            >
              <div className="max-w-[90%] bg-card-dark border border-white/5 rounded-2xl px-4 py-3 shadow-[inset_0_0_18px_rgba(255,255,255,0.02)]">
                <p className="text-sm leading-relaxed whitespace-pre-line text-gray-200">{msg.text}</p>
              </div>
            </motion.div>
          );
        })}

        {/* CTA under last bot msg with intent */}
        {lastBotIntent && !isTyping && (
          <div className="flex justify-start pl-1">
            <button
              onClick={() => handleIntentClick(lastBotIntent)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber text-black font-bold text-xs rounded-xl hover:bg-amber-light transition-all shadow-[0_0_18px_rgba(245,158,11,0.2)] active:scale-95"
            >
              {lastBotIntent === "subscribe" ? (
                <>
                  <HiEnvelope className="text-sm" />
                  {tLabel("chatbot_cs_intent_subscribe", lang)}
                </>
              ) : lastBotIntent === "team" ? (
                <>
                  <HiUserGroup className="text-sm" />
                  {tLabel("chatbot_cs_intent_team", lang)}
                </>
              ) : (
                <>
                  <HiSparkles className="text-sm" />
                  {tLabel("chatbot_cs_intent_info", lang)}
                </>
              )}
            </button>
          </div>
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-card-dark border border-white/5 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber/40 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber/40 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber/40 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chip rail */}
      <div className="flex-none px-5 py-2 border-t border-white/5 bg-black/40 relative z-10">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1 items-center">
          {/* Status badge — "Subscribe" with a pulsing green dot.
              Clicking it triggers the inline email-capture flow. */}
          {subscribeState === "success" ? (
            <span className="inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[11px] font-bold">
              <HiCheck className="text-xs" />
              {tLabel("chat_badge_subscribed", lang)}
            </span>
          ) : (
            <button
              onClick={startSubscribe}
              disabled={subscribeState === "submitting"}
              className="inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[11px] font-bold hover:bg-green-500/20 transition-all shadow-[0_0_10px_rgba(34,197,94,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative flex items-center justify-center w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-60 animate-ping" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-green-400" />
              </span>
              {tLabel("chat_badge_subscribe", lang)}
            </button>
          )}

          {chips.map((c) => (
            <button
              key={c.id}
              onClick={() => handleChipClick(c.id)}
              className="inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-medium hover:bg-amber/15 hover:border-amber/30 transition-all"
            >
              <c.icon className="text-amber text-xs" />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex-none px-5 py-3 border-t border-white/10 bg-black/50 relative z-10">
        {subscribeState === "collecting" || subscribeState === "submitting" ? (
          <div className="flex flex-col gap-1.5">
            {emailError && (
              <p className="text-[10px] text-red-400 font-medium flex items-center gap-1.5">
                <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                {emailError}
              </p>
            )}
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitEmail();
                }}
                placeholder={tLabel("chat_email_placeholder", lang)}
                disabled={subscribeState === "submitting"}
                className={`flex-1 bg-card-dark border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none transition-colors disabled:opacity-50 ${
                  emailError
                    ? "border-red-500/60 focus:border-red-500"
                    : "border-green-500/30 focus:border-green-400"
                }`}
              />
              <button
                onClick={submitEmail}
                disabled={subscribeState === "submitting" || !input.trim()}
                aria-label={tLabel("chat_subscribe_input_btn", lang)}
                className="w-10 h-10 rounded-xl bg-green-500 text-black flex items-center justify-center hover:bg-green-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                {subscribeState === "submitting" ? (
                  <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <HiPaperAirplane className="text-sm" />
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") ask(input);
              }}
              placeholder={tLabel("chatbot_cs_input_placeholder", lang)}
              className="flex-1 bg-card-dark border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:border-amber/50 focus:outline-none transition-colors"
            />
            <button
              onClick={() => ask(input)}
              disabled={!input.trim()}
              aria-label="Send"
              className="w-10 h-10 rounded-xl bg-amber text-black flex items-center justify-center hover:bg-amber-light transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              <HiPaperAirplane className="text-sm" />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-none border-t border-white/5 px-5 py-2 flex items-center justify-between bg-black/60 text-[10px] text-gray-500 relative z-10">
        <span className="flex items-center gap-1">
          <HiHeart className="text-amber text-[10px]" />
          {tLabel("chatbot_cs_footer_built", lang)}
        </span>
        <button
          onClick={handleHumanTeam}
          className="font-bold text-amber hover:text-amber-light transition-colors inline-flex items-center gap-1"
        >
          <HiUserGroup className="text-xs" />
          {tLabel("chatbot_cs_footer_human", lang)}
        </button>
      </div>
    </div>
  );
}

export default ComingSoonAIChat;
