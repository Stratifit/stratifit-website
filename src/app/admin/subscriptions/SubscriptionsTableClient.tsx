"use client";

import { useState, useMemo } from "react";
import {
  HiMagnifyingGlass,
  HiChevronDown,
  HiEnvelope,
  HiXMark,
  HiSparkles,
  HiArrowDownTray,
} from "react-icons/hi2";
import { DeleteSubscriberButton } from "./DeleteSubscriberButton";

type Subscriber = {
  id: string;
  email: string;
  status: string;
  source: string | null;
  lang: string | null;
  created_at: string;
};

type SourceMeta = {
  label: string;
  className: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SOURCE_META: Record<string, SourceMeta> = {
  coming_soon_page: {
    label: "Page Form",
    icon: HiEnvelope,
    className: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  },
  coming_soon_chat: {
    label: "AI Chat",
    icon: HiSparkles,
    className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
};

const FALLBACK_SOURCE_META: SourceMeta = {
  label: "Unknown",
  icon: HiXMark,
  className: "bg-white/5 text-gray-400 border-white/10",
};

function getSourceMeta(source: string | null): SourceMeta {
  if (!source) return FALLBACK_SOURCE_META;
  return SOURCE_META[source] ?? {
    label: source,
    icon: FALLBACK_SOURCE_META.icon,
    className: FALLBACK_SOURCE_META.className,
  };
}

export function SubscriptionsTableClient({ subscribers }: { subscribers: Subscriber[] }) {
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const allSourceKeys = useMemo(() => {
    const keys = new Set<string>(Object.keys(SOURCE_META));
    subscribers.forEach((s) => {
      if (s.source && !SOURCE_META[s.source]) keys.add(s.source);
    });
    return Array.from(keys);
  }, [subscribers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subscribers.filter((s) => {
      if (sourceFilter !== "all" && s.source !== sourceFilter) return false;
      if (q && !s.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [subscribers, sourceFilter, search]);

  const isFiltered = sourceFilter !== "all" || search.trim().length > 0;

  return (
    <>
      <div className="px-6 py-3 border-b border-white/5 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email..."
            className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-amber/50 focus:outline-none transition-colors"
          />
        </div>
        <div className="relative md:min-w-[200px]">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            aria-label="Filter by source"
            className="w-full appearance-none bg-black border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:border-amber/50 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">All Sources</option>
            {allSourceKeys.map((key) => {
              const meta = SOURCE_META[key];
              return (
                <option key={key} value={key}>
                  {meta?.label ?? key}
                </option>
              );
            })}
          </select>
          <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-base" />
        </div>
      </div>

      <div className="px-6 py-2 border-b border-white/5 flex items-center justify-between">
        <p className="text-xs text-gray-400 flex items-center gap-2 flex-wrap">
          <span>
            <span className="text-white font-bold">{filtered.length}</span>
            {isFiltered && <span className="text-gray-500"> of {subscribers.length}</span>}
            {" "}subscribers
          </span>
          {sourceFilter !== "all" && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getSourceMeta(sourceFilter).className}`}>
              {getSourceMeta(sourceFilter).label}
            </span>
          )}
        </p>
        {isFiltered && (
          <button
            type="button"
            onClick={() => {
              setSourceFilter("all");
              setSearch("");
            }}
            className="text-[10px] font-bold text-gray-400 hover:text-amber transition-colors inline-flex items-center gap-1"
          >
            <HiXMark className="text-xs" />
            Clear
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/5">
              <th className="px-6 py-3 font-bold">Email</th>
              <th className="px-6 py-3 font-bold hidden sm:table-cell">Status</th>
              <th className="px-6 py-3 font-bold hidden md:table-cell">Source</th>
              <th className="px-6 py-3 font-bold hidden lg:table-cell">Lang</th>
              <th className="px-6 py-3 font-bold">Subscribed</th>
              <th className="px-6 py-3 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((s) => {
              const sourceMeta = getSourceMeta(s.source);
              return (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center shrink-0">
                        <HiEnvelope className="text-amber text-sm" />
                      </div>
                      <span className="font-medium text-white truncate max-w-[280px]">
                        {s.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span
                      className={
                        s.status === "subscribed"
                          ? "text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20"
                          : "text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-500 border border-white/10"
                      }
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${sourceMeta.className}`}
                    >
                      <sourceMeta.icon className="text-xs" />
                      {sourceMeta.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-gray-400 text-xs uppercase">
                    {s.lang ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-xs font-mono whitespace-nowrap">
                    {formatDate(s.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DeleteSubscriberButton id={s.id} email={s.email} />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <HiEnvelope className="text-3xl opacity-30" />
                    <p className="text-sm">
                      {isFiltered
                        ? "No subscribers match the current filter."
                        : "No subscribers yet."}
                    </p>
                    {isFiltered ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSourceFilter("all");
                          setSearch("");
                        }}
                        className="text-xs text-amber hover:text-amber-light font-bold"
                      >
                        Clear filter
                      </button>
                    ) : (
                      <p className="text-xs text-gray-600">
                        Share the Coming Soon page to collect signups.
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Client-side CSV export (respects active filter) */}
      <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between">
        <p className="text-[10px] font-mono text-gray-600">
          Subscribers stored in Supabase table <code className="text-gray-400">notify_subscribers</code> — accessible via the button above.
        </p>
        <ExportCsvButton subscribers={filtered} />
      </div>
    </>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ExportCsvButton({ subscribers }: { subscribers: Subscriber[] }) {
  const csv = useMemo(() => {
    const rows: string[] = [];
    rows.push(
      ["email", "status", "source", "lang", "created_at"].join(","),
    );
    subscribers.forEach((s) => {
      rows.push(
        [s.email, s.status, s.source ?? "", s.lang ?? "", s.created_at]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(","),
      );
    });
    return rows.join("\n");
  }, [subscribers]);

  return (
    <a
      href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
      download={`notify-subscribers-${new Date().toISOString().slice(0, 10)}.csv`}
      className="inline-flex items-center gap-2 px-3 py-2 bg-black border border-white/10 rounded-lg text-xs font-medium text-gray-300 hover:border-amber/40 hover:text-amber transition-colors"
    >
      <HiArrowDownTray className="text-sm" />
      Export CSV ({subscribers.length})
    </a>
  );
}
