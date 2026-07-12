"use client";

import { useEffect, useLayoutEffect, useState, useCallback, useRef } from "react";
import { getSupabase, hasSupabase } from "@/lib/supabase";
import type { Language } from "@/lib/cms-types";

/* ------------------------------------------------------------------ */
/*  Generic CMS fetch hook                                            */
/*                                                                   */
/*  PHASE 4: in addition to the initial fetch on mount, this hook    */
/*  subscribes to Supabase Realtime postgres_changes events on the   */
/*  table backing the requested `section`. Whenever an admin row     */
/*  update lands in public CMS tables, we re-fetch.                  */
/*                                                                   */
/*  PII safety: only the 24 public CMS tables are whitelisted in     */
/*  SECTION_TO_TABLE. leads / lead_followups / email_log / llm_log  */
/*  / notify_subscribers are intentionally absent \u2014 the anon-key    */
/*  public client must NEVER subscribe to PII.                       */
/* ------------------------------------------------------------------ */

/**
 * Section key \u2192 DB table name. Mirrors the ALLOWED_TABLES list in
 * src/app/api/cms/[section]/route.ts plus the sectionEditorConfigs
 * entry in src/lib/content-editor-config.tsx. Defined locally here
 * to avoid a circular import between useCms and the editor config.
 */
const SECTION_TO_TABLE: Readonly<Record<string, string>> = Object.freeze({
  "site-settings": "site_settings",
  "header-nav": "header_nav_links",
  "footer": "footer_content",
  "hero": "hero_content",
  "services": "core_services",
  "process": "process_steps",
  "why-choose-us": "why_choose_us_content",
  "why-choose-us-benefits": "why_choose_us_benefits",
  "about": "about_page_content",
  "about-stats": "about_stats",
  "about-values": "about_values",
  "packages": "service_packages",
  "testimonials": "testimonials",
  "faq": "faq_entries",
  "projects": "projects",
  "insights": "insights",
  "buy-business-niches": "buy_business_niches",
  "buy-business-brands": "buy_business_brands",
  "legal-pages": "legal_pages",
  "contact-form": "contact_form_config",
  "service-pages": "service_page_content",
  "niche-stats": "niche_stats",
  "niche-inclusions": "niche_inclusions",
  "section-labels": "section_labels",
});

interface UseCmsOptions<T> {
  /** Fallback data when Supabase is not configured or loading. */
  fallback?: T;
  /** Language for translation (not used in raw fetch, but passed for context). */
  lang?: Language;
}

interface UseCmsResult<T> {
  data: T | undefined;
  loading: boolean;
  error: string | null;
  mutate: () => void;
}

export function useCms<T = unknown>(
  section: string,
  options: UseCmsOptions<T> = {},
): UseCmsResult<T> {
  const { fallback } = options;
  const [data, setData] = useState<T | undefined>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to hold latest fallback, avoiding stale closures without
  // adding it to useCallback deps (which would cause infinite re-renders
  // when fallback is an inline array/object literal like [] or {}).
  // The ref is updated in useLayoutEffect (not during render) so that
  // effects triggered by `fallback` changes always see the up-to-date value.
  const fallbackRef = useRef(fallback);
  useLayoutEffect(() => {
    fallbackRef.current = fallback;
  }, [fallback]);

  const fetchData = useCallback(async () => {
    if (!hasSupabase()) {
      setData(fallbackRef.current);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/cms/${section}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch ${section}: ${res.statusText}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setData(fallbackRef.current);
    } finally {
      setLoading(false);
    }
  }, [section]);

  // Ref to the latest fetchData so the Realtime callback always calls
  // the most-recent bound function (mirrors the fallbackRef pattern).
  const fetchRef = useRef(fetchData);
  useLayoutEffect(() => {
    fetchRef.current = fetchData;
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Phase 4: live CMS updates via Supabase Realtime.
  // One channel per (section) \u2014 listens to postgres_changes on the
  // whitelisted table backed by `section`. On any event we re-fetch;
  // dedupe with the initial-fetch path is intentional and safe.
  useEffect(() => {
    const client = getSupabase();
    const tableName = SECTION_TO_TABLE[section];

    // Defensive no-op: Supabase not configured (e.g. local dev), or the
    // caller passed a section that isn't in the public allowlist.
    // The initial HTTP fetch still runs and returns whatever the API
    // says, so this never breaks the hook's contract.
    if (!client || !tableName) return;

    const channel = client
      .channel(`public:${tableName}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
        () => {
          // Latest bound fetcher \u2014 always uses the current `section`
          // even if the component re-rendered with a different one.
          fetchRef.current();
        },
      )
      .subscribe((status, err) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          // Surface subscription failures to the console. The user still
          // sees correct data via the initial fetch + any manual mutate()
          // \u2014 we never block UI on Realtime being healthy.
          if (err) {
            console.warn(
              `[useCms] Realtime subscription ${status} for ${tableName}:`,
              err.message ?? err,
            );
          } else {
            console.warn(`[useCms] Realtime subscription ${status} for ${tableName}`);
          }
        }
      });

    return () => {
      // removeChannel unwinds the WebSocket cleanly and fires the
      // UNSUBSCRIBED status so the close isn't logged as an error.
      client.removeChannel(channel);
    };
  }, [section]);

  return { data, loading, error, mutate: fetchData };
}

/* ------------------------------------------------------------------ */
/*  CMS mutation helpers                                              */
/* ------------------------------------------------------------------ */

export async function saveCmsData(section: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/cms/${section}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Save failed");
  }
  return res.json();
}

export async function createCmsItem(section: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/cms/${section}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Create failed");
  }
  return res.json();
}

export async function deleteCmsItem(section: string, id: string) {
  const res = await fetch(`/api/cms/${section}?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Delete failed");
  }
}
