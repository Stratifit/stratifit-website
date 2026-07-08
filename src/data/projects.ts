export interface Project {
  slug: string;
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  challenge: string;
  solution: string;
  results: string[];
}

import { slugify } from "@/lib/slugify";

export const projects: Project[] = [
  {
    id: 1,
    title: "Luxe Retail App",
    category: "Brand Design",
    description:
      "A seamless mobile shopping experience designed for the modern luxury consumer.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop&auto=format",
    tags: ["UX Design", "Mobile", "Luxury"],
    challenge:
      "A premium fashion retailer was losing market share to digital-native competitors. Their existing app felt dated, with a clunky checkout flow and a 4.2% conversion rate — well below the luxury e-commerce benchmark of 6.5%. The challenge was to reimagine the entire mobile experience while preserving the brand's heritage and exclusivity.",
    solution:
      "We designed a gesture-first browsing experience that felt like flipping through a high-end magazine. The checkout flow was reduced from seven screens to three, with Apple Pay and saved preferences eliminating friction. A personalized discovery feed, powered by machine learning, surfaced products based on browsing behavior and purchase history.",
    results: [
      "Conversion rate increased from 4.2% to 7.1% (+69%)",
      "Average session duration grew by 2.3x",
      "Repeat purchase rate improved by 34%",
      "App Store rating improved from 3.8★ to 4.7★",
      "Revenue from mobile increased by 85% in 6 months",
    ],
  },
  {
    id: 2,
    title: "Aura Cosmetics",
    category: "Brand Design",
    description:
      "Redefining natural beauty with a minimalist identity and sustainable packaging.",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=600&fit=crop&auto=format",
    tags: ["Brand Identity", "Packaging", "Sustainability"],
    challenge:
      "Aura Cosmetics had exceptional products but struggled to communicate their premium positioning. Their existing brand identity was inconsistent across touchpoints, their packaging didn't reflect their sustainability commitment, and their digital presence lacked the aspirational quality that drives luxury beauty purchases.",
    solution:
      "We developed a complete brand identity system anchored in the concept of 'radiant simplicity.' A warm, earthy color palette replaced generic pastels. Custom typography combined elegance with readability. Packaging was redesigned using 100% post-consumer recycled materials with plantable seed paper inserts — turning every unboxing into a brand moment.",
    results: [
      "Brand awareness increased by 156% in target demographic",
      "Social media engagement grew 4x within 3 months of relaunch",
      "Press features in Vogue, Elle, and Refinery29",
      "Retail partnerships expanded from 12 to 87 stores",
      "Customer acquisition cost decreased by 28%",
    ],
  },
  {
    id: 3,
    title: "Zenith Bank Rebrand",
    category: "Brand Design",
    description:
      "Modernizing heritage banking for the digital age with a refreshed visual language.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop&auto=format",
    tags: ["Rebrand", "Finance", "Strategy"],
    challenge:
      "Zenith Bank, a 120-year-old institution, was perceived as outdated and bureaucratic. They were losing younger customers to fintech challengers while struggling to justify premium fees to their existing client base. The brand needed to convey both heritage trust and modern capability — a difficult balance.",
    solution:
      "We modernized every brand touchpoint while carefully preserving equity. The iconic shield logo was refined, not replaced — simplified geometry and a warmer blue conveyed approachability. The new visual system introduced dynamic gradients, human-centric photography, and a digital-first design language. The brand voice shifted from institutional to empowering.",
    results: [
      "New account openings among 25-34 age group increased by 42%",
      "Brand sentiment score improved from -12 to +31 (net positive)",
      "Digital banking adoption increased from 48% to 72%",
      "Customer retention rate improved by 11%",
      "Employee engagement scores rose 18% post-rebrand",
    ],
  },
  {
    id: 4,
    title: "Nova Fintech Platform",
    category: "Website Development",
    description:
      "A blazing-fast fintech dashboard built with Next.js and real-time data.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&auto=format",
    tags: ["Next.js", "Fintech", "Dashboard"],
    challenge:
      "Nova needed a trading dashboard capable of displaying real-time market data with sub-100ms latency while serving 50,000+ concurrent users. Their existing React SPA couldn't handle the load, with page loads exceeding 8 seconds and frequent crashes during market volatility.",
    solution:
      "We rebuilt the platform using Next.js with a hybrid rendering strategy: server-side rendering for static content, incremental static regeneration for semi-dynamic pages, and client-side WebSocket connections for real-time price feeds. Edge caching via CDN reduced latency by routing requests to the nearest node. Redis was implemented for session and state management.",
    results: [
      "Page load time reduced from 8.2s to 0.9s (89% improvement)",
      "Platform now handles 200K+ concurrent users without degradation",
      "99.99% uptime maintained through high-volatility trading days",
      "Development velocity increased 3x with component library",
      "Customer support tickets decreased by 62%",
    ],
  },
  {
    id: 5,
    title: "Atlas E-commerce",
    category: "Website Development",
    description:
      "Headless commerce solution that scaled from 100 to 100,000 daily orders.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop&auto=format",
    tags: ["Headless", "E-commerce", "Scale"],
    challenge:
      "Atlas was a rapidly growing DTC brand that had outgrown Shopify's standard architecture. Their monolithic setup couldn't handle flash sale traffic, international expansion was cumbersome, and performance degraded significantly during marketing campaigns. They needed an architecture that could scale 1000x without a proportional cost increase.",
    solution:
      "We implemented a headless commerce architecture with Shopify's Storefront API as the backend and Next.js as the frontend. Product data was cached at the edge via a CDN. Checkout was optimized with a custom flow that reduced steps while maintaining PCI compliance. International storefronts were deployed with localized content, pricing, and payment methods.",
    results: [
      "Platform scaled from 100 to 100K daily orders with zero downtime",
      "International revenue grew to 40% of total (from 5%)",
      "Flash sale events handled 50K concurrent users at 200ms response time",
      "Cart abandonment rate decreased from 68% to 42%",
      "Infrastructure costs reduced by 45% through edge caching",
    ],
  },
  {
    id: 6,
    title: "SmartFlow AI Pipeline",
    category: "AI & Automation",
    description:
      "End-to-end lead qualification system that reduced manual work by 85%.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop&auto=format",
    tags: ["AI", "Automation", "Lead Gen"],
    challenge:
      "A B2B SaaS company was drowning in leads. Their sales team of 40 reps spent over 3,000 hours per month manually qualifying inbound inquiries — reading emails, scoring prospects, and routing opportunities. Conversion from lead to qualified opportunity was just 8%, and top-performing reps were burning out.",
    solution:
      "We built an AI-powered lead qualification pipeline using NLP to analyze inbound emails, forms, and chat transcripts. A custom scoring model, trained on 18 months of historical conversion data, predicted lead quality with 92% accuracy. High-scoring leads were automatically enriched with firmographic data and routed to the appropriate rep with suggested talking points.",
    results: [
      "Manual qualification time reduced by 85% (2,550 hours saved/month)",
      "Lead-to-opportunity conversion improved from 8% to 19%",
      "Average deal size increased by 31% (better-qualified leads)",
      "Sales team capacity increased 3x without headcount growth",
      "Rep satisfaction scores improved by 47%",
    ],
  },
  {
    id: 7,
    title: "GrowthStack Campaign",
    category: "Growth & Marketing",
    description:
      "Multi-channel campaign generating 340% ROAS across Meta, Google, and TikTok.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&auto=format",
    tags: ["Paid Media", "ROAS", "Multi-channel"],
    challenge:
      "A DTC wellness brand was spending $150K/month on paid media with a declining ROAS of 1.8x. Ad fatigue was setting in across all channels, creative production couldn't keep pace, and attribution was a black box — they couldn't tell which channels were actually driving revenue.",
    solution:
      "We built a unified measurement framework using server-side tracking and incrementality testing to determine true channel contribution. Creative production was systematized with a modular asset system that generated 200+ ad variants per month from a core set of 20 assets. Budget allocation was automated using a custom algorithm that shifted spend to highest-performing channels in real time.",
    results: [
      "ROAS improved from 1.8x to 3.4x (89% improvement)",
      "Customer acquisition cost decreased by 41%",
      "Revenue attributed to paid media grew by 130%",
      "Creative production velocity increased 10x",
      "First-party data collection increased by 320%",
    ],
  },
  {
    id: 8,
    title: "Vertex SaaS Landing",
    category: "Website Development",
    description:
      "Conversion-optimized landing page that achieved 12% demo request rate.",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8a7c0d?w=1200&h=600&fit=crop&auto=format",
    tags: ["Landing Page", "CRO", "SaaS"],
    challenge:
      "Vertex had a powerful SaaS product but their landing page converted at just 2.1%. Heatmaps showed visitors scrolling but not converting, and qualitative feedback revealed confusion about what the product actually did. With a high CPC in their category, every unconverted click was eroding their unit economics.",
    solution:
      "We redesigned the landing page from the ground up using a conversion-first methodology. The hero section was restructured around a clear value proposition with an interactive product demo embedded above the fold. Social proof was strategically placed: customer logos for credibility, case study results for desire, and a risk-reversal guarantee to overcome final objections.",
    results: [
      "Demo request conversion rate increased from 2.1% to 12.3%",
      "Cost per demo lead decreased by 83%",
      "Qualified pipeline generated in first 90 days: $4.2M",
      "Bounce rate reduced from 62% to 28%",
      "Page load time reduced to 1.2s (from 4.7s)",
    ],
  },
  {
    id: 9,
    title: "Pulse Health Dashboard",
    category: "AI & Automation",
    description:
      "AI-powered patient monitoring system processing 50K+ data points per second in real time.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=600&fit=crop&auto=format",
    tags: ["AI", "Health Tech", "Real-time"],
    challenge:
      "A hospital network needed to centralize patient monitoring across 12 facilities. Existing systems were siloed — each ICU had its own monitoring stack with no cross-facility visibility. Critical events were missed due to alert fatigue (nurses receiving 150+ alerts per shift, most false positives).",
    solution:
      "We built an AI-powered monitoring platform that ingested 50K+ data points per second from medical devices, EHR systems, and environmental sensors. A machine learning model analyzed patterns to distinguish genuine emergencies from routine fluctuations, reducing false alerts by 94%. A unified dashboard gave administrators real-time visibility across all facilities.",
    results: [
      "False alert rate reduced by 94% (from 150/shift to 9/shift)",
      "Critical event detection time improved by 76%",
      "Nurse satisfaction scores increased by 52%",
      "Cross-facility patient transfers became 40% more efficient",
      "HIPAA compliance maintained with zero violations",
    ],
  },
  {
    id: 10,
    title: "Meridian Brand Launch",
    category: "Brand Design",
    description:
      "Full-spectrum brand launch for a DTC wellness startup — from strategy to storefront.",
    image:
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1200&h=600&fit=crop&auto=format",
    tags: ["Brand Launch", "DTC", "Strategy"],
    challenge:
      "Meridian was entering one of the most saturated categories in DTC: wellness supplements. With thousands of established brands and customer acquisition costs exceeding $80 in the category, they needed a brand that could command attention and justify premium pricing from day one.",
    solution:
      "We executed a complete brand launch in 12 weeks: positioning strategy, visual identity, packaging design, e-commerce website, and launch campaign. The brand was positioned around 'scientific wellness' — a departure from the woo-woo aesthetic dominating the category. Clean, clinical design language with warm accents. Packaging that looked like it belonged in a design museum.",
    results: [
      "$850K in first-month revenue (3x projection)",
      "Press features in Goop, Well+Good, and The Strategist",
      "Instagram following grew to 45K in 60 days",
      "Customer acquisition cost 40% below category average",
      "Wholesale partnerships secured with Erewhon and Credo",
    ],
  },
  {
    id: 11,
    title: "Circuit Analytics Platform",
    category: "Website Development",
    description:
      "Enterprise analytics dashboard processing terabytes with sub-second query responses.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&auto=format",
    tags: ["Analytics", "Enterprise", "Performance"],
    challenge:
      "Circuit's legacy analytics platform, built on a monolithic Rails application, couldn't handle their growing data volumes. Queries that used to take seconds now took minutes. Dashboard refreshes were measured in tens of seconds. Enterprise clients were threatening to churn to competitors with more modern architectures.",
    solution:
      "We rebuilt the platform using a modern data stack: ClickHouse for real-time analytics (handling billions of rows with sub-second queries), GraphQL for flexible API access, and React with virtualized rendering for smooth dashboard interactions. The migration was executed incrementally over 4 months with zero downtime, running old and new systems in parallel.",
    results: [
      "Average query time reduced from 47s to 0.3s (156x improvement)",
      "Platform now processes 5TB+ of data daily",
      "Enterprise client retention improved from 82% to 97%",
      "New feature deployment time reduced from weeks to days",
      "Engineering team velocity increased 4x post-migration",
    ],
  },
  {
    id: 12,
    title: "Catalyst Growth Engine",
    category: "Growth & Marketing",
    description:
      "Automated growth system combining email, SMS, and retargeting for 5x customer LTV.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&auto=format",
    tags: ["Automation", "Retention", "LTV"],
    challenge:
      "A subscription-based SaaS company had a leaky bucket: they were acquiring customers at a healthy rate but losing 60% within the first 90 days. Their onboarding was a one-size-fits-all email sequence, and there was no re-engagement strategy for at-risk accounts. LTV was stagnating at 8 months.",
    solution:
      "We built an automated growth engine that personalized every stage of the customer journey. Onboarding was segmented by user persona and behavior — power users got advanced tips, struggling users got hands-on guidance. At-risk detection triggered automated re-engagement campaigns across email, SMS, and in-app messages. Win-back campaigns targeted churned users with personalized offers.",
    results: [
      "90-day retention improved from 40% to 76%",
      "Customer LTV increased from 8 months to 22 months (2.75x)",
      "Reactivation rate for churned users reached 18%",
      "Net revenue retention improved from 85% to 124%",
      "Referral rate increased 3x through automated advocacy program",
    ],
  },
].map((project) => ({ ...project, slug: slugify(project.title) }));

export const projectCategories = [
  "All",
  "Brand Design",
  "Website Development",
  "AI & Automation",
  "Growth & Marketing",
] as const;
