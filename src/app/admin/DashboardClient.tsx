"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiUsers, HiEnvelope, HiSparkles, HiBriefcase, HiNewspaper,
  HiShoppingBag, HiChatBubbleLeftRight, HiClock, HiArrowUpRight,
  HiArrowRight,
} from "react-icons/hi2";

export interface UpcomingFollowup {
  id: string;
  lead_id: string;
  lead_name: string;
  lead_email: string;
  topic: string;
  status: string;
  scheduled_for: string;
}

interface LeadCounts {
  total: number;
  newCount: number;
  scheduledFollowupsThisWeek: number;
}

const trafficBars = [
  { day: "Mon", v: 62 }, { day: "Tue", v: 78 }, { day: "Wed", v: 54 },
  { day: "Thu", v: 88 }, { day: "Fri", v: 71 }, { day: "Sat", v: 41 }, { day: "Sun", v: 49 },
];
// Activity feed is hard-coded for now (no `activity_log` Supabase table yet).
// When the real audit log lands, swap this array for the Supabase query result.
const activity = [
  { id: "A-1", user: "admin@stratifit.com", verb: "published", target: '"How to Scale AI"', when: "2h ago", type: "publish" },
  { id: "A-2", user: "lead-bot", verb: "captured", target: "new lead from Coming-soon Notify form", when: "3h ago", type: "lead" },
  { id: "A-3", user: "system", verb: "synced Stripe payment data", target: "", when: "5h ago", type: "sync" },
  { id: "A-4", user: "admin@stratifit.com", verb: "edited", target: "Website Development pricing", when: "1d ago", type: "edit" },
  { id: "A-5", user: "lead-bot", verb: "replied to a lead via Resend", target: "", when: "2d ago", type: "email" },
];
const topServices = [
  { name: "Brand Design", count: 18, share: 0.42 },
  { name: "AI & Automation", count: 14, share: 0.32 },
  { name: "Website Development", count: 9, share: 0.21 },
  { name: "Growth Marketing", count: 6, share: 0.14 },
];

