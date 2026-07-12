"use client";

import { motion } from "framer-motion";
import {
  HiArrowTrendingUp,
  HiArrowTrendingDown,
  HiUserGroup,
  HiClock,
} from "react-icons/hi2";

const kpis = [
  { label: "Pageviews · 7d", value: "1,842", delta: "+22%", positive: true, placeholder: "analytics.pageviews" },
  { label: "Unique visitors · 7d", value: "642", delta: "+9%", positive: true, placeholder: "analytics.visitors" },
  { label: "Bounce rate", value: "31.4%", delta: "−4%", positive: true, placeholder: "analytics.bounce" },
  { label: "Avg. session", value: "3m 12s", delta: "+18s", positive: true, placeholder: "analytics.session" },
];

const weeklyVisitors = [
  { day: "Mon", views: 220 },
  { day: "Tue", views: 295 },
  { day: "Wed", views: 198 },
  { day: "Thu", views: 340 },
  { day: "Fri", views: 268 },
  { day: "Sat", views: 156 },
  { day: "Sun", views: 365 },
];

const sources = [
  { name: "Organic search", value: 54, color: "bg-amber" },
  { name: "Direct", value: 22, color: "bg-amber/70" },
  { name: "Referral", value: 14, color: "bg-amber/40" },
  { name: "Social", value: 7, color: "bg-white/30" },
  { name: "Email", value: 3, color: "bg-white/10" },
];

const topPages = [
  { path: "/", views: 712, rate: "+12%" },
  { path: "/services", views: 384, rate: "+8%" },
  { path: "/insights/how-to-scale-ai-2026", views: 218, rate: "+34%" },
  { path: "/portfolio/vox-ai-platform", views: 162, rate: "+18%" },
  { path: "/contact", views: 124, rate: "+6%" },
];

export default function AdminAnalyticsPage() {
  const maxViews = Math.max(...weeklyVisitors.map((v) => v.views));

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
          System
        </p>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
          Analytics
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Traffic, sources, and top-performing pages.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-5"
          >
            <p className="text-[9px] font-mono text-gray-500 mb-1">{k.placeholder}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{k.label}</p>
            <p className="font-heading font-black text-3xl text-white">{k.value}</p>
            <p className={`mt-1 text-[11px] font-medium inline-flex items-center gap-1 ${k.positive ? "text-emerald-400" : "text-red-400"}`}>
              {k.positive ? <HiArrowTrendingUp className="text-[12px]" /> : <HiArrowTrendingDown className="text-[12px]" />}
              {k.delta}
            </p>
          </motion.div>
        ))}
      </section>

      <section className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card-dark rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-mono text-gray-500 mb-1">
                analytics.visitors_by_day
              </p>
              <h2 className="font-heading font-bold text-base text-white">
                Weekly Visitors
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Unique visitors · last 7 days</p>
            </div>
            <span className="text-[10px] font-mono text-amber font-bold">+22% wk</span>
          </div>
          <div className="flex items-end gap-3 h-44 px-1">
            {weeklyVisitors.map((v, i) => (
              <div key={v.day} className="flex-1 flex flex-col items-center gap-2 h-full">
                <div className="w-full flex-1 flex items-end relative">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(v.views / maxViews) * 100}%` }}
                    transition={{ delay: i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full rounded-t-md bg-gradient-to-t from-amber/40 to-amber shadow-[0_0_15px_rgba(245,158,11,0.3)] relative group"
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber opacity-0 group-hover:opacity-100 transition-opacity">
                      {v.views}
                    </span>
                  </motion.div>
                </div>
                <span className="text-[10px] text-gray-500 font-mono uppercase">{v.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card-dark rounded-2xl border border-white/5 p-6">
          <p className="text-[10px] font-mono text-gray-500 mb-1">
            analytics.traffic_sources
          </p>
          <h2 className="font-heading font-bold text-base text-white mb-4">Traffic Sources</h2>
          <div className="space-y-3">
            {sources.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">{s.name}</span>
                  <span className="text-gray-400 font-mono">{s.value}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.value}%` }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full ${s.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <p className="text-[10px] font-mono text-gray-500">
            analytics.top_pages — ranked by total views · 7d
          </p>
        </div>
        <ul className="divide-y divide-white/5">
          {topPages.map((p, i) => (
            <li key={p.path} className="px-6 py-4 flex items-center gap-4">
              <span className="text-[10px] font-mono text-gray-500 w-6">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono text-white truncate">{p.path}</p>
              </div>
              <span className="text-[10px] font-mono text-gray-500 hidden md:inline">analytics.duration · 4m 02s</span>
              <span className="text-xs text-gray-300 font-bold w-16 text-right">{p.views}</span>
              <span className="text-[10px] font-mono text-emerald-400 w-12 text-right">{p.rate}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
