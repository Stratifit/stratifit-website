"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiPencil, HiXMark, HiPlus, HiCheck } from "react-icons/hi2";

const mockServices = [
  {
    id: "brand-design",
    name: "Brand Design",
    slug: "brand-design",
    priceType: "starting",
    priceValue: "$1,500",
    description:
      "Crafting unique identities that resonate and leave a lasting impression on your market.",
  },
  {
    id: "website-development",
    name: "Website Development",
    slug: "website-development",
    priceType: "starting",
    priceValue: "$2,500",
    description:
      "High-performance websites and web apps engineered for speed, scale, and conversion.",
  },
  {
    id: "ai-automation",
    name: "AI & Automation",
    slug: "ai-automation",
    priceType: "starting",
    priceValue: "$1,200",
    description:
      "Intelligent automation that streamlines operations and qualifies leads 24/7.",
  },
  {
    id: "growth-marketing",
    name: "Growth & Marketing",
    slug: "growth-marketing",
    priceType: "starting",
    priceValue: "$3,000",
    description:
      "Data-driven campaigns that amplify your brand and drive measurable revenue growth.",
  },
  {
    id: "buy-a-business",
    name: "Buy a Business",
    slug: "buy-a-business",
    priceType: "one-time",
    priceValue: "$9,000",
    description:
      "Acquire vetted, revenue-generating online businesses and skip the startup phase.",
  },
  {
    id: "funnel-strategy",
    name: "Funnel Strategy",
    slug: "funnel-strategy",
    priceType: "starting",
    priceValue: "$1,800",
    description:
      "Conversion-optimized funnels and CRM workflows that turn visitors into loyal customers.",
  },
];

const priceTypeOptions = ["starting", "one-time", "monthly", "custom"];

export default function AdminServicesPage() {
  const [editing, setEditing] = useState<(typeof mockServices)[number] | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            Catalog
          </p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Services
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Manage service names, pricing, and descriptions.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95">
          <HiPlus className="text-base" /> New service
        </button>
      </header>

      {/* Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockServices.map((svc, i) => (
          <motion.div
            key={svc.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="group bg-card-dark rounded-2xl border border-white/5 hover:border-amber/20 transition-all p-6 relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber/5 rounded-full blur-3xl group-hover:bg-amber/10 transition-all pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[9px] font-mono text-gray-600">
                    {/* {{service_name}} */}
                    {"{{service_name}}"}
                  </p>
                  <h3 className="font-heading font-black text-xl text-white tracking-tight mt-1">
                    {svc.name}
                  </h3>
                </div>
                <button
                  onClick={() => setEditing(svc)}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-amber/15 border border-white/10 hover:border-amber/30 flex items-center justify-center text-gray-300 hover:text-amber transition-all"
                  aria-label="Edit"
                >
                  <HiPencil className="text-sm" />
                </button>
              </div>
              <p className="text-[9px] font-mono text-gray-600 mt-3">
                {/* {{service_slug}} */}
                <span className="mr-1">{"{{service_slug}}"}</span>=<span className="text-gray-400">{svc.slug}</span>
              </p>
              <p className="text-[10px] font-mono text-gray-500 mt-3">
                {/* {{service_description}} */}
                {svc.description}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                <div>
                  <p className="text-[9px] font-mono text-gray-600">
                    {/* {{service_price_type}} */}
                    {"{{service_price_type}}"}
                  </p>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber/15 text-amber border border-amber/20 mt-1">
                    {svc.priceType}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-mono text-gray-600">
                    {/* {{service_price_value}} */}
                    {"{{service_price_value}}"}
                  </p>
                  <p className="font-heading font-black text-lg text-white mt-1">
                    {svc.priceValue}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Edit modal */}
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
                    Edit Service
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
                <Field
                  label="{{edit_service_name}}"
                  defaultValue={editing.name}
                  placeholder="Service name"
                />
                <Field
                  label="{{edit_service_description}}"
                  defaultValue={editing.description}
                  placeholder="Description"
                  multiline
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[9px] font-mono text-gray-600 mb-1 pl-1">
                      {"{{edit_service_price_type}}"}
                    </p>
                    <select
                      defaultValue={editing.priceType}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-amber/50 focus:outline-none cursor-pointer"
                    >
                      {priceTypeOptions.map((o) => (
                        <option key={o} value={o} className="bg-black text-white">
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Field
                    label="{{edit_service_price_value}}"
                    defaultValue={editing.priceValue}
                    placeholder="e.g. $1,500"
                  />
                </div>
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

function Field({
  label,
  defaultValue,
  placeholder,
  multiline,
}: {
  label: string;
  defaultValue?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="text-[9px] font-mono text-gray-600 mb-1 pl-1">{label}</p>
      {multiline ? (
        <textarea
          rows={3}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none resize-none"
        />
      ) : (
        <input
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none"
        />
      )}
    </div>
  );
}
