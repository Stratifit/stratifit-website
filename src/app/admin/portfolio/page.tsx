"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiPlus, HiMagnifyingGlass, HiChevronDown, HiArrowRight, HiBriefcase } from "react-icons/hi2";

const cases = [
  { slug: "linnea-couture", title: "Linnea Couture", category: "Brand Design", shortMetric: "+248% brand recall", client: "Linnea", timeline: "5w", tags: ["Brand", "Packaging"], status: "published" },
  { slug: "vox-ai-platform", title: "Vox · AI Voice Platform", category: "AI Automation", shortMetric: "−62% support cost", client: "Vox", timeline: "8w", tags: ["AI", "Voice"], status: "published" },
  { slug: "rimini-ecom", title: "Rimini · DTC Storefront", category: "Website Development", shortMetric: "+3.1× conversion", client: "Rimini", timeline: "6w", tags: ["Shopify", "CRO"], status: "published" },
  { slug: "argo-acquisition", title: "Argo SaaS · End-to-end Acquisition", category: "Buy a Business", shortMetric: "2.4× revenue / 8mo", client: "Argo", timeline: "Ongoing", tags: ["Acquisition"], status: "in-review" },
  { slug: "lumen-co", title: "Lumen Co · B2B Lead Funnel", category: "Growth Marketing", shortMetric: "$2.1M ARR added", client: "Lumen", timeline: "12w", tags: ["Ads", "SEO"], status: "draft" },
  { slug: "coda-studio", title: "Coda Studio · Product Identity", category: "Brand Design", shortMetric: "Launch in 4 weeks", client: "Coda", timeline: "4w", tags: ["Brand", "Web"], status: "scheduled" },
];

const categories = ["All", "Brand Design", "Website Development", "AI Automation", "Growth Marketing", "Buy a Business"];

export default function AdminPortfolioPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState(categories[0]);

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            Content
          </p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Portfolio
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Manage case studies and project showcases.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95">
          <HiPlus className="text-base" /> New Case Study
        </button>
      </header>

      <section className="bg-card-dark rounded-2xl border border-white/5 p-4 flex flex-col lg:flex-row gap-3">
        <label className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search case studies"
            className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-amber/50 focus:outline-none"
          />
        </label>
        <div className="relative lg:min-w-[200px]">
          <p className="text-[9px] font-mono text-gray-600 mb-0.5 pl-1">{"{{filter_category}}"}</p>
          <div className="relative">
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="w-full appearance-none bg-black border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:border-amber/50 focus:outline-none cursor-pointer">
              {categories.map((c) => (
                <option key={c} value={c} className="bg-black text-white">
                  {c}
                </option>
              ))}
            </select>
            <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-base" />
          </div>
        </div>
      </section>

      <section className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <p className="text-[10px] font-mono text-gray-500">
            {"{{case.title}} · {{case.category}} · {{case.metric}} · {{case.status}}"}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/5">
                <th className="px-6 py-3 font-bold">Project</th>
                <th className="px-6 py-3 font-bold hidden md:table-cell">Category</th>
                <th className="px-6 py-3 font-bold">Metric</th>
                <th className="px-6 py-3 font-bold hidden lg:table-cell">Client</th>
                <th className="px-6 py-3 font-bold hidden md:table-cell">Timeline</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {cases.map((c, i) => (
                <motion.tr
                  key={c.slug}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber/20 to-amber/5 border border-amber/30 flex items-center justify-center shrink-0">
                        <HiBriefcase className="text-amber text-sm" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{c.title}</p>
                        <p className="text-[10px] font-mono text-gray-600">/{c.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-300 text-xs">{c.category}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber/15 text-amber border border-amber/20">
                      {c.shortMetric}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-gray-400 text-xs">{c.client}</td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-400 text-xs font-mono">{c.timeline}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/portfolio/${c.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber hover:gap-2 transition-all"
                    >
                      Edit <HiArrowRight className="text-sm" />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
