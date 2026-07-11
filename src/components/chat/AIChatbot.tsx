"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { openContactModal } from "@/components/contact/ContactModal";
import {
  HiChatBubbleLeftRight,
  HiXMark,
  HiPaperAirplane,
  HiQuestionMarkCircle,
  HiBriefcase,
  HiCurrencyDollar,
  HiLifebuoy,
  HiBuildingOffice2,
} from "react-icons/hi2";
import { useLanguage } from "@/lib/LanguageContext";
import { tLabel } from "@/lib/stratifit-i18n";
import type { Language } from "@/lib/cms-types";

type Category = {
  id: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
};

type Message = {
  role: "bot" | "user";
  text: string;
  quickReplies?: string[];
};

/* Category config — labels are i18n keys. The actual translated text
   is computed in getCategories(lang) below. */
const categoryConfig: Category[] = [
  { id: "faq", labelKey: "chatbot_ai_cat_faq", icon: HiQuestionMarkCircle },
  { id: "services", labelKey: "chatbot_ai_cat_services", icon: HiBriefcase },
  { id: "pricing", labelKey: "chatbot_ai_cat_pricing", icon: HiCurrencyDollar },
  { id: "support", labelKey: "chatbot_ai_cat_support", icon: HiLifebuoy },
  { id: "about", labelKey: "chatbot_ai_cat_about", icon: HiBuildingOffice2 },
];

function getCategories(lang: Language): { id: string; label: string; icon: Category["icon"] }[] {
  return categoryConfig.map((c) => ({ id: c.id, label: tLabel(c.labelKey, lang), icon: c.icon }));
}

function getResponses(lang: Language): Record<string, Message> {
  return {
    greeting: {
      role: "bot",
      text: tLabel("chatbot_ai_resp_greeting", lang),
      quickReplies: [
        tLabel("chatbot_ai_cat_faq", lang),
        tLabel("chatbot_ai_cat_services", lang),
        tLabel("chatbot_ai_cat_pricing", lang),
        tLabel("chatbot_ai_cat_support", lang),
        tLabel("chatbot_ai_qr_help", lang),
        tLabel("chatbot_ai_qr_contact", lang),
      ],
    },
    faq: {
      role: "bot",
      text: tLabel("chatbot_ai_resp_faq", lang),
      quickReplies: [tLabel("chatbot_ai_cat_services", lang), tLabel("chatbot_ai_cat_pricing", lang), tLabel("chatbot_ai_qr_speak", lang)],
    },
    services: {
      role: "bot",
      text: tLabel("chatbot_ai_resp_services", lang),
      quickReplies: [tLabel("chatbot_ai_qr_branding", lang), tLabel("chatbot_ai_qr_development", lang), tLabel("chatbot_ai_qr_ai", lang), tLabel("chatbot_ai_cat_pricing", lang)],
    },
    pricing: {
      role: "bot",
      text: tLabel("chatbot_ai_resp_pricing", lang),
      quickReplies: [tLabel("chatbot_ai_qr_quote", lang), tLabel("chatbot_ai_cat_services", lang), tLabel("chatbot_ai_cat_faq", lang)],
    },
    support: {
      role: "bot",
      text: tLabel("chatbot_ai_resp_support", lang),
      quickReplies: [tLabel("chatbot_ai_qr_speak", lang), tLabel("chatbot_ai_cat_faq", lang), tLabel("chatbot_ai_cat_services", lang)],
    },
    about: {
      role: "bot",
      text: tLabel("chatbot_ai_resp_about", lang),
      quickReplies: [tLabel("chatbot_ai_cat_services", lang), tLabel("chatbot_ai_cat_pricing", lang), tLabel("chatbot_ai_qr_speak", lang)],
    },
    branding: {
      role: "bot",
      text: tLabel("chatbot_ai_resp_branding", lang),
      quickReplies: [tLabel("chatbot_ai_cat_pricing", lang), tLabel("chatbot_ai_qr_speak", lang), tLabel("chatbot_ai_cat_services", lang)],
    },
    development: {
      role: "bot",
      text: tLabel("chatbot_ai_resp_development", lang),
      quickReplies: [tLabel("chatbot_ai_cat_pricing", lang), tLabel("chatbot_ai_qr_speak", lang), tLabel("chatbot_ai_cat_services", lang)],
    },
    ai: {
      role: "bot",
      text: tLabel("chatbot_ai_resp_ai", lang),
      quickReplies: [tLabel("chatbot_ai_cat_pricing", lang), tLabel("chatbot_ai_qr_speak", lang), tLabel("chatbot_ai_cat_services", lang)],
    },
    quote: {
      role: "bot",
      text: tLabel("chatbot_ai_resp_quote", lang),
      quickReplies: [],
    },
    team: {
      role: "bot",
      text: tLabel("chatbot_ai_resp_team", lang),
      quickReplies: [tLabel("chatbot_ai_qr_open_form", lang), tLabel("chatbot_ai_cat_support", lang), tLabel("chatbot_ai_cat_faq", lang)],
    },
  };
}

