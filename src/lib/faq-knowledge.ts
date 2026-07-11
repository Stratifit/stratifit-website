/* ------------------------------------------------------------------ */
/*  FAQ knowledge base — typed entries for AI matching + fallbacks    */
/* ------------------------------------------------------------------ */

export type FaqCategory =
  | "Process"
  | "Pricing"
  | "Timeline"
  | "Tech"
  | "Services"
  | "Support"
  | "Business";

export interface FaqEntry {
  /** Stable id used for quick-reply linking */
  id: string;
  category: FaqCategory;
  /** Title shown in the FAQ accordion + the AI's "I found a match" headline */
  question: string;
  /** One-sentence blurb shown when the FAQ accordion is opened */
  shortAnswer: string;
  /** Rich multi-line response rendered in chat (emoji prefixes, **bold**, line breaks via real \n) */
  aiAnswer: string;
  /** Case-insensitive keywords matched against user input. Order matters — earlier = higher weight. */
  keywords: string[];
  /** Other FaqEntry ids surfaced as quick-reply chips after this answer */
  related: string[];
  /** Optional CTA surfaced at the very bottom of the AI reply */
  cta?: { label: string; intent: "quote" | "team" | "demo" };
}

export const faqKnowledge: FaqEntry[] = [
  {
    id: "timeline",
    category: "Timeline",
    question: "What is the typical timeline for a project?",
    shortAnswer:
      "Branding takes 4–6 weeks, full websites 6–12 weeks, AI projects 3–6 weeks. Marketing is ongoing.",
    aiAnswer: `Typical timelines across our service lines:

🕐 **Branding** — 4–6 weeks (discovery → identity → guidelines)
💻 **Website Development** — 6–12 weeks depending on scope
🤖 **AI & Automation** — 3–6 weeks with iterative testing
📈 **Growth Marketing** — ongoing; first measurable results in 30–90 days

Rush delivery is available on request.`,
    keywords: ["timeline", "long", "weeks", "duration", "how long", "turnaround"],
    related: ["pricing", "process", "support"],
    cta: { label: "Get a tailored estimate", intent: "quote" },
  },
  {
    id: "pricing",
    category: "Pricing",
    question: "How much does a project cost?",
    shortAnswer:
      "Project pricing spans $3K–$25K depending on service and scope; marketing retainers from $1.5K/mo.",
    aiAnswer: `Every engagement is scoped individually, but typical ranges:

🎨 **Brand Design** — $3,000 – $15,000
💻 **Website Development** — $5,000 – $25,000
🤖 **AI & Automation** — $3,000 – $20,000
📈 **Growth Marketing** — from $1,500/mo
🏢 **Buy a Business** — bespoke pricing based on valuation

We send a detailed proposal within 24 hours.`,
    keywords: ["pric", "cost", "budget", "fee", "expensiv", "cheap", "afford", "quote", "how much"],
    related: ["payment", "timeline", "process"],
    cta: { label: "Request a custom quote", intent: "quote" },
  },
  {
    id: "payment",
    category: "Pricing",
    question: "What are the payment terms?",
    shortAnswer:
      "50% deposit to start, 50% on completion. Milestone billing is available for projects $10K+.",
    aiAnswer: `Our payment structure is straightforward:

💵 **50% deposit** to commence work
💵 **50% on completion** before launch
📊 **Milestone billing** available for projects $10K+
🔄 **Monthly retainers** for ongoing work

We accept bank transfer, card, and PayPal. Every invoice comes with a clear breakdown — no surprises.`,
    keywords: ["payment", "deposit", "invoice", "pay", "billing", "wire", "card"],
    related: ["pricing", "process"],
  },
  {
    id: "process",
    category: "Process",
    question: "What does your process look like?",
    shortAnswer:
      "A 4-step process: Strategy → Design → Build → Launch & Grow, with weekly check-ins.",
    aiAnswer: `Our proven 4-step process:

1️⃣ **Strategy** — Goals, audience, market positioning
2️⃣ **Design** — Wireframes → prototypes → pixel-perfect UI
3️⃣ **Build** — Clean code, weekly check-ins, no surprises
4️⃣ **Launch & Grow** — Deploy, optimize, ongoing support

You'll see deliverables at every step. No black boxes.`,
    keywords: ["process", "method", "workflow", "step", "how do you"],
    related: ["timeline", "revisions", "support"],
  },
  {
    id: "revisions",
    category: "Process",
    question: "How many revision rounds are included?",
    shortAnswer:
      "Up to 3 rounds on branding, 2 each on design/build for web, sweeping testing on AI projects.",
    aiAnswer: `Our revision policy is collaborative, not infinite:

🎨 **Branding** — up to 3 rounds of revisions included
💻 **Web** — 2 design rounds + 2 build rounds
🤖 **AI** — iterative testing included in scope

Additional rounds are billed hourly. Most approvals happen within 2 rounds.`,
    keywords: ["revision", "edit", "change", "iterat", "feedback"],
    related: ["process", "pricing"],
  },
  {
    id: "tech",
    category: "Tech",
    question: "What technology stack do you use?",
    shortAnswer:
      "Next.js + React + TypeScript + Tailwind for the frontend; Node + Postgres on the backend.",
    aiAnswer: `Our default modern stack:

⚡ **Frontend** — Next.js, React, TypeScript, Tailwind CSS
🔧 **Backend** — Node.js, Python, PostgreSQL
🤖 **AI** — OpenAI, Anthropic, LangChain, custom fine-tunes
☁️ **Infra** — Vercel, AWS, Docker, PostgreSQL

We pick the right tool per project — never one-size-fits-all.`,
    keywords: ["stack", "tech", "code", "framework", "language", "nextjs", "react"],
    related: ["services", "process"],
  },
  {
    id: "integrations",
    category: "Tech",
    question: "Can you integrate with our existing tools?",
    shortAnswer:
      "Yes — we integrate with HubSpot, Salesforce, Stripe, Shopify, plus any custom API.",
    aiAnswer: `Absolutely. We integrate natively with the tools you already use:

🧰 **CRM** — HubSpot, Salesforce, Pipedrive
🛒 **Ecommerce** — Shopify, WooCommerce, custom
💳 **Payments** — Stripe, PayPal, Square
📨 **Email** — Mailchimp, Klaviyo, SendGrid
🔌 **Custom** — any REST/GraphQL API or webhook

We extend what's working — no rip-and-replace.`,
    keywords: ["integrat", "hubspot", "salesforce", "stripe", "shopify", "existing", "tool"],
    related: ["tech", "services"],
  },
  {
    id: "support",
    category: "Support",
    question: "Do you offer post-launch support?",
    shortAnswer:
      "30 days of complimentary support after launch; custom maintenance retainers afterwards.",
    aiAnswer: `We don't disappear after launch.

🛡️ **30 days** of complimentary support included
⚡ **Priority email** — response within 24 hours
📊 **Performance reports** included on retainers
🔧 **Custom retainers** for ongoing needs

Your success is the metric we're measured against.`,
    keywords: ["support", "maintain", "after", "warranty", "post-launch", "ongoing"],
    related: ["process", "pricing"],
  },
  {
    id: "kpi",
    category: "Process",
    question: "How do you measure success?",
    shortAnswer:
      "Every engagement starts with KPIs tied to your business — conversions, perf, revenue.",
    aiAnswer: `We start with the numbers that matter to you:

🎯 **Conversion rate** lift on key flows
⚡ **Performance** — Core Web Vitals, load times
💬 **Engagement** — time-on-site, scroll depth
💰 **Revenue attribution** — last-touch, multi-touch

We share live dashboards with full transparency.`,
    keywords: ["kpi", "metric", "success", "measure", "report", "dashboard"],
    related: ["pricing", "process"],
  },
  {
    id: "industries",
    category: "Business",
    question: "What industries do you serve?",
    shortAnswer:
      "Fintech, SaaS, ecommerce, healthcare, agencies, and consumer brands across the US/EU.",
    aiAnswer: `We partner with founders, marketing leaders, and ops teams across:

🏦 **Fintech** — Banks, wallets, payment platforms
🧪 **SaaS** — Early-stage to enterprise
🛍️ **Ecommerce** — DTC brands and marketplaces
🏥 **Healthcare** — Clinics, patient portals, telehealth
🏢 **Agencies** — White-label partnerships

Global team, US/EU timezone overlap.`,
    keywords: ["indust", "vertical", "niche", "sector", "agency", "saas"],
    related: ["services", "tech"],
  },
  {
    id: "remote",
    category: "Business",
    question: "Are you fully remote?",
    shortAnswer:
      "Yes — distributed team across multiple timezones, async-friendly, weekly calls.",
    aiAnswer: `We're a fully distributed studio:

🌍 **Team** across North America, Europe, and Asia
⚡ **Async-first** — Loom, Notion, Linear by default
🗓️ **Weekly calls** for project check-ins
⏰ **Timezones** — overlap with US/EU working hours

Quality is identical to co-located work — just leaner.`,
    keywords: ["remote", "location", "where", "office", "timezone", "distributed"],
    related: ["support", "process"],
  },
  {
    id: "ai-approach",
    category: "Services",
    question: "What's your approach to AI?",
    shortAnswer:
      "Production-grade, ROI-driven AI — chatbots, lead qual, workflow automation, custom models.",
    aiAnswer: `We build AI that pays for itself:

💬 **Chatbots** — Customer support, lead qualification
⚙️ **Workflow automation** — Connect tools, save hours
🧠 **Custom models** — Fine-tuned to your domain
📊 **AI-powered analytics** — Insights & anomaly detection

Every system is measured against real business outcomes.`,
    keywords: ["ai", "artificial", "automation", "agent", "bot", "llm", "gpt"],
    related: ["services", "tech"],
  },
];

