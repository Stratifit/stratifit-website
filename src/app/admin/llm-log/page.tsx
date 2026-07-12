import { getSupabaseAdmin } from "@/lib/supabase";
import {
  HiArrowTopRightOnSquare,
  HiCpuChip,
  HiCheckCircle,
  HiExclamationCircle,
  HiNoSymbol,
} from "react-icons/hi2";
import { LlmLogTableClient, type LlmLogRow } from "./LlmLogTableClient";

/* ------------------------------------------------------------------ */
/*  Admin LLM Log \u2014 audit trail of every Groq call from any chatbot. */
/* ------------------------------------------------------------------ */

const DEFAULT_LIMIT = 200;

async function fetchLogs(): Promise<LlmLogRow[]> {
  const client = getSupabaseAdmin();
  if (!client) return [];
  const { data, error } = await client
    .from("llm_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(DEFAULT_LIMIT);
  if (error) {
    console.error("fetchLogs (llm_log) error:", error);
    return [];
  }
  return (data ?? []) as LlmLogRow[];
}

function getSupabaseDashboardUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  const projectRef = match?.[1];
  if (!projectRef) return "https://supabase.com/dashboard";
  return `https://supabase.com/dashboard/project/${projectRef}/editor`;
}

export default async function LlmLogPage() {
  const [rows, dashboardUrl] = await Promise.all([
    fetchLogs(),
    Promise.resolve(getSupabaseDashboardUrl()),
  ]);

  const total = rows.length;
  const ok = rows.filter((r) => r.status === "ok").length;
  const failed = rows.filter(
    (r) => r.status === "error" || r.status === "timeout" || r.status === "empty_response",
  ).length;
  const skipped = rows.filter(
    (r) =>
      r.status === "no_api_key" ||
      r.status === "rate_limited" ||
      r.status === "disabled",
  ).length;
  const hasGroqKey = Boolean(process.env.GROQ_API_KEY);
  const flagDisabled =
    process.env.AI_FALLBACK_TO_LLM === "false" ||
    process.env.AI_FALLBACK_TO_LLM === "0";

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            System
          </p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            LLM Log
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Append-only audit trail of every Groq call from any chatbot.
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

      {!hasGroqKey && (
        <div className="bg-amber/10 border border-amber/30 rounded-xl px-4 py-3 text-sm text-amber">
          <strong>Groq not configured.</strong> Set{" "}
          <code>GROQ_API_KEY</code> in Environment Variables (e.g. Vercel \u2192
          Project \u2192 Settings), then redeploy. Without it, every chat question
          falls back to canned responses.
        </div>
      )}
      {hasGroqKey && flagDisabled && (
        <div className="bg-amber/10 border border-amber/30 rounded-xl px-4 py-3 text-sm text-amber">
          <strong>LLM routing disabled by flag.</strong>{" "}
          <code>AI_FALLBACK_TO_LLM=false</code> is set, so chatbots behave as
          before Phase 2. Set it to <code>true</code> to enable.
        </div>
      )}

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total" value={total} icon={HiCpuChip} accent="text-white" />
        <StatCard label="Ok" value={ok} icon={HiCheckCircle} accent="text-emerald-400" />
        <StatCard label="Failed" value={failed} icon={HiExclamationCircle} accent="text-red-400" />
        <StatCard label="Skipped" value={skipped} icon={HiNoSymbol} accent="text-gray-400" />
      </section>

      <section className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
        <LlmLogTableClient rows={rows} />
      </section>
    </div>
  );
}

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
