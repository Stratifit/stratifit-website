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
} from "react-icons/hi2";
import { openContactModal } from "@/components/contact/ContactModal";

type Message = {
  role: "bot" | "user";
  text: string;
  quickReplies?: string[];
};

type Chip = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const chips: Chip[] = [
  { id: "pricing", label: "Pricing & Cost", icon: HiCurrencyDollar },
  { id: "timeline", label: "Timeline", icon: HiClock },
  { id: "stack", label: "Tech Stack", icon: HiCog },
  { id: "process", label: "Our Process", icon: HiLightBulb },
  { id: "services", label: "Services", icon: HiBriefcase },
  { id: "support", label: "Support", icon: HiLifebuoy },
];

const botResponses: Record<string, Message> = {
  greeting: {
    role: "bot",
    text: "Hey! I'm Stratifit AI — your instant project advisor. Tap a topic below or type your question and I'll help you out.",
    quickReplies: ["Pricing", "Timeline", "Tech Stack", "Our Process"],
  },
  pricing: {
    role: "bot",
    text: "Transparent pricing, tailored to you:\n\nBrand Design — $3,000-$15,000\nWebsite Development — $5,000-$25,000\nAI Automation — $3,000-$20,000\nGrowth Marketing — from $1,500/mo\n\nEvery project is custom-scoped. Want an exact quote?",
    quickReplies: ["Get a Quote", "Timeline", "Tech Stack"],
  },
  timeline: {
    role: "bot",
    text: "Typical turnaround times:\n\nBranding — 2-4 weeks\nFull website — 4-8 weeks\nAI automation — 3-6 weeks\nMarketing — ongoing, results in 30-90 days\n\nMost projects kick off within 48 hours. Rush delivery available.",
    quickReplies: ["Pricing", "Our Process", "Get a Quote"],
  },
  stack: {
    role: "bot",
    text: "Our modern, scalable tech stack:\n\nFrontend — Next.js, React, TypeScript, Tailwind CSS\nBackend — Node.js, Python, PostgreSQL\nAI — OpenAI, LangChain, custom models\nInfra — Vercel, AWS, Docker\n\nProduction-grade and fully documented.",
    quickReplies: ["Our Process", "Pricing", "Services"],
  },
  process: {
    role: "bot",
    text: "Our proven 4-step process:\n\n1. Strategy — We dig deep into your goals, audience & market\n2. Design — Wireframes → prototypes → pixel-perfect mockups\n3. Build — Clean code, regular check-ins, zero surprises\n4. Launch & Grow — Deploy, optimize, and ongoing support\n\nWe keep you in the loop at every step.",
    quickReplies: ["Timeline", "Pricing", "Services"],
  },
  services: {
    role: "bot",
    text: "We cover the full digital spectrum:\n\nBrand Design — Strategy, identity, guidelines\nWeb Development — Custom sites, apps, ecommerce\nAI & Automation — Chatbots, workflows, integrations\nGrowth Marketing — SEO, ads, content, analytics\nBuy a Business — Acquire ready-made online businesses\n\nWhich area fits your needs?",
    quickReplies: ["Pricing", "Timeline", "Get a Quote"],
  },
  support: {
    role: "bot",
    text: "Post-launch we've got your back:\n\n30 days of free support after launch\nPriority email support — response within 24h\nMaintenance retainers available\nMonthly performance reports included\n\nYour success doesn't end at launch.",
    quickReplies: ["Pricing", "Services", "Speak to Team"],
  },
  quote: {
    role: "bot",
    text: "Great choice! Let's get you a custom proposal. Our team will scope your project, prep a detailed estimate, and get back to you within 24 hours. Opening the contact form now...",
    quickReplies: [],
  },
  team: {
    role: "bot",
    text: "Absolutely — our team would love to chat! Opening the contact form so you can tell us about your project. We'll respond within 24 hours.",
    quickReplies: [],
  },
  fallback: {
    role: "bot",
    text: "Good question! I can help with pricing, timelines, tech stack, our process, services, or post-launch support. Tap a topic above or try rephrasing!",
    quickReplies: ["Pricing", "Timeline", "Our Process", "Services"],
  },
};

export default function ContactChatbot() {
  const [messages, setMessages] = useState<Message[]>([botResponses.greeting]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    if (lower.includes("quote") || lower.includes("speak to team") || lower.includes("contact")) {
      const userMsg: Message = { role: "user", text };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
      setExpanded(true);

      const botMsg = lower.includes("quote") ? botResponses.quote : botResponses.team;
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
    if (
      lower.includes("pric") ||
      lower.includes("cost") ||
      lower.includes("budget") ||
      lower.includes("estimate")
    )
      response = botResponses.pricing;
    else if (
      lower.includes("time") ||
      lower.includes("long") ||
      lower.includes("week") ||
      lower.includes("timeline")
    )
      response = botResponses.timeline;
    else if (lower.includes("stack") || lower.includes("tech") || lower.includes("code"))
      response = botResponses.stack;
    else if (lower.includes("process") || lower.includes("step") || lower.includes("method"))
      response = botResponses.process;
    else if (lower.includes("service") || lower.includes("offer")) response = botResponses.services;
    else if (lower.includes("support") || lower.includes("maintain") || lower.includes("after"))
      response = botResponses.support;
    else response = botResponses.fallback;

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, response]);
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
            Instant Answers
          </p>
        </div>
        <h2 className="text-xl sm:text-2xl font-heading font-black text-white mb-2">
          Ask Stratifit <span className="text-amber">AI</span>
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto">
          Get instant answers about pricing, timelines, and more. Or talk to a human — your choice.
        </p>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-5">
        {chips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => handleChip(chip.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-card-dark border border-white/10 text-white text-xs font-medium hover:bg-white/10 hover:border-amber/30 transition-all group"
            aria-label={`Ask about ${chip.label}`}
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
              placeholder="Ask about pricing, timeline, tech stack..."
              aria-label="Type your question"
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
              aria-label="Send message"
              className="w-10 h-10 rounded-xl bg-amber text-black flex items-center justify-center hover:bg-amber-light transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              <HiPaperAirplane className="text-base rotate-90" />
            </button>
          </div>
        </div>
      </div>

      {/* Human fallback */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <HiUserGroup className="text-gray-500 text-sm" />
          <p className="text-gray-500 text-xs">Prefer a human?</p>
        </div>
        <button
          onClick={openContactModal}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] active:scale-95 text-sm"
        >
          Contact Our Team
        </button>
        <p className="text-[10px] text-gray-500 mt-3">No spam. Your data stays private.</p>
      </div>
    </section>
  );
}
