"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiClock,
  HiMagnifyingGlass,
  HiXMark,
  HiTrash,
} from "react-icons/hi2";

/* ------------------------------------------------------------------ */
/*  Email Log table + filters (client). Server passes all rows; we    */
/*  filter in memory for the small dataset typical of an MVP admin   */
/*  viewer. If the table grows, swap to a server-paged fetch.         */
/* ------------------------------------------------------------------ */

export interface EmailLogRow {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  template_name: string;
  status: "queued" | "sent" | "failed";
  resend_id: string | null;
  error: string | null;
  attempt_count: number;
  related_subscriber_id: string | null;
  sent_at: string | null;
  created_at: string;
}

const STATUS_META = {
  queued: {
    label: "Queued",
    cls: "bg-amber/15 text-amber border-amber/30",
    Icon: HiClock,
  },
  sent: {
    label: "Sent",
    cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    Icon: HiCheckCircle,
  },
  failed: {
    label: "Failed",
    cls: "bg-red-500/15 text-red-300 border-red-500/30",
    Icon: HiExclamationCircle,
  },
} as const;

type StatusKey = keyof typeof STATUS_META;

function statusMeta(s: string | null | undefined): (typeof STATUS_META)[StatusKey] {
  return STATUS_META[(s as StatusKey) ?? "queued"] ?? STATUS_META.queued;
}

function formatRelative(iso: string | null): string {
  if (!iso) return "\u2014";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 0) {
    // Future date (e.g. queued sent_at) — show absolute
    return d.toLocaleString();
  }
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  return d.toLocaleDateString();
}

function truncate(s: string | null | undefined, n: number): string {
  if (!s) return "\u2014";
  const oneLine = s.replace(/\s+/g, " ").trim();
  return oneLine.length > n ? `${oneLine.slice(0, n)}\u2026` : oneLine;
}

export function EmailLogTableClient({ rows }: { rows: EmailLogRow[] }) {
  const [statusFilter, setStatusFilter] = useState<"all" | StatusKey>("all");
  const [templateFilter, setTemplateFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [purgeBusy, setPurgeBusy] = useState(false);
  const [purgeMsg, setPurgeMsg] = useState<string | null>(null);

  const templates = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) set.add(r.template_name);
    return Array.from(set).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (templateFilter !== "all" && r.template_name !== templateFilter) return false;
      if (q) {
        if (
          !r.recipient.toLowerCase().includes(q) &&
          !r.subject.toLowerCase().includes(q) &&
          !(r.error ?? "").toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [rows, statusFilter, templateFilter, search]);

  const purgeOld = async (days: number, force: boolean) => {
    if (purgeBusy) return;
    if (
      !confirm(
        `Delete ${force ? "all" : "failed/queued"} email_log rows older than ${days} day${days === 1 ? "" : "s"}? This cannot be undone.`,
      )
    ) {
      return;
    }
    setPurgeBusy(true);
    setPurgeMsg(null);
    try {
      const res = await fetch(
        `/api/email-log?days=${days}${force ? "&force=1" : ""}`,
        { method: "DELETE" },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPurgeMsg(data.error || "Purge failed");
        return;
      }
      setPurgeMsg(
        `Purged ${data.deleted ?? "?"} row${data.deleted === 1 ? "" : "s"}. Reload to refresh.`,
      );
    } catch (err) {
      setPurgeMsg(err instanceof Error ? err.message : "Network error");
    } finally {
      setPurgeBusy(false);
    }
  };

  return (
    <div>
      {/* Header / filters */}
      <div className="px-4 sm:px-6 py-4 border-b border-white/5 bg-black/30 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          <div className="relative">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipient / subject / error\u2026"
              className="bg-black border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusKey | "all")}
            className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber/50 focus:outline-none transition-colors"
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="queued">Queued</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>
          {templates.length > 0 && (
            <select
              value={templateFilter}
              onChange={(e) => setTemplateFilter(e.target.value)}
              className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber/50 focus:outline-none transition-colors"
              aria-label="Filter by template"
            >
              <option value="all">All templates</option>
              {templates.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
          {(statusFilter !== "all" || templateFilter !== "all" || search) && (
            <button
              onClick={() => {
                setStatusFilter("all");
                setTemplateFilter("all");
                setSearch("");
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <HiXMark className="text-base" />
              Clear
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => purgeOld(30, false)}
            disabled={purgeBusy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 border border-white/10 rounded-lg hover:border-amber/40 hover:text-amber transition-colors disabled:opacity-50"
          >
            <HiTrash className="text-sm" />
            Purge old
          </button>
        </div>
      </div>

      {purgeMsg && (
        <div className="px-4 sm:px-6 py-2 text-xs text-gray-400 bg-black/40 border-b border-white/5">
          {purgeMsg}
        </div>
      )}

      {/* Result indicator */}
      <div className="px-4 sm:px-6 py-3 text-xs text-gray-500 flex items-center gap-2">
        <span>
          {filtered.length} of {rows.length} email{rows.length === 1 ? "" : "s"}
        </span>
        {statusFilter !== "all" && (
          <span className="text-amber">
            \u00b7 status: {statusMeta(statusFilter).label}
          </span>
        )}
        {templateFilter !== "all" && (
          <span className="text-amber">\u00b7 template: {templateFilter}</span>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="px-4 sm:px-6 py-12 text-center bg-amber/5 border-t border-amber/20">
          <p className="text-sm text-amber mb-1">
            {rows.length === 0
              ? "No emails sent yet."
              : "No emails match the current filters."}
          </p>
          <p className="text-xs text-gray-400">
            {rows.length === 0
              ? "Once /api/notify fires, every send shows up here with delivery status."
              : "Try clearing the filters above."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-black/40">
              <tr>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Recipient</th>
                <th className="text-left px-4 py-3">Subject</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Template</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Sent</th>
                <th className="text-right px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const meta = statusMeta(row.status);
                const isExpanded = false; // future: per-row body expansion
                return (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="border-t border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full border ${meta.cls}`}
                      >
                        <meta.Icon className="text-xs" />
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-white">
                      {row.recipient}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      <div className="font-medium">{row.subject}</div>
                      {row.error && (
                        <div className="text-[11px] text-red-300 mt-0.5 truncate max-w-xs">
                          {row.error}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono hidden md:table-cell">
                      {row.template_name}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                      {formatRelative(row.sent_at)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs text-right">
                      {formatRelative(row.created_at)}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="px-4 sm:px-6 py-3 text-[11px] text-gray-500 border-t border-white/5">
        Append-only audit trail of every transactional email sent by the
        site. Rows are written to Supabase table{" "}
        <code className="text-gray-400">email_log</code> from{" "}
        <code className="text-gray-400">src/lib/email.ts</code>.
      </div>
    </div>
  );
}

// Helper re-export for callers that need it
export { truncate, formatRelative };
