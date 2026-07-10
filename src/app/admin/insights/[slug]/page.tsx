"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HiArrowLeft, HiCheck, HiDocumentText } from "react-icons/hi2";
import { insights } from "@/data/insights";

export default function AdminInsightDetail({ params }: { params: { slug: string } }) {
  // Match against the static dataset to populate the form fields
  const found = insights.find((p) => (p.slug ?? "").toLowerCase() === params.slug.toLowerCase());
  // Insight has no "status" field in the schema — publish-state is derived from `date` (future ⇒ scheduled, near-now ⇒ published, old ⇒ archived)
  const derivedStatus = (() => {
    const d = Date.parse(found?.date ?? "");
    if (!isFinite(d)) return "draft";
    const now = Date.now();
    if (d > now + 86_400_000) return "scheduled";
    if (d < now - 365 * 86_400_000) return "archived";
    return "published";
  })();
  const fallback = {
    title: params.slug.replace(/-/g, " "),
    category: "Strategy",
    excerpt: "",
    date: "",
    readTime: "—",
    author: "Stratifit Team",
    image: "",
  };
  const base = {
    title: found?.title ?? fallback.title,
    category: (found?.category ?? fallback.category) as string,
    excerpt: found?.excerpt ?? fallback.excerpt,
    date: found?.date ?? fallback.date,
    readTime: (found?.readTime ?? fallback.readTime) as string,
    author: fallback.author,
    image: found?.image ?? fallback.image,
  };

  return (
    <div className="space-y-8">
      <Link href="/admin/insights" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-amber transition-colors">
        <HiArrowLeft /> Back to Insights
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            Insight Detail
          </p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            {base.title}
          </h1>
          <p className="text-[10px] font-mono text-gray-600 mt-1">/{params.slug}</p>
        </div>
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] text-sm active:scale-95">
          <HiCheck /> Save changes
        </button>
      </header>

      <section className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 bg-card-dark rounded-2xl border border-white/5 p-6 space-y-5">
          <Row label="{{insight.title}}">
            <input defaultValue={base.title} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none transition-all" />
          </Row>
          <Row label="{{insight.slug}}">
            <input defaultValue={params.slug} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-l-2 focus:border-l-amber focus:outline-none transition-all" />
          </Row>
          <Row label="{{insight.excerpt}}">
            <textarea rows={3} defaultValue={base.excerpt} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none resize-none transition-all" />
          </Row>
          <Row label="{{insight.content}}">
            <textarea rows={10} defaultValue={found?.content ?? ""} placeholder="Markdown or rich-text content..." className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-l-2 focus:border-l-amber focus:outline-none resize-y transition-all" />
          </Row>
          <Row label="{{insight.image}}">
            <input defaultValue={base.image} placeholder="/insights/your-image.jpg" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-l-2 focus:border-l-amber focus:outline-none transition-all" />
          </Row>
        </div>

        {/* Side meta */}
        <aside className="bg-card-dark rounded-2xl border border-white/5 p-6 space-y-5">
          <Row label="{{insight.category}}">
            <select defaultValue={base.category} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none cursor-pointer transition-all">
              {["Strategy", "Design", "Growth", "Tech", "Other"].map((c) => (
                <option key={c} value={c} className="bg-black text-white">
                  {c}
                </option>
              ))}
            </select>
          </Row>
          <Row label="{{insight.status}}">
            <select defaultValue={derivedStatus} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none cursor-pointer transition-all">
              {["draft", "scheduled", "published", "archived"].map((s) => (
                <option key={s} value={s} className="bg-black text-white">
                  {s}
                </option>
              ))}
            </select>
          </Row>
          <Row label="{{insight.read_time}}">
            <input defaultValue={base.readTime} placeholder="5 min" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none transition-all" />
          </Row>
          <Row label="{{insight.author}}">
            <input defaultValue={base.author} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none transition-all" />
          </Row>
          <Row label="{{insight.date}}">
            <input defaultValue={base.date} placeholder="YYYY-MM-DD" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-l-2 focus:border-l-amber focus:outline-none transition-all" />
          </Row>
        </aside>
      </section>

      {/* Preview */}
      <section className="bg-card-dark rounded-2xl border border-white/5 p-6">
        <p className="text-[10px] font-mono text-gray-500 mb-3">
          {"{{insight.preview}}"} — replacement title/excerpt render here
        </p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-amber/15 bg-black/40 p-6">
          <div className="flex items-center gap-2 text-[10px] font-mono text-amber mb-3">
            <HiDocumentText className="text-sm" /> {params.slug}
          </div>
          <h2 className="font-heading font-black text-2xl text-white mb-2">{base.title}</h2>
          <p className="text-sm text-gray-400 leading-relaxed">{base.excerpt || "—"}</p>
        </motion.div>
      </section>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9px] font-mono text-gray-600 mb-1 pl-1">{label}</p>
      {children}
    </div>
  );
}
