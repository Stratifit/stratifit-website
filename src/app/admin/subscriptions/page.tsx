import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  HiArrowTopRightOnSquare,
  HiMagnifyingGlass,
  HiCheckCircle,
  HiXCircle,
  HiEnvelope,
  HiTrash,
} from "react-icons/hi2";
import { DeleteSubscriberButton } from "./DeleteSubscriberButton";

/* ------------------------------------------------------------------ */
/*  Admin Subscriptions — lists every "Notify When It's Live" email. */
/*  Server component: talks directly to Supabase (already protected  */
/*  by the AdminGuard in src/app/admin/layout.tsx).                  */
/* ------------------------------------------------------------------ */

interface NotifySubscriber {
  id: string;
  email: string;
  status: string;
  source: string | null;
  lang: string | null;
  created_at: string;
}

async function fetchSubscribers(): Promise<NotifySubscriber[]> {
  const client = getSupabaseAdmin();
  if (!client) return [];
  const { data, error } = await client
    .from("notify_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchSubscribers error:", error);
    return [];
  }
  return (data ?? []) as NotifySubscriber[];
}

function getSupabaseDashboardUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  const projectRef = match?.[1];
  if (!projectRef) return "https://supabase.com/dashboard";
  return `https://supabase.com/dashboard/project/${projectRef}/editor`;
}

export default async function SubscriptionsPage() {
  const [subscribers, dashboardUrl] = await Promise.all([
    fetchSubscribers(),
    Promise.resolve(getSupabaseDashboardUrl()),
  ]);

  const total = subscribers.length;
  const subscribed = subscribers.filter((s) => s.status === "subscribed").length;
  const unsubscribed = total - subscribed;
  const last7d = subscribers.filter(
    (s) => Date.now() - new Date(s.created_at).getTime() < 7 * 24 * 60 * 60 * 1000,
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            CRM &amp; Sales
          </p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Notify Subscribers
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Everyone who tapped &ldquo;Notify When It&rsquo;s Live&rdquo; on the Coming Soon page.
          </p>
        </div>
        <a
          href={dashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-card-dark border border-white/10 rounded-xl text-sm text-gray-300 hover:border-amber/40 hover:text-amber transition-colors"
        >
          View in Supabase
          <HiArrowTopRightOnSquare className="text-base" />
        </a>
      </header>

      {/* Stat cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total" value={total} icon={HiEnvelope} accent="text-white" />
        <StatCard label="Subscribed" value={subscribed} icon={HiCheckCircle} accent="text-emerald-400" />
        <StatCard label="Unsubscribed" value={unsubscribed} icon={HiXCircle} accent="text-gray-400" />
        <StatCard label="Last 7 days" value={last7d} icon={HiArrowTopRightOnSquare} accent="text-amber" />
      </section>

      {/* Search + table */}
      <section className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-6 py-4 border-b border-white/5">
          <p className="text-xs text-gray-400">
            <span className="text-white font-bold">{total}</span> subscribers
            {last7d > 0 && (
              <span className="ml-2 text-amber">
                +{last7d} this week
              </span>
            )}
          </p>
          <ExportCsvButton subscribers={subscribers} />
        </div>

        {/* Search filter (client-side via id) */}
        <div className="px-6 py-3 border-b border-white/5">
          <form className="relative max-w-md">
            <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none" />
            <input
              type="search"
              name="q"
              placeholder="Filter by email (works after first paint)"
              className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-amber/50 focus:outline-none transition-colors"
              disabled
            />
          </form>
          <p className="text-[10px] text-gray-600 mt-1.5">
            Client-side search UI placeholder. Use Supabase dashboard for ad-hoc queries.
          </p>
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
              {subscribers.map((s) => (
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
                  <td className="px-6 py-4 hidden md:table-cell text-gray-400 text-xs font-mono">
                    {s.source ?? "—"}
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
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <HiEnvelope className="text-3xl opacity-30" />
                      <p className="text-sm">No subscribers yet.</p>
                      <p className="text-xs text-gray-600">
                        Share the Coming Soon page to collect signups.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="text-[10px] font-mono text-gray-600 text-center pt-2">
        Subscribers stored in Supabase table <code className="text-gray-400">notify_subscribers</code> — accessible via the button above.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <div className="bg-card-dark rounded-2xl border border-white/5 p-4 sm:p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
        <Icon className="text-sm" />
        {label}
      </div>
      <p className={`font-heading font-black text-2xl sm:text-3xl tabular-nums ${accent}`}>
        {value}
      </p>
    </div>
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

function ExportCsvButton({ subscribers }: { subscribers: NotifySubscriber[] }) {
  const csv = [
    ["email", "status", "source", "lang", "created_at"].join(","),
    ...subscribers.map((s) =>
      [s.email, s.status, s.source ?? "", s.lang ?? "", s.created_at]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    ),
  ].join("\n");

  return (
    <a
      href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
      download={`notify-subscribers-${new Date().toISOString().slice(0, 10)}.csv`}
      className="inline-flex items-center gap-2 px-3 py-2 bg-black border border-white/10 rounded-lg text-xs font-medium text-gray-300 hover:border-amber/40 hover:text-amber transition-colors"
    >
      Export CSV
    </a>
  );
}