/* ------------------------------------------------------------------ */
/*  Lookup helpers                                                     */
/* ------------------------------------------------------------------ */

/**
 * Topic union — extends FaqCategory with the special "all" sentinel used by
 * FaqAIChat's chip rail. Drives the soft-gate matcher scope below.
 */
export type FaqTopic = FaqCategory | "all";

/**
 * Score-based search: counts substring hits across `question`, `keywords`, `category`.
 * Empty query returns `null`.
 *
 * Soft gate on topic: when an explicit `activeTopic` is set (not "all"), entries
 * whose `category` matches the active topic get a +3 score bonus so they're
 * preferred over un-scoped matches of equal relevance. The bot still surfaces
 * any answer it knows — we never withhold a known answer behind the filter.
 */
export function findFaqAnswer(
  query: string,
  activeTopic?: FaqTopic | null,
): FaqEntry | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  if (q.length < 3) return null; // avoid single-character false matches

  let best: { score: number; entry: FaqEntry } | null = null;
  for (const entry of faqKnowledge) {
    let score = 0;
    // Direct keyword substring match (high weight)
    for (let i = 0; i < entry.keywords.length; i++) {
      const kw = entry.keywords[i];
      if (q.includes(kw)) score += 5 - i * 0.4; // earlier keywords weigh more
    }
    // Question / category partials (lower weight)
    if (entry.question.toLowerCase().includes(q)) score += 3;
    if (entry.category.toLowerCase().includes(q)) score += 2;
    // Word-overlap on the question (only for queries with 3+ chars)
    const qWords = q.split(/\s+/).filter((w) => w.length >= 3);
    for (const w of qWords) {
      if (entry.question.toLowerCase().includes(w)) score += 1;
    }
    // Soft-gate topic scope — gentle tiebreaker that prefers in-category entries.
    // A single +3 is below a single keyword hit (~5) so it never over-promotes a
    // category match over a real relevance match.
    if (
      activeTopic && activeTopic !== "all" &&
      entry.category === activeTopic
    ) {
      score += 3;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { score, entry };
    }
  }
  if (!best) return null;
  // Require at least some confidence — above a single accidental hit
  return best.score >= 1 ? best.entry : null;
}

/** Pick `n` related FAQ questions by id, excluding the source itself */
export function getRelatedFaqs(ids: string[], excludeId: string, n = 3): FaqEntry[] {
  return ids
    .map((id) => faqKnowledge.find((e) => e.id === id))
    .filter((e): e is FaqEntry => Boolean(e) && e!.id !== excludeId)
    .slice(0, n);
}

/** Suggested "popular" questions shown above the input on first open.
 *  Curated to populate the topic chips: each topic must have at least 1 entry. */
export const popularFaqIds: string[] = [
  "timeline",
  "pricing",
  "process",
  "tech",
  "ai-approach",
  "support",
  "industries",
  "remote",
];
