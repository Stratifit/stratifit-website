export interface BusinessBrand {
  slug: string;
  name: string;
  niche: string;
  price: string;
  revenue: string;
  profit: string;
  description: string;
  image: string;
  websiteUrl: string;
  logo: string;
  tags: string[];
  highlights: string[];
  trustBadges: string[];
  accentColor?: string;
  badgeStyle?: "pill" | "square" | "glass" | "dot";
}

export interface BusinessNiche {
  slug: string;
  title: string;
  description: string;
  heroDescription: string;
  image: string;
  icon: string;
  stats: { stat: string; label: string; sub: string }[];
  whatIsIncluded: string[];
  brands: BusinessBrand[];
}

import { slugify } from "@/lib/slugify";

const brandImgs: Record<string, string[]> = {
  Ecommerce: [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop&auto=format",
  ],
  SaaS: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop&auto=format",
  ],
  Agency: [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop&auto=format",
  ],
  "AI Tools": [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e5685?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&h=400&fit=crop&auto=format",
  ],
  "Personal Brand": [
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=400&fit=crop&auto=format",
  ],
  "Local Business": [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&auto=format",
  ],
  "Digital Products": [
    "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1467232004584-a241de8a7c0d?w=600&h=400&fit=crop&auto=format",
  ],
};

export const productEmojis: Record<string, string[]> = {
  Ecommerce: ["🛍️", "📦", "🏷️"],
  SaaS: ["📊", "⚙️", "🔌"],
  Agency: ["🎨", "📈", "💼"],
  "AI Tools": ["🤖", "🧠", "✨"],
  "Personal Brand": ["📱", "🎙️", "📧"],
  "Local Business": ["📍", "⭐", "🏪"],
  "Digital Products": ["📁", "🖥️", "📥"],
};

export const nicheCtaLabel: Record<string, string> = {
  Ecommerce: "Shop Now →",
  SaaS: "Get Started →",
  Agency: "View Services →",
  "AI Tools": "Try Demo →",
  "Personal Brand": "Explore →",
  "Local Business": "Visit Us →",
  "Digital Products": "Browse →",
};

const accentPalette = [
  "#D4A574",
  "#A8D8EA",
  "#FF6B6B",
  "#4ECDC4",
  "#FFD93D",
  "#6C5CE7",
  "#00B894",
  "#0984E3",
  "#F8B500",
  "#E17055",
  "#A29BFE",
  "#00CEC9",
  "#E84393",
  "#2D3436",
  "#FF6348",
  "#1E90FF",
  "#2ED573",
  "#FFA502",
  "#C0392B",
  "#27AE60",
  "#F39C12",
  "#FDCB6E",
  "#55E6C1",
  "#FD79A8",
  "#74B9FF",
  "#E74C3C",
  "#8E44AD",
  "#1ABC9C",
];
const badgePool: ("pill" | "square" | "glass" | "dot")[] = [
  "pill",
  "square",
  "glass",
  "dot",
  "glass",
  "pill",
  "square",
];

export function getBrandAccent(brand: BusinessBrand, index: number): string {
  return brand.accentColor || accentPalette[index % accentPalette.length];
}
export function getBrandBadge(
  brand: BusinessBrand,
  index: number,
): "pill" | "square" | "glass" | "dot" {
  return brand.badgeStyle || badgePool[index % badgePool.length];
}

const b = (s: string) => slugify(s);

