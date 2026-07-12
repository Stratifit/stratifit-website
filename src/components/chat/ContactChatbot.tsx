"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiPaperAirplane,
  HiCurrencyDollar,
  HiClock,
  HiCog,
  HiLightBulb,
  HiBriefcase,
  HiLifebuoy,
  HiSparkles,
  HiUserGroup,
  HiEye,
  HiUsers,
  HiPencilSquare,
  HiCreditCard,
} from "react-icons/hi2";
import { openContactModal } from "@/components/contact/ContactModal";
import { useLanguage } from "@/lib/LanguageContext";
import { tLabel } from "@/lib/stratifit-i18n";
import { askLlm } from "@/lib/chat-llm-client";
import type { Language } from "@/lib/cms-types";

type Message = {
  role: "bot" | "user";
  text: string;
  quickReplies?: string[];
};

type Chip = {
  id: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
};

/* Chip config — labels are i18n keys. The actual translated text is
   computed in getChips(lang) below so the chip rail updates when the
   user switches the language dropdown. */
const chipConfig: Chip[] = [
  { id: "pricing", labelKey: "chatbot_c_chip_pricing", icon: HiCurrencyDollar },
  { id: "timeline", labelKey: "chatbot_c_chip_timeline", icon: HiClock },
  { id: "stack", labelKey: "chatbot_c_chip_stack", icon: HiCog },
  { id: "process", labelKey: "chatbot_c_chip_process", icon: HiLightBulb },
  { id: "services", labelKey: "chatbot_c_chip_services", icon: HiBriefcase },
  { id: "portfolio", labelKey: "chatbot_c_chip_portfolio", icon: HiEye },
  { id: "team", labelKey: "chatbot_c_chip_team", icon: HiUsers },
  { id: "revisions", labelKey: "chatbot_c_chip_revisions", icon: HiPencilSquare },
  { id: "payment", labelKey: "chatbot_c_chip_payment", icon: HiCreditCard },
  { id: "support", labelKey: "chatbot_c_chip_support", icon: HiLifebuoy },
];

function getChips(lang: Language): { id: string; label: string; icon: Chip["icon"] }[] {
  return chipConfig.map((c) => ({ id: c.id, label: tLabel(c.labelKey, lang), icon: c.icon }));
}