export function AIChatbot() {
  const { lang } = useLanguage();
  const categories = getCategories(lang);
  const responses = getResponses(lang);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([responses.greeting]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [mounted, setMounted] = useState(false);

  // setMounted(true) post-mount so createPortal can safely target document.body.
  // This is the canonical "isMounted" pattern; reading document during SSR would
  // throw, so we explicitly delay the portal to after hydration. The
  // set-state-in-effect rule doesn't apply to this idiom.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(isOpen);
  // Sync the ref in useLayoutEffect rather than during render so the
  // setTimeout callback inside handleSend sees the fresh `isOpen` value
  // without mutating a ref mid-render.
  useLayoutEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Pin scroll to bottom on open — useLayoutEffect fires after layout, before paint
  useLayoutEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [isOpen]);

  // Scroll to latest message when new content arrives during active chat
  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isOpen) return;
    // Only lock body scroll on mobile-sized viewports where the bottom-sheet covers the screen.
    // On desktop (lg+) the panel is a corner widget — background page scroll must remain free.
    const isMobileViewport = () => window.matchMedia("(max-width: 1023px)").matches;
    if (!isMobileViewport()) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Desktop-only outside-click-to-close: backdrop is `lg:hidden` so on desktop the user
  // must be able to dismiss the corner widget by clicking anywhere else on the page.
  useEffect(() => {
    if (!isOpen) return;
    const isMobileViewport = () => window.matchMedia("(max-width: 1023px)").matches;
    if (isMobileViewport()) return;
    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-chat-panel]")) return;
      if (target.closest("[data-chat-trigger]")) return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  const handleSend = (text: string) => {
    // Check for contact form navigation. Each language's quick-reply
    // stems are included so translated buttons (e.g. "Obtenir un devis"
    // / "Angebot anfordern" / "Solicitar cotización") still trigger the
    // contact modal in their respective language.
    const lower = text.toLowerCase();
    if (
      lower === "contact" ||
      lower.trim() === "contact me" ||
      lower.trim() === "help" ||
      lower.includes("open contact form") ||
      lower.includes("speak to team") ||
      lower.includes("get a quote") ||
      lower.includes("contact form") ||
      lower.includes("obtenir un devis") ||
      lower.includes("parler") || lower.includes("équipe") || lower.includes("contacter") || lower.includes("aide") || lower.includes("formulaire") ||
      lower.includes("angebot") || lower.includes("team sprechen") || lower.includes("kontakt") || lower.includes("hilfe") || lower.includes("formular") ||
      lower.includes("cotiz") || lower.includes("hablar") || lower.includes("equipo") || lower.includes("contacto") || lower.includes("ayuda") || lower.includes("formulario")
    ) {
      const userMsg: Message = { role: "user", text };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
      // Add bot message then navigate after a short delay
      const botMsg =
        lower.includes("get a quote") || lower.includes("open contact form")
          ? responses.quote
          : responses.team;
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, botMsg]);
        // Open contact modal after the message appears
        setTimeout(() => {
          setIsOpen(false);
          openContactModal();
        }, 1200);
      }, 800);
      return;
    }

    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    let botResponse: Message;
    // Language-aware keyword detection: matches each language's stems
    // so users typing in their native language still land on the
    // right scripted answer.
    if (
      lower.includes("faq") || lower.includes("question") ||
      lower.includes("frage") || lower.includes("fragen") ||
      lower.includes("pregunta") || lower.includes("preguntas")
    ) botResponse = responses.faq;
    else if (
      lower.includes("service") || lower.includes("offer") ||
      lower.includes("service") || lower.includes("offre") ||
      lower.includes("dienst") || lower.includes("leistung") ||
      lower.includes("servicio") || lower.includes("ofrece")
    ) botResponse = responses.services;
    else if (
      lower.includes("pric") || lower.includes("cost") || lower.includes("budget") ||
      lower.includes("prix") || lower.includes("coût") || lower.includes("budget") ||
      lower.includes("preis") || lower.includes("kosten") ||
      lower.includes("precio") || lower.includes("costo")
    )
      botResponse = responses.pricing;
    else if (
      lower.includes("support") || lower.includes("contact") ||
      lower.includes("support") || lower.includes("contact") ||
      lower.includes("support") || lower.includes("kontakt") ||
      lower.includes("soporte") || lower.includes("contacto")
    )
      botResponse = responses.support;
    else if (
      lower.includes("about") || lower.includes("who") ||
      lower.includes("propos") || lower.includes("qui") ||
      lower.includes("über") || lower.includes("wer") ||
      lower.includes("acerca") || lower.includes("quién")
    ) botResponse = responses.about;
    else if (
      lower.includes("brand") || lower.includes("marque") || lower.includes("marke") || lower.includes("marca")
    ) botResponse = responses.branding;
    else if (
      lower.includes("develop") || lower.includes("web") || lower.includes("site") ||
      lower.includes("dév") || lower.includes("site") ||
      lower.includes("entwick") || lower.includes("website") ||
      lower.includes("desarr") || lower.includes("sitio")
    )
      botResponse = responses.development;
    else if (
      // Tightened to require "automat" or "chatbot" as the primary stem
      // across all 4 languages. Bare "ai"/"ia"/"ki" was too broad (matched
      // "main", "available", "domain", "again", "había", "werden", etc.).
      lower.includes("automat") || lower.includes("chatbot") || lower.includes("agent") ||
      lower.includes("automat") || lower.includes("chatbot") || lower.includes("agent") ||
      lower.includes("automat") || lower.includes("chatbot") || lower.includes("agent") ||
      lower.includes("automat") || lower.includes("chatbot") || lower.includes("agent")
    ) botResponse = responses.ai;
    else if (lower.includes("quote") || lower.includes("devis") || lower.includes("angebot") || lower.includes("cotiz")) botResponse = responses.quote;
    else if (
      lower.includes("team") || lower.includes("speak") || lower.includes("human") || lower.includes("help") ||
      lower.includes("équipe") || lower.includes("aide") ||
      lower.includes("team") || lower.includes("hilfe") ||
      lower.includes("equipo") || lower.includes("ayuda")
    ) botResponse = responses.team;
    else botResponse = responses.greeting;

    // Simulate typing delay
    const delay = Math.min(botResponse.text.length * 20, 1500);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, botResponse]);
      // Show badge if chat is closed and bot replied (use ref for fresh value)
      if (!isOpenRef.current) setShowBadge(true);
    }, delay);
  };

  const handleQuickReply = (reply: string) => {
    handleSend(reply);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      handleSend(input.trim());
      setInput("");
    }
  };

  return (
    <>
      {/* Chat Button — sits in the Header as before; panel slides up from the bottom on click */}
      <button
        onClick={() => {
          setIsOpen(true);
          setShowBadge(false);
        }}
        className="relative w-10 h-10 rounded-full bg-amber flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        aria-label={tLabel("chatbot_ai_aria_open", lang)}
        data-chat-trigger=""
      >
        <HiChatBubbleLeftRight className="text-black text-lg" />
        {showBadge && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 border-2 border-black animate-pulse" />
        )}
      </button>

      {/* Chat Panel — portaled to body so it's always relative to viewport */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="lg:hidden fixed inset-0 z-[65] bg-black/60 backdrop-blur-sm"
                  onClick={() => setIsOpen(false)}
                />
                {/* Panel */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 26, stiffness: 220 }}
                  className="fixed bottom-0 inset-x-0 z-[70] bg-black flex flex-col max-h-[92dvh] rounded-t-2xl border-t border-white/10 lg:inset-x-auto lg:bottom-6 lg:right-6 lg:w-[400px] xl:w-[440px] lg:max-h-[80vh] lg:rounded-2xl lg:border lg:border-white/10 lg:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]"
                  data-chat-panel=""
                >
                  {/* Header */}
                  <div className="flex-none px-4 py-3 flex items-center justify-between border-b border-white/10 bg-black/95 rounded-t-2xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-amber flex items-center justify-center">
                        <HiChatBubbleLeftRight className="text-black text-lg" />
                      </div>
                      <div>
                        <span className="font-heading font-black text-white text-sm">{tLabel("chatbot_ai_title", lang)}</span>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          <span className="text-[9px] text-gray-400 font-medium">{tLabel("chatbot_ai_status", lang)}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors"
                      aria-label={tLabel("chatbot_ai_aria_close", lang)}
                    >
                      <HiXMark size={22} />
                    </button>
                  </div>

                  {/* Categories */}
                  <div className="flex-none px-4 py-3 border-b border-white/5 bg-black">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleQuickReply(cat.label)}
                          className="flex items-center gap-1.5 shrink-0 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-medium hover:bg-white/10 hover:border-amber/30 transition-all"
                        >
                          <cat.icon className="text-amber text-sm" />
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Messages */}
                  <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto flex flex-col px-4 py-4 menu-scroll overscroll-contain"
                  >
                    <div className="flex-1 min-h-0" />
                    <div className="space-y-4">
                      {messages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                              msg.role === "user"
                                ? "bg-amber text-black"
                                : "bg-card-dark border border-white/5"
                            }`}
                          >
                            <p
                              className={`text-sm leading-relaxed whitespace-pre-line ${msg.role === "user" ? "text-black font-medium" : "text-gray-300"}`}
                            >
                              {msg.text}
                            </p>
                            {msg.quickReplies &&
                              msg.quickReplies.length > 0 &&
                              i === messages.length - 1 &&
                              !isTyping && (
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                  {msg.quickReplies.map((qr) => (
                                    <button
                                      key={qr}
                                      onClick={() => handleQuickReply(qr)}
                                      className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white text-[11px] font-medium hover:bg-amber/20 hover:border-amber/30 transition-all"
                                    >
                                      {qr}
                                    </button>
                                  ))}
                                </div>
                              )}
                          </div>
                        </div>
                      ))}

                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-card-dark border border-white/5 rounded-2xl px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber/40 animate-bounce [animation-delay:0ms]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-amber/40 animate-bounce [animation-delay:150ms]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-amber/40 animate-bounce [animation-delay:300ms]" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Input */}
                  <div className="flex-none px-4 py-3 border-t border-white/10 bg-black">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={tLabel("chatbot_ai_placeholder", lang)}
                        className="flex-1 bg-card-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:border-amber/50 focus:outline-none transition-colors"
                      />
                      <button
                        onClick={() => {
                          if (input.trim()) {
                            handleSend(input.trim());
                            setInput("");
                          }
                        }}
                        disabled={!input.trim()}
                        className="w-11 h-11 rounded-xl bg-amber text-black flex items-center justify-center hover:bg-amber-light transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                      >
                        <HiPaperAirplane className="text-lg" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