const businesses: BusinessNiche[] = [
  {
    slug: "ecommerce",
    title: "Ecommerce",
    description:
      "Acquire profitable, turnkey online stores with established traffic, revenue, and brand equity.",
    heroDescription:
      "Skip the build phase. Own a revenue-generating ecommerce store with proven product-market fit, existing customers, and operational systems already in place.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop&auto=format",
    icon: "🛒",
    stats: [
      { stat: "$85K", label: "Avg. Annual Revenue", sub: "across our portfolio" },
      { stat: "36%", label: "Avg. Profit Margin", sub: "fully optimized stores" },
      { stat: "12+", label: "Active Listings", sub: "updated weekly" },
    ],
    whatIsIncluded: [
      "Fully operational Shopify / WooCommerce store",
      "Existing supplier & fulfillment relationships",
      "Verified 12-month financial history",
      "Email list & customer database",
      "Social media accounts with audience",
      "SEO-optimized product pages & content",
      "Standard operating procedures documentation",
      "30 days post-acquisition support",
    ],
    brands: [
      {
        slug: b("Luxe Pet Co."),
        name: "Luxe Pet Co.",
        niche: "Ecommerce",
        price: "$45,000",
        revenue: "$8,200/mo",
        profit: "$3,100/mo",
        websiteUrl: "https://luxepetco.com",
        logo: "🐾",
        description:
          "Premium pet accessories brand with 14 SKUs, 23K Instagram followers, and 4,200 email subscribers.",
        image: brandImgs["Ecommerce"][0],
        tags: ["Pet", "Shopify", "DTC"],
        highlights: ["AOV: $64", "2.8K monthly visitors", "14 active SKUs"],
        trustBadges: [
          "Verified Financials",
          "Secure Escrow",
          "30-Day Support",
          "Money-Back Guarantee",
        ],
        accentColor: "#D4A574",
        badgeStyle: "pill",
      },
      {
        slug: b("Nomad Home"),
        name: "Nomad Home",
        niche: "Ecommerce",
        price: "$68,000",
        revenue: "$14,500/mo",
        profit: "$5,800/mo",
        websiteUrl: "https://nomadhome.co",
        logo: "🏠",
        description:
          "Scandinavian-inspired home decor brand with 32 SKUs, strong Pinterest presence, and wholesale accounts.",
        image: brandImgs["Ecommerce"][1],
        tags: ["Home Decor", "Shopify", "Wholesale"],
        highlights: ["AOV: $112", "5.2K monthly visitors", "6 wholesale accounts"],
        trustBadges: [
          "Verified Financials",
          "Secure Escrow",
          "30-Day Support",
          "Money-Back Guarantee",
        ],
        accentColor: "#A8D8EA",
        badgeStyle: "square",
      },
      {
        slug: b("FitFuel Supplements"),
        name: "FitFuel Supplements",
        niche: "Ecommerce",
        price: "$95,000",
        revenue: "$21,000/mo",
        profit: "$7,200/mo",
        websiteUrl: "https://fitfuel.co",
        logo: "💪",
        description:
          "Health & wellness supplement brand with proprietary formulas, 8 SKUs, and strong recurring subscription revenue.",
        image: brandImgs["Ecommerce"][2],
        tags: ["Health", "Subscription", "Shopify"],
        highlights: ["AOV: $78", "340 active subscribers", "4.9★ (600+ reviews)"],
        trustBadges: [
          "Verified Financials",
          "Secure Escrow",
          "30-Day Support",
          "Money-Back Guarantee",
        ],
        accentColor: "#FF6B6B",
        badgeStyle: "glass",
      },
      {
        slug: b("Coastal Threads"),
        name: "Coastal Threads",
        niche: "Ecommerce",
        price: "$52,000",
        revenue: "$9,800/mo",
        profit: "$3,900/mo",
        websiteUrl: "https://coastalthreads.com",
        logo: "🌊",
        description:
          "Lifestyle apparel brand with a loyal community, 18K TikTok followers, and strong seasonal revenue patterns.",
        image: brandImgs["Ecommerce"][3],
        tags: ["Apparel", "Community", "TikTok"],
        highlights: ["AOV: $58", "18K TikTok followers", "42% repeat purchase rate"],
        trustBadges: [
          "Verified Financials",
          "Secure Escrow",
          "30-Day Support",
          "Money-Back Guarantee",
        ],
        accentColor: "#4ECDC4",
        badgeStyle: "dot",
      },
    ],
  },
  {
    slug: "saas",
    title: "SaaS",
    description:
      "Own established software businesses with recurring revenue, low churn, and scalable infrastructure.",
    heroDescription:
      "Step into a cash-flowing SaaS business with validated product-market fit. These aren't startups — they're profitable, stable, and ready for a new owner to scale.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&auto=format",
    icon: "☁️",
    stats: [
      { stat: "$13.2K", label: "Avg. MRR", sub: "across our SaaS portfolio" },
      { stat: "92%", label: "Gross Margin", sub: "low infrastructure costs" },
      { stat: "3.2%", label: "Avg. Churn Rate", sub: "strong retention" },
    ],
    whatIsIncluded: [
      "Full source code & IP ownership",
      "AWS / Vercel / Railway infrastructure",
      "Stripe billing & subscription management",
      "Existing customer contracts & data",
      "Documented codebase & architecture",
      "Customer support knowledge base",
      "Marketing assets & ad accounts",
      "60 days transition support",
    ],
    brands: [
      {
        slug: b("ReviewPilot"),
        name: "ReviewPilot",
        niche: "SaaS",
        price: "$160,000",
        revenue: "$14,200/mo",
        profit: "$9,400/mo",
        websiteUrl: "https://reviewpilot.io",
        logo: "⭐",
        description:
          "Automated review management platform serving 280+ Shopify merchants with 94% gross margins and <2% monthly churn.",
        image: brandImgs["SaaS"][0],
        tags: ["Martech", "Shopify App", "B2B"],
        highlights: ["MRR: $14.2K", "280+ active customers", "94% gross margin"],
        trustBadges: [
          "Code Audit Ready",
          "Secure Escrow",
          "60-Day Support",
          "IP Transfer Included",
        ],
        accentColor: "#FFD93D",
        badgeStyle: "glass",
      },
      {
        slug: b("TeamFlow"),
        name: "TeamFlow",
        niche: "SaaS",
        price: "$210,000",
        revenue: "$19,800/mo",
        profit: "$12,600/mo",
        websiteUrl: "https://teamflow.app",
        logo: "🔄",
        description:
          "Project management SaaS for creative agencies with 180+ teams, strong NPS of 72, and growing enterprise pipeline.",
        image: brandImgs["SaaS"][1],
        tags: ["Project Mgmt", "B2B", "Enterprise"],
        highlights: ["MRR: $19.8K", "180+ teams active", "NPS: 72"],
        trustBadges: [
          "Code Audit Ready",
          "Secure Escrow",
          "60-Day Support",
          "IP Transfer Included",
        ],
        accentColor: "#6C5CE7",
        badgeStyle: "square",
      },
      {
        slug: b("InvoiceFlow"),
        name: "InvoiceFlow",
        niche: "SaaS",
        price: "$95,000",
        revenue: "$8,100/mo",
        profit: "$6,200/mo",
        websiteUrl: "https://invoiceflow.io",
        logo: "📄",
        description:
          "Simple invoicing & expense tracking tool for freelancers. Bootstrapped, profitable, 1,450+ paid users.",
        image: brandImgs["SaaS"][2],
        tags: ["Fintech", "Freelancer", "Bootstrapped"],
        highlights: ["MRR: $8.1K", "1,450+ paid users", "76% gross margin"],
        trustBadges: [
          "Code Audit Ready",
          "Secure Escrow",
          "60-Day Support",
          "IP Transfer Included",
        ],
        accentColor: "#00B894",
        badgeStyle: "pill",
      },
      {
        slug: b("DataSense Analytics"),
        name: "DataSense Analytics",
        niche: "SaaS",
        price: "$280,000",
        revenue: "$26,500/mo",
        profit: "$15,800/mo",
        websiteUrl: "https://datasense.io",
        logo: "📊",
        description:
          "Embedded analytics platform for B2B SaaS companies. 95% retention, strong API-first architecture, and growing marketplace integration.",
        image: brandImgs["SaaS"][3],
        tags: ["Analytics", "B2B", "API"],
        highlights: ["MRR: $26.5K", "95% net retention", "Enterprise contracts"],
        trustBadges: [
          "Code Audit Ready",
          "Secure Escrow",
          "60-Day Support",
          "IP Transfer Included",
        ],
        accentColor: "#0984E3",
        badgeStyle: "dot",
      },
    ],
  },
  {
    slug: "agency",
    title: "Agency",
    description:
      "Buy a fully operational digital agency with existing clients, team, systems, and recurring revenue.",
    heroDescription:
      "Own a turnkey agency business with an established client roster, proven delivery systems, and a team that knows how to execute. Skip the grind of building from zero.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop&auto=format",
    icon: "🏢",
    stats: [
      { stat: "$22K", label: "Avg. Monthly Retainer", sub: "across our agency portfolio" },
      { stat: "47%", label: "Avg. Profit Margin", sub: "lean operations model" },
      { stat: "8+", label: "Agencies Available", sub: "various niches" },
    ],
    whatIsIncluded: [
      "Existing client contracts & relationships",
      "Proven service delivery playbooks",
      "Team transition (if applicable)",
      "Brand assets & portfolio",
      "CRM with lead pipeline",
      "Sales & proposal templates",
      "Vendor & tool subscriptions",
      "90 days transition support",
    ],
    brands: [
      {
        slug: b("Digital Hive Studio"),
        name: "Digital Hive Studio",
        niche: "Agency",
        price: "$180,000",
        revenue: "$31,000/mo",
        profit: "$13,600/mo",
        websiteUrl: "https://digitalhive.studio",
        logo: "🐝",
        description:
          "Full-service digital agency specializing in ecommerce brands. 12 retainer clients, 7 team members, and $370K ARR.",
        image: brandImgs["Agency"][0],
        tags: ["Ecommerce", "Full-Service", "12 Clients"],
        highlights: ["ARR: $370K", "7 team members", "43% profit margin"],
        trustBadges: ["Contracts Verified", "Secure Escrow", "90-Day Support", "Team Transition"],
        accentColor: "#F8B500",
        badgeStyle: "square",
      },
      {
        slug: b("SEO Directive"),
        name: "SEO Directive",
        niche: "Agency",
        price: "$95,000",
        revenue: "$14,800/mo",
        profit: "$7,200/mo",
        websiteUrl: "https://seodirective.com",
        logo: "🔍",
        description:
          "Boutique SEO agency with 18 retainer clients in the B2B SaaS space. Strong systems, minimal owner involvement needed.",
        image: brandImgs["Agency"][1],
        tags: ["SEO", "B2B SaaS", "Remote"],
        highlights: ["MRR: $14.8K", "18 retainer clients", "48% profit margin"],
        trustBadges: ["Contracts Verified", "Secure Escrow", "90-Day Support", "Team Transition"],
        accentColor: "#E17055",
        badgeStyle: "glass",
      },
      {
        slug: b("Brand Architect"),
        name: "Brand Architect",
        niche: "Agency",
        price: "$140,000",
        revenue: "$22,500/mo",
        profit: "$10,800/mo",
        websiteUrl: "https://brandarchitect.co",
        logo: "🎨",
        description:
          "Brand design agency serving tech startups. Strong portfolio of 60+ completed projects, high-ticket project-based model.",
        image: brandImgs["Agency"][2],
        tags: ["Branding", "Tech Startups", "Project-Based"],
        highlights: ["Avg. project: $18K", "60+ completed projects", "Strong referral pipeline"],
        trustBadges: ["Contracts Verified", "Secure Escrow", "90-Day Support", "Team Transition"],
        accentColor: "#A29BFE",
        badgeStyle: "pill",
      },
      {
        slug: b("Content Pillar Agency"),
        name: "Content Pillar Agency",
        niche: "Agency",
        price: "$75,000",
        revenue: "$12,000/mo",
        profit: "$5,800/mo",
        websiteUrl: "https://contentpillar.io",
        logo: "✍️",
        description:
          "Content marketing & social media agency. 22 retainer clients, AI-augmented workflows, and high margins.",
        image: brandImgs["Agency"][3],
        tags: ["Content Marketing", "Social Media", "AI-Enhanced"],
        highlights: ["MRR: $12K", "22 retainer clients", "50% profit margin"],
        trustBadges: ["Contracts Verified", "Secure Escrow", "90-Day Support", "Team Transition"],
        accentColor: "#00CEC9",
        badgeStyle: "dot",
      },
    ],
  },
  {
    slug: "ai-tools",
    title: "AI Tools",
    description:
      "Acquire production AI applications generating real revenue with established user bases.",
    heroDescription:
      "Own the future. These AI-powered businesses are already generating revenue, have active user bases, and are positioned in the fastest-growing technology market in history.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop&auto=format",
    icon: "🤖",
    stats: [
      { stat: "$18.5K", label: "Avg. MRR", sub: "growing 12% monthly" },
      { stat: "91%", label: "Gross Margin", sub: "API-based delivery" },
      { stat: "6+", label: "AI Businesses", sub: "available now" },
    ],
    whatIsIncluded: [
      "Full source code & model weights",
      "OpenAI / Anthropic API integrations",
      "Vector database & embeddings setup",
      "Existing user accounts & data",
      "Prompt engineering documentation",
      "Fine-tuning datasets & scripts",
      "Marketing landing pages & funnels",
      "45 days transition support",
    ],
    brands: [
      {
        slug: b("ContentForge AI"),
        name: "ContentForge AI",
        niche: "AI Tools",
        price: "$220,000",
        revenue: "$19,400/mo",
        profit: "$14,200/mo",
        websiteUrl: "https://contentforge.ai",
        logo: "✍️",
        description:
          "AI content creation platform serving 3,200+ marketers. Multi-model pipeline, custom fine-tuned models, strong organic growth.",
        image: brandImgs["AI Tools"][0],
        tags: ["Content Gen", "B2B", "Subscription"],
        highlights: ["MRR: $19.4K", "3,200+ users", "73% gross margin"],
        trustBadges: ["Model Verified", "Secure Escrow", "45-Day Support", "API Docs Included"],
        accentColor: "#E84393",
        badgeStyle: "glass",
      },
      {
        slug: b("SupportBot"),
        name: "SupportBot",
        niche: "AI Tools",
        price: "$175,000",
        revenue: "$16,200/mo",
        profit: "$11,800/mo",
        websiteUrl: "https://supportbot.ai",
        logo: "💬",
        description:
          "AI customer support chatbot for ecommerce. 140+ Shopify stores, handles 85K+ conversations monthly.",
        image: brandImgs["AI Tools"][1],
        tags: ["Customer Support", "Ecommerce", "Shopify"],
        highlights: ["MRR: $16.2K", "140+ Shopify stores", "85K convos/month"],
        trustBadges: ["Model Verified", "Secure Escrow", "45-Day Support", "API Docs Included"],
        accentColor: "#2D3436",
        badgeStyle: "square",
      },
      {
        slug: b("DataLens"),
        name: "DataLens",
        niche: "AI Tools",
        price: "$310,000",
        revenue: "$28,500/mo",
        profit: "$18,200/mo",
        websiteUrl: "https://datalens.ai",
        logo: "🔎",
        description:
          "AI-powered data analysis tool for product teams. Integrates with Mixpanel, Amplitude, and 12+ data sources. Strong enterprise traction.",
        image: brandImgs["AI Tools"][2],
        tags: ["Analytics", "Enterprise", "AI"],
        highlights: ["MRR: $28.5K", "12+ integrations", "Enterprise pipeline"],
        trustBadges: ["Model Verified", "Secure Escrow", "45-Day Support", "API Docs Included"],
        accentColor: "#6C5CE7",
        badgeStyle: "pill",
      },
      {
        slug: b("VoiceGen Studio"),
        name: "VoiceGen Studio",
        niche: "AI Tools",
        price: "$125,000",
        revenue: "$11,400/mo",
        profit: "$8,100/mo",
        websiteUrl: "https://voicegen.studio",
        logo: "🎙️",
        description:
          "AI voice cloning & TTS platform for content creators. 2,800+ users, strong growth trajectory in podcasting space.",
        image: brandImgs["AI Tools"][3],
        tags: ["Voice AI", "Creator Economy", "TTS"],
        highlights: ["MRR: $11.4K", "2,800+ users", "40% monthly growth"],
        trustBadges: ["Model Verified", "Secure Escrow", "45-Day Support", "API Docs Included"],
        accentColor: "#00B894",
        badgeStyle: "dot",
      },
    ],
  },
  {
    slug: "personal-brand",
    title: "Personal Brand",
    description:
      "Acquire established personal brands with engaged audiences and diversified revenue streams.",
    heroDescription:
      "Step into a personal brand with a built-in audience, proven monetization, and content systems already in place. Your shortcut to influence and income.",
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1200&h=600&fit=crop&auto=format",
    icon: "🌟",
    stats: [
      { stat: "$14K", label: "Avg. Monthly Revenue", sub: "across multiple channels" },
      { stat: "85K", label: "Avg. Audience Size", sub: "combined platforms" },
      { stat: "3+", label: "Revenue Streams", sub: "per brand avg." },
    ],
    whatIsIncluded: [
      "Social media accounts (all platforms)",
      "Email list & automations",
      "Existing digital products / courses",
      "Content library & repurposing system",
      "Sponsorship & partnership agreements",
      "Brand voice & positioning guide",
      "Content calendar templates",
      "60 days transition support",
    ],
    brands: [
      {
        slug: b("The Design Thinker"),
        name: "The Design Thinker",
        niche: "Personal Brand",
        price: "$95,000",
        revenue: "$9,500/mo",
        profit: "$7,200/mo",
        websiteUrl: "https://thedesignthinker.co",
        logo: "🎯",
        description:
          "Design & creativity newsletter with 42K subscribers, a $49K course business, and 3-4 brand sponsorships monthly.",
        image: brandImgs["Personal Brand"][0],
        tags: ["Design", "Newsletter", "Courses"],
        highlights: ["42K email subscribers", "$49K course revenue/yr", "3+ sponsorship deals/mo"],
        trustBadges: [
          "Audience Verified",
          "Secure Escrow",
          "60-Day Support",
          "Content Library Included",
        ],
        accentColor: "#FF6348",
        badgeStyle: "square",
      },
      {
        slug: b("SaaS Growth Lab"),
        name: "SaaS Growth Lab",
        niche: "Personal Brand",
        price: "$145,000",
        revenue: "$16,200/mo",
        profit: "$11,400/mo",
        websiteUrl: "https://saasgrowthlab.com",
        logo: "🚀",
        description:
          "SaaS growth Twitter/X brand with 95K followers, a paid community of 480 members, and a thriving consulting practice.",
        image: brandImgs["Personal Brand"][2],
        tags: ["SaaS", "Twitter/X", "Community"],
        highlights: ["95K Twitter followers", "480 paid community members", "Consulting: $8K/mo"],
        trustBadges: [
          "Audience Verified",
          "Secure Escrow",
          "60-Day Support",
          "Content Library Included",
        ],
        accentColor: "#1E90FF",
        badgeStyle: "glass",
      },
      {
        slug: b("The Wellness Edit"),
        name: "The Wellness Edit",
        niche: "Personal Brand",
        price: "$85,000",
        revenue: "$8,800/mo",
        profit: "$6,100/mo",
        websiteUrl: "https://thewellnessedit.co",
        logo: "🌿",
        description:
          "Holistic wellness brand on Instagram & TikTok with 120K followers, supplement affiliate revenue, and an ebook library.",
        image: brandImgs["Personal Brand"][1],
        tags: ["Wellness", "Instagram", "Affiliate"],
        highlights: ["120K Instagram followers", "55K TikTok followers", "$4.2K/mo affiliate rev"],
        trustBadges: [
          "Audience Verified",
          "Secure Escrow",
          "60-Day Support",
          "Content Library Included",
        ],
        accentColor: "#2ED573",
        badgeStyle: "pill",
      },
      {
        slug: b("The Indie Maker"),
        name: "The Indie Maker",
        niche: "Personal Brand",
        price: "$115,000",
        revenue: "$12,500/mo",
        profit: "$8,900/mo",
        websiteUrl: "https://theindiemaker.io",
        logo: "🛠️",
        description:
          "Indie hacking brand with a popular newsletter (28K subs), 4 digital products, and a podcast with 15K downloads/month.",
        image: brandImgs["Personal Brand"][3],
        tags: ["Indie Hacking", "Newsletter", "Podcast"],
        highlights: ["28K newsletter subs", "4 digital products", "15K podcast downloads/mo"],
        trustBadges: [
          "Audience Verified",
          "Secure Escrow",
          "60-Day Support",
          "Content Library Included",
        ],
        accentColor: "#FFA502",
        badgeStyle: "dot",
      },
    ],
  },
  {
    slug: "local-business",
    title: "Local Business",
    description:
      "Own profitable local businesses with established locations, loyal customers, and strong community presence.",
    heroDescription:
      "Acquire a local business with real assets, real customers, and real cash flow. These aren't startups — they're established community institutions with proven track records.",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=600&fit=crop&auto=format",
    icon: "📍",
    stats: [
      { stat: "4.8★", label: "Avg. Google Rating", sub: "across our listings" },
      { stat: "7+", label: "Years Avg. Operation", sub: "established businesses" },
      { stat: "5+", label: "Businesses Available", sub: "various categories" },
    ],
    whatIsIncluded: [
      "Physical location & lease agreement",
      "Equipment, inventory & fixtures",
      "Existing staff & management team",
      "Vendor & supplier relationships",
      "POS system & customer database",
      "Google Business Profile & reviews",
      "Marketing assets & local SEO",
      "90 days transition support",
    ],
    brands: [
      {
        slug: b("Brew & Bean Coffee"),
        name: "Brew & Bean Coffee",
        niche: "Local Business",
        price: "$195,000",
        revenue: "$32,000/mo",
        profit: "$9,800/mo",
        websiteUrl: "https://brewbean.coffee",
        logo: "☕",
        description:
          "Popular specialty coffee shop in a high-foot-traffic downtown location. 4.9★ (340+ reviews), loyal regulars, and strong catering side business.",
        image: brandImgs["Local Business"][0],
        tags: ["Coffee Shop", "Food & Beverage", "High Traffic"],
        highlights: ["Revenue: $32K/mo", "4.9★ (340 reviews)", "4 team members"],
        trustBadges: [
          "Physical Assets Verified",
          "Secure Escrow",
          "90-Day Support",
          "Staff Retention Plan",
        ],
        accentColor: "#C0392B",
        badgeStyle: "square",
      },
      {
        slug: b("Green Leaf Market"),
        name: "Green Leaf Market",
        niche: "Local Business",
        price: "$250,000",
        revenue: "$45,000/mo",
        profit: "$13,500/mo",
        websiteUrl: "https://greenleaf.market",
        logo: "🥬",
        description:
          "Organic grocery & cafe in an affluent neighborhood. 8 years in business, strong supplier relationships, and growing online order revenue.",
        image: brandImgs["Local Business"][1],
        tags: ["Grocery", "Organic", "Cafe"],
        highlights: ["Revenue: $45K/mo", "8 years operating", "7 team members"],
        trustBadges: [
          "Physical Assets Verified",
          "Secure Escrow",
          "90-Day Support",
          "Staff Retention Plan",
        ],
        accentColor: "#27AE60",
        badgeStyle: "glass",
      },
      {
        slug: b("Iron Forge Fitness"),
        name: "Iron Forge Fitness",
        niche: "Local Business",
        price: "$180,000",
        revenue: "$28,000/mo",
        profit: "$10,200/mo",
        websiteUrl: "https://ironforge.fitness",
        logo: "🏋️",
        description:
          "Boutique fitness studio with 320 active members, 6 trainers, and a growing online coaching component. Strong community culture.",
        image: brandImgs["Local Business"][2],
        tags: ["Fitness", "Membership", "Community"],
        highlights: ["320 active members", "6 certified trainers", "Online coaching: $4K/mo"],
        trustBadges: [
          "Physical Assets Verified",
          "Secure Escrow",
          "90-Day Support",
          "Staff Retention Plan",
        ],
        accentColor: "#E74C3C",
        badgeStyle: "pill",
      },
      {
        slug: b("Pet Paradise Grooming"),
        name: "Pet Paradise Grooming",
        niche: "Local Business",
        price: "$120,000",
        revenue: "$18,500/mo",
        profit: "$7,400/mo",
        websiteUrl: "https://petparadise.co",
        logo: "🐶",
        description:
          "Premium pet grooming & daycare with 400+ regular clients, 4 groomers, and a 3-month booking waitlist. High demand, low competition area.",
        image: brandImgs["Local Business"][3],
        tags: ["Pet Services", "Grooming", "Daycare"],
        highlights: ["400+ regular clients", "3-month waitlist", "40% profit margin"],
        trustBadges: [
          "Physical Assets Verified",
          "Secure Escrow",
          "90-Day Support",
          "Staff Retention Plan",
        ],
      },
    ],
  },
  {
    slug: "digital-products",
    title: "Digital Products",
    description:
      "Own passive-income digital product businesses with zero inventory, high margins, and global reach.",
    heroDescription:
      "Acquire digital product businesses that generate revenue while you sleep. Templates, courses, plugins, and assets — built once, sold infinitely.",
    image:
      "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=1200&h=600&fit=crop&auto=format",
    icon: "📦",
    stats: [
      { stat: "96%", label: "Avg. Profit Margin", sub: "zero marginal cost" },
      { stat: "$9.8K", label: "Avg. Monthly Revenue", sub: "truly passive income" },
      { stat: "2.8K", label: "Avg. Customer Base", sub: "global audience" },
    ],
    whatIsIncluded: [
      "Full product files & source materials",
      "Sales page & funnel assets",
      "Customer email list & automations",
      "Marketplace listings (Gumroad, Etsy, etc.)",
      "Marketing assets & ad creatives",
      "Product update & version history",
      "Customer support documentation",
      "30 days transition support",
    ],
    brands: [
      {
        slug: b("UI Kit Pro"),
        name: "UI Kit Pro",
        niche: "Digital Products",
        price: "$85,000",
        revenue: "$9,200/mo",
        profit: "$8,700/mo",
        websiteUrl: "https://uikitpro.design",
        logo: "🎨",
        description:
          "Premium Figma UI kit with 2,400+ components, 18K customers, and a 4.9★ rating. Steady organic sales via design communities.",
        image: brandImgs["Digital Products"][0],
        tags: ["Figma", "Design", "Marketplace"],
        highlights: ["$9.2K/mo revenue", "18K customers", "95% profit margin"],
        trustBadges: ["Files Verified", "Secure Escrow", "30-Day Support", "Lifetime Updates"],
      },
      {
        slug: b("Notion OS Templates"),
        name: "Notion OS Templates",
        niche: "Digital Products",
        price: "$65,000",
        revenue: "$7,100/mo",
        profit: "$6,800/mo",
        websiteUrl: "https://notionostemplates.com",
        logo: "📋",
        description:
          "Collection of 12 premium Notion templates for productivity, startups, and creators. Strong Gumroad presence and affiliate program.",
        image: brandImgs["Digital Products"][1],
        tags: ["Notion", "Productivity", "Gumroad"],
        highlights: ["$7.1K/mo revenue", "12 template products", "Active affiliate program"],
        trustBadges: ["Files Verified", "Secure Escrow", "30-Day Support", "Lifetime Updates"],
      },
      {
        slug: b("CourseCraft Library"),
        name: "CourseCraft Library",
        niche: "Digital Products",
        price: "$120,000",
        revenue: "$12,800/mo",
        profit: "$11,500/mo",
        websiteUrl: "https://coursecraft.library",
        logo: "📚",
        description:
          "Bundle of 5 online courses on web development & design. 4,200+ students, strong Udemy & Teachable presence, automated sales funnel.",
        image: brandImgs["Digital Products"][2],
        tags: ["Courses", "Development", "Education"],
        highlights: ["$12.8K/mo revenue", "4,200+ students", "5-course bundle"],
        trustBadges: ["Files Verified", "Secure Escrow", "30-Day Support", "Lifetime Updates"],
      },
      {
        slug: b("StockAsset Hub"),
        name: "StockAsset Hub",
        niche: "Digital Products",
        price: "$95,000",
        revenue: "$10,400/mo",
        profit: "$9,900/mo",
        websiteUrl: "https://stockasset.hub",
        logo: "📸",
        description:
          "Premium stock photo & video library with 8,000+ assets. Subscription & one-time purchase model, 1,200+ active subscribers.",
        image: brandImgs["Digital Products"][3],
        tags: ["Stock Media", "Subscription", "Creative"],
        highlights: ["$10.4K/mo revenue", "8,000+ assets", "1,200+ subscribers"],
        trustBadges: ["Files Verified", "Secure Escrow", "30-Day Support", "Lifetime Updates"],
      },
    ],
  },
];

export const niches: BusinessNiche[] = businesses;
export const allBrands: BusinessBrand[] = businesses.flatMap((n) => n.brands);
export const nicheList = businesses.map((n) => ({
  slug: n.slug,
  title: n.title,
  description: n.description,
  icon: n.icon,
  image: n.image,
  brandCount: n.brands.length,
  avgRevenue: n.stats[0].stat,
  avgMargin: n.stats[1]?.stat || n.stats[0].stat,
}));
export function getNicheBySlug(slug: string): BusinessNiche | undefined {
  return businesses.find((n) => n.slug === slug);
}
export function getBrandBySlug(slug: string): BusinessBrand | undefined {
  return allBrands.find((b) => b.slug === slug);
}
