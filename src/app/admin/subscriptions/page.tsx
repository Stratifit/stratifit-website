"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HiArrowRight, HiMagnifyingGlass, HiChevronDown } from "react-icons/hi2";

const mockSubs = [
  {
    id: "SUB-1",
    email: "visitor1@example.com",
    reason: "Coming-soon · Notify Me",
    created: "2026-07-09 · 18:22",
  },
  {
    id: "SUB-2",
    email: "visitor2@example.com",
    reason: "Coming-soon · Notify Me",
    created: "2026-07-09 · 11:48",
  },
  {
    id: "SUB-3",
    email: "visitor3@example.com",
    reason: "Contact Modal",
    created: "2026-07-08 · 21:05",
  },
  {
    id: "SUB-4",
    email: "visitor4@example.com",
    reason: "Newsletter",
    created: "2026-07-07 · 09:14",
  },
];

const reasons = ["All reasons", "Coming-soon · Notify Me", "Contact Modal", "Newsletter"];

export default function AdminSubscriptionsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
          Subscribers
        </p>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
          Subscriptions
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          All collected emails and their subscription reasons.
        </p>
      </header>

      {/* Toolbar */}
      <section className="bg-card-dark rounded-2xl border border-white/5 p-4 flex flex-col lg:flex-row gap-3">
        <label className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none" />
          <input
            placeholder="Search by email"
            className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-amber/50 focus:outline-none"
          />
        </label>
        <div className="relative lg:min-w-[240px]">
          <p className="text-[9px] font-mono text-gray-600 mb-0.5 pl-1">
            {/* {{subscription_reason}} */}
            {"{{subscription_reason}}"}
          </p>
          <div className="relative">
            <select
              defaultValue={reasons[0]}
              className="w-full appearance-none bg-black border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:border-amber/50 focus:outline-none cursor-pointer"
            >
              {reasons.map((r) => (
                <option key={r} className="bg-black text-white">
                  {r}
                </option>
              ))}
            </select>
            <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-base" />
          </div>
        </div>
        <button className="px-6 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all text-xs shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95 inline-flex items-center justify-center gap-2">
          Export CSV <HiArrowRight className="text-sm" />
        </button>
      </section>

      {/* Table */}
      <section className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <p className="text-[10px] font-mono text-gray-500">
            {/* {{subscription_email}} · {{subscription_reason}} · {{subscription_created_at}} */}
            {`{{subscription_email}} · {{subscription_reason}} · {{subscription_created_at}}`}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/5">
                <th className="px-6 py-3 font-bold">Email</th>
                <th className="px-6 py-3 font-bold">Reason</th>
                <th className="px-6 py-3 font-bold hidden md:table-cell">Created</th>
                <th className="px-6 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockSubs.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 text-white font-medium font-mono text-xs">
                    {s.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                      {s.reason}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-400 text-xs font-mono">
                    {s.created}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/leads/${s.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber hover:gap-2 transition-all"
                    >
                      View <HiArrowRight className="text-sm" />
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
