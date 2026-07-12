import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  HiArrowTopRightOnSquare,
  HiEnvelope,
  HiCheckCircle,
  HiXCircle,
  HiClock,
} from "react-icons/hi2";
import { EmailLogTableClient, type EmailLogRow } from "./EmailLogTableClient";

/* ------------------------------------------------------------------ */
/*  Admin Email Log \u2014 audit trail of every Resend send.            */
/*  Server component: talks directly to Supabase (already protected     */
/*  by the AdminGuard in src/app/admin/layout.tsx).                    */
/* ------------------------------------------------------------------ */

const DEFAULT_LIMIT = 200;

async function fetchLogs(): Promise<EmailLogRow[]> {
  const client = getSupabaseAdmin();
  if (!client) return [];
  const { data, error } = await client
    .from("email_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(DEFAULT_LIMIT);
  if (error) {
    console.error("fetchLogs error:", error);
    return [];
  }
  return (data ?? []) as EmailLogRow[];
}

function getSupabaseDashboardUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  const projectRef = match?.[1];
  if (!projectRef) return "https://supabase.com/dashboard";
  return `https://supabase.com/dashboard/project/${projectRef}/editor`;
}

export default async function EmailLogPage() {
  const [rows, dashboardUrl] = await Promise.all([
    fetchLogs(),
    Promise.resolve(getSupabaseDashboardUrl()),
  ]);

  const total = rows.length;
  const queued = rows.filter((r) => r.status === "queued").length;
  const sent = rows.filter((r) => r.status === "sent").length;
  const failed = rows.filter((r) => r.status === "failed").length;
  const hasResendKey = Boolean(process.env.RESEND_API_KEY);
  const hasMailFrom = Boolean(process.env.MAIL_FROM);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            CRM &amp; Sales
          </p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Email Log
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Append-only audit trail of every Resend send (welcome,
            launch, follow-ups).
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

      {/* Status banner if email is not configured */}
      {(!hasResendKey || !hasMailFrom) && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-200">
          <strong>Resend not configured.</strong> Set{" "}
          <code>RESEND_API_KEY</code> and <code>MAIL_FROM</code> in
          Environment Variables (e.g. Vercel \u2192 Project \u2192 Settings),
          then redeploy. Saves still work via{" "}
          <Link
            href="/admin/subscriptions"
            className="underline underline-offset-2 hover:text-red-100"
          >
            Notify Subscribers
          </Link>
          ; only the email leg fails.
        </div>
      )}

      {/* Stat cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total" value={total} icon={HiEnvelope} accent="text-white" />
        <StatCard label="Sent" value={sent} icon={HiCheckCircle} accent="text-emerald-400" />
        <StatCard label="Queued" value={queued} icon={HiClock} accent="text-amber" />
        <StatCard label="Failed" value={failed} icon={HiXCircle} accent="text-red-400" />
      </section>

      {/* Table (client component) */}
      <section className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
        <EmailLogTableClient rows={rows} />
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
