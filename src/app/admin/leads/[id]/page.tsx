"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiArrowLeft,
  HiEnvelope,
  HiClock,
  HiCheckCircle,
  HiXMark,
  HiPaperAirplane,
} from "react-icons/hi2";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
const messages = [
  {
    id: "M-1",
    role: "user" as const,
    content:
      "Looking to redesign our SaaS brand. We have 2 weeks before launch.",
    ts: "2026-07-09 · 14:32",
  },
  {
    id: "M-2",
    role: "bot" as const,
    content:
      "Got it — what’s your ideal budget range for the engagement?",
    ts: "2026-07-09 · 14:32",
  },
  {
    id: "M-3",
    role: "user" as const,
    content: "Between $3-5K, all-in. Happy to share our current deck.",
    ts: "2026-07-09 · 14:34",
  },
];

const followups = [
  { id: "F-1", status: "scheduled", scheduledFor: "2026-07-11 · 15:00", topic: "Discovery call" },
  { id: "F-2", status: "completed", scheduledFor: "2026-07-08 · 10:30", topic: "Initial scoping" },
  { id: "F-3", status: "drafted", scheduledFor: "—", topic: "Send proposal draft" },
];

const statuses = ["new", "qualified", "in-review", "won", "lost"];

export default function AdminLeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [status, setStatus] = useState("qualified");
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-amber transition-colors"
      >
        <HiArrowLeft /> Back to Leads
      </Link>

      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            Lead Detail
          </p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Sample Lead
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            {/* {{lead_email}} */}
            <span className="font-mono text-[10px] text-gray-600 mr-2">
              {"{{lead_email}}"}
            </span>
            lead@example.com
          </p>
          <p className="text-[10px] font-mono text-gray-600 mt-1">
            id: {params.id}
          </p>
        </div>

        {/* Status dropdown */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[9px] font-mono text-gray-600">
              {/* {{status_dropdown}} */}
              {"{{status_dropdown}}"}
            </p>
          </div>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none bg-black border border-amber/30 rounded-xl pl-4 pr-10 py-2.5 text-sm text-amber font-bold focus:outline-none focus:border-amber cursor-pointer"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-black text-white">
                  {s}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber pointer-events-none text-xs">
              ▼
            </span>
          </div>
          <button
            onClick={() => setEmailModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all active:scale-95 text-xs shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            <HiPaperAirplane className="text-sm rotate-90" /> Send Email
          </button>
        </div>
      </header>

      {/* Two-column layout: messages + follow-ups */}
      <section className="grid lg:grid-cols-3 gap-6">
        {/* Messages */}
        <div className="lg:col-span-2 bg-card-dark rounded-2xl border border-white/5">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-white">
                Messages
              </h2>
              <p className="text-[10px] font-mono text-gray-500 mt-0.5">
                {/* {{message_list}} */}
                {"{{message_list}}"}
              </p>
            </div>
            <span className="text-[10px] text-gray-500">{messages.length} messages</span>
          </div>
          <ul className="p-6 space-y-4">
            {messages.map((m) => (
              <motion.li
                key={m.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user"
                      ? "bg-amber/15 border border-amber/20 text-white"
                      : "bg-black border border-white/10 text-gray-300"
                  }`}
                >
                  <p className="text-[9px] font-mono text-gray-500 mb-1">
                    {/* {{message_role}} · {{message_timestamp}} */}
                    {`{{message_role}}="${m.role}" · {{message_timestamp}}`}
                  </p>
                  <p className="leading-relaxed">
                    {/* {{message_content}} */}
                    {m.content}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Follow-ups */}
        <div className="bg-card-dark rounded-2xl border border-white/5">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <HiClock className="text-amber" /> Follow-ups
            </h2>
            <p className="text-[10px] font-mono text-gray-500 mt-0.5">
              {/* {{followup_list}} */}
              {"{{followup_list}}"}
            </p>
          </div>
          <ul className="divide-y divide-white/5">
            {followups.map((f) => (
              <li key={f.id} className="px-6 py-4 flex items-start gap-3">
                <div className="mt-0.5">
                  {f.status === "completed" ? (
                    <HiCheckCircle className="text-emerald-400 text-base" />
                  ) : f.status === "scheduled" ? (
                    <HiClock className="text-amber text-base" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-white/20 block" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-mono text-gray-600">
                    {/* {{followup_status}} */}
                    {`{{followup_status}}="${f.status}"`}
                  </p>
                  <p className="text-sm font-bold text-white mt-1">{f.topic}</p>
                  <p className="text-xs text-gray-400">
                    {/* {{followup_scheduled_for}} */}
                    <span className="font-mono text-[9px] text-gray-600 mr-1">
                      {"{{followup_scheduled_for}}"}
                    </span>
                    {f.scheduledFor}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-6 py-4 border-t border-white/5">
            <button className="w-full px-4 py-2.5 border border-amber/30 text-amber font-bold text-xs rounded-xl hover:bg-amber/10 transition-all">
              + Schedule follow-up
            </button>
          </div>
        </div>
      </section>

      {/* Manual email modal */}
      {emailModalOpen && (
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
                    {/* {{manual_email_modal}} */}
                    {"{{manual_email_modal}}"}
                  </p>
                  <h3 className="font-heading font-black text-xl text-white">
                    Send Email (Resend)
                  </h3>
                </div>
                <button
                  onClick={() => setEmailModalOpen(false)}
                  className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white"
                >
                  <HiXMark />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setEmailModalOpen(false);
                }}
                className="space-y-3"
              >
                <input
                  defaultValue="lead@example.com"
                  placeholder="Recipient"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none"
                />
                <input
                  placeholder="Subject"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none"
                />
                <textarea
                  rows={5}
                  placeholder="Body"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] text-sm"
                >
                  <HiEnvelope /> Send via Resend
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
