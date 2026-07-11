"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiPlus,
  HiMagnifyingGlass,
  HiArrowRight,
  HiChatBubbleLeftRight,
  HiEnvelope,
  HiUserGroup,
  HiSparkles,
  HiCheckCircle,
  HiXCircle,
  HiTrash,
} from "react-icons/hi2";
import {
  comingSoonResponses,
  comingSoonChips,
  type ComingSoonIntent,
  type ComingSoonMessage,
} from "@/data/coming-soon-bot";

const STORAGE_KEY = "coming-soon-bot-kb-v1";

const intents: ComingSoonIntent[] = ["subscribe", "team", "info"];

const intentAccent: Record<ComingSoonIntent, { bg: string; fg: string; border: string }> = {
  subscribe: { bg: "bg-amber/15", fg: "text-amber", border: "border-amber/30" },
  team:      { bg: "bg-emerald-400/10", fg: "text-emerald-300", border: "border-emerald-400/20" },
  info:      { bg: "bg-white/5",   fg: "text-gray-300", border: "border-white/10" },
};

const intentCopy: Record<ComingSoonIntent, string> = {
  subscribe: "Subscribe for Launch",
  team: "Talk to the Team",
  info: "Explore Services",
};

const intentTarget: Record<ComingSoonIntent, string> = {
  subscribe: "Scroll → email input",
  team: "Open → contact modal",
  info: "Scroll → services carousel",
};

/**
 * Each entry's status is derived at render time:
 *   ready  => text length >= 140 chars and an intent is set
 *   draft  => shorter or missing intent
 */
function deriveStatus(text: string, intent?: ComingSoonIntent): "ready" | "draft" {
  if (!intent) return "draft";
  if (text.trim().length < 140) return "draft";
  return "ready";
}

export default function AdminComingSoonPage() {
  // Stable list of entries shown in master view (order: chips first, then special keys last)
  const allIds = Array.from(
    new Set([...comingSoonChips.map((c) => c.id), "fallback", "greeting"])
  );
  const seed = allIds
    .filter((id) => (id === "greeting" ? false : true)) // greeting never shows in admin master
    .map((id) => ({
      id,
      label: comingSoonChips.find((c) => c.id === id)?.label ?? (id === "fallback" ? "Fallback (no match)" : id),
      message: comingSoonResponses[id] ?? { role: "bot" as const, text: "", intent: undefined },
    }));

  /* Local overrides — admins can add/remove chips + scripted answers in this browser. */
  const [entries, setEntries] = useState<{ id: string; label: string; message: ComingSoonMessage }[]>(seed);
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setEntries(parsed);
        }
      }
    } catch { /* ignore */ }
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Delete this bot entry? Edits stay in this browser only.")) return;
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            Site Configuration
          </p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Pre-launch Bot
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl">
            Manage the chip rail + scripted answers the Coming Soon gate chat uses to greet visitors and respond to launch / services / pricing / hiring questions.
          </p>
        </div>
        <Link
          href="/admin/bots/coming-soon/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95"
        >
          <HiPlus className="text-base" /> New Chip
        </Link>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile label="Total chips" value={comingSoonChips.length} accent="amber" />
        <StatTile
          label="Ready to ship"
          value={entries.filter((e) => deriveStatus(e.message.text, e.message.intent) === "ready").length}
          accent="emerald"
        />
        <StatTile
          label="Drafts"
          value={entries.filter((e) => deriveStatus(e.message.text, e.message.intent) === "draft").length}
          accent="amber"
        />
        <StatTile
          label="Subscribe intents"
          value={entries.filter((e) => e.message.intent === "subscribe").length}
          accent="amber"
        />
      </section>

      {/* Toolbar */}
      <section className="bg-card-dark rounded-2xl border border-white/5 p-4 flex flex-col lg:flex-row gap-3">
        <label className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none" />
          <input
            placeholder="Search by id or label"
            className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-amber/50 focus:outline-none transition-colors"
          />
        </label>
        <div className="flex items-center gap-1.5 px-3">
          {intents.map((i) => (
            <span key={i} className={`text-[9px] font-bold uppercase tracking-[0.18em] px-2 py-1 rounded-full border ${intentAccent[i].bg} ${intentAccent[i].fg} ${intentAccent[i].border}`}>
              {i}
            </span>
          ))}
          <span className="text-[10px] font-mono text-gray-600 ml-1">intents</span>
        </div>
      </section>

      {/* Entries table */}
      <section className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <p className="text-[10px] font-mono text-gray-500">
            {"{{cs.id}} · {{cs.label}} · {{cs.intent}} · {{cs.status}}"}
          </p>
          <p className="text-xs text-gray-400">
            <span className="text-white font-bold">{entries.length}</span> entries
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/5">
                <th className="px-6 py-3 font-bold">Chip</th>
                <th className="px-6 py-3 font-bold hidden md:table-cell">Id</th>
                <th className="px-6 py-3 font-bold hidden lg:table-cell">Answer preview</th>
                <th className="px-6 py-3 font-bold">Intent</th>
                <th className="px-6 py-3 font-bold hidden md:table-cell">Status</th>
                <th className="px-6 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {entries.map((entry, i) => {
                const st = deriveStatus(entry.message.text, entry.message.intent);
                const accent = entry.message.intent ? intentAccent[entry.message.intent] : intentAccent.info;
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
                          <HiChatBubbleLeftRight className="text-amber text-sm" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white">{entry.label}</p>
                          <p className="text-[10px] font-mono text-gray-600 mt-0.5">/{entry.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10 font-mono">
                        {entry.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="text-xs text-gray-400 line-clamp-2 max-w-[420px] leading-relaxed">
                        {entry.message.text}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {entry.message.intent ? (
                        <div className="flex flex-col gap-0.5">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${accent.bg} ${accent.fg} ${accent.border}`}>
                            <HiCheckCircle className="text-[10px]" />
                            {entry.message.intent}
                          </span>
                          <span className="text-[9px] text-gray-500 pl-1">{intentTarget[entry.message.intent]}</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-500 border border-white/10">
                          <HiXCircle className="text-[10px]" /> none
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={st === "ready" ? statusReady : statusDraft}>
                        {st}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/admin/bots/coming-soon/${entry.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber hover:gap-2 transition-all"
                        >
                          Edit <HiArrowRight className="text-sm" />
                        </Link>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-red-400 hover:bg-red-400/10 transition-all"
                          aria-label={`Delete bot entry ${entry.id}`}
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
            The {comingSoonChips.length} chips and 8 scripted responses above are sourced from{" "}
            <span className="font-mono text-gray-300">src/data/coming-soon-bot.ts</span> and rendered live in the chat bubble on the Coming Soon gate. Edit the data file when you need new answers — refresh the page to see them.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline helpers                                                     */
/* ------------------------------------------------------------------ */
function StatTile({ label, value, accent }: { label: string; value: number | string; accent: "amber" | "emerald" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="bg-card-dark rounded-2xl border border-white/5 p-4"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">{label}</p>
      <p className={`mt-2 font-heading font-black text-2xl tracking-tight ${accent === "emerald" ? "text-emerald-300" : "text-white"}`}>
        {value}
      </p>
    </motion.div>
  );
}

const statusReady = "text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20";
const statusDraft = "text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber/15 text-amber border border-amber/20";
