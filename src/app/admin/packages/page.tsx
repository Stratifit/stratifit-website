"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiPencil, HiXMark, HiPlus, HiCheck, HiRectangleStack } from "react-icons/hi2";

const tiers = [
  {
    id: "launch",
    name: "Launch",
    price: "$1,500",
    period: "one-time",
    description: "For new founders looking to ship a sharp, on-brand foundation.",
    features: ["Brand strategy session", "Logo + visual identity", "Single-page site", "2 rounds of revisions"],
    highlighted: false,
    cta: "Start Launch",
  },
  {
    id: "grow",
    name: "Grow",
    price: "$4,800",
    period: "starting",
    description: "For brands ready to scale content and acquisition systems.",
    features: ["Everything in Launch", "Multi-page website", "Lead capture + email automation", "30-day content sprint"],
    highlighted: true,
    cta: "Choose Grow",
  },
  {
    id: "scale",
    name: "Scale",
    price: "$9,200",
    period: "starting",
    description: "For teams ready to dominate their category with AI + automation.",
    features: ["Everything in Grow", "Custom AI agent", "Paid acquisition playbook", "Quarterly strategy review"],
    highlighted: false,
    cta: "Choose Scale",
  },
  {
    id: "custom",
    name: "Custom",
    price: "Contact us",
    period: "quote",
    description: "Bespoke engagements, from M&A diligence to enterprise rollouts.",
    features: ["Bespoke scoping", "Team-of-teams model", "Dedicated Slack", "NDA + MSA"],
    highlighted: false,
    cta: "Contact sales",
  },
];

export default function AdminPackagesPage() {
  const [editing, setEditing] = useState<(typeof tiers)[0] | null>(null);

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            Pricing
          </p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Packages
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Manage tier names, prices, deliverables, and highlighted flags.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95">
          <HiPlus className="text-base" /> New tier
        </button>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`group bg-card-dark rounded-2xl border p-6 relative overflow-hidden ${
              tier.highlighted ? "border-amber/40 shadow-[0_0_30px_rgba(245,158,11,0.1)]" : "border-white/5 hover:border-amber/20"
            } transition-all`}
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber/5 rounded-full blur-3xl pointer-events-none" />
            {tier.highlighted && (
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-b-md bg-amber text-black text-[9px] font-bold uppercase tracking-wider">
                Featured
              </div>
            )}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/30 flex items-center justify-center">
                  <HiRectangleStack className="text-amber text-base" />
                </div>
                <button
                  onClick={() => setEditing(tier)}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-amber/15 border border-white/10 hover:border-amber/30 flex items-center justify-center text-gray-300 hover:text-amber transition-all"
                  aria-label="Edit"
                >
                  <HiPencil className="text-sm" />
                </button>
              </div>
              <p className="text-[9px] font-mono text-gray-600 mb-1">{"{{package.name}}"}</p>
              <h3 className="font-heading font-black text-2xl text-white mb-1">{tier.name}</h3>
              <p className="text-[10px] font-mono text-gray-500 mb-3">
                {"{{package.price}}"} · {"{{package.period}}"}
              </p>
              <p className="text-xs text-gray-300 leading-relaxed mb-3">{tier.description}</p>
              <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent my-3" />
              <p className="text-[9px] font-mono text-gray-500 mb-2">{"{{package.features[]}}"}</p>
              <ul className="space-y-2 mb-4">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-gray-300">
                    <HiCheck className="text-amber text-[14px] shrink-0 mt-[2px]" /> {f}
                  </li>
                ))}
                <li className="flex items-start gap-2 text-xs text-gray-500 italic">
                  <HiPlus className="text-gray-600 text-[14px] shrink-0 mt-[2px]" /> Add feature
                </li>
              </ul>
              <p className="text-[9px] font-mono text-gray-500 mb-1">{"{{package.cta}}"}</p>
              <p className="font-heading font-bold text-sm text-amber">{tier.cta}</p>
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
                    Edit Package
                  </p>
                  <h3 className="font-heading font-black text-xl text-white">{editing.name}</h3>
                </div>
                <button onClick={() => setEditing(null)} className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white">
                  <HiXMark />
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setEditing(null); }} className="space-y-3">
                <Field label="{{package.name}}" defaultValue={editing.name} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="{{package.price}}" defaultValue={editing.price} />
                  <div>
                    <p className="text-[9px] font-mono text-gray-600 mb-1 pl-1">{"{{package.period}}"}</p>
                    <select defaultValue={editing.period} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none cursor-pointer">
                      {["one-time", "starting", "monthly", "quote"].map((p) => (
                        <option key={p} value={p} className="bg-black text-white">{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Field label="{{package.description}}" defaultValue={editing.description} multiline />
                <Field label="{{package.features[]}}" defaultValue={editing.features.join("\n")} multiline />
                <Field label="{{package.cta}}" defaultValue={editing.cta} />
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
          rows={multiline ? 4 : 1}
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
