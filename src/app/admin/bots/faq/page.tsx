"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiPlus,
  HiMagnifyingGlass,
  HiChevronDown,
  HiArrowRight,
  HiSparkles,
  HiCheckCircle,
  HiXCircle,
  HiTrash,
} from "react-icons/hi2";
import { faqKnowledge } from "@/lib/faq-knowledge";

const KB_STORAGE_KEY = "faq-bot-kb-v1";

const categories = ["All", "Process", "Pricing", "Timeline", "Tech", "Services", "Support", "Business"];

/**
 * Each entry's status is derived at render time:
 *   published  ⇒ 5+ keywords and at least one related id and an aiAnswer longer than 200 chars
 *   draft      ⇒ fewer than 5 keywords or no related id (incomplete)
 *   archived   ⇒ aiAnswer missing or empty (placeholder data)
 */
function deriveStatus(entry: (typeof faqKnowledge)[number]): "published" | "draft" | "archived" {
  if (!entry.aiAnswer || entry.aiAnswer.length < 200) return "archived";
  if (entry.keywords.length < 5 || entry.related.length === 0) return "draft";
  return "published";
}

const statuses = ["All", "published", "draft", "archived"];

export default function AdminFaqPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState(categories[0]);
  const [status, setStatus] = useState(statuses[0]);

  /* Local KB state — hydrated from localStorage so admin edits persist across nav. */
  const [entries, setEntries] = useState(faqKnowledge);
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" && window.localStorage.getItem(KB_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) setEntries(parsed);
      }
    } catch { /* ignore */ }
  }, []);
  const handleDelete = (id: string) => {
    if (!confirm("Delete this bot KB entry? Edits stay in this browser until you re-run the page.")) return;
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    try { window.localStorage.setItem(KB_STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            Site Configuration
          </p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            FAQ
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Manage the knowledge base that powers the public FAQ AI chatbot.
          </p>
        </div>
        <Link
          href="/admin/bots/faq/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95"
        >
          <HiPlus className="text-base" /> New FAQ
        </Link>
      </header>

      {/* Knowledge base stats row */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile label="Total entries" value={faqKnowledge.length} accent="amber" />
        <StatTile
          label="Auto-publish ready"
          value={faqKnowledge.filter((e) => deriveStatus(e) === "published").length}
          accent="emerald"
        />
        <StatTile
          label="Drafts"
          value={faqKnowledge.filter((e) => deriveStatus(e) === "draft").length}
          accent="amber"
        />
        <StatTile
          label="With CTA"
          value={faqKnowledge.filter((e) => Boolean(e.cta)).length}
          accent="amber"
        />
      </section>

      {/* Toolbar */}
      <section className="bg-card-dark rounded-2xl border border-white/5 p-4 flex flex-col lg:flex-row gap-3">
        <label className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by question, keyword, or category"
            className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-amber/50 focus:outline-none transition-colors"
          />
        </label>
        <FilterSelect label="Category" value={cat} options={categories} onChange={setCat} />
        <FilterSelect label="Status" value={status} options={statuses} onChange={setStatus} />
      </section>

      {/* Table */}
      <section className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <p className="text-[10px] font-mono text-gray-500">
            {"{{faq.question}} · {{faq.category}} · {{faq.keywords}} · {{faq.related}} · {{faq.cta}}"}
          </p>
          <p className="text-xs text-gray-400">
            <span className="text-white font-bold">{faqKnowledge.length}</span> entries
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/5">
                <th className="px-6 py-3 font-bold">Question</th>
                <th className="px-6 py-3 font-bold hidden md:table-cell">Category</th>
                <th className="px-6 py-3 font-bold">Keywords</th>
                <th className="px-6 py-3 font-bold hidden lg:table-cell">Related</th>
                <th className="px-6 py-3 font-bold">CTA</th>
                <th className="px-6 py-3 font-bold hidden md:table-cell">Status</th>
                <th className="px-6 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {entries.map((entry, i) => {
                const st = deriveStatus(entry);
                return (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber/15 border border-amber/30 flex items-center justify-center shrink-0 mt-0.5">
                          <HiSparkles className="text-amber text-sm" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white">{entry.question}</p>
                          <p className="text-[10px] font-mono text-gray-600 mt-0.5">/{entry.id}</p>
                          <p className="text-xs text-gray-400 mt-1 max-w-[420px] line-clamp-2">
                            {entry.shortAnswer}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                        {entry.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-amber font-bold">
                        +{entry.keywords.length}
                      </span>
                      <span className="text-[10px] text-gray-500 ml-1">
                        <span className="hidden lg:inline">
                          ({entry.keywords.slice(0, 3).join(", ")}…)
                        </span>
                        <span className="lg:hidden">keywords</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-gray-400 text-xs font-mono">
                      {entry.related.length} link{entry.related.length === 1 ? "" : "s"}
                    </td>
                    <td className="px-6 py-4">
                      {entry.cta ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
                          <HiCheckCircle className="text-[10px]" />
                          {entry.cta.intent}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-500 border border-white/10">
                          <HiXCircle className="text-[10px]" />
                          none
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={statusClasses(st)}>{st}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/admin/bots/faq/${entry.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber hover:gap-2 transition-all"
                        >
                          Edit <HiArrowRight className="text-sm" />
                        </Link>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-red-400 hover:bg-red-400/10 transition-all"
                          aria-label={`Delete FAQ bot entry ${entry.id}`}
                        >
                          <HiTrash className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Source + freshness note */}
      <section className="bg-card-dark rounded-2xl border border-white/5 p-5 flex items-start gap-3">
        <HiSparkles className="text-amber text-base mt-0.5 shrink-0" />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber mb-1">
            Source of truth
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            The 12 entries above are sourced from{" "}
            <span className="font-mono text-gray-300">src/lib/faq-knowledge.ts</span> and rendered live in the question mark section of the public FAQ page. Save changes here when the file is edited; once a Supabase binding is wired this view will read/write through the API route.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline helpers                                                     */
/* ------------------------------------------------------------------ */
function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative lg:min-w-[200px]">
      <p className="text-[9px] font-mono text-gray-600 mb-0.5 pl-1">{`{{filter_${label.toLowerCase()}}}`}</p>
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

function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent: "amber" | "emerald";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="bg-card-dark rounded-2xl border border-white/5 p-4"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">{label}</p>
      <p
        className={`mt-2 font-heading font-black text-2xl tracking-tight ${
          accent === "emerald" ? "text-emerald-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </motion.div>
  );
}

function statusClasses(s: string) {
  switch (s) {
    case "published":
      return "text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20";
    case "draft":
      return "text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber/15 text-amber border border-amber/20";
    case "archived":
      return "text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-500 border border-white/10";
    default:
      return "text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10";
  }
}
