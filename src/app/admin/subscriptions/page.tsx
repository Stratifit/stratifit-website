import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  HiArrowTopRightOnSquare,
  HiCheckCircle,
  HiXCircle,
  HiEnvelope,
  HiSparkles,
} from "react-icons/hi2";
import { SubscriptionsTableClient } from "./SubscriptionsTableClient";

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
    // eslint-disable-next-line react-hooks/purity -- "Last 7 days" count must reflect real wall-clock time per render.
    (s) => Date.now() - new Date(s.created_at).getTime() < 7 * 24 * 60 * 60 * 1000,
  ).length;
  // Per-source counts for the side-by-side comparison cards.
  const pageFormCount = subscribers.filter((s) => s.source === "coming_soon_page").length;
  const aiChatCount = subscribers.filter((s) => s.source === "coming_soon_chat").length;

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
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard label="Total" value={total} icon={HiEnvelope} accent="text-white" />
        <StatCard label="Subscribed" value={subscribed} icon={HiCheckCircle} accent="text-emerald-400" />
        <StatCard label="Unsubscribed" value={unsubscribed} icon={HiXCircle} accent="text-gray-400" />
        <StatCard label="Last 7 days" value={last7d} icon={HiArrowTopRightOnSquare} accent="text-amber" />
        <StatCard label="Page Form" value={pageFormCount} icon={HiEnvelope} accent="text-blue-300" />
        <StatCard label="AI Chat" value={aiChatCount} icon={HiSparkles} accent="text-emerald-300" />
      </section>

      {/* Filterable table (client component) */}
      <section className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
        <SubscriptionsTableClient subscribers={subscribers} />
      </section>
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
