"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiClock,
  HiUserGroup,
  HiPencil,
  HiEnvelope,
  HiCurrencyDollar,
  HiCheckCircle,
} from "react-icons/hi2";

const events = [
  { id: "e-1", ts: "2026-07-10 · 14:32", actor: "admin@stratifit.com", verb: "published", target: "{{insight.title}} \"How to Scale AI\"", type: "publish" },
  { id: "e-2", ts: "2026-07-10 · 13:48", actor: "lead-bot", verb: "captured", target: "new lead · SAMPLE-{{lead.id}}", type: "lead" },
  { id: "e-3", ts: "2026-07-10 · 12:15", actor: "system", verb: "synced {{supabase.sync_stripe}}", target: "payment data", type: "sync" },
  { id: "e-4", ts: "2026-07-10 · 11:02", actor: "admin@stratifit.com", verb: "edited", target: "{{service.name}} Website Development pricing", type: "edit" },
  { id: "e-5", ts: "2026-07-10 · 09:48", actor: "lead-bot", verb: "sent {{email.subject}}", target: "via Resend", type: "email" },
  { id: "e-6", ts: "2026-07-09 · 22:11", actor: "v.bidder@linnea.co", verb: "submitted bid on", target: "{{listing.title}} Linnea Couture", type: "bid" },
  { id: "e-7", ts: "2026-07-09 · 19:05", actor: "mira@stratifit.com", verb: "added testimonial", target: "from Linnea Couture", type: "edit" },
  { id: "e-8", ts: "2026-07-09 · 17:42", actor: "system", verb: "auto-renewed subscription", target: "{{subscription.email}}", type: "billing" },
  { id: "e-9", ts: "2026-07-09 · 14:30", actor: "theo@stratifit.com", verb: "joined team", target: "as Viewer", type: "team" },
  { id: "e-10", ts: "2026-07-09 · 09:00", actor: "admin@stratifit.com", verb: "updated", target: "{{settings.password}} policy", type: "edit" },
];

const types = ["all", "publish", "lead", "edit", "email", "sync", "bid", "billing", "team"];

const typeIcon: Record<string, any> = {
  publish: HiCheckCircle,
  lead: HiUserGroup,
  edit: HiPencil,
  email: HiEnvelope,
  sync: HiClock,
  bid: HiCurrencyDollar,
  billing: HiCurrencyDollar,
  team: HiUserGroup,
};

const typeColor: Record<string, string> = {
  publish: "text-emerald-300 border-emerald-400/20 bg-emerald-400/10",
  lead: "text-amber border-amber/20 bg-amber/15",
  edit: "text-gray-300 border-white/10 bg-white/5",
  email: "text-gray-300 border-white/10 bg-white/5",
  sync: "text-gray-300 border-white/10 bg-white/5",
  bid: "text-amber border-amber/20 bg-amber/15",
  billing: "text-emerald-300 border-emerald-400/20 bg-emerald-400/10",
  team: "text-gray-400 border-white/10 bg-white/5",
};

export default function AdminActivityPage() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? events : events.filter((e) => e.type === filter);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
          System
        </p>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
          Activity
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Audit log of every meaningful event on the site.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all capitalize ${
              filter === t ? "bg-amber text-black border-amber" : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <section className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <p className="text-[10px] font-mono text-gray-500">
            {"{{activity_log_timestamp}} · {{activity_log_actor}} · {{activity_log_message}}"}
          </p>
        </div>
        <ul className="divide-y divide-white/5">
          {filtered.map((e, i) => {
            const Icon = typeIcon[e.type] ?? HiClock;
            return (
              <motion.li
                key={e.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="px-6 py-4 flex items-start gap-4"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${typeColor[e.type]}`}>
                  <Icon className="text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    <span className="font-mono text-[10px] text-amber mr-2">
                      {"{{activity_log_actor}}"}
                    </span>
                    <span className="font-bold">{e.actor}</span>{" "}
                    <span className="text-gray-400">{e.verb}</span>{" "}
                    <span className="text-gray-200">{e.target}</span>
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 font-mono">
                    {"{{activity_log_timestamp}}"} · {e.ts}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize border ${typeColor[e.type]}`}>
                  {e.type}
                </span>
              </motion.li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
