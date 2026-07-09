"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChatBubbleLeftRight, HiXMark, HiPaperAirplane, HiQuestionMarkCircle, HiBriefcase, HiCurrencyDollar, HiLifebuoy, HiBuildingOffice2 } from "react-icons/hi2";

type Category = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type Message = {
  role: "bot" | "user";
  text: string;
  quickReplies?: string[];
};

const categories: Category[] = [
  { id: "faq", label: "FAQ", icon: HiQuestionMarkCircle },
  { id: "services", label: "Services", icon: HiBriefcase },
  { id: "pricing", label: "Pricing", icon: HiCurrencyDollar },
  { id: "support", label: "Support", icon: HiLifebuoy },
  { id: "about", label: "About", icon: HiBuildingOffice2 },
];

const responses: Record<string, Message> = {
  greeting: {
    role: "bot",
    text: "👋 Hi! I'm Stratifit AI — here to help. What would you like to know?",
    quickReplies: ["FAQ", "Services", "Pricing", "Support", "Help", "Contact"],
  },
  faq: {
    role: "bot",
    text: "Here are some common questions:\n\n🕐 **Timeline** — 4–6 weeks for branding, 6–12 weeks for full website builds.\n\n💳 **Payments** — 50% deposit, 50% on completion. Milestone billing available for larger projects.\n\n🔧 **Tech Stack** — Next.js, React, TypeScript, Tailwind CSS, Node.js.\n\n🔄 **Post-Launch** — 30 days complimentary support included. Maintenance retainers available.\n\n🤖 **AI** — We build production AI solutions from chatbots to workflow automation.\n\nAsk me anything else!",
    quickReplies: ["Services", "Pricing", "Speak to Team"],
  },
  services: {
    role: "bot",
    text: "Here's what we offer:\n\n🎨 **Brand Design** — Strategy, identity, guidelines, logo design\n\n💻 **Website Development** — Custom Next.js sites, ecommerce, web apps\n\n🤖 **AI & Automation** — Chatbots, workflow automation, AI integrations\n\n📈 **Growth Marketing** — SEO, paid ads, content marketing, analytics\n\nWhich area interests you?",
    quickReplies: ["Branding", "Development", "AI & Automation", "Pricing"],
  },
  pricing: {
    role: "bot",
    text: "Our project pricing is transparent:\n\n🎨 **Branding** — $3,000 – $15,000\n💻 **Web Development** — $5,000 – $25,000\n🤖 **AI Automation** — $3,000 – $20,000\n📈 **Growth Marketing** — starting at $1,500/mo\n\nEvery project is scoped to your needs. Want a custom quote?",
    quickReplies: ["Get a Quote", "Services", "FAQ"],
  },
  support: {
    role: "bot",
    text: "We're here for you! 📧\n\n✉️ **Email**: hello@stratifit.com\n⏱️ **Response Time**: Within 24 hours\n🛡️ **Post-Launch**: 30 days free support\n🔧 **Maintenance**: Custom retainers available\n\nWant to speak directly with our team?",
    quickReplies: ["Speak to Team", "FAQ", "Services"],
  },
  about: {
    role: "bot",
    text: "**Stratifit** is a digital excellence studio specializing in brand design, web development, AI automation, and growth marketing.\n\n📍 We work with startups, scale-ups, and enterprises worldwide.\n\n🏆 Our approach: strategy-first, design-driven, tech-powered.\n\nWant to see our work or start a project?",
    quickReplies: ["Services", "Pricing", "Speak to Team"],
  },
  branding: {
    role: "bot",
    text: "Our branding services include:\n\n🎯 **Brand Strategy** — Positioning, messaging, audience research\n🎨 **Visual Identity** — Logo, color systems, typography\n📖 **Brand Guidelines** — Comprehensive usage documentation\n\nStarting at $3,000. Want to discuss your brand?",
    quickReplies: ["Pricing", "Speak to Team", "Services"],
  },
  development: {
    role: "bot",
    text: "We build modern, performant websites:\n\n⚡ **Next.js & React** — Blazing fast, SEO-optimized\n🎨 **Tailwind CSS** — Beautiful, responsive designs\n🛒 **Ecommerce** — Shopify, custom solutions\n🔌 **Integrations** — Stripe, HubSpot, APIs\n\nProjects from $5,000. Ready to build?",
    quickReplies: ["Pricing", "Speak to Team", "Services"],
  },
  ai: {
    role: "bot",
    text: "AI & Automation solutions:\n\n💬 **Chatbots** — Customer support, lead qualification\n⚙️ **Workflow Automation** — Connect your tools, save hours\n🧠 **Custom AI** — Fine-tuned models for your business\n📊 **Analytics** — AI-powered insights & reporting\n\nStarting at $3,000. Let's automate!",
    quickReplies: ["Pricing", "Speak to Team", "Services"],
  },
  quote: {
    role: "bot",
    text: "Let's get you a custom quote! Fill out our contact form and we'll get back to you within 24 hours with a detailed proposal tailored to your needs. Opening the contact form for you now...",
    quickReplies: [],
  },
  team: {
    role: "bot",
    text: "Our team would love to hear from you! You can reach us at hello@stratifit.com or fill out our contact form for a detailed consultation.\n\nWe typically respond within 24 hours.",
    quickReplies: ["Open Contact Form", "Support", "FAQ"],
  },
};

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([responses.greeting]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

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
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSend = (text: string) => {
    // Check for contact form navigation
    const lower = text.toLowerCase();
    if (lower === "contact" || lower.trim() === "contact me" || lower.trim() === "help" || lower.includes("open contact form") || lower.includes("speak to team") || lower.includes("get a quote") || lower.includes("contact form")) {
      const userMsg: Message = { role: "user", text };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
      // Add bot message then navigate after a short delay
      const botMsg = lower.includes("get a quote") || lower.includes("open contact form") ? responses.quote : responses.team;
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, botMsg]);
        // Navigate to contact form after the message appears
        setTimeout(() => {
          setIsOpen(false);
          const el = document.getElementById("contact");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          } else {
            window.location.hash = "contact";
          }
        }, 1200);
      }, 800);
      return;
    }

    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    let botResponse: Message;
    if (lower.includes("faq") || lower.includes("question")) botResponse = responses.faq;
    else if (lower.includes("service") || lower.includes("offer")) botResponse = responses.services;
    else if (lower.includes("pric") || lower.includes("cost") || lower.includes("budget")) botResponse = responses.pricing;
    else if (lower.includes("support") || lower.includes("contact")) botResponse = responses.support;
    else if (lower.includes("about") || lower.includes("who")) botResponse = responses.about;
    else if (lower.includes("brand")) botResponse = responses.branding;
    else if (lower.includes("develop") || lower.includes("web") || lower.includes("site")) botResponse = responses.development;
    else if (lower.includes("ai") || lower.includes("auto")) botResponse = responses.ai;
    else if (lower.includes("quote")) botResponse = responses.quote;
    else if (lower.includes("team") || lower.includes("speak")) botResponse = responses.team;
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
      {/* Chat Button — mobile only */}
      <button
        onClick={() => { setIsOpen(true); setShowBadge(false); }}
        className="lg:hidden relative w-10 h-10 rounded-full bg-amber flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        aria-label="Open chat"
      >
        <HiChatBubbleLeftRight className="text-black text-lg" />
        {showBadge && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 border-2 border-black animate-pulse" />
        )}
      </button>

      {/* Chat Panel */}
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
              className="lg:hidden fixed bottom-0 left-0 right-0 z-[70] bg-black flex flex-col max-h-[92dvh] rounded-t-2xl border-t border-white/10"
            >
              {/* Header */}
              <div className="flex-none px-4 py-3 flex items-center justify-between border-b border-white/10 bg-black/95 rounded-t-2xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-amber flex items-center justify-center">
                    <HiChatBubbleLeftRight className="text-black text-lg" />
                  </div>
                  <div>
                    <span className="font-heading font-black text-white text-sm">Stratifit AI</span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-[9px] text-gray-400 font-medium">Online</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close chat"
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

              {/* Messages — spacer div pins to bottom naturally, no JS scroll needed on open */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto flex flex-col px-4 py-4 menu-scroll overscroll-contain">
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
                      <p className={`text-sm leading-relaxed whitespace-pre-line ${msg.role === "user" ? "text-black font-medium" : "text-gray-300"}`}>
                        {msg.text}
                      </p>
                      {msg.quickReplies && msg.quickReplies.length > 0 && i === messages.length - 1 && !isTyping && (
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
                    placeholder="Type your message..."
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
                    <HiPaperAirplane className="text-lg rotate-90" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
