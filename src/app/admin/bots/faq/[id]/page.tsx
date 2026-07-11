"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiArrowLeft,
  HiCheck,
  HiSparkles,
  HiXCircle,
  HiPlus,
  HiXMark,
  HiChatBubbleLeftRight,
} from "react-icons/hi2";
import { faqKnowledge, getRelatedFaqs, type FaqCategory } from "@/lib/faq-knowledge";

const categories: FaqCategory[] = [
  "Process",
  "Pricing",
  "Timeline",
  "Tech",
  "Services",
  "Support",
  "Business",
];

const intents = [
  { id: "quote", label: "Open quote form" },
  { id: "team", label: "Open team contact" },
  { id: "demo", label: "Show demo" },
] as const;

export default function AdminFaqDetail({ params }: { params: { id: string } }) {
  const found = faqKnowledge.find((e) => e.id === params.id);

  // Fallback used when the user navigates to an id not in the knowledge base —
  // admin form should still render instead of crashing.
  // Depends only on params.id (stable prop), so no useMemo needed.
  const fallback = {
    id: params.id,
    category: "Process" as FaqCategory,
    question: params.id.replace(/-/g, " "),
    shortAnswer: "",
    aiAnswer: "",
    keywords: [] as string[],
    related: [] as string[],
    cta: undefined as undefined | { label: string; intent: "quote" | "team" | "demo" },
  };

  const entry = found ?? fallback;
  const relatedEntries = found ? getRelatedFaqs(found.related, found.id) : [];

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/admin/bots/faq"
        className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-amber transition-colors"
      >
        <HiArrowLeft /> Back to FAQ Bot
      </Link>

      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            FAQ Detail
          </p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            {entry.question}
          </h1>
          <p className="text-[10px] font-mono text-gray-600 mt-1">/{entry.id}</p>
        </div>
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] text-sm active:scale-95">
          <HiCheck /> Save changes
        </button>
      </header>

      {!found && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber/10 border border-amber/30 rounded-xl px-4 py-3 text-sm text-amber flex items-center gap-2"
        >
          <HiSparkles className="text-base" />
          This id isn&apos;t in the knowledge base yet — the form below shows a placeholder. Add the entry to{" "}
          <span className="font-mono">src/lib/faq-knowledge.ts</span> and refresh.
        </motion.div>
      )}

      {/* Form grid */}
      <section className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 bg-card-dark rounded-2xl border border-white/5 p-6 space-y-5">
          <Row label="{{faq.id}}">
            <input
              defaultValue={entry.id}
              readOnly={Boolean(found)}
              className={`w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-l-2 focus:border-l-amber focus:outline-none transition-all ${
                found ? "opacity-60 cursor-not-allowed" : ""
              }`}
            />
            {found && (
              <p className="text-[9px] font-mono text-gray-600 pl-1 mt-1">
                Slug is the lookup key — change with care.
              </p>
            )}
          </Row>

          <Row label="{{faq.question}}">
            <input
              defaultValue={entry.question}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none transition-all"
            />
          </Row>

          <Row label="{{faq.short_answer}}">
            <textarea
              rows={2}
              defaultValue={entry.shortAnswer}
              placeholder="One-sentence blurb shown in the FAQ accordion when expanded."
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none resize-none transition-all"
            />
          </Row>

          <Row label="{{faq.ai_answer}}">
            <textarea
              rows={12}
              defaultValue={entry.aiAnswer}
              placeholder="Multi-line rich answer — emoji prefixes, **bold** highlights, line breaks via real newlines."
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-l-2 focus:border-l-amber focus:outline-none resize-y transition-all"
            />
            <p className="text-[9px] font-mono text-gray-600 pl-1 mt-1">
              Tip: emoji prefixes (🚀 🎨 💻) + **bold** markers behave like markdown and render as accent pill chips inline.
            </p>
          </Row>

          <Row label="{{faq.related}}">
            <RelatedPicker value={entry.related} excludeId={entry.id} />
          </Row>
        </div>

        {/* Side meta */}
        <aside className="bg-card-dark rounded-2xl border border-white/5 p-6 space-y-5 h-fit">
          <Row label="{{faq.category}}">
            <select
              defaultValue={entry.category}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none cursor-pointer transition-all"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-black text-white">
                  {c}
                </option>
              ))}
            </select>
          </Row>

          <Row label="{{faq.keywords}}">
            <KeywordInput value={entry.keywords} />
          </Row>

          <div className="h-px bg-white/5" />

          <Row label="{{faq.cta_label}}">
            <input
              defaultValue={entry.cta?.label ?? ""}
              placeholder="Get a tailored estimate"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none transition-all"
            />
          </Row>
          <Row label="{{faq.cta_intent}}">
            <select
              defaultValue={entry.cta?.intent ?? ""}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none cursor-pointer transition-all"
            >
              <option value="">— no CTA —</option>
              {intents.map((i) => (
                <option key={i.id} value={i.id} className="bg-black text-white">
                  {i.label}
                </option>
              ))}
            </select>
          </Row>
        </aside>
      </section>

      {/* Live preview */}
      <section className="bg-card-dark rounded-2xl border border-white/5 p-6 space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-amber">
          <HiChatBubbleLeftRight className="text-base text-amber" /> Live preview — how the FAQ AI bot will display this entry
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-2 bg-black border border-amber/15 rounded-2xl px-5 py-4 shadow-[inset_0_0_24px_rgba(245,158,11,0.05)]"
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber mb-2 opacity-90">
              {entry.category} · Answer
            </p>
            <pre className="text-sm leading-relaxed whitespace-pre-wrap text-gray-200 font-sans">
              {entry.aiAnswer || "(empty answer — bot will fall back to Talk-to-a-human)"}
            </pre>
          </motion.div>
          <div className="bg-black border border-white/5 rounded-2xl px-4 py-3 space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">Related quick-reply chips</p>
            {relatedEntries.length > 0 ? (
              relatedEntries.map((r) => (
                <div
                  key={r.id}
                  className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-gray-300"
                >
                  {r.question}
                </div>
              ))
            ) : (
              <p className="text-[11px] text-gray-500 italic">No related entries linked.</p>
            )}
            {entry.cta && (
              <button className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber text-black font-bold rounded-lg hover:bg-amber-light transition-all text-[11px] shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                {entry.cta.label}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline field row helper                                            */
/* ------------------------------------------------------------------ */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[9px] font-mono text-gray-600 mb-1 pl-1">{label}</p>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Keyword chip input — display-only chip list (placeholder UX)      */
/* ------------------------------------------------------------------ */
function KeywordInput({ value }: { value: string[] }) {
  if (value.length === 0) {
    return (
      <div className="w-full bg-black border border-dashed border-white/10 rounded-xl px-4 py-3 text-[11px] text-gray-500 italic">
        No keywords yet — add comma-separated phrases to improve matching.
      </div>
    );
  }
  return (
    <div className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 flex flex-wrap gap-1.5">
      {value.map((kw) => (
        <span
          key={kw}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber/10 border border-amber/20 text-amber text-[11px] font-mono"
        >
          {kw}
          <button className="text-amber/70 hover:text-amber" aria-label={`Remove keyword ${kw}`}>
            <HiXMark className="text-[10px]" />
          </button>
        </span>
      ))}
      <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-dashed border-white/15 text-gray-400 text-[11px] hover:bg-white/10 transition-all">
        <HiPlus className="text-[10px]" /> add
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Related-question picker — display-only chip list (placeholder UX)  */
/* ------------------------------------------------------------------ */
function RelatedPicker({ value, excludeId }: { value: string[]; excludeId: string }) {
  if (value.length === 0) {
    return (
      <div className="w-full bg-black border border-dashed border-white/10 rounded-xl px-4 py-3 text-[11px] text-gray-500 italic">
        No related entries linked — articles surfaced as quick-reply chips after this answer.
      </div>
    );
  }
  const resolved = value
    .map((id) => faqKnowledge.find((e) => e.id === id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e) && e!.id !== excludeId);
  return (
    <div className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 flex flex-wrap gap-1.5">
      {resolved.map((r) => (
        <span
          key={r.id}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white text-[11px]"
        >
          <HiSparkles className="text-amber text-[10px]" />
          {r.question}
          <button className="text-gray-500 hover:text-amber" aria-label={`Unlink ${r.id}`}>
            <HiXCircle className="text-[10px]" />
          </button>
        </span>
      ))}
      <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-dashed border-white/15 text-gray-400 text-[11px] hover:bg-white/10 transition-all">
        <HiPlus className="text-[10px]" /> link another
      </button>
    </div>
  );
}
