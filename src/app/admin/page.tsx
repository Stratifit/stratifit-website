"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiUsers,
  HiEnvelope,
  HiSparkles,
  HiBriefcase,
  HiNewspaper,
  HiChatBubbleLeftRight,
  HiShoppingBag,
  HiClock,
  HiArrowUpRight,
  HiArrowRight,
  HiArrowTrendingUp,
} from "react-icons/hi2";

/* ------------------------------------------------------------------ */
/*  Mock data — aligned with real site data shapes                     */
/* ------------------------------------------------------------------ */
const tiles = [
  { key: "leads", label: "Leads · This Month", value: "12", delta: "+3 wk", href: "/admin/leads", placeholder: "{{nav_leads}}", accent: "amber" as const, icon: HiUsers },
  { key: "subs", label: "Subscriptions", value: "248", delta: "+18 wk", href: "/admin/subscriptions", placeholder: "{{nav_subscriptions}}", accent: "amber" as const, icon: HiEnvelope },
  { key: "services", label: "Active Services", value: "6", delta: "All live", href: "/admin/services", placeholder: "{{nav_services}}", accent: "amber" as const, icon: HiSparkles },
  { key: "portfolio", label: "Case Studies", value: "8", delta: "+1 mo", href: "/admin/portfolio", placeholder: "{{nav_portfolio}}", accent: "amber" as const, icon: HiBriefcase },
  { key: "insights", label: "Insights Published", value: "14", delta: "+2 wk", href: "/admin/insights", placeholder: "{{nav_insights}}", accent: "amber" as const, icon: HiNewspaper },
  { key: "buy", label: "Buy-a-Business · Listings", value: "23", delta: "+5 mo", href: "/admin/buy-business", placeholder: "{{nav_buy_business}}", accent: "amber" as const, icon: HiShoppingBag },
  { key: "testimonials", label: "Testimonials", value: "32", delta: "+4 mo", href: "/admin/testimonials", placeholder: "{{nav_testimonials}}", accent: "amber" as const, icon: HiChatBubbleLeftRight },
  { key: "analytics", label: "Visitors · Last 7 days", value: "1,842", delta: "+22%", href: "/admin/analytics", placeholder: "{{nav_analytics}}", accent: "amber" as const, icon: HiArrowTrendingUp },
];

const trafficBars = [
  { day: "Mon", v: 62 },
  { day: "Tue", v: 78 },
  { day: "Wed", v: 54 },
  { day: "Thu", v: 88 },
  { day: "Fri", v: 71 },
  { day: "Sat", v: 41 },
  { day: "Sun", v: 49 },
];

const activity = [
  { id: "A-1", user: "admin@stratifit.com", verb: "published", target: "{{insight.title}} \"How to Scale AI\"", when: "2h ago", type: "publish" },
  { id: "A-2", user: "lead-bot", verb: "captured", target: "new lead from Coming-soon Notify form", when: "3h ago", type: "lead" },
  { id: "A-3", user: "system", verb: "synced", target: "{{supabase.sync_stripe}} payment data", when: "5h ago", type: "sync" },
  { id: "A-4", user: "admin@stratifit.com", verb: "edited", target: "{{service.name}} Website Development pricing", when: "1d ago", type: "edit" },
  { id: "A-5", user: "lead-bot", verb: "replied", target: "lead via Resend {{email.subject}}", when: "2d ago", type: "email" },
];

const topServices = [
  { name: "Brand Design", count: 18, share: 0.42 },
  { name: "AI & Automation", count: 14, share: 0.32 },
  { name: "Website Development", count: 9, share: 0.21 },
  { name: "Growth Marketing", count: 6, share: 0.14 },
];

