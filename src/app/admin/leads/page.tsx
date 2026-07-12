import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  HiArrowTopRightOnSquare,
  HiUsers,
  HiCheckCircle,
  HiCurrencyDollar,
  HiSparkles,
} from "react-icons/hi2";
import { LeadsTableClient, type LeadRow } from "./LeadsTableClient";

/* ------------------------------------------------------------------ */
/*  Admin Leads \u2014 pulls real leads from Supabase. Server component: */
/*  AdminGuard in src/app/admin/layout.tsx already gates access.      */
/* ------------------------------------------------------------------ */

const DEFAULT_LIMIT = 200;

async function fetchLeads(): Promise<LeadRow[]> {
  const client = getSupabaseAdmin();
  if (!client) return [];
  const { data, error } = await client
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(DEFAULT_LIMIT);
  if (error) {
    console.error("fetchLeads error:", error);
    return [];
  }
  return (data ?? []) as LeadRow[];
}

function getSupabaseDashboardUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  const projectRef = match?.[1];
  if (!projectRef) return "https://supabase.com/dashboard";
  return `https://supabase.com/dashboard/project/${projectRef}/editor`;
}

export default async function AdminLeadsPage() {
  const [leads, dashboardUrl] = await Promise.all([
    fetchLeads(),
    Promise.resolve(getSupabaseDashboardUrl()),
  ]);

  const total = leads.length;
  const newly = leads.filter((l) => l.status === "new").length;
  const qualified = leads.filter((l) => l.status === "qualified").length;
  const won = leads.filter((l) => l.status === "won").length;
  const last7d = leads.filter(
    (l) => Date.now() - new Date(l.created_at).getTime() < 7 * 24 * 60 * 60 * 1000,
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
            Leads
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Every captured lead from the contact form, chatbots, and manual
            entry. Filter by status, service, or free-text search.
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
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <StatCard label="Total" value={total} icon={HiUsers} accent="text-white" />
        <StatCard label="New" value={newly} icon={HiSparkles} accent="text-amber" />
        <StatCard
          label="Qualified"
          value={qualified}
          icon={HiCheckCircle}
          accent="text-emerald-400"
        />
        <StatCard
          label="Won"
          value={won}
          icon={HiCurrencyDollar}
          accent="text-emerald-300"
        />
        <StatCard label="Last 7 days" value={last7d} icon={HiUsers} accent="text-blue-300" />
      </section>

      {/* Filterable table (client component) */}
      <section className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
        <LeadsTableClient leads={leads} />
      </section>

      {/* Helpful footer */}
      <footer className="text-[10px] font-mono text-gray-600 flex items-center gap-3 flex-wrap">
        <span>
          Stored in Supabase table <code className="text-gray-400">leads</code>.
        </span>
        <span>
          Scheduled follow-ups dispatch from{" "}
          <Link
            href="/admin/email-log"
            className="text-gray-400 hover:text-amber underline-offset-2 hover:underline"
          >
            Email Log
          </Link>{" "}
          via the Vercel cron.
        </span>
      </footer>
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
