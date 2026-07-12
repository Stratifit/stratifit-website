import { getSupabaseAdmin } from "@/lib/supabase";
import { DashboardClient, type UpcomingFollowup } from "./DashboardClient";

/* ------------------------------------------------------------------ */
/*  Admin overview \u2014 server component. Fetches the small set of     */
/*  numbers + the next 4 upcoming lead_followups. All motion/animation */
/*  lives in the DashboardClient so the page itself stays server-only. */
/* ------------------------------------------------------------------ */

const MAX_UPCOMING = 4;

async function fetchUpcomingFollowups(): Promise<UpcomingFollowup[]> {
  const client = getSupabaseAdmin();
  if (!client) return [];
  const { data, error } = await client
    .from("lead_followups")
    .select(
      "id, lead_id, topic, status, scheduled_for, leads!inner ( id, name, email )",
    )
    .eq("status", "scheduled")
    .gt("scheduled_for", new Date().toISOString())
    .order("scheduled_for", { ascending: true })
    .limit(MAX_UPCOMING);
  if (error) {
    console.error("fetchUpcomingFollowups error:", error);
    return [];
  }
  type Joined = {
    id: string;
    lead_id: string;
    topic: string;
    status: string;
    scheduled_for: string;
    leads: { id: string; name: string | null; email: string } | null;
  };
  const rows = ((data ?? []) as unknown) as Joined[];
  return rows.map((r) => ({
    id: r.id,
    lead_id: r.lead_id,
    lead_name: r.leads?.name || r.leads?.email?.split("@")[0] || "Lead",
    lead_email: r.leads?.email || "",
    topic: r.topic,
    status: r.status,
    scheduled_for: r.scheduled_for,
  }));
}

async function fetchLeadCounts(): Promise<{
  total: number;
  newCount: number;
  scheduledFollowupsThisWeek: number;
}> {
  const client = getSupabaseAdmin();
  if (!client) return { total: 0, newCount: 0, scheduledFollowupsThisWeek: 0 };
  const [totalRow, newRow, upcomingRow] = await Promise.all([
    client.from("leads").select("id", { count: "exact", head: true }),
    client
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    client
      .from("lead_followups")
      .select("id", { count: "exact", head: true })
      .eq("status", "scheduled")
      .gt(
        "scheduled_for",
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      ),
  ]);
  return {
    total: totalRow.count ?? 0,
    newCount: newRow.count ?? 0,
    scheduledFollowupsThisWeek: upcomingRow.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const [upcoming, counts] = await Promise.all([
    fetchUpcomingFollowups(),
    fetchLeadCounts(),
  ]);

  return (
    <DashboardClient upcomingFollowups={upcoming} leadCounts={counts} />
  );
}
