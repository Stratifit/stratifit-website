"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { hasSupabase } from "@/lib/supabase";
import type { Language } from "@/lib/cms-types";

/* ------------------------------------------------------------------ */
/*  Generic CMS fetch hook                                            */
/* ------------------------------------------------------------------ */

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
  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
