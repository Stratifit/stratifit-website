"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiPlus,
  HiPencil,
  HiXMark,
  HiStar,
  HiCheck,
  HiChatBubbleLeftRight,
} from "react-icons/hi2";

const testimonials = [
  { id: "t-1", name: "Maria Linnea", role: "Founder · Linnea Couture", initials: "ML", rating: 5, text: "Stratifit replaced our agency-of-three with one team that ships end-to-end, weekly.", featured: true, status: "published", when: "1w ago" },
  { id: "t-2", name: "Diego Vox", role: "CTO · Vox AI", initials: "DV", rating: 5, text: "Our AI voice agent cut support cost 62% in eight weeks, and they handed off everything cleanly.", featured: true, status: "published", when: "2w ago" },
  { id: "t-3", name: "Aria Rimini", role: "Head of Growth · Rimini", initials: "AR", rating: 5, text: "Conversion +3.1×. The process felt less like an agency and more like an embedded team.", featured: false, status: "published", when: "3w ago" },
  { id: "t-4", name: "Noor Halo", role: "Founder · Coda Studio", initials: "NH", rating: 4, text: "Brand identity + website done in 4 weeks. We've used their playbook twice since.", featured: false, status: "draft", when: "1mo ago" },
  { id: "t-5", name: "Lukas Aaltonen", role: "Ops · Lumen Co", initials: "LA", rating: 5, text: "$2.1M ARR in 12 weeks of paid + SEO. Reporting is the cleanest I've seen.", featured: true, status: "published", when: "1mo ago" },
  { id: "t-6", name: "Iris Calderon", role: "CEO · Argo SaaS", initials: "IC", rating: 5, text: "Bought a SaaS through Stratifit; their DD checklist saved us from three bad deals.", featured: false, status: "scheduled", when: "—", statusScheduled: true },
];

export default function AdminTestimonialsPage() {
  const [editing, setEditing] = useState<(typeof testimonials)[0] | null>(null);

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            Content
          </p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Testimonials
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Curate reviews shown across the homepage and proposals.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95">
          <HiPlus className="text-base" /> New Testimonial
        </button>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="group bg-card-dark rounded-2xl border border-white/5 hover:border-amber/20 transition-all p-6 relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber/5 rounded-full blur-3xl group-hover:bg-amber/10 transition-all pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-amber/15 border border-amber/30 flex items-center justify-center font-heading font-black text-amber">
                  {t.initials}
                </div>
                <button
                  onClick={() => setEditing(t)}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-amber/15 border border-white/10 hover:border-amber/30 flex items-center justify-center text-gray-300 hover:text-amber transition-all"
                  aria-label="Edit"
                >
                  <HiPencil className="text-sm" />
                </button>
              </div>
              <p className="text-[9px] font-mono text-gray-600 mb-1">
                testimonial.author
              </p>
              <p className="font-bold text-white">{t.name}</p>
              <p className="text-xs text-gray-400 mb-3">{t.role}</p>
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <HiStar
                    key={idx}
                    className={`text-[14px] ${idx < t.rating ? "text-amber" : "text-gray-700"}`}
                  />
                ))}
                <span className="text-[10px] font-mono text-gray-500 ml-2">
                  testimonial.rating = {t.rating}/5
                </span>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent my-3" />
              <p className="text-[9px] font-mono text-gray-600 mb-1">
                testimonial.quote
              </p>
              <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                &quot;{t.text}&quot;
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  t.status === "published" ? "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20"
                    : t.status === "draft" ? "bg-white/5 text-gray-400 border border-white/10"
                    : "bg-amber/15 text-amber border border-amber/20"
                }`}>
                  {t.status}
                </span>
                <button
                  onClick={() => setEditing(t)}
                  className="text-[11px] text-amber font-bold flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Open <HiChatBubbleLeftRight className="text-sm" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-card-dark rounded-2xl border border-amber/20 w-full max-w-lg overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber/60 to-transparent bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-1">
                    Edit Testimonial
                  </p>
                  <h3 className="font-heading font-black text-xl text-white">
                    {editing.name}
                  </h3>
                </div>
                <button
                  onClick={() => setEditing(null)}
                  className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white"
                >
                  <HiXMark />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setEditing(null);
                }}
                className="space-y-3"
              >
                <Field label="testimonial.author" defaultValue={editing.name} />
                <Field label="testimonial.role" defaultValue={editing.role} />
                <Field label="testimonial.rating" defaultValue={String(editing.rating)} />
                <Field label="testimonial.quote" defaultValue={editing.text} multiline />
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] text-sm mt-2"
                >
                  <HiCheck /> Save changes
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function Field({ label, defaultValue, multiline }: { label: string; defaultValue?: string; multiline?: boolean }) {
  return (
    <div>
      <p className="text-[9px] font-mono text-gray-600 mb-1 pl-1">{label}</p>
      {multiline ? (
        <textarea
          rows={4}
          defaultValue={defaultValue}
          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none resize-none"
        />
      ) : (
        <input
          defaultValue={defaultValue}
          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none"
        />
      )}
    </div>
  );
}
