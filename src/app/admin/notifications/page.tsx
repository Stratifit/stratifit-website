"use client";

import { useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import {
  HiBell,
  HiCheck,
  HiUserGroup,
  HiEnvelope,
  HiCurrencyDollar,
  HiChatBubbleLeftRight,
  HiSparkles,
  HiExclamationCircle,
} from "react-icons/hi2";

const notifications = [
  { id: "n-1", title: "New lead captured", body: "Sample Lead submitted \"Brand Design\" project ($3-5K budget).", time: "5m ago", unread: true, type: "lead", cta: { label: "Open lead", href: "/admin/leads/SAMPLE-1" } },
  { id: "n-2", title: "Payment received", body: "Subscription renewed — net +34 subscribers this week.", time: "32m ago", unread: true, type: "billing", cta: { label: "View subscriptions", href: "/admin/subscriptions" } },
  { id: "n-3", title: "AI chatbot escalated", body: "Sample user couldn't resolve — needs human review.", time: "1h ago", unread: true, type: "chat", cta: { label: "Open thread", href: "/admin/leads/SAMPLE-2" } },
  { id: "n-4", title: "Insight draft needs review", body: "Mira saved \"Design Systems That Convert\" as draft.", time: "3h ago", unread: false, type: "content", cta: { label: "Review draft", href: "/admin/insights" } },
  { id: "n-5", title: "Supabase sync completed", body: "Stripe payment data mirrored to read-only DB.", time: "6h ago", unread: false, type: "system" },
  { id: "n-6", title: "New testimonial suggested", body: "Linnea Couture left 5★ feedback. Ready to publish?", time: "1d ago", unread: false, type: "content", cta: { label: "Review", href: "/admin/testimonials" } },
];

const typeIcon: Record<string, ComponentType<{ className?: string }>> = {
  lead: HiUserGroup,
  billing: HiCurrencyDollar,
  chat: HiChatBubbleLeftRight,
  content: HiSparkles,
  system: HiBell,
};

const typeColor: Record<string, string> = {
  lead: "text-amber border-amber/20 bg-amber/15",
  billing: "text-emerald-300 border-emerald-400/20 bg-emerald-400/10",
  chat: "text-amber border-amber/20 bg-amber/15",
  content: "text-amber border-amber/20 bg-amber/15",
  system: "text-gray-400 border-white/10 bg-white/5",
};

const allFilters = ["all", "unread", "lead", "billing", "chat", "content", "system"];

export default function AdminNotificationsPage() {
  const [filter, setFilter] = useState<string>("all");
  const [filterList, setFilterList] = useState(notifications);
  const filtered =
    filter === "all"
      ? filterList
      : filter === "unread"
      ? filterList.filter((n) => n.unread)
      : filterList.filter((n) => n.type === filter);

  const markAllRead = () => setFilterList((l) => l.map((n) => ({ ...n, unread: false })));

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            Inbox
          </p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Notifications
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Capture every lead, payment, escalation, and content suggestion.
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-bold rounded-xl transition-all"
        >
          <HiCheck className="text-sm" /> Mark all read
        </button>
      </header>

      <div className="flex flex-wrap gap-2">
        {allFilters.map((t) => (
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

      <section className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
        {filtered.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-gray-500">No notifications match this filter.</div>
        )}
        {filtered.map((n, i) => {
          const Icon = typeIcon[n.type] ?? HiBell;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`px-6 py-4 flex items-start gap-4 transition-colors ${
                n.unread ? "bg-amber/[0.03]" : "hover:bg-white/[0.02]"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${typeColor[n.type]}`}>
                <Icon className="text-base" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  {n.title}
                  {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />}
                </p>
                <p className="text-sm text-gray-400 mt-1">{n.body}</p>
                <p className="text-[10px] text-gray-500 mt-1 font-mono">{n.time}</p>
              </div>
              {n.cta && (
                <a
                  href={n.cta.href}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber hover:gap-2 transition-all px-3 py-1.5 rounded-lg border border-amber/30 hover:bg-amber/10"
                >
                  {n.cta.label}
                </a>
              )}
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}
