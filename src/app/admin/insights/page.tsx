"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiPlus,
  HiMagnifyingGlass,
  HiChevronDown,
  HiArrowRight,
  HiDocumentText,
} from "react-icons/hi2";

/* ------------------------------------------------------------------ */
/*  Mock blog posts (mirrors src/data/insights.ts shape)               */
/* ------------------------------------------------------------------ */
const mockInsights = [
  {
    slug: "how-to-scale-ai-2026",
    title: "How to Scale AI in 2026: A Playbook for Founders",
    category: "Strategy",
    status: "published",
    excerpt: "Concrete steps to ship agentic workflows that pay for themselves in week one.",
    readTime: "7 min",
    date: "2026-07-09",
    author: "Stratifit Team",
  },
  {
    slug: "design-systems-that-convert",
    title: "Design Systems That Convert: Beyond Pretty Pixels",
    category: "Design",
    status: "published",
    excerpt: "Tokens, motion, and content strategy — the three layers most teams skip.",
    readTime: "5 min",
    date: "2026-07-04",
    author: "Stratifit Team",
  },
  {
    slug: "growth-loops-for-saas",
    title: "Growth Loops for SaaS: Acquisition, Activation, Retention",
    category: "Growth",
    status: "draft",
    excerpt: "Mapping the four loops that produce compounding — without paid ads.",
    readTime: "9 min",
    date: "2026-07-01",
    author: "Stratifit Team",
  },
  {
    slug: "edge-runtime-deep-dive",
    title: "Edge Runtime Deep-Dive: When to Use Vercel, Cloudflare, or Bare Metal",
    category: "Tech",
    status: "published",
    excerpt: "A decision matrix that pairs use-case with infrastructure.",
    readTime: "12 min",
    date: "2026-06-27",
    author: "Stratifit Team",
  },
  {
    slug: "buy-a-business-due-diligence",
    title: "Buy-a-Business: A 14-Point Due-Diligence Checklist",
    category: "Strategy",
    status: "scheduled",
    excerpt: "How to spot red flags in MRR, churn, traffic, ops, and team contracts.",
    readTime: "8 min",
    date: "2026-06-20",
    author: "Stratifit Team",
  },
];

const categories = ["All", "Strategy", "Design", "Growth", "Tech"];
const statuses = ["All", "published", "draft", "scheduled"];

export default function AdminInsightsPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState(categories[0]);
  const [status, setStatus] = useState(statuses[0]);

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            Content
          </p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Insights
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Publish and manage blog posts and articles.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95">
          <HiPlus className="text-base" /> New Insight
        </button>
      </header>

      {/* Toolbar */}
      <section className="bg-card-dark rounded-2xl border border-white/5 p-4 flex flex-col lg:flex-row gap-3">
        <label className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category"
            className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-amber/50 focus:outline-none transition-colors"
          />
        </label>
        <FilterSelect label="Category" value={cat} options={categories} onChange={setCat} />
        <FilterSelect label="Status" value={status} options={statuses} onChange={setStatus} />
      </section>

      {/* Table */}
      <section className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/5">
                <th className="px-6 py-3 font-bold">Title</th>
                <th className="px-6 py-3 font-bold hidden md:table-cell">Category</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold hidden lg:table-cell">Read</th>
                <th className="px-6 py-3 font-bold hidden md:table-cell">Date</th>
                <th className="px-6 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockInsights.map((p, i) => (
                <motion.tr
                  key={p.slug}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center shrink-0">
                        <HiDocumentText className="text-amber text-sm" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{p.title}</p>
                        <p className="text-[10px] font-mono text-gray-600 mt-0.5">/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={statusClasses(p.status)}>{p.status}</span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-gray-400 text-xs font-mono">{p.readTime}</td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-400 text-xs font-mono">{p.date}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/insights/${p.slug}`}
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

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="relative lg:min-w-[200px]">
      <p className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-500 uppercase tracking-wider pointer-events-none z-10">{label}</p>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-black border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:border-amber/50 focus:outline-none cursor-pointer"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-black text-white">
              {o}
            </option>
          ))}
        </select>
        <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-base" />
      </div>
    </div>
  );
}

function statusClasses(s: string) {
  switch (s) {
    case "published":
      return "text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20";
    case "draft":
      return "text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10";
    case "scheduled":
      return "text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber/15 text-amber border border-amber/20";
    default:
      return "text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10";
  }
}
