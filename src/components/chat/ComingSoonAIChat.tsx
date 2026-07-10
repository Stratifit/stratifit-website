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
} from "react-icons/hi2";
import { openContactModal } from "@/components/contact/ContactModal";

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
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const chips: Chip[] = [
  { id: "launch", label: "When do you launch?", icon: HiClock },
  { id: "services", label: "What services?", icon: HiSparkles },
  { id: "early", label: "Early access", icon: HiRocketLaunch },
  { id: "pricing", label: "Pricing preview", icon: HiCurrencyDollar },
  { id: "hiring", label: "Are you hiring?", icon: HiUserGroup },
  { id: "location", label: "Where are you?", icon: HiMapPin },
  { id: "sneakpeek", label: "Sneak peek", icon: HiQuestionMarkCircle },
];

const responses: Record<string, ComingSoonMessage> = {
  greeting: {
    role: "bot",
    text:
      "👋 Hi! I'm Stratifit AI — happy to answer questions before we launch. Tap a topic below or type your question and I'll do my best.",
    intent: "info",
  },
  launch: {
    role: "bot",
    text:
      "🚀 **Launch countdown** — we're targeting **August 10, 2026** with a public beta.\n\nEarly supporters get a 30% discount on their first engagement and 60 days of complimentary post-launch support.\n\nWant a heads-up the moment we go live?",
    intent: "subscribe",
  },
  services: {
    role: "bot",
    text:
      "🎯 **Six core services** are launching day one:\n\n🎨 **Brand Design** — strategy, identity, guidelines\n💻 **Website Development** — custom Next.js sites & apps\n🤖 **AI & Automation** — chatbots, workflows, AI agents\n📈 **Growth Marketing** — SEO, ads, content, analytics\n🏢 **Buy a Business** — vetted online businesses\n🔧 **Funnel Strategy** — conversion + CRM optimization\n\nWhich area interests you most?",
    intent: "info",
  },
  early: {
    role: "bot",
    text:
      "🎁 **Early access perks** — Subscribe to our launch list and you'll receive:\n\n✅ **30% off** your first engagement\n✅ **60 days of free post-launch support**\n✅ **Priority booking** before public launch\n✅ **Behind-the-scenes access** to our private portfolio\n\nAll it takes is your email above. Want me to highlight the subscribe input?",
    intent: "subscribe",
  },
  pricing: {
    role: "bot",
    text:
      "💵 **Preview pricing** (locked in for early subscribers):\n\n🎨 **Brand Design** — $2,500 – $12,000\n💻 **Website Development** — $4,500 – $20,000\n🤖 **AI & Automation** — $3,000 – $18,000\n📈 **Growth Marketing** — from $1,200/mo\n\nWant a preliminary quote based on your project?",
    intent: "team",
  },
  hiring: {
    role: "bot",
    text:
      "🌱 **We're a small, senior team** — strategy, design, engineering, AI, growth all under one roof. We don't outsource, and we don't hire for hire's sake.\n\nThat said, we occasionally bring on **fractional specialists** for specific projects. If you're an exceptional strategist, designer, or AI engineer who loves shipped work over spec docs, we'd love to hear from you.",
    intent: "team",
  },
  location: {
    role: "bot",
    text:
      "🌍 **Fully distributed** — small team across North America, Europe, and Asia. We're async-first (Loom, Notion, Linear) with weekly calls for project check-ins.\n\nWhat matters isn't where we are — it's the quality of the work and the speed we ship it.",
    intent: "info",
  },
  sneakpeek: {
    role: "bot",
    text:
      "🔒 **Sneak peek** — We're sharing early-access materials with subscribers only:\n\n📐 Sample brand systems (Playbook)\n💻 Reference Next.js builds\n🤖 Live demo AI workflows\n📊 Pricing playbook & methodology\n\nSubscribe with your email above and we'll DM the bundle before launch.",
    intent: "subscribe",
  },
  fallback: {
    role: "bot",
    text:
      "🤔 Good question — I don't have a scripted answer for that one yet, but our team absolutely will. Tap below to drop us a note and we'll respond within 24 hours.",
    intent: "team",
  },
};

const greeting = responses.greeting;

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
  const [messages, setMessages] = useState<ComingSoonMessage[]>([greeting]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        if (lower.includes("launch") || lower.includes("when") || lower.includes("date")) key = "launch";
        else if (lower.includes("service") || lower.includes("offer") || lower.includes("do you do")) key = "services";
        else if (lower.includes("early") || lower.includes("access") || lower.includes("beta")) key = "early";
        else if (lower.includes("pric") || lower.includes("cost") || lower.includes("budget")) key = "pricing";
        else if (lower.includes("hire") || lower.includes("job") || lower.includes("team grow")) key = "hiring";
        else if (lower.includes("where") || lower.includes("location") || lower.includes("office")) key = "location";
        else if (lower.includes("sneak") || lower.includes("preview") || lower.includes("see")) key = "sneakpeek";
      }
      setMessages((prev) => [...prev, responses[key]]);
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
      { role: "bot", text: "Opening the contact form so a real human can take over..." },
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
              Online · Pre-launch concierge
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
                  Subscribe for Launch
                </>
              ) : lastBotIntent === "team" ? (
                <>
                  <HiUserGroup className="text-sm" />
                  Talk to the Team
                </>
              ) : (
                <>
                  <HiSparkles className="text-sm" />
                  Explore Services
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
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
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
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") ask(input);
            }}
            placeholder="Ask anything — pricing, services, launch…"
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
      </div>

      {/* Footer */}
      <div className="flex-none border-t border-white/5 px-5 py-2 flex items-center justify-between bg-black/60 text-[10px] text-gray-500 relative z-10">
        <span className="flex items-center gap-1">
          <HiHeart className="text-amber text-[10px]" />
          Built with care by the Stratifit team
        </span>
        <button
          onClick={handleHumanTeam}
          className="font-bold text-amber hover:text-amber-light transition-colors inline-flex items-center gap-1"
        >
          <HiUserGroup className="text-xs" />
          Talk to a human
        </button>
      </div>
    </div>
  );
}

export default ComingSoonAIChat;
