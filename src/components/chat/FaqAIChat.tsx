"use client";

import { useState, useRef, useEffect } from "react";
import type { ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiChatBubbleLeftRight,
  HiMagnifyingGlass,
  HiPaperAirplane,
  HiSparkles,
  HiUserGroup,
  HiXMark,
  HiQuestionMarkCircle,
  HiCurrencyDollar,
  HiShieldCheck,
  HiInformationCircle,
} from "react-icons/hi2";
import {
  faqKnowledge,
  findFaqAnswer,
  getRelatedFaqs,
  popularFaqIds,
  type FaqEntry,
  type FaqTopic,
} from "@/lib/faq-knowledge";
import { openContactModal } from "@/components/contact/ContactModal";

export type FaqChatRole = "bot" | "user";

export type FaqChatMessage = {
  role: FaqChatRole;
  /** Plain-text body. User role ⇒ the question. Bot role ⇒ unformatted answer text or fallback. */
  text: string;
  /** Set on bot-answer messages: id of the matched FaqEntry, or "__fallback__" for "I don't know". */
  matchedFaqId?: string;
};

type Props = {
  variant?: "card" | "embedded";
  initialExpanded?: boolean;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
};

export function FaqAIChat({
  variant = "embedded",
  initialExpanded = false,
  title = "Ask Stratifit AI",
  subtitle = "Get instant, expert answers to common questions — 24/7.",
  onClose,
}: Props) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<FaqChatMessage[]>([
    {
      role: "bot",
      text:
        "👋 Hi! I'm Stratifit AI. Pick a topic below to dive in, or type your own question.",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTopic, setActiveTopic] = useState<FaqTopic>("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /** Topic chip rail — visible at the top of the chat. Matches the public
   *  FAQ banner reference: FAQ, Services, Pricing, Support, About. */
  const allTopics: { id: FaqTopic; label: string; icon: ComponentType<{ className?: string }> }[] = [
    { id: "all",      label: "FAQ",      icon: HiQuestionMarkCircle },
    { id: "Services", label: "Services", icon: HiSparkles },
    { id: "Pricing",  label: "Pricing",  icon: HiCurrencyDollar },
    { id: "Support",  label: "Support",  icon: HiShieldCheck },
    { id: "Business", label: "About",    icon: HiInformationCircle },
  ];

  /** Popular pills filtered by the active topic ("all" shows every popular entry). */
  const popular = popularFaqIds
    .map((id) => faqKnowledge.find((e) => e.id === id))
    .filter((e): e is FaqEntry => Boolean(e))
    .filter((e) => activeTopic === "all" || e.category === activeTopic);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const ask = (text: string, preMatched?: FaqEntry) => {
    const q = text.trim();
    if (!q) return;
    const matched = preMatched ?? findFaqAnswer(q, activeTopic);

    // Push the user's question as a user-role message
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (matched) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: matched.aiAnswer, matchedFaqId: matched.id },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text:
              "🤔 I couldn't find a matching answer. Try a popular question above, or tap below to chat with a human — we typically reply within 24 hours.",
            matchedFaqId: "__fallback__",
          },
        ]);
      }
    }, 600);
  };

  const handleHumanFallback = () => {
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: "Opening the contact form so a human can take over..." },
    ]);
    setTimeout(() => openContactModal(), 700);
  };

  const history = messages.slice(1);

  return (
    <div
      className={
        variant === "card"
          ? "relative bg-card-dark rounded-2xl border border-white/10 overflow-hidden"
          : "relative"
      }
    >
      {variant === "card" && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber/60 to-transparent bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />
      )}

      {/* Header / greeting */}
      <div className="px-5 sm:px-6 pt-5 pb-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-amber flex items-center justify-center shadow-[0_0_18px_rgba(245,158,11,0.3)] shrink-0">
          <HiChatBubbleLeftRight className="text-black text-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-heading font-black text-white text-sm">{title}</span>
            <span className="inline-flex items-center gap-1 text-[9px] text-gray-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Online
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{subtitle}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Close FAQ chat"
          >
            <HiXMark size={20} />
          </button>
        )}
      </div>

      {/* Topic chips — click to filter popular pills + scope the matcher by category */}
      <div className="flex-none px-4 py-3 border-b border-white/5 bg-black">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {allTopics.map((topic) => {
            const active = activeTopic === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => {
                  // "all" can't be deactivated — clicking it again is a no-op
                  if (active && topic.id !== "all") setActiveTopic("all");
                  else setActiveTopic(topic.id);
                }}
                className={`flex items-center gap-1.5 shrink-0 px-3.5 py-2 rounded-full border text-xs font-medium transition-all ${
                  active
                    ? "bg-amber text-black border-amber shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-amber/30"
                }`}
                aria-pressed={active}
              >
                <topic.icon className={`text-sm shrink-0 ${active ? "text-black" : "text-amber"}`} />
                {topic.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular pills */}
      <div className="px-5 sm:px-6 pb-3">
        <div className="flex items-baseline justify-between mb-2 gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
            Popular Questions
            {activeTopic !== "all" && (
              <span className="ml-2 text-amber normal-case tracking-normal font-medium">
                · {allTopics.find((t) => t.id === activeTopic)?.label ?? activeTopic}
              </span>
            )}
          </p>
          {activeTopic !== "all" && (
            <button
              onClick={() => setActiveTopic("all")}
              className="text-[10px] text-gray-500 hover:text-amber transition-colors"
            >
              Show all
            </button>
          )}
        </div>
        {popular.length === 0 ? (
          <p className="text-[11px] text-gray-500 italic">
            No popular questions in <span className="text-amber">{allTopics.find((t) => t.id === activeTopic)?.label ?? activeTopic}</span> yet — tap
            <span className="text-amber mx-1">Show all</span>
            or type your question below.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {popular.map((entry) => (
              <button
                key={entry.id}
                onClick={() => ask(entry.question, entry)}
                className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-gray-300 hover:bg-amber/15 hover:border-amber/30 hover:text-white transition-all inline-flex items-center gap-1.5"
              >
                <HiSparkles className="text-amber text-[10px] shrink-0" />
                {entry.question}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      <AnimatePresence initial={initialExpanded}>
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/5"
          >
            <div
              className="px-5 sm:px-6 py-4 space-y-3 max-h-[360px] overflow-y-auto menu-scroll overscroll-contain"
              role="log"
              aria-live="polite"
            >
              {history.map((msg, i) => {
                // User echo ⇒ amber bubble on right
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

                // Fallback bot message ⇒ "Talk to a human" CTA on its last occurrence
                if (msg.role === "bot" && msg.matchedFaqId === "__fallback__") {
                  const isLast = i === history.length - 1;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-start">
                        <div className="max-w-[92%] bg-card-dark border border-white/10 rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line text-gray-300">
                          {msg.text}
                        </div>
                      </div>
                      {isLast && !isTyping && (
                        <button
                          onClick={handleHumanFallback}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/15 rounded-lg text-xs text-white font-medium hover:bg-amber/15 hover:border-amber/30 transition-all"
                        >
                          <HiUserGroup className="text-amber text-base" />
                          Talk to a human
                        </button>
                      )}
                    </motion.div>
                  );
                }

                // Matched bot answer ⇒ card with category tag + optional related chips + cta
                if (msg.role === "bot" && msg.matchedFaqId) {
                  const entry = faqKnowledge.find((e) => e.id === msg.matchedFaqId);
                  const related = entry ? getRelatedFaqs(entry.related, entry.id) : [];
                  const isLast = i === history.length - 1;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-start">
                        <div className="max-w-[92%] bg-card-dark border border-amber/15 rounded-2xl px-4 py-3 shadow-[inset_0_0_20px_rgba(245,158,11,0.04)]">
                          {entry && (
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber mb-2 opacity-90">
                              {entry.category} · Answer
                            </p>
                          )}
                          <p className="text-sm leading-relaxed whitespace-pre-line text-gray-200">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                      {related.length > 0 && isLast && !isTyping && (
                        <div className="flex flex-wrap gap-1.5 pl-1">
                          {related.map((r) => (
                            <button
                              key={r.id}
                              onClick={() => ask(r.question, r)}
                              className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-white text-[10px] font-medium hover:bg-amber/20 hover:border-amber/30 transition-all inline-flex items-center gap-1.5"
                            >
                              <HiSparkles className="text-amber text-[9px]" />
                              {r.question}
                            </button>
                          ))}
                        </div>
                      )}
                      {entry?.cta && isLast && !isTyping && (
                        <div className="pl-1">
                          <button
                            onClick={openContactModal}
                            className="mt-1 inline-flex items-center gap-2 px-4 py-2 bg-amber text-black font-bold rounded-lg hover:bg-amber-light transition-all text-[11px] shadow-[0_0_20px_rgba(245,158,11,0.2)] active:scale-95"
                          >
                            {entry.cta.label}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                }

                // Greeting / generic bot message ⇒ also fall through to a greeting-shaped bubble
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[92%] bg-card-dark border border-white/10 rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line text-gray-300">
                      {msg.text}
                    </div>
                  </motion.div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-card-dark border border-white/10 rounded-2xl px-4 py-3">
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search input — anchored at the bottom (above the footer fallback) so chat history expands upward */}
      <div className="px-5 sm:px-6 py-3 border-t border-white/5 bg-black/40">
        <label className="relative block">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") ask(input);
            }}
            placeholder="Search questions… e.g. What does the process look like?"
            className="w-full bg-card-dark border border-white/10 rounded-xl pl-11 pr-12 py-3 text-white text-sm placeholder-gray-500 focus:border-amber/50 focus:outline-none transition-colors"
          />
          <button
            onClick={() => ask(input)}
            disabled={!input.trim()}
            aria-label="Send"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-amber text-black flex items-center justify-center hover:bg-amber-light transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <HiPaperAirplane className="text-sm" />
          </button>
        </label>
      </div>

      {/* Footer fallback */}
      <div className="px-5 sm:px-6 py-3 border-t border-white/5 flex items-center justify-between gap-3 bg-black/30">
        <p className="text-[10px] text-gray-500 flex items-center gap-1.5">
          <HiUserGroup className="text-amber text-xs" />
          Prefer a human? We'll reply within 24h.
        </p>
        <button
          onClick={openContactModal}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber hover:text-amber-light transition-colors"
        >
          Contact Team
        </button>
      </div>
    </div>
  );
}

export default FaqAIChat;
