"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  HiArrowLeft, HiEnvelope, HiClock, HiCheckCircle, HiXMark,
  HiPaperAirplane, HiCalendar,
} from "react-icons/hi2";
import Link from "next/link";

export interface LeadFollowup {
  id: string;
  topic: string;
  template: string;
  lang: string;
  status: string;
  scheduled_for: string;
  sent_at: string | null;
  attempts: number;
  last_error: string | null;
  email_log_id: string | null;
  scheduled_by: string;
  created_at: string;
}

export interface LeadDetail {
  id: string;
  name: string;
  email: string;
  service: string | null;
  source: string | null;
  status: string;
  budget: string | null;
  lang: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const ALLOWED_STATUSES = ["new", "qualified", "in-review", "won", "lost"];
const FOLLOWUP_TEMPLATES = [
  { key: "lead_followup_welcome", label: "Welcome" },
  { key: "lead_followup_checkin", label: "Check-in" },
  { key: "lead_followup_proposal", label: "Proposal" },
  { key: "lead_followup_thanks", label: "Thanks" },
] as const;

export function LeadDetailClient({ lead, followups }: { lead: LeadDetail; followups: LeadFollowup[] }) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleTopic, setScheduleTopic] = useState("Follow-up");
  const [scheduleTemplate, setScheduleTemplate] = useState<(typeof FOLLOWUP_TEMPLATES)[number]["key"]>("lead_followup_checkin");
  const [scheduleWhen, setScheduleWhen] = useState<string>(() => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  const [scheduleBusy, setScheduleBusy] = useState(false);
  const [scheduleErr, setScheduleErr] = useState<string | null>(null);

  async function submitSchedule(e: React.FormEvent) {
    e.preventDefault();
    if (scheduleBusy) return;
    setScheduleBusy(true);
    setScheduleErr(null);
    try {
      const iso = new Date(scheduleWhen).toISOString();
      const res = await fetch(`/api/leads/${lead.id}/followups`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          topic: scheduleTopic,
          template: scheduleTemplate,
          scheduled_for: iso,
          lang: lead.lang ?? "en",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setScheduleErr(data.error || "Failed to schedule follow-up");
        return;
      }
      setScheduleOpen(false);
      router.refresh();
    } catch (err) {
      setScheduleErr(err instanceof Error ? err.message : "Network error");
    } finally {
      setScheduleBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <Link href="/admin/leads" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-amber transition-colors">
        <HiArrowLeft /> Back to Leads
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">Lead Detail</p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            {lead.name || lead.email.split("@")[0]}
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            <span className="font-mono text-[10px] text-gray-600 mr-2">{"{{lead_email}}"}</span>
            <span className="font-mono">{lead.email}</span>
          </p>
          <p className="text-[10px] font-mono text-gray-600 mt-1">id: {lead.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[9px] font-mono text-gray-600">{"{{status_dropdown}}"}</p>
          </div>
          <div className="relative">
            <select
              value={status}
              onChange={async (e) => {
                setStatus(e.target.value);
                try {
                  await fetch(`/api/leads/${lead.id}`, {
                    method: "PATCH",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ status: e.target.value }),
                  });
                } catch { /* ignore */ }
              }}
              className="appearance-none bg-black border border-amber/30 rounded-xl pl-4 pr-10 py-2.5 text-sm text-amber font-bold focus:outline-none focus:border-amber cursor-pointer"
            >
              {ALLOWED_STATUSES.map((s) => (
                <option key={s} value={s} className="bg-black text-white">{s}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber pointer-events-none text-xs">\u25bc</span>
          </div>
          <button
            onClick={() => setEmailModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all active:scale-95 text-xs shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            <HiPaperAirplane className="text-sm rotate-90" /> Send Email
          </button>
        </div>
      </header>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card-dark rounded-2xl border border-white/5">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-white">Notes</h2>
              <p className="text-[10px] font-mono text-gray-500 mt-0.5">{"{{message_list}}"}</p>
            </div>
          </div>
          <div className="p-6 text-sm text-gray-300">
            {lead.notes ? (
              <NotesView notes={lead.notes} />
            ) : (
              <span className="text-gray-500 italic">No notes yet. Conversation history will land here once the chatbot-to-lead bridge ships.</span>
            )}
          </div>
        </div>

        <div className="bg-card-dark rounded-2xl border border-white/5">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <HiClock className="text-amber" /> Follow-ups
            </h2>
            <p className="text-[10px] font-mono text-gray-500 mt-0.5">{"{{followup_list}}"}</p>
          </div>
          <ul className="divide-y divide-white/5 max-h-96 overflow-y-auto">
            {followups.length === 0 ? (
              <li className="px-6 py-8 text-center text-sm text-gray-500">No follow-ups scheduled.</li>
            ) : (
              followups.map((f) => (
                <li key={f.id} className="px-6 py-4 flex items-start gap-3">
                  <div className="mt-0.5">
                    {f.status === "completed" ? (
                      <HiCheckCircle className="text-emerald-400 text-base" />
                    ) : f.status === "scheduled" ? (
                      <HiClock className="text-amber text-base" />
                    ) : f.status === "failed" ? (
                      <HiXMark className="text-red-400 text-base" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-white/20 block" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-mono text-gray-600">{`{{followup_status}}="${f.status}"`}</p>
                    <p className="text-sm font-bold text-white mt-1">{f.topic}</p>
                    <p className="text-xs text-gray-400">
                      <span className="font-mono text-[9px] text-gray-600 mr-1">
                        {/* {{followup_scheduled_for}} */}
                        {"{{followup_scheduled_for}}"}
                      </span>
                      {formatDateTime(f.scheduled_for)}
                    </p>
                    {f.last_error && (
                      <p className="text-[10px] text-red-300 mt-1 truncate">
                        {f.last_error}
                      </p>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
          <div className="px-6 py-4 border-t border-white/5">
            <button
              onClick={() => setScheduleOpen(true)}
              className="w-full px-4 py-2.5 border border-amber/30 text-amber font-bold text-xs rounded-xl hover:bg-amber/10 transition-all inline-flex items-center justify-center gap-2"
            >
              <HiCalendar className="text-sm" />+ Schedule follow-up
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
                  defaultValue={lead.email}
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

      {/* Schedule follow-up modal */}
      {scheduleOpen && (
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
                    Follow-up
                  </p>
                  <h3 className="font-heading font-black text-xl text-white">
                    Schedule email
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Vercel cron dispatches the email automatically at the
                    chosen time via Resend.
                  </p>
                </div>
                <button
                  onClick={() => setScheduleOpen(false)}
                  className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white"
                >
                  <HiXMark />
                </button>
              </div>

              <form onSubmit={submitSchedule} className="space-y-3">
                <label className="block">
                  <span className="text-[9px] font-mono text-gray-600 block mb-0.5">
                    Topic
                  </span>
                  <input
                    value={scheduleTopic}
                    onChange={(e) => setScheduleTopic(e.target.value)}
                    placeholder="e.g. Discovery call"
                    required
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-[9px] font-mono text-gray-600 block mb-0.5">
                    Template
                  </span>
                  <select
                    value={scheduleTemplate}
                    onChange={(e) =>
                      setScheduleTemplate(
                        e.target.value as (typeof FOLLOWUP_TEMPLATES)[number]["key"],
                      )
                    }
                    className="w-full appearance-none bg-black border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:border-amber/50 focus:outline-none cursor-pointer"
                  >
                    {FOLLOWUP_TEMPLATES.map((t) => (
                      <option key={t.key} value={t.key} className="bg-black">
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[9px] font-mono text-gray-600 block mb-0.5">
                    Send at
                  </span>
                  <input
                    type="datetime-local"
                    value={scheduleWhen}
                    onChange={(e) => setScheduleWhen(e.target.value)}
                    required
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-amber/50 focus:outline-none [color-scheme:dark]"
                  />
                </label>

                {scheduleErr && (
                  <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {scheduleErr}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={scheduleBusy}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] text-sm disabled:opacity-50"
                >
                  <HiCalendar />
                  {scheduleBusy ? "Scheduling..." : "Schedule follow-up"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/*  NotesView \u2014 renders leads.notes as a stream of timestamped       */
/*  event cards when the public leads route (or future sources)       */
/*  stamp structured "[ISO] label" entries. Falls back to a plain     */
/*  <pre> block when no structured entries are detected so manually   */
/*  edited notes still display correctly.                              */
/* ------------------------------------------------------------------ */
const NOTE_HEADER_RE = /^\[(\d{4}-\d{2}-\d{2}T[\d:.\-Z]+)\]\s+(.+)$/;
const NOTE_TIMESTAMP_PRESENT_RE = /\[\d{4}-\d{2}-\d{2}T[\d:.\-Z]+\]/;

interface ParsedNoteBlock {
  timestamp: string;
  title: string;
  detail: string;
}

function parseNoteEntries(notes: string): {
  structured: ParsedNoteBlock[] | null;
  trailing: string;
} {
  if (!NOTE_TIMESTAMP_PRESENT_RE.test(notes)) return { structured: null, trailing: notes };

  const lines = notes.split("\n");
  const blocks: ParsedNoteBlock[] = [];
  let current: ParsedNoteBlock | null = null;
  const trailingChunks: string[] = [];

  for (const line of lines) {
    const m = line.match(NOTE_HEADER_RE);
    if (m) {
      if (current) blocks.push(current);
      current = { timestamp: m[1], title: m[2].trim(), detail: "" };
    } else if (current) {
      // Belongs to the current structured block.
      current.detail += (current.detail ? "\n" : "") + line;
    } else {
      trailingChunks.push(line);
    }
  }
  if (current) blocks.push(current);

  return { structured: blocks, trailing: trailingChunks.join("\n").trim() };
}

function NotesView({ notes }: { notes: string }) {
  const { structured, trailing } = parseNoteEntries(notes);
  if (!structured || structured.length === 0) {
    return <div className="whitespace-pre-wrap">{notes}</div>;
  }
  return (
    <div className="space-y-3">
      {structured.map((b, idx) => (
        <div
          key={`${b.timestamp}-${idx}`}
          className="rounded-lg border border-white/5 bg-black/40 px-4 py-3"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono text-gray-500">
              {b.timestamp}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber">
              {b.title}
            </span>
          </div>
          {b.detail.trim() && (
            <div className="text-xs font-mono text-gray-400 whitespace-pre-wrap pl-3 border-l border-amber/30">
              {b.detail.trim()}
            </div>
          )}
        </div>
      ))}
      {trailing && (
        <div className="text-sm text-gray-300 whitespace-pre-wrap pt-2 border-t border-white/5">
          {trailing}
        </div>
      )}
    </div>
  );
}
