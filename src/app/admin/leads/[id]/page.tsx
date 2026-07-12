import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  LeadDetailClient,
  type LeadDetail,
  type LeadFollowup,
} from "./LeadDetailClient";

/* ------------------------------------------------------------------ */
/*  Admin Lead Detail \u2014 server component. Pulls the lead row plus    */
/*  every follow-up row (most recent first), then hands everything off */
/*  to LeadDetailClient for the interactive bits.                     */
/* ------------------------------------------------------------------ */

async function fetchLead(id: string): Promise<LeadDetail | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;
  const { data, error } = await client
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("fetchLead error:", error);
    return null;
  }
  return (data ?? null) as LeadDetail | null;
}

async function fetchFollowups(leadId: string): Promise<LeadFollowup[]> {
  const client = getSupabaseAdmin();
  if (!client) return [];
  const { data, error } = await client
    .from("lead_followups")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) {
    console.error("fetchFollowups error:", error);
    return [];
  }
  return (data ?? []) as LeadFollowup[];
}

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lead, followups] = await Promise.all([
    fetchLead(id),
    fetchFollowups(id),
  ]);

  if (!lead) {
    notFound();
  }

  return <LeadDetailClient lead={lead} followups={followups} />;
}
