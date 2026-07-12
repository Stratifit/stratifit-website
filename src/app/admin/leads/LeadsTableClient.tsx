"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiMagnifyingGlass,
  HiChevronDown,
  HiXMark,
  HiArrowRight,
  HiUsers,
  HiTrash,
} from "react-icons/hi2";

export interface LeadRow {
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

const STATUS_META: Record<string, { label: string; cls: string }> = {
  new: { label: "new", cls: "bg-amber/15 text-amber border-amber/30" },
  qualified: { label: "qualified", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  "in-review": { label: "in-review", cls: "bg-white/5 text-gray-300 border-white/10" },
  won: { label: "won", cls: "bg-amber text-black" },
  lost: { label: "lost", cls: "bg-white/5 text-gray-500 border-white/10" },
  scheduled: { label: "scheduled", cls: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
};

function statusMeta(s: string) {
  return STATUS_META[s] ?? { label: s, cls: "bg-white/5 text-gray-400 border-white/10" };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "\u2014";
  return d.toLocaleString("en-US", {
    year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

function initials(name: string, email: string): string {
  const src = name?.trim() || email || "?";
  return src.charAt(0).toUpperCase();
}

export function LeadsTableClient({ leads }: { leads: LeadRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  // Row-level delete — confirmation modal prevents accidental one-clicks
  // (the prior version fired DELETE on first click). The pattern mirrors
  // the delete modal in LeadDetailClient.tsx: pending row + busy flag +
  // inline error, so the table view and the detail page behave identically.
  const [pendingDelete, setPendingDelete] = useState<LeadRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteErr, setDeleteErr] = useState<string | null>(null);

  async function confirmDelete() {
    if (!pendingDelete || deleting) return;
    setDeleteErr(null);
    setDeleting(true);
    try {
      const res = await fetch(`/api/leads/${pendingDelete.id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setDeleteErr(data.error || `Delete failed (${res.status})`);
        return;
      }
      router.refresh();
      setPendingDelete(null);
    } catch (err) {
      setDeleteErr(err instanceof Error ? err.message : "Network error");
    } finally {
      setDeleting(false);
    }
  }

  const services = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => { if (l.service) set.add(l.service); });
    return Array.from(set).sort();
  }, [leads]);

  const statuses = useMemo(() => {
    const set = new Set<string>(Object.keys(STATUS_META));
    leads.forEach((l) => { if (l.status && !STATUS_META[l.status]) set.add(l.status); });
    return Array.from(set);
  }, [leads]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (serviceFilter !== "all" && l.service !== serviceFilter) return false;
      if (q) {
        if (
          !(l.name ?? "").toLowerCase().includes(q) &&
          !(l.email ?? "").toLowerCase().includes(q) &&
          !(l.notes ?? "").toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [leads, search, statusFilter, serviceFilter]);

  const isFiltered = search.trim().length > 0 || statusFilter !== "all" || serviceFilter !== "all";

  return (
    <div>
      <div className="px-4 sm:px-6 py-4 border-b border-white/5 bg-black/30 flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or notes..."
            className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-amber/50 focus:outline-none transition-colors"
          />
        </div>
        <div className="relative lg:min-w-[180px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            className="w-full appearance-none bg-black border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:border-amber/50 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{statusMeta(s).label}</option>
            ))}
          </select>
          <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-base" />
        </div>
        <div className="relative lg:min-w-[200px]">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            aria-label="Filter by service"
            className="w-full appearance-none bg-black border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:border-amber/50 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">All services</option>
            {services.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-base" />
        </div>
      </div>

      <div className="px-4 sm:px-6 py-3 text-xs text-gray-400 flex items-center gap-3 flex-wrap">
        <span>
          <span className="text-white font-bold">{filtered.length}</span>
          {isFiltered && <span className="text-gray-500"> of {leads.length}</span>} leads
        </span>
        {statusFilter !== "all" && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusMeta(statusFilter).cls}`}>
            {statusMeta(statusFilter).label}
          </span>
        )}
        {serviceFilter !== "all" && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-blue-500/10 text-blue-300 border-blue-500/20">
            {serviceFilter}
          </span>
        )}
        {isFiltered && (
          <button
            type="button"
            onClick={() => { setSearch(""); setStatusFilter("all"); setServiceFilter("all"); }}
            className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-amber transition-colors"
          >
            <HiXMark className="text-xs" />Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="px-4 sm:px-6 py-16 text-center">
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <HiUsers className="text-3xl opacity-30" />
            <p className="text-sm">
              {leads.length === 0
                ? "No leads yet. They will appear here as soon as the contact form is wired."
                : "No leads match the current filter."}
            </p>
            {isFiltered && leads.length > 0 && (
              <button
                type="button"
                onClick={() => { setSearch(""); setStatusFilter("all"); setServiceFilter("all"); }}
                className="text-xs text-amber hover:text-amber-light font-bold"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/5">
                <th className="px-6 py-3 font-bold">Lead</th>
                <th className="px-6 py-3 font-bold hidden md:table-cell">Service</th>
                <th className="px-6 py-3 font-bold hidden lg:table-cell">Source</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold hidden lg:table-cell">Budget</th>
                <th className="px-6 py-3 font-bold hidden md:table-cell">Created</th>
                <th className="px-6 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((lead, i) => {
                const meta = statusMeta(lead.status);
                return (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center font-heading font-black text-amber text-sm shrink-0">
                          {initials(lead.name, lead.email)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate max-w-[200px]">
                            {lead.name || lead.email.split("@")[0]}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[240px]">
                            {lead.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-300">
                      {lead.service ?? "\u2014"}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-gray-400 text-xs">
                      {lead.source ?? "\u2014"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${meta.cls}`}
                      >
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-gray-300 text-xs font-mono">
                      {lead.budget ?? "\u2014"}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-400 text-xs font-mono whitespace-nowrap">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber hover:gap-2 transition-all whitespace-nowrap"
                        >
                          View <HiArrowRight className="text-sm" />
                        </Link>
                        <button
                          onClick={() => setPendingDelete(lead)}
                          disabled={Boolean(pendingDelete)}
                          aria-label={`Delete lead ${lead.email}`}
                          title="Delete lead"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <HiTrash className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {deleteErr && !pendingDelete && (
        <div className="px-6 py-3 border-t border-red-500/20 bg-red-500/5">
          <p className="text-xs text-red-300">
            Delete failed: {deleteErr}
          </p>
        </div>
      )}

      {pendingDelete && (
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
                      {pendingDelete.name || pendingDelete.email.split("@")[0]}
                    </span>{" "}
                    <span className="font-mono text-[11px] text-gray-500">
                      ({pendingDelete.email})
                    </span>{" "}
                    and every scheduled follow-up linked to them. This cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (deleting) return;
                    setPendingDelete(null);
                    setDeleteErr(null);
                  }}
                  disabled={deleting}
                  className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Close delete confirmation"
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
                  onClick={() => {
                    setPendingDelete(null);
                    setDeleteErr(null);
                  }}
                  disabled={deleting}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
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
    </div>
  );
}
