"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiClock,
  HiNoSymbol,
  HiMagnifyingGlass,
  HiXMark,
  HiTrash,
  HiCpuChip,
} from "react-icons/hi2";

/* ------------------------------------------------------------------ */
/*  LLM Log table + filters (client). Mirrors EmailLogTableClient.   */
/* ------------------------------------------------------------------ */

export interface LlmLogRow {
  id: string;
  chatbot: string;
  lang: string;
  query: string;
  response: string | null;
  model: string;
  tokens_in: number | null;
  tokens_out: number | null;
  latency_ms: number;
  status:
    | "ok"
    | "no_api_key"
    | "rate_limited"
    | "empty_response"
    | "timeout"
    | "error"
    | "disabled";
  error: string | null;
  created_at: string;
}

const STATUS_META = {
  ok: {
    label: "OK",
    cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    Icon: HiCheckCircle,
  },
  no_api_key: {
    label: "No API key",
    cls: "bg-gray-500/15 text-gray-300 border-gray-500/30",
    Icon: HiNoSymbol,
  },
  rate_limited: {
    label: "Rate-limited",
    cls: "bg-amber/15 text-amber border-amber/30",
    Icon: HiClock,
  },
  empty_response: {
    label: "Empty",
    cls: "bg-amber/15 text-amber border-amber/30",
    Icon: HiClock,
  },
  timeout: {
    label: "Timeout",
    cls: "bg-red-500/15 text-red-300 border-red-500/30",
    Icon: HiClock,
  },
  error: {
    label: "Error",
    cls: "bg-red-500/15 text-red-300 border-red-500/30",
    Icon: HiExclamationCircle,
  },
  disabled: {
    label: "Disabled",
    cls: "bg-gray-500/15 text-gray-300 border-gray-500/30",
    Icon: HiNoSymbol,
  },
} as const;

type StatusKey = keyof typeof STATUS_META;

function statusMeta(s: string | null | undefined): (typeof STATUS_META)[StatusKey] {
  return STATUS_META[(s as StatusKey) ?? "ok"] ?? STATUS_META.ok;
}

function formatRelative(iso: string | null): string {
  if (!iso) return "\u2014";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 0) return d.toLocaleString();
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

const ALL_CHATBOTS = ["ai", "contact", "coming_soon", "faq"] as const;

export function LlmLogTableClient({ rows }: { rows: LlmLogRow[] }) {
  const [chatbotFilter, setChatbotFilter] = useState<"all" | string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | StatusKey>("all");
  const [search, setSearch] = useState("");
  const [purgeBusy, setPurgeBusy] = useState(false);
  const [purgeMsg, setPurgeMsg] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (chatbotFilter !== "all" && r.chatbot !== chatbotFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (q) {
        const hay =
          `${r.query} ${r.response ?? ""} ${r.error ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, chatbotFilter, statusFilter, search]);

  const purgeOld = async (days: number, force: boolean) => {
    if (purgeBusy) return;
    if (
      !confirm(
        `Delete ${force ? "all" : "non-ok"} llm_log rows older than ${days} day${days === 1 ? "" : "s"}? This cannot be undone.`,
      )
    ) {
      return;
    }
    setPurgeBusy(true);
    setPurgeMsg(null);
    try {
      const res = await fetch(
        `/api/llm-log?days=${days}${force ? "&force=1" : ""}`,
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
      <div className="px-4 sm:px-6 py-4 border-b border-white/5 bg-black/30 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          <div className="relative">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search query / response / error\u2026"
              className="bg-black border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none transition-colors"
            />
          </div>
          <select
            value={chatbotFilter}
            onChange={(e) => setChatbotFilter(e.target.value)}
            className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber/50 focus:outline-none transition-colors"
            aria-label="Filter by chatbot"
          >
            <option value="all">All chatbots</option>
            {ALL_CHATBOTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusKey | "all")}
            className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber/50 focus:outline-none transition-colors"
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="ok">Ok</option>
            <option value="error">Error</option>
            <option value="timeout">Timeout</option>
            <option value="empty_response">Empty</option>
            <option value="rate_limited">Rate-limited</option>
            <option value="no_api_key">No API key</option>
            <option value="disabled">Disabled</option>
          </select>
          {(chatbotFilter !== "all" || statusFilter !== "all" || search) && (
            <button
              onClick={() => {
                setChatbotFilter("all");
                setStatusFilter("all");
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

      <div className="px-4 sm:px-6 py-3 text-xs text-gray-500 flex items-center gap-2">
        <span>
          {filtered.length} of {rows.length} call{rows.length === 1 ? "" : "s"}
        </span>
        {chatbotFilter !== "all" && (
          <span className="text-amber">\u00b7 {chatbotFilter}</span>
        )}
        {statusFilter !== "all" && (
          <span className="text-amber">\u00b7 {statusMeta(statusFilter).label}</span>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="px-4 sm:px-6 py-12 text-center bg-amber/5 border-t border-amber/20">
          <p className="text-sm text-amber mb-1">
            {rows.length === 0
              ? "No LLM calls yet."
              : "No LLM calls match the current filters."}
          </p>
          <p className="text-xs text-gray-400">
            {rows.length === 0
              ? "Groq is wired but no chatbot has routed an unmatched question to it yet."
              : "Try clearing the filters above."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-black/40">
              <tr>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Chatbot</th>
                <th className="text-left px-4 py-3">Query</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Model</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Tokens</th>
                <th className="text-right px-4 py-3 hidden md:table-cell">Latency</th>
                <th className="text-right px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const meta = statusMeta(row.status);
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
                    <td className="px-4 py-3 text-gray-300 font-mono text-xs">
                      {row.chatbot}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      <div className="text-xs">{truncate(row.query, 80)}</div>
                      {row.response && (
                        <div className="text-[11px] text-gray-500 mt-0.5 truncate max-w-md">
                          {truncate(row.response, 120)}
                        </div>
                      )}
                      {row.error && (
                        <div className="text-[11px] text-red-300 mt-0.5 truncate max-w-md">
                          {row.error}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-[11px] font-mono hidden md:table-cell">
                      {row.model}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-[11px] font-mono hidden lg:table-cell">
                      {row.tokens_in !== null && row.tokens_out !== null
                        ? `${row.tokens_in}/${row.tokens_out}`
                        : "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs text-right hidden md:table-cell tabular-nums">
                      {row.latency_ms}ms
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

      <div className="px-4 sm:px-6 py-3 text-[11px] text-gray-500 border-t border-white/5 flex items-center gap-2">
        <HiCpuChip className="text-amber text-sm" />
        Append-only audit trail of every Groq call from any chatbot.
        Rows are written to Supabase table{" "}
        <code className="text-gray-400">llm_log</code> from{" "}
        <code className="text-gray-400">src/lib/llm.ts</code>.
      </div>
    </div>
  );
}
