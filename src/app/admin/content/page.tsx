"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiCog6Tooth,
  HiBars3,
  HiDocumentText,
  HiPhoto,
  HiSquares2X2,
  HiArrowPath,
  HiStar,
  HiCube,
  HiTag,
  HiChatBubbleLeftRight,
  HiQuestionMarkCircle,
  HiBriefcase,
  HiNewspaper,
  HiBuildingStorefront,
  HiShoppingBag,
  HiEnvelope,
  HiFlag,
  HiArrowUpRight,
  HiWrench,
  HiPresentationChartLine,
  HiListBullet,
} from "react-icons/hi2";

const contentSections = [
  {
    group: "Global",
    items: [
      { key: "site-settings", label: "Site Settings", desc: "Brand name, logo, tagline", icon: HiCog6Tooth, accent: "amber" },
      { key: "header-nav", label: "Header Navigation", desc: "Menu links, CTA button", icon: HiBars3, accent: "amber" },
      { key: "footer", label: "Footer Content", desc: "Links, social, tagline", icon: HiDocumentText, accent: "amber" },
      { key: "section-labels", label: "Section Labels", desc: "All section headings & subtitles", icon: HiFlag, accent: "amber" },
    ],
  },
  {
    group: "Homepage Sections",
    items: [
      { key: "hero", label: "Hero Section", desc: "Headline, CTAs, stats, tech stack", icon: HiPhoto, accent: "emerald" },
      { key: "services", label: "Core Services", desc: "Service cards on homepage", icon: HiSquares2X2, accent: "emerald" },
      { key: "process", label: "Process Steps", desc: "4-step process flow", icon: HiArrowPath, accent: "emerald" },
      { key: "why-choose-us", label: "Why Choose Us", desc: "Section heading & subtitle", icon: HiStar, accent: "emerald" },
      { key: "why-choose-us-benefits", label: "Why Choose Us — Benefits", desc: "Benefit cards with stats", icon: HiCube, accent: "emerald" },
      { key: "packages", label: "Service Packages", desc: "Pricing packages", icon: HiTag, accent: "emerald" },
      { key: "testimonials", label: "Testimonials", desc: "Client testimonials", icon: HiChatBubbleLeftRight, accent: "emerald" },
      { key: "faq", label: "FAQ Entries", desc: "Frequently asked questions", icon: HiQuestionMarkCircle, accent: "emerald" },
    ],
  },
  {
    group: "Service Pages",
    items: [
      { key: "service-pages", label: "Service Pages Content", desc: "Brand/Website/AI/Growth page hero + sections", icon: HiWrench, accent: "emerald" },
    ],
  },
  {
    group: "Info Pages",
    items: [
      { key: "about", label: "About Page", desc: "Mission, story, team, CTA", icon: HiDocumentText, accent: "violet" },
      { key: "about-stats", label: "About Page — Stats", desc: "Stat cards on About page", icon: HiStar, accent: "violet" },
      { key: "about-values", label: "About Page — Values", desc: "Value cards on About page", icon: HiCube, accent: "violet" },
      { key: "legal-pages", label: "Legal Pages", desc: "Privacy, Terms, Cookies", icon: HiDocumentText, accent: "violet" },
      { key: "contact-form", label: "Contact Form", desc: "Headings, dropdowns, success msg", icon: HiEnvelope, accent: "violet" },
    ],
  },
  {
    group: "Content",
    items: [
      { key: "projects", label: "Portfolio / Projects", desc: "Case studies & portfolio", icon: HiBriefcase, accent: "rose" },
      { key: "insights", label: "Insights / Blog", desc: "Blog posts & articles", icon: HiNewspaper, accent: "rose" },
    ],
  },
  {
    group: "Buy Business",
    items: [
      { key: "buy-business-niches", label: "Niches", desc: "Business niche categories", icon: HiBuildingStorefront, accent: "rose" },
      { key: "niche-stats", label: "Niche Stats", desc: "Stats shown on each niche page", icon: HiPresentationChartLine, accent: "rose" },
      { key: "niche-inclusions", label: "Niche Inclusions", desc: "'What's Included' per niche", icon: HiListBullet, accent: "rose" },
      { key: "buy-business-brands", label: "Brands", desc: "Individual brand listings", icon: HiShoppingBag, accent: "rose" },
    ],
  },
];

const accentColors: Record<string, string> = {
  amber: "border-amber/30 bg-amber/10 text-amber",
  emerald: "border-emerald/30 bg-emerald/10 text-emerald-400",
  violet: "border-violet/30 bg-violet/10 text-violet-400",
  rose: "border-rose/30 bg-rose/10 text-rose-400",
};

const accentGlow: Record<string, string> = {
  amber: "bg-amber/5 group-hover:bg-amber/10",
  emerald: "bg-emerald/5 group-hover:bg-emerald/10",
  violet: "bg-violet/5 group-hover:bg-violet/10",
  rose: "bg-rose/5 group-hover:bg-rose/10",
};

export default function ContentDashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
          Site Content
        </p>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
          Content Management
        </h1>
        <p className="text-sm text-gray-400 mt-2 max-w-lg">
          Edit all website content in 4 languages: EN, DE, FR, ES. Changes appear live on the website the moment you save.
        </p>
      </header>

      {contentSections.map((group) => (
        <section key={group.group}>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
            <span className="flex-1 h-px bg-white/5" />
            <span>{group.group}</span>
            <span className="flex-1 h-px bg-white/5" />
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {group.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={"/admin/content/" + item.key}
                    className="group relative block bg-card-dark rounded-2xl p-5 border border-white/5 hover:border-amber/20 transition-all overflow-hidden h-full"
                  >
                    <div className={"absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl transition-all pointer-events-none " + accentGlow[item.accent]} />
                    <div className="relative z-10 flex items-start justify-between mb-3">
                      <div className={"w-10 h-10 rounded-xl border flex items-center justify-center " + accentColors[item.accent]}>
                        <Icon className="text-base" />
                      </div>
                      <HiArrowUpRight className="text-gray-500 group-hover:text-amber group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-base" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-heading font-bold text-sm text-white mb-1">{item.label}</h3>
                      <p className="text-[11px] text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