function getResponses(lang: Language): Record<string, Message> {
  return {
    greeting: {
      role: "bot",
      text: tLabel("chatbot_c_resp_greeting", lang),
      quickReplies: [tLabel("chatbot_c_qr_pricing", lang), tLabel("chatbot_c_qr_timeline", lang), tLabel("chatbot_c_qr_portfolio", lang), tLabel("chatbot_c_qr_process", lang)],
    },
    pricing: {
      role: "bot",
      text: tLabel("chatbot_c_resp_pricing", lang),
      quickReplies: [tLabel("chatbot_c_qr_quote", lang), tLabel("chatbot_c_qr_timeline", lang), tLabel("chatbot_c_qr_stack", lang)],
    },
    timeline: {
      role: "bot",
      text: tLabel("chatbot_c_resp_timeline", lang),
      quickReplies: [tLabel("chatbot_c_qr_pricing", lang), tLabel("chatbot_c_qr_process", lang), tLabel("chatbot_c_qr_quote", lang)],
    },
    stack: {
      role: "bot",
      text: tLabel("chatbot_c_resp_stack", lang),
      quickReplies: [tLabel("chatbot_c_qr_process", lang), tLabel("chatbot_c_qr_pricing", lang), tLabel("chatbot_c_qr_services", lang)],
    },
    process: {
      role: "bot",
      text: tLabel("chatbot_c_resp_process", lang),
      quickReplies: [tLabel("chatbot_c_qr_timeline", lang), tLabel("chatbot_c_qr_pricing", lang), tLabel("chatbot_c_qr_services", lang)],
    },
    services: {
      role: "bot",
      text: tLabel("chatbot_c_resp_services", lang),
      quickReplies: [tLabel("chatbot_c_qr_pricing", lang), tLabel("chatbot_c_qr_timeline", lang), tLabel("chatbot_c_qr_quote", lang)],
    },
    portfolio: {
      role: "bot",
      text: tLabel("chatbot_c_resp_portfolio", lang),
      quickReplies: [tLabel("chatbot_c_qr_pricing", lang), tLabel("chatbot_c_qr_process", lang), tLabel("chatbot_c_qr_services", lang)],
    },
    team: {
      role: "bot",
      text: tLabel("chatbot_c_resp_team", lang),
      quickReplies: [tLabel("chatbot_c_qr_process", lang), tLabel("chatbot_c_qr_portfolio", lang), tLabel("chatbot_c_qr_services", lang)],
    },
    revisions: {
      role: "bot",
      text: tLabel("chatbot_c_resp_revisions", lang),
      quickReplies: [tLabel("chatbot_c_qr_pricing", lang), tLabel("chatbot_c_qr_process", lang), tLabel("chatbot_c_qr_timeline", lang)],
    },
    payment: {
      role: "bot",
      text: tLabel("chatbot_c_resp_payment", lang),
      quickReplies: [tLabel("chatbot_c_qr_pricing", lang), tLabel("chatbot_c_qr_quote", lang), tLabel("chatbot_c_chip_revisions", lang)],
    },
    support: {
      role: "bot",
      text: tLabel("chatbot_c_resp_support", lang),
      quickReplies: [tLabel("chatbot_c_qr_pricing", lang), tLabel("chatbot_c_qr_services", lang), tLabel("chatbot_c_qr_speak", lang)],
    },
    quote: {
      role: "bot",
      text: tLabel("chatbot_c_resp_quote", lang),
      quickReplies: [],
    },
    contactTeam: {
      role: "bot",
      text: tLabel("chatbot_c_resp_contact", lang),
      quickReplies: [],
    },
    fallback: {
      role: "bot",
      text: tLabel("chatbot_c_resp_fallback", lang),
      quickReplies: [tLabel("chatbot_c_qr_pricing", lang), tLabel("chatbot_c_qr_portfolio", lang), tLabel("chatbot_c_qr_process", lang), tLabel("chatbot_c_qr_services", lang)],
    },
  };
}

