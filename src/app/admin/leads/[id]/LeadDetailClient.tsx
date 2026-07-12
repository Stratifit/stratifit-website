"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  HiArrowLeft, HiEnvelope, HiClock, HiCheckCircle, HiXMark,
  HiPaperAirplane, HiCalendar, HiTrash, HiPencilSquare,
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
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [emailSentId, setEmailSentId] = useState<string | null>(null);
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

  // Edit-mode state for the lead detail panel (name / service / budget).
  const [editingDetails, setEditingDetails] = useState(false);
  const [editName, setEditName] = useState(lead.name ?? "");
  const [editService, setEditService] = useState(lead.service ?? "");
  const [editBudget, setEditBudget] = useState(lead.budget ?? "");
  const [savingDetails, setSavingDetails] = useState(false);
  const [detailsErr, setDetailsErr] = useState<string | null>(null);

  // Edit-mode state for the notes panel.
  const [editingNotes, setEditingNotes] = useState(false);
  const [editNotes, setEditNotes] = useState(lead.notes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesErr, setNotesErr] = useState<string | null>(null);

  // Delete confirmation modal.
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteErr, setDeleteErr] = useState<string | null>(null);

  async function saveDetails() {
    if (savingDetails) return;
    setSavingDetails(true);
    setDetailsErr(null);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          service: editService.trim(),
          budget: editBudget.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setDetailsErr(data.error || `Save failed (${res.status})`);
        return;
      }
      setEditingDetails(false);
      router.refresh();
    } catch (err) {
      setDetailsErr(err instanceof Error ? err.message : "Network error");
    } finally {
      setSavingDetails(false);
    }
  }

  async function saveNotes() {
    if (savingNotes) return;
    setSavingNotes(true);
    setNotesErr(null);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ notes: editNotes }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setNotesErr(data.error || `Save failed (${res.status})`);
        return;
      }
      setEditingNotes(false);
      router.refresh();
    } catch (err) {
      setNotesErr(err instanceof Error ? err.message : "Network error");
    } finally {
      setSavingNotes(false);
    }
  }

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (emailSending) return;
    if (!emailSubject.trim() || !emailBody.trim()) return;
    setEmailSending(true);
    setEmailErr(null);
    try {
      const res = await fetch(`/api/leads/${lead.id}/email`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ subject: emailSubject, body: emailBody }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        emailLogId?: string | null;
        error?: string;
      };
      if (!res.ok || !data.success) {
        setEmailErr(data.error || `Send failed (${res.status})`);
        return;
      }
      setEmailSentId(data.emailLogId ?? null);
      setEmailSubject("");
      setEmailBody("");
    } catch (err) {
      setEmailErr(err instanceof Error ? err.message : "Network error");
    } finally {
      setEmailSending(false);
    }
  }

  async function deleteLead() {
    if (deleting) return;
    setDeleting(true);
    setDeleteErr(null);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setDeleteErr(data.error || `Delete failed (${res.status})`);
        return;
      }
      router.push("/admin/leads");
      router.refresh();
    } catch (err) {
      setDeleteErr(err instanceof Error ? err.message : "Network error");
    } finally {
      setDeleting(false);
    }
  }

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

      <header className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">Lead Detail</p>
          {editingDetails ? (
            <div className="space-y-3 max-w-lg mt-2">
              <label className="block">
                <span className="text-[9px] font-mono text-gray-600 block mb-1">Name</span>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Name"
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber/50 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="text-[9px] font-mono text-gray-600 block mb-1">Service</span>
                <input
                  value={editService}
                  onChange={(e) => setEditService(e.target.value)}
                  placeholder="Service"
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber/50 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="text-[9px] font-mono text-gray-600 block mb-1">Budget</span>
                <input
                  value={editBudget}
                  onChange={(e) => setEditBudget(e.target.value)}
                  placeholder="Budget"
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber/50 focus:outline-none"
                />
              </label>
              {detailsErr && (
                <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {detailsErr}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={saveDetails}
                  disabled={savingDetails}
                  className="px-4 py-2 bg-emerald-500 text-black text-xs font-bold rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-60 inline-flex items-center gap-1.5"
                >
                  <HiCheckCircle className="text-sm" />
                  {savingDetails ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditName(lead.name ?? "");
                    setEditService(lead.service ?? "");
                    setEditBudget(lead.budget ?? "");
                    setDetailsErr(null);
                    setEditingDetails(false);
                  }}
                  disabled={savingDetails}
                  className="px-4 py-2 bg-white/10 text-white text-xs font-bold rounded-xl hover:bg-white/20 transition-all disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
                  {lead.name || lead.email.split("@")[0]}
                </h1>
                <button
                  onClick={() => setEditingDetails(true)}
                  aria-label="Edit lead details"
                  className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-amber hover:border-amber/30 transition-colors"
                >
                  <HiPencilSquare className="text-sm" />
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                <span className="font-mono">{lead.email}</span>
                {lead.service && (
                  <span className="ml-3 pl-3 border-l border-white/10">{lead.service}</span>
                )}
                {lead.budget && (
                  <span className="ml-3 pl-3 border-l border-white/10 font-mono">{lead.budget}</span>
                )}
              </p>
              <p className="text-[10px] font-mono text-gray-600 mt-1">id: {lead.id}</p>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
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
          <button
            onClick={() => setDeleteOpen(true)}
            aria-label="Delete lead"
            className="inline-flex items-center justify-center w-[42px] h-[42px] border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/10 transition-all active:scale-95 shrink-0"
          >
            <HiTrash className="text-lg" />
          </button>
        </div>
      </header>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card-dark rounded-2xl border border-white/5">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-white">Notes</h2>
            {!editingNotes && (
              <button
                onClick={() => {
                  setEditNotes(lead.notes ?? "");
                  setNotesErr(null);
                  setEditingNotes(true);
                }}
                className="text-xs font-bold inline-flex items-center gap-1.5 text-gray-400 hover:text-amber transition-colors"
              >
                <HiPencilSquare className="text-sm" />
                Edit
              </button>
            )}
          </div>
          <div className="p-6 text-sm text-gray-300">
            {editingNotes ? (
              <div className="space-y-3">
                <textarea
                  rows={8}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Write notes for this lead…"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-amber/50 focus:outline-none resize-y"
                />
                {notesErr && (
                  <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {notesErr}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={saveNotes}
                    disabled={savingNotes}
                    className="px-4 py-2 bg-emerald-500 text-black text-xs font-bold rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-60 inline-flex items-center gap-1.5"
                  >
                    <HiCheckCircle className="text-sm" />
                    {savingNotes ? "Saving…" : "Save notes"}
                  </button>
                  <button
                    onClick={() => {
                      setEditNotes(lead.notes ?? "");
                      setNotesErr(null);
                      setEditingNotes(false);
                    }}
                    disabled={savingNotes}
                    className="px-4 py-2 bg-white/10 text-white text-xs font-bold rounded-xl hover:bg-white/20 transition-all disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : lead.notes ? (
              <NotesView notes={lead.notes} />
            ) : (
              <span className="text-gray-500 italic">No notes yet. Tap Edit to add the first note.</span>
            )}
          </div>
        </div>

        <div className="bg-card-dark rounded-2xl border border-white/5">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <HiClock className="text-amber" /> Follow-ups
            </h2>
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
                    <span className="inline-block text-[9px] uppercase tracking-wider text-gray-500 border border-white/10 rounded px-1.5 py-0.5">
                      {f.status}
                    </span>
                    <p className="text-sm font-bold text-white mt-1">{f.topic}</p>
                    <p className="text-xs text-gray-400">
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
                    Manual Email
                  </p>
                  <h3 className="font-heading font-black text-xl text-white">
                    Send Email (Resend)
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setEmailModalOpen(false);
                    setEmailErr(null);
                    setEmailSentId(null);
                    setEmailSubject("");
                    setEmailBody("");
                  }}
                  className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white"
                  aria-label="Close email modal"
                >
                  <HiXMark />
                </button>
              </div>

              {emailSentId ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <HiCheckCircle className="text-3xl text-emerald-300" />
                  </div>
                  <p className="font-heading font-black text-lg text-white">
                    Email sent
                  </p>
                  <p className="text-xs text-gray-400 mt-1 font-mono">
                    log_id: {emailSentId}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-3">
                    Recipient: <span className="font-mono text-gray-300">{lead.email}</span>
                  </p>
                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() => setEmailSentId(null)}
                      className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl transition-all"
                    >
                      Send another
                    </button>
                    <button
                      onClick={() => {
                        setEmailModalOpen(false);
                        setEmailSentId(null);
                        setEmailSubject("");
                        setEmailBody("");
                      }}
                      className="flex-1 px-4 py-2.5 bg-amber text-black text-sm font-bold rounded-xl hover:bg-amber-light transition-all"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submitEmail} className="space-y-3">
                  <label className="block">
                    <span className="text-[9px] font-mono text-gray-600 block mb-1">
                      Recipient (locked to lead)
                    </span>
                    <input
                      value={lead.email}
                      readOnly
                      title="Recipient is locked to the lead's email server-side."
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white/60 cursor-not-allowed focus:outline-none font-mono"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[9px] font-mono text-gray-600 block mb-1">
                      Subject {emailSubject.length}/200
                    </span>
                    <input
                      placeholder="Subject"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      disabled={emailSending}
                      required
                      maxLength={200}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none disabled:opacity-50"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[9px] font-mono text-gray-600 block mb-1">
                      Body (plain text) {emailBody.length}/4000
                    </span>
                    <textarea
                      rows={6}
                      placeholder="Hey {name}, just following up on your project…"
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      disabled={emailSending}
                      required
                      maxLength={4000}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none resize-y disabled:opacity-50"
                    />
                  </label>

                  {emailErr && (
                    <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      {emailErr}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={
                      emailSending || !emailSubject.trim() || !emailBody.trim()
                    }
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    <HiEnvelope />
                    {emailSending ? "Sending…" : "Send via Resend"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-card-dark rounded-2xl border border-red-500/30 w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.25em] mb-1">
                    Danger
                  </p>
                  <h3 className="font-heading font-black text-xl text-white">
                    Delete this lead?
                  </h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Permanently removes{" "}
                    <span className="font-bold text-white">
                      {lead.name || lead.email.split("@")[0]}
                    </span>{" "}
                    and every scheduled follow-up linked to them. This cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() => setDeleteOpen(false)}
                  disabled={deleting}
                  className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white"
                >
                  <HiXMark />
                </button>
              </div>

              {deleteErr && (
                <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">
                  {deleteErr}
                </p>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end">
                <button
                  onClick={() => setDeleteOpen(false)}
                  disabled={deleting}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteLead}
                  disabled={deleting}
                  className="px-4 py-2.5 bg-red-500 text-black text-sm font-bold rounded-xl hover:bg-red-400 transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                >
                  <HiTrash />
                  {deleting ? "Deleting…" : "Delete lead"}
                </button>
              </div>
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
