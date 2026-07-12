"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiPlus,
  HiMagnifyingGlass,
  HiChevronDown,
  HiArrowRight,
  HiBuildingStorefront,
  HiArrowTrendingUp,
  HiCheckCircle,
} from "react-icons/hi2";

const niches = [
  { slug: "ecommerce", name: "E-commerce", count: 8 },
  { slug: "saas", name: "SaaS", count: 6 },
  { slug: "agencies", name: "Agencies", count: 4 },
  { slug: "content", name: "Content", count: 3 },
  { slug: "marketplaces", name: "Marketplaces", count: 2 },
];

const listings = [
  { id: "linnea-couture", title: "Linnea Couture", niche: "E-commerce", price: "$84,000", mrr: "$7,100", profit: "$4,800/mo", multiplier: "17.5×", status: "available", featured: true },
  { id: "vox-ai", title: "Vox AI Voice Platform", niche: "SaaS", price: "$220,000", mrr: "$11,400", profit: "$7,200/mo", multiplier: "19.3×", status: "available", featured: true },
  { id: "rimini-store", title: "Rimini Storefront", niche: "E-commerce", price: "$65,000", mrr: "$4,200", profit: "$2,600/mo", multiplier: "25×", status: "in-review", featured: false },
  { id: "argo-saas", title: "Argo Workflow SaaS", niche: "SaaS", price: "$180,000", mrr: "$9,800", profit: "$6,300/mo", multiplier: "18.4×", status: "sold", featured: false },
  { id: "matter-studio", title: "Matter Content Studio", niche: "Content", price: "$42,000", mrr: "$3,200", profit: "$2,100/mo", multiplier: "16.7×", status: "available", featured: false },
];

const statuses = ["All", "available", "in-review", "sold", "draft"];

export default function AdminBuyBusinessPage() {
  const [niche, setNiche] = useState("all");
  const [status, setStatus] = useState(statuses[0]);
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            Content
          </p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Buy a Business
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Curate the niche tabs + business listings shown to buyers.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95">
          <HiPlus className="text-base" /> New Listing
        </button>
      </header>

      {/* Niche Tab strip */}
      <section className="bg-card-dark rounded-2xl border border-white/5 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setNiche("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              niche === "all" ? "bg-amber text-black border-amber" : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
            }`}
          >
            All ({niches.reduce((a, n) => a + n.count, 0)})
          </button>
          {niches.map((n) => (
            <button
              key={n.slug}
              onClick={() => setNiche(n.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                niche === n.slug ? "bg-amber text-black border-amber" : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
              }`}
            >
              {n.name} ({n.count})
            </button>
          ))}
        </div>
      </section>

      {/* Toolbar */}
      <section className="bg-card-dark rounded-2xl border border-white/5 p-4 flex flex-col lg:flex-row gap-3">
        <label className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings"
            className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-amber/50 focus:outline-none"
          />
        </label>
        <div className="relative lg:min-w-[200px]">
          <div className="relative">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full appearance-none bg-black border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:border-amber/50 focus:outline-none cursor-pointer">
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-black text-white">
                  {s}
                </option>
              ))}
            </select>
            <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-base" />
          </div>
        </div>
      </section>

      {/* Listings table */}
      <section className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/5">
                <th className="px-6 py-3 font-bold">Listing</th>
                <th className="px-6 py-3 font-bold hidden md:table-cell">Niche</th>
                <th className="px-6 py-3 font-bold">Asking</th>
                <th className="px-6 py-3 font-bold hidden lg:table-cell">MRR</th>
                <th className="px-6 py-3 font-bold hidden md:table-cell">Profit</th>
                <th className="px-6 py-3 font-bold hidden lg:table-cell">Multiplier</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {listings.map((l, i) => (
                <motion.tr
                  key={l.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber/15 border border-amber/30 flex items-center justify-center shrink-0">
                        <HiBuildingStorefront className="text-amber text-sm" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{l.title}</p>
                        <p className="text-[10px] font-mono text-gray-600">/{l.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-300 text-xs">{l.niche}</td>
                  <td className="px-6 py-4 font-bold text-amber font-mono text-sm">{l.price}</td>
                  <td className="px-6 py-4 hidden lg:table-cell text-gray-300 text-xs font-mono">{l.mrr}</td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-300 text-xs font-mono">{l.profit}</td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 inline-flex items-center gap-1">                        <HiArrowTrendingUp className="text-[10px]" /> {l.multiplier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                      l.status === "available" ? "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20"
                        : l.status === "sold" ? "bg-white/5 text-gray-400 border border-white/10"
                        : l.status === "in-review" ? "bg-amber/15 text-amber border border-amber/20"
                        : "bg-white/5 text-gray-400 border border-white/10"
                    }`}>
                      {l.status === "available" && <HiCheckCircle className="text-[10px]" />}
                      {l.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/buy-business/${l.id}`}
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
