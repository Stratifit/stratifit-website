import type { ComponentType } from "react";
import {
  HiClock,
  HiSparkles,
  HiRocketLaunch,
  HiUserGroup,
  HiEnvelope,
  HiMapPin,
  HiQuestionMarkCircle,
  HiCurrencyDollar,
} from "react-icons/hi2";

/* ------------------------------------------------------------------ */
/*  Coming-Soon AI bot — shared data module                            */
/*                                                                    */
/*  Consumed by:                                                       */
/*    src/components/chat/ComingSoonAIChat.tsx (public concierge)       */
/*    src/app/admin/coming-soon/page.tsx          (master admin view)    */
/*    src/app/admin/coming-soon/[id]/page.tsx     (detail admin view)   */
/* ------------------------------------------------------------------ */

export type ComingSoonRole = "bot" | "user";
export type ComingSoonIntent = "subscribe" | "team" | "info";

export type ComingSoonMessage = {
  role: ComingSoonRole;
  text: string;
  /** Set on bot answer messages — drives the CTA chip beneath the latest answer. */
  intent?: ComingSoonIntent;
};

export type ComingSoonChip = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

/* The greeting lives in the responses map but is exported separately so  */
/* the chat component can seed its initial state.                          */
export const comingSoonGreeting: ComingSoonMessage = {
  role: "bot",
  text:
    "👋 Hi! I'm Stratifit AI — happy to answer questions before we launch. Tap a topic below or type your question and I'll do my best.",
  intent: "info",
};

export const comingSoonChips: ComingSoonChip[] = [
  { id: "launch", label: "When do you launch?", icon: HiClock },
  { id: "services", label: "What services?", icon: HiSparkles },
  { id: "early", label: "Early access", icon: HiRocketLaunch },
  { id: "pricing", label: "Pricing preview", icon: HiCurrencyDollar },
  { id: "hiring", label: "Are you hiring?", icon: HiUserGroup },
  { id: "location", label: "Where are you?", icon: HiMapPin },
  { id: "sneakpeek", label: "Sneak peek", icon: HiQuestionMarkCircle },
];

export const comingSoonResponses: Record<string, ComingSoonMessage> = {
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

/**
 * Per-entry keyword lists — drives both the free-form matcher and the admin
 * detail view's "Match triggers" preview, so admins see the actual phrases.
 */
export const comingSoonKeywords: Record<string, string[]> = {
  launch:     ["launch", "when", "date", "go live"],
  services:   ["service", "offer", "do you do", "what can"],
  early:      ["early", "access", "beta", "subscriber"],
  pricing:    ["pric", "cost", "budget", "rate"],
  hiring:     ["hire", "job", "career", "team grow"],
  location:   ["where", "location", "office", "based"],
  sneakpeek:  ["sneak", "preview", "see ", "look like"],
};

/**
 * Lightweight substring matcher used by ComingSoonAIChat when the user types free-form text.
 * Returns the matched response id and the message that should be pushed on the next tick.
 *
 * Order matters — entries earlier in comingSoonKeywords win ties.
 */
export function findComingSoonAnswer(query: string): { id: string; message: ComingSoonMessage } {
  const q = query.trim().toLowerCase();
  for (const [id, keywords] of Object.entries(comingSoonKeywords)) {
    if (keywords.some((kw) => q.includes(kw))) {
      const message = comingSoonResponses[id] ?? comingSoonResponses.fallback;
      return { id, message };
    }
  }
  return { id: "fallback", message: comingSoonResponses.fallback };
}