export function DashboardClient({ upcomingFollowups, leadCounts }: { upcomingFollowups: UpcomingFollowup[]; leadCounts: LeadCounts }) {
  const maxBar = Math.max(...trafficBars.map((b) => b.v));

  // TODO(admin): wire Subscriptions / Insights / Buy-a-Business / Testimonials tiles
  // to live Supabase counts. Currently they show static illustrative numbers.
  const tiles = [
    { key: "leads", label: "Leads \u00b7 This Month", value: String(leadCounts.total), delta: leadCounts.newCount > 0 ? `+${leadCounts.newCount} new` : "\u2014", href: "/admin/leads", accent: "amber" as const, icon: HiUsers },
    { key: "subs", label: "Subscriptions", value: "248", delta: "+18 wk", href: "/admin/subscriptions", accent: "amber" as const, icon: HiEnvelope },
    { key: "services", label: "Active Services", value: "6", delta: "All live", href: "/admin/services", accent: "amber" as const, icon: HiSparkles },
    { key: "portfolio", label: "Case Studies", value: "8", delta: "+1 mo", href: "/admin/portfolio", accent: "amber" as const, icon: HiBriefcase },
    { key: "insights", label: "Insights Published", value: "14", delta: "+2 wk", href: "/admin/insights", accent: "amber" as const, icon: HiNewspaper },
    { key: "buy", label: "Buy-a-Business \u00b7 Listings", value: "23", delta: "+5 mo", href: "/admin/buy-business", accent: "amber" as const, icon: HiShoppingBag },
    { key: "testimonials", label: "Testimonials", value: "32", delta: "+4 mo", href: "/admin/testimonials", accent: "amber" as const, icon: HiChatBubbleLeftRight },
    { key: "followups", label: "Follow-ups This Week", value: String(leadCounts.scheduledFollowupsThisWeek), delta: "via cron", href: "/admin/leads", accent: "amber" as const, icon: HiClock },
  ];

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">Overview</p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-2 max-w-lg">Manage leads, content, services, packages, team, and site configuration.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Connected \u00b7 stubbed session
        </div>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((tile, i) => {
          const Icon = tile.icon;
          return (
            <motion.div key={tile.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link href={tile.href} className="group relative block bg-card-dark rounded-2xl p-5 border border-white/5 hover:border-amber/20 transition-all overflow-hidden">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber/5 rounded-full blur-3xl group-hover:bg-amber/10 transition-all pointer-events-none" />
                <div className="relative z-10 flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <Icon className="text-amber text-base drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
                  </div>
                  <HiArrowUpRight className="text-gray-500 group-hover:text-amber group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-base" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-heading font-black text-2xl text-white tracking-tight">{tile.value}</h3>
                  <p className="text-[11px] text-gray-400 mt-1 truncate">{tile.label}</p>
                  <p className="text-[10px] text-emerald-400 mt-2 font-medium">{tile.delta}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </section>

      <section className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card-dark rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading font-bold text-base text-white">Weekly Activity</h2>
              <p className="text-xs text-gray-400 mt-0.5">Visitors &amp; leads \u00b7 last 7 days</p>
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
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber opacity-0 group-hover:opacity-100 transition-opacity">{bar.v}</span>
                  </motion.div>
                </div>
                <span className="text-[10px] text-gray-500 font-mono uppercase">{bar.day}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[10px] font-mono text-gray-600">Per-day values bound to &#123;&#123;stat_<em>day</em>&#125;&#125; \u2014 replace with analytics query.</p>
        </div>

        {/* Activity feed */}
        <div className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <HiClock className="text-amber" /> Recent Activity
              </h2>
            </div>
            <Link
              href="/admin/activity"
              className="text-xs text-amber font-bold flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <HiArrowRight className="text-sm" />
            </Link>
          </div>
          <ul className="divide-y divide-white/5 max-h-96 overflow-y-auto">
            {activity.map((a) => (
              <li key={a.id} className="px-5 py-3.5">
                <p className="text-[12px] text-white mt-1 leading-snug">
                  {a.user} <span className="text-gray-400">{a.verb}</span>{" "}
                  {a.target && <span className="text-gray-200">{a.target}</span>}
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
              <p className="text-[10px] text-gray-500 mt-0.5">
                Lead services \u00b7 count (static demo)
              </p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs text-amber font-bold flex items-center gap-1 hover:gap-2 transition-all"
            >
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
            <p className="text-[10px] text-gray-500 mt-0.5">
              Live timestamp \u00b7 read from lead_followups.scheduled_for
            </p>
          </div>
          <ul className="divide-y divide-white/5">
            {upcomingFollowups.length === 0 ? (
              <li className="px-6 py-10 text-center text-sm text-gray-500">
                No follow-ups scheduled yet. Open a lead and tap{" "}
                <span className="text-amber font-bold">+ Schedule follow-up</span>{" "}
                to queue one.
              </li>
            ) : (
              upcomingFollowups.map((f) => (
                <li key={f.id} className="px-6 py-4">
                  <p className="text-sm text-white font-bold mt-1">{f.topic}</p>
                  <p className="text-xs text-gray-400">
                    {f.lead_name}
                    {f.lead_email && (
                      <span className="font-mono text-[10px] text-gray-600 ml-2">
                        {f.lead_email}
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-amber mt-2 font-medium">
                    {formatDateTime(f.scheduled_for)}
                  </p>
                  <span className="inline-block mt-1 text-[10px] uppercase tracking-wider text-gray-500 border border-white/10 rounded px-1.5 py-0.5">
                    {f.status}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      {/* Recent activity feed sits in the section above; this closes the outer wrapper. */}
    </div>
  );
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const diff = d.getTime() - Date.now();
  const min = Math.round(diff / 60000);
  if (Math.abs(min) < 60) {
    return min >= 0 ? `in ${min}m` : `${-min}m ago`;
  }
  const hr = Math.round(min / 60);
  if (Math.abs(hr) < 24) {
    return hr >= 0
      ? `in ${hr}h \u00b7 ${d.toLocaleString("en-US", { weekday: "short", hour: "2-digit", minute: "2-digit" })}`
      : d.toLocaleString("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
