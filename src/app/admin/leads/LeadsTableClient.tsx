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

  // Row-level delete (admin-gated server route).
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteErr, setDeleteErr] = useState<string | null>(null);

  async function confirmDelete(id: string) {
    setDeleteErr(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setDeleteErr(data.error || `Delete failed (${res.status})`);
        return;
      }
      router.refresh();
    } catch (err) {
      setDeleteErr(err instanceof Error ? err.message : "Network error");
    } finally {
      setDeletingId(null);
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
                          onClick={() => confirmDelete(lead.id)}
                          disabled={deletingId === lead.id}
                          aria-label={`Delete lead ${lead.email}`}
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

      {deleteErr && (
        <div className="px-6 py-3 border-t border-red-500/20 bg-red-500/5">
          <p className="text-xs text-red-300">
            Delete failed: {deleteErr}
          </p>
        </div>
      )}
    </div>
  );
}