export default function ContactChatbot() {
  const { lang } = useLanguage();
  const chips = getChips(lang);
  const botResponses = getResponses(lang);
  const [messages, setMessages] = useState<Message[]>([botResponses.greeting]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Recompute the greeting + responses map when the language changes so
  // the very first message the user sees is already in their language.
  // The state update is deferred via setTimeout(0) so it runs at the next
  // macrotask boundary instead of synchronously inside the effect body —
  // that satisfies react-compiler/react-compiler's "no cascading renders"
  // rule while preserving the existing single-greeting behaviour.
  useEffect(() => {
    const timer = setTimeout(() => {
      const greeting = botResponses.greeting;
      setMessages((prev) => {
        if (prev.length <= 1) return [greeting];
        return prev;
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleChip = (chipId: string) => {
    const response = botResponses[chipId] || botResponses.fallback;
    const label = chips.find((c) => c.id === chipId)?.label || chipId;
    const userMsg: Message = { role: "user", text: label };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setExpanded(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, response]);
    }, 600);
  };

  const handleSend = (text: string) => {
    const lower = text.toLowerCase();

    if (
      lower.includes("quote") || lower.includes("speak to team") || lower.includes("contact") ||
      lower.includes("devis") || lower.includes("parler") || lower.includes("équipe") || lower.includes("contacter") ||
      lower.includes("angebot") || lower.includes("team sprechen") || lower.includes("kontakt") ||
      lower.includes("cotiz") || lower.includes("hablar") || lower.includes("equipo") || lower.includes("contacto")
    ) {
      const userMsg: Message = { role: "user", text };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
      setExpanded(true);

      const botMsg = lower.includes("quote") ? botResponses.quote : botResponses.contactTeam;
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, botMsg]);
        setTimeout(() => openContactModal(), 1000);
      }, 800);
      return;
    }

    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setExpanded(true);

    let response: Message;
    // Language-aware keyword detection: matches each language's stems
    // so users typing in their native language still land on the
    // right scripted answer.
    if (
      lower.includes("pric") || lower.includes("cost") || lower.includes("budget") || lower.includes("estimate") ||
      lower.includes("prix") || lower.includes("coût") || lower.includes("budget") ||
      lower.includes("preis") || lower.includes("kosten") || lower.includes("budget") ||
      lower.includes("precio") || lower.includes("costo")
    )
      response = botResponses.pricing;
    else if (
      lower.includes("time") || lower.includes("long") || lower.includes("week") || lower.includes("timeline") ||
      lower.includes("délai") || lower.includes("temps") || lower.includes("semaine") ||
      lower.includes("zeit") || lower.includes("woche") || lower.includes("dauer") ||
      lower.includes("plazo") || lower.includes("tiempo") || lower.includes("semana")
    )
      response = botResponses.timeline;
    else if (
      lower.includes("stack") || lower.includes("tech") || lower.includes("code") ||
      lower.includes("stack") || lower.includes("technique") ||
      lower.includes("stack") || lower.includes("tech") ||
      lower.includes("stack") || lower.includes("tecnolog")
    )
      response = botResponses.stack;
    else if (
      lower.includes("process") || lower.includes("step") || lower.includes("method") ||
      lower.includes("processus") || lower.includes("étape") ||
      lower.includes("prozess") || lower.includes("schritt") ||
      lower.includes("proceso") || lower.includes("paso")
    )
      response = botResponses.process;
    else if (
      lower.includes("service") || lower.includes("offer") ||
      lower.includes("service") || lower.includes("offre") ||
      lower.includes("dienst") || lower.includes("leistung") ||
      lower.includes("servicio") || lower.includes("ofrece")
    )
      response = botResponses.services;
    else if (
      lower.includes("portfolio") || lower.includes("past work") || lower.includes("case study") || lower.includes("examples") ||
      lower.includes("portfolio") || lower.includes("réalisation") || lower.includes("étude") ||
      lower.includes("portfolio") || lower.includes("arbeit") || lower.includes("fall") ||
      lower.includes("portafolio") || lower.includes("caso") || lower.includes("ejemplo")
    )
      response = botResponses.portfolio;
    else if (
      lower.includes("team") || lower.includes("who") || lower.includes("people") ||
      lower.includes("équipe") || lower.includes("qui") ||
      lower.includes("team") || lower.includes("wer") ||
      lower.includes("equipo") || lower.includes("quién")
    )
      response = botResponses.team;
    else if (
      lower.includes("revision") || lower.includes("change") || lower.includes("edit") ||
      lower.includes("révision") || lower.includes("modif") ||
      lower.includes("revision") || lower.includes("änderung") ||
      lower.includes("revisión") || lower.includes("cambio")
    )
      response = botResponses.revisions;
    else if (
      lower.includes("payment") || lower.includes("deposit") || lower.includes("invoice") || lower.includes("pay") ||
      lower.includes("paiement") || lower.includes("acompte") || lower.includes("facture") ||
      lower.includes("zahlung") || lower.includes("anzahlung") || lower.includes("rechnung") ||
      lower.includes("pago") || lower.includes("anticipo") || lower.includes("factura")
    )
      response = botResponses.payment;
    else if (
      lower.includes("support") || lower.includes("maintain") || lower.includes("after") ||
      lower.includes("support") || lower.includes("maintenance") ||
      lower.includes("support") || lower.includes("wartung") ||
      lower.includes("soporte") || lower.includes("mantenimiento")
    )
      response = botResponses.support;
    else response = botResponses.fallback;

    // If the keyword chain landed on the canned fallback, route to Groq
    // via /api/chat/llm instead so the bot can answer novel questions.
    // Falls back to canned `botResponses.fallback` if GROQ_API_KEY is
    // missing or the call fails.
    const finalResponse = response;
    setTimeout(() => {
      if (finalResponse === botResponses.fallback) {
        askLlm({ chatbot: "contact", query: text, lang })
          .then((r) => {
            setIsTyping(false);
            if (r.ok && r.text) {
              setMessages((prev) => [
                ...prev,
                {
                  role: "bot",
                  text: r.text as string,
                  quickReplies: botResponses.fallback.quickReplies,
                },
              ]);
            } else {
              setMessages((prev) => [...prev, botResponses.fallback]);
            }
          })
          .catch(() => {
            setIsTyping(false);
            setMessages((prev) => [...prev, botResponses.fallback]);
          });
      } else {
        setIsTyping(false);
        setMessages((prev) => [...prev, finalResponse]);
      }
    }, 600);
  };

  const handleQuickReply = (reply: string) => {
    handleSend(reply.toLowerCase());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      handleSend(input.trim());
      setInput("");
    }
  };

  return (
    <section className="max-w-2xl mx-auto mt-16">
      {/* Section header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <HiSparkles className="text-amber text-base" />
          <p className="text-[10px] font-bold tracking-[0.3em] text-amber uppercase">
            {tLabel("chatbot_c_label", lang)}
          </p>
        </div>
        <h2
          className="text-xl sm:text-2xl font-heading font-black text-white mb-2"
          dangerouslySetInnerHTML={{ __html: tLabel("chatbot_c_title", lang) }}
        />
        <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto">
          {tLabel("chatbot_c_subtitle", lang)}
        </p>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-5">
        {chips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => handleChip(chip.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-card-dark border border-white/10 text-white text-xs font-medium hover:bg-white/10 hover:border-amber/30 transition-all group"
            aria-label={tLabel("chatbot_c_aria_ask", lang).replace("{label}", chip.label)}
          >
            <chip.icon className="text-amber text-sm group-hover:scale-110 transition-transform" />
            {chip.label}
          </button>
        ))}
      </div>

      {/* Chat panel */}
      <div className="relative bg-card-dark rounded-2xl border border-white/10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber/60 to-transparent bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />

        <div
          className={`overflow-y-auto transition-all duration-300 ${
            expanded ? "max-h-[400px]" : "max-h-[200px]"
          }`}
        >
          <div className="p-4 space-y-3" role="log" aria-live="polite">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg.role === "user"
                      ? "bg-amber text-black"
                      : "bg-[#1A1A1A] border border-white/5"
                  }`}
                >
                  <p
                    className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === "user" ? "text-black font-medium" : "text-gray-300"
                    }`}
                  >
                    {msg.text}
                  </p>
                  {msg.quickReplies &&
                    msg.quickReplies.length > 0 &&
                    i === messages.length - 1 &&
                    !isTyping && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {msg.quickReplies.map((qr) => (
                          <button
                            key={qr}
                            onClick={() => handleQuickReply(qr)}
                            className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-white text-[10px] font-medium hover:bg-amber/20 hover:border-amber/30 transition-all"
                          >
                            {qr}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl px-4 py-2.5">
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
        </div>

        {/* Input */}
        <div className="border-t border-white/10 px-4 py-3 bg-[#0D0D0D]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={tLabel("chatbot_c_placeholder", lang)}
              aria-label={tLabel("chatbot_c_aria_send", lang)}
              className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs placeholder-gray-500 focus:border-amber/50 focus:outline-none transition-colors"
            />
            <button
              onClick={() => {
                if (input.trim()) {
                  handleSend(input.trim());
                  setInput("");
                }
              }}
              disabled={!input.trim()}
              aria-label={tLabel("chatbot_c_aria_send", lang)}
              className="w-10 h-10 rounded-xl bg-amber text-black flex items-center justify-center hover:bg-amber-light transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              <HiPaperAirplane className="text-base" />
            </button>
          </div>
        </div>
      </div>

      {/* Human fallback */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <HiUserGroup className="text-gray-500 text-sm" />
          <p className="text-gray-500 text-xs">{tLabel("chatbot_c_footer_human", lang)}</p>
        </div>
        <button
          onClick={openContactModal}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] active:scale-95 text-sm"
        >
          {tLabel("chatbot_c_footer_cta", lang)}
        </button>
        <p className="text-[10px] text-gray-500 mt-3">{tLabel("chatbot_c_footer_privacy", lang)}</p>
      </div>
    </section>
  );
}