export default function AdminDashboardPage() {
  const maxBar = Math.max(...trafficBars.map((b) => b.v));

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            Overview
          </p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-lg">
            Manage leads, content, services, packages, team, and site configuration.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Connected · stubbed session
        </div>
      </header>

      {/* Tiles — 4×2 grid on lg */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((tile, i) => {
          const Icon = tile.icon;
          return (
            <motion.div
              key={tile.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={tile.href}
                className="group relative block bg-card-dark rounded-2xl p-5 border border-white/5 hover:border-amber/20 transition-all overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber/5 rounded-full blur-3xl group-hover:bg-amber/10 transition-all pointer-events-none" />
                <div className="relative z-10 flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <Icon className="text-amber text-base drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
                  </div>
                  <HiArrowUpRight className="text-gray-500 group-hover:text-amber group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-base" />
                </div>
                <div className="relative z-10">
                  <p className="text-[9px] font-mono text-gray-500 mb-1">{tile.placeholder}</p>
                  <h3 className="font-heading font-black text-2xl text-white tracking-tight">
                    {tile.value}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1 truncate">{tile.label}</p>
                  <p className="text-[10px] text-emerald-400 mt-2 font-medium">{tile.delta}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </section>

      {/* Two-column: weekly traffic + activity */}
      <section className="grid lg:grid-cols-3 gap-5">
        {/* Traffic card */}
        <div className="lg:col-span-2 bg-card-dark rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-mono text-gray-500 mb-1">
                {"{{stat_leads_7d}}"}
              </p>
              <h2 className="font-heading font-bold text-base text-white">
                Weekly Activity
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Visitors & leads · last 7 days</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-gray-600">total</p>
              <p className="font-heading font-black text-2xl text-white">1,842</p>
            </div>
          </div>
          <div className="flex items-end gap-3 h-44 px-1">
            {trafficBars.map((bar, i) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full">
                <div className="w-full flex-1 flex items-end relative">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(bar.v / maxBar) * 100}%` }}
                    transition={{ delay: i * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full rounded-t-md bg-gradient-to-t from-amber/40 to-amber shadow-[0_0_15px_rgba(245,158,11,0.3)] relative group"
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber opacity-0 group-hover:opacity-100 transition-opacity">
                      {bar.v}
                    </span>
                  </motion.div>
                </div>
                <span className="text-[10px] text-gray-500 font-mono uppercase">{bar.day}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[10px] font-mono text-gray-600">
            Per-day values bound to &#123;&#123;stat_<em>day</em>&#125;&#125; — replace with analytics query.
          </p>
        </div>

        {/* Activity feed */}
        <div className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <HiClock className="text-amber" /> Recent Activity
              </h2>
              <p className="text-[10px] font-mono text-gray-500 mt-0.5">
                {"{{activity_log}}"}
              </p>
            </div>
            <Link href="/admin/activity" className="text-xs text-amber font-bold flex items-center gap-1 hover:gap-2 transition-all">
              View all <HiArrowRight className="text-sm" />
            </Link>
          </div>
          <ul className="divide-y divide-white/5 max-h-96 overflow-y-auto">
            {activity.map((a) => (
              <li key={a.id} className="px-5 py-3.5">
                <p className="text-[10px] font-mono text-gray-600">
                  {/* {"{{activity_log_timestamp}}"} */}
                </p>
                <p className="text-[12px] text-white mt-1 leading-snug">
                  <span className="font-mono text-[10px] text-amber mr-1">
                    {"{{activity_user}}"}
                  </span>
                  {a.user}{" "}
                  <span className="text-gray-400">{a.verb}</span>{" "}
                  <span className="text-gray-200">{a.target}</span>
                </p>
                <p className="text-[10px] text-gray-500 mt-1">{a.when}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bottom: Top services + Upcoming follow-ups */}
      <section className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-white">
                Top Services
              </h2>
              <p className="text-[10px] font-mono text-gray-500 mt-0.5">
                {"{{lead_service}} · count"}
              </p>
            </div>
            <Link href="/admin/leads" className="text-xs text-amber font-bold flex items-center gap-1 hover:gap-2 transition-all">
              More <HiArrowRight className="text-sm" />
            </Link>
          </div>
          <ul className="p-5 space-y-3">
            {topServices.map((svc) => (
              <li key={svc.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white font-medium">{svc.name}</span>
                  <span className="text-[10px] font-mono text-gray-500">
                    {svc.count} leads
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${svc.share * 100}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-amber"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <HiClock className="text-amber" /> Upcoming Follow-ups
            </h2>
            <p className="text-[10px] font-mono text-gray-500 mt-0.5">
              {"{{followup_scheduled_for}}"}
            </p>
          </div>
          <ul className="divide-y divide-white/5">
            {[
              { id: "F-1", when: "Today, 3:00 PM", lead: "Sample Lead", topic: "Discovery call" },
              { id: "F-2", when: "Tomorrow, 10:30 AM", lead: "Sample Lead", topic: "Proposal review" },
              { id: "F-3", when: "Thu, 2:00 PM", lead: "Sample Lead", topic: "Contract sign" },
              { id: "F-4", when: "Fri, 11:00 AM", lead: "Sample Lead", topic: "Demo walk-through" },
            ].map((f) => (
              <li key={f.id} className="px-6 py-4">
                <p className="text-[10px] font-mono text-gray-600">
                  {"{{followup_status}}"}
                </p>
                <p className="text-sm text-white font-bold mt-1">{f.topic}</p>
                <p className="text-xs text-gray-400">
                  <span className="font-mono text-[10px] text-gray-600 mr-2">
                    {"{{lead_name}}"}
                  </span>
                  {f.lead}
                </p>
                <p className="text-[10px] text-amber mt-2 font-medium">{f.when}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
