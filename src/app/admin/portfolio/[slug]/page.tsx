"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HiArrowLeft, HiCheck, HiPlus } from "react-icons/hi2";
import { projects } from "@/data/projects";

export default function AdminCaseStudyDetail({ params }: { params: { slug: string } }) {
  const found = projects.find((p) => (p.slug ?? "").toLowerCase() === params.slug.toLowerCase());
  const fallback = {
    title: params.slug.replace(/-/g, " "),
    category: "Brand Design",
    description: "",
    client: "Sample Client",
    timeline: "—",
    metric: "—",
    tags: [] as string[],
    challenges: [""],
    solutions: [""],
    results: [""],
    status: "draft",
  };
  const base = {
    title: found?.title ?? fallback.title,
    category: (found?.category ?? fallback.category) as string,
    description: found?.description ?? fallback.description,
    client: fallback.client,
    timeline: fallback.timeline,
    metric: (found as { shortMetric?: string })?.shortMetric ?? fallback.metric,
    tags: fallback.tags,
    challenges: fallback.challenges,
    solutions: fallback.solutions,
    results: fallback.results,
    status: fallback.status,
  };

  return (
    <div className="space-y-8">
      <Link href="/admin/portfolio" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-amber transition-colors">
        <HiArrowLeft /> Back to Portfolio
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            Case Study
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
        <div className="lg:col-span-2 space-y-6">
          <Card eyebrow="Title">
            <input defaultValue={base.title} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none" />
          </Card>
          <Card eyebrow="Slug">
            <input defaultValue={params.slug} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-l-2 focus:border-l-amber focus:outline-none" />
          </Card>
          <Card eyebrow="Description">
            <textarea rows={4} defaultValue={base.description} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none resize-none" />
          </Card>
          <Card eyebrow="Challenges">
            {[0, 1, 2].map((i) => (
              <textarea key={i} rows={2} placeholder={`Challenge ${i + 1}`} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none resize-none mb-2" />
            ))}
          </Card>
          <Card eyebrow="Solutions">
            {[0, 1, 2].map((i) => (
              <textarea key={i} rows={2} placeholder={`Solution ${i + 1}`} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none resize-none mb-2" />
            ))}
          </Card>
          <Card eyebrow="Results">
            {[0, 1, 2].map((i) => (
              <textarea key={i} rows={2} placeholder={`Result ${i + 1}`} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none resize-none mb-2" />
            ))}
          </Card>
        </div>

        <aside className="space-y-6">
          <Card eyebrow="Category">
            <select defaultValue={base.category} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none cursor-pointer">
              {["Brand Design", "Website Development", "AI Automation", "Growth Marketing", "Buy a Business"].map((c) => (
                <option key={c} value={c} className="bg-black text-white">
                  {c}
                </option>
              ))}
            </select>
          </Card>
          <Card eyebrow="Highlight metric">
            <input defaultValue={base.metric} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none" />
          </Card>
          <Card eyebrow="Tags (comma separated)">
            <input defaultValue={base.tags.join(", ")} placeholder="Brand, Web, CRO" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-l-2 focus:border-l-amber focus:outline-none" />
          </Card>
          <Card eyebrow="Status">
            <select defaultValue={base.status} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none cursor-pointer">
              {["draft", "scheduled", "published", "archived"].map((s) => (
                <option key={s} value={s} className="bg-black text-white">
                  {s}
                </option>
              ))}
            </select>
          </Card>
        </aside>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber">Gallery</p>
          <button className="text-xs text-amber font-bold flex items-center gap-1 hover:gap-2 transition-all">
            <HiPlus className="text-sm" /> Add image
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-[4/3] rounded-xl bg-card-dark border border-white/5 flex items-center justify-center text-[10px] font-mono text-gray-600">
              Image {i + 1}
            </div>
          ))}
        </div>
      </section>

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card-dark rounded-2xl border border-amber/15 p-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber mb-1">Preview</p>
        <h2 className="font-heading font-black text-2xl text-white mb-1">{base.title}</h2>
        <p className="text-sm text-gray-400">{base.description || "—"}</p>
      </motion.section>
    </div>
  );
}

function Card({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="bg-card-dark rounded-2xl border border-white/5 p-5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-amber mb-3">{eyebrow}</p>
      {children}
    </div>
  );
}
