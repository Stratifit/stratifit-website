"use client";

import { useState, useMemo } from "react";
import { useCms, saveCmsData, createCmsItem, deleteCmsItem } from "@/lib/use-cms";
import { t as tLocal, type BuyBusinessBrand, type BuyBusinessNiche } from "@/lib/cms-types";

/* ------------------------------------------------------------------ */
/*  Local helpers                                                      */
/* ------------------------------------------------------------------ */

type LangCode = "en" | "de" | "fr" | "es";
const LANGS: readonly LangCode[] = ["en", "de", "fr", "es"] as const;

/** Pull a value out of a TranslatableString (JSONB → object|string). */
function pickLocalized(
  v: Record<string, string> | string | null | undefined,
  lang: LangCode,
): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  return v[lang] ?? v.en ?? "";
}

/** Same for TranslatableArray (JSONB → object|string[]). */
function pickLocalizedArray(
  v: Record<string, string[]> | string[] | null | undefined,
  lang: LangCode,
): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  return v[lang] ?? v.en ?? [];
}

/** Type that matches the row shape Supabase returns for a JSONB column. */
type JsonbString = Record<string, string> | string | null;
type JsonbArray = Record<string, string[]> | string[] | null;

/** The CMS row widened for the form: we accept both old and new JSONB
 *  shape (string | object) so the form degrades gracefully if someone
 *  inserts a row with non-standard JSON. */
interface BrandRow extends Omit<BuyBusinessBrand, "description" | "tags" | "highlights"> {
  description: JsonbString;
  tags: JsonbArray;
  highlights: JsonbArray;
}

type BrandDraft = Omit<BrandRow, "id">;

const EMPTY_DRAFT: BrandDraft = {
  niche_id: "",
  sort_order: 99,
  slug: "",
  name: "",
  price: "",
  revenue: "",
  profit: "",
  description: { en: "", de: "", fr: "", es: "" },
  image: "",
  website_url: "",
  logo: "",
  tags: { en: [], de: [], fr: [], es: [] },
  highlights: { en: [], de: [], fr: [], es: [] },
  is_active: true,
};

export default function BuyBusinessAdminPage() {
  const { data: niches } = useCms<BuyBusinessNiche[]>("buy-business-niches");
  const { data: brands, loading, error, mutate } = useCms<BrandRow[]>(
    "buy-business-brands",
  );
  const [editing, setEditing] = useState<BrandRow | null>(null);
  const [draft, setDraft] = useState<BrandDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);

  const activeNiche = useMemo(
    () => (niches ?? []).find((n) => n.id === draft.niche_id),
    [niches, draft.niche_id],
  );

  /* ----- lifecycle helpers ----- */

  const startCreate = () => {
    const firstNicheId = niches?.[0]?.id ?? "";
    setEditing({ id: "__new__", ...EMPTY_DRAFT, niche_id: firstNicheId } as BrandRow);
    setDraft({ ...EMPTY_DRAFT, niche_id: firstNicheId });
  };

  const startEdit = (row: BrandRow) => {
    setEditing(row);
    setDraft({
      niche_id: row.niche_id,
      sort_order: row.sort_order ?? 99,
      slug: row.slug ?? "",
      name: row.name ?? "",
      price: row.price ?? "",
      revenue: row.revenue ?? "",
      profit: row.profit ?? "",
      description:
        (typeof row.description === "object" && row.description !== null
          ? (row.description as Record<string, string>)
          : { en: String(row.description ?? ""), de: "", fr: "", es: "" }) ??
        { en: "", de: "", fr: "", es: "" },
      image: row.image ?? "",
      website_url: row.website_url ?? "",
      logo: row.logo ?? "",
      tags:
        typeof row.tags === "object" && !Array.isArray(row.tags) && row.tags !== null
          ? (row.tags as Record<string, string[]>)
          : { en: Array.isArray(row.tags) ? row.tags : [], de: [], fr: [], es: [] },
      highlights:
        typeof row.highlights === "object" && !Array.isArray(row.highlights) && row.highlights !== null
          ? (row.highlights as Record<string, string[]>)
          : {
              en: Array.isArray(row.highlights) ? row.highlights : [],
              de: [],
              fr: [],
              es: [],
            },
      is_active: row.is_active !== false,
    });
  };

  const cancel = () => {
    setEditing(null);
    setDraft({ ...EMPTY_DRAFT, niche_id: niches?.[0]?.id ?? "" });
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id === "__new__") {
        await createCmsItem("buy-business-brands", draft);
      } else {
        await saveCmsData("buy-business-brands", { id: editing.id, ...draft });
      }
      await mutate();
      cancel();
    } catch (e) {
      alert("Save failed: " + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this brand? This cannot be undone.")) return;
    setSaving(true);
    try {
      await deleteCmsItem("buy-business-brands", id);
      await mutate();
    } finally {
      setSaving(false);
    }
  };

  /* ----- JSONB helpers (mutate a single language slot in a draft) ----- */

  const setDescription = (lang: LangCode, value: string) =>
    setDraft((d) => ({
      ...d,
      description: {
        ...((d.description as Record<string, string>) ?? { en: "", de: "", fr: "", es: "" }),
        [lang]: value,
      },
    }));

  const setArray = (
    field: "tags" | "highlights",
    lang: LangCode,
    raw: string,
  ) => {
    const arr = raw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 32);
    setDraft((d) => ({
      ...d,
      [field]: {
        ...((d[field] as Record<string, string[]>) ?? { en: [], de: [], fr: [], es: [] }),
        [lang]: arr,
      },
    }));
  };

  if (loading) return <div className="p-6 text-gray-400">Loading brands…</div>;
  if (error) return <div className="p-6 text-red-400">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Buy a Business — Brands</h1>
          <p className="text-sm text-gray-400">
            Manage brand listings surfaced under each niche on /buy-business.
          </p>
        </div>
        <button
          onClick={startCreate}
          disabled={(niches ?? []).length === 0}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          + New brand
        </button>
      </div>

      {(niches ?? []).length === 0 && (
        <div className="rounded-lg border border-amber/30 bg-amber/5 p-4 text-sm text-amber">
          No niches yet. Seed at least one <code>buy_business_niches</code> row in Supabase, then
          come back here to add brands.
        </div>
      )}

      {/* List by niche */}
      <div className="space-y-6">
        {(niches ?? []).map((niche) => {
          const brandsInNiche = (brands ?? []).filter((b) => b.niche_id === niche.id);
          return (
            <section
              key={niche.id}
              className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-400">{niche.slug}</div>
                  <h2 className="text-lg font-semibold text-white">
                    {pickLocalized(niche.title, "en")}{" "}
                    <span className="ml-2 text-2xl">{niche.icon}</span>
                  </h2>
                </div>
                <span className="text-xs text-gray-400">{brandsInNiche.length} brands</span>
              </div>
              {brandsInNiche.length === 0 && (
                <div className="text-sm text-gray-500">No brands in this niche yet.</div>
              )}
              <div className="grid gap-3 md:grid-cols-2">
                {brandsInNiche.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-md border border-white/10 bg-black/30 p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-base font-semibold text-white">
                          {row.logo} {row.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {row.price || "—"} · Rev {row.revenue || "—"} · Profit{" "}
                          {row.profit || "—"}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-md">
                          {row.website_url}
                        </div>
                      </div>
                      {row.is_active ? (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-400">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {pickLocalized(row.description, "en")}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {pickLocalizedArray(row.tags, "en")
                        .slice(0, 4)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => startEdit(row)}
                        className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-white hover:bg-white/10"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(row.id)}
                        disabled={saving}
                        className="rounded-md border border-red-500/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Editor drawer */}
      {editing && (
        <div className="rounded-lg border border-white/10 bg-black/40 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {editing.id === "__new__" ? "New brand" : "Edit brand"}
              {activeNiche && (
                <span className="ml-3 text-sm font-normal text-gray-400">
                  in {pickLocalized(activeNiche.title, "en")} {activeNiche.icon}
                </span>
              )}
            </h2>
            <button
              onClick={cancel}
              className="text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          {/* Identity */}
          <div className="grid gap-3 md:grid-cols-4">
            <label className="space-y-1 md:col-span-2">
              <div className="text-xs text-gray-400">Niche</div>
              <select
                value={draft.niche_id}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, niche_id: e.target.value }))
                }
                className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white"
              >
                {(niches ?? []).map((n) => (
                  <option key={n.id} value={n.id}>
                    {pickLocalized(n.title, "en")} ({n.slug})
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <div className="text-xs text-gray-400">Slug</div>
              <input
                value={draft.slug}
                onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
                placeholder="e.g. luxe-pet-co"
                className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white"
              />
            </label>
            <label className="space-y-1">
              <div className="text-xs text-gray-400">Sort order</div>
              <input
                type="number"
                value={draft.sort_order}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, sort_order: Number(e.target.value) }))
                }
                className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white"
              />
            </label>
            <label className="space-y-1 md:col-span-2">
              <div className="text-xs text-gray-400">Name</div>
              <input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="e.g. Luxe Pet Co."
                className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white"
              />
            </label>
            <label className="space-y-1">
              <div className="text-xs text-gray-400">Logo (emoji or text)</div>
              <input
                value={draft.logo}
                onChange={(e) => setDraft((d) => ({ ...d, logo: e.target.value }))}
                placeholder="e.g. 🐾"
                className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white"
              />
            </label>
            <label className="space-y-1">
              <div className="text-xs text-gray-400">Website URL</div>
              <input
                value={draft.website_url}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, website_url: e.target.value }))
                }
                placeholder="https://example.com"
                className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white"
              />
            </label>
          </div>

          {/* Pricing */}
          <div className="grid gap-3 md:grid-cols-3">
            <label className="space-y-1">
              <div className="text-xs text-gray-400">Asking price</div>
              <input
                value={draft.price}
                onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                placeholder="$45,000"
                className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white"
              />
            </label>
            <label className="space-y-1">
              <div className="text-xs text-gray-400">Revenue</div>
              <input
                value={draft.revenue}
                onChange={(e) => setDraft((d) => ({ ...d, revenue: e.target.value }))}
                placeholder="$8,200/mo"
                className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white"
              />
            </label>
            <label className="space-y-1">
              <div className="text-xs text-gray-400">Profit</div>
              <input
                value={draft.profit}
                onChange={(e) => setDraft((d) => ({ ...d, profit: e.target.value }))}
                placeholder="$3,100/mo"
                className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white"
              />
            </label>
          </div>

          {/* Image */}
          <label className="space-y-1 block">
            <div className="text-xs text-gray-400">Hero image URL</div>
            <input
              value={draft.image}
              onChange={(e) => setDraft((d) => ({ ...d, image: e.target.value }))}
              placeholder="https://images.unsplash.com/…"
              className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white"
            />
            {draft.image && (
              <div className="mt-2 rounded-md border border-white/10 overflow-hidden max-w-md">
                <img
                  src={draft.image}
                  alt="Hero preview"
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "0.2";
                  }}
                />
              </div>
            )}
          </label>

          {/* Description (per language) */}
          <fieldset className="space-y-2">
            <legend className="text-xs text-gray-400">Description (per language)</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {LANGS.map((lang) => (
                <textarea
                  key={lang}
                  placeholder={lang.toUpperCase()}
                  rows={3}
                  value={pickLocalized(draft.description, lang)}
                  onChange={(e) => setDescription(lang, e.target.value)}
                  className="rounded-md bg-black/30 border border-white/10 px-2 py-1 text-sm text-white"
                />
              ))}
            </div>
          </fieldset>

          {/* Tags (per language, newline-separated) */}
          <fieldset className="space-y-2">
            <legend className="text-xs text-gray-400">
              Tags (one per line, per language)
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {LANGS.map((lang) => (
                <textarea
                  key={lang}
                  placeholder={`${lang.toUpperCase()} — tag per line`}
                  rows={3}
                  value={pickLocalizedArray(draft.tags, lang).join("\n")}
                  onChange={(e) => setArray("tags", lang, e.target.value)}
                  className="rounded-md bg-black/30 border border-white/10 px-2 py-1 text-sm text-white"
                />
              ))}
            </div>
          </fieldset>

          {/* Highlights (per language) */}
          <fieldset className="space-y-2">
            <legend className="text-xs text-gray-400">
              Highlights (one per line, per language) — used in detail page
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {LANGS.map((lang) => (
                <textarea
                  key={lang}
                  placeholder={`${lang.toUpperCase()} — highlight per line`}
                  rows={3}
                  value={pickLocalizedArray(draft.highlights, lang).join("\n")}
                  onChange={(e) => setArray("highlights", lang, e.target.value)}
                  className="rounded-md bg-black/30 border border-white/10 px-2 py-1 text-sm text-white"
                />
              ))}
            </div>
          </fieldset>

          {/* Status */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={draft.is_active}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, is_active: e.target.checked }))
                }
              />
              Active (visible on /buy-business)
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
            <button
              onClick={cancel}
              className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-white hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving || !draft.niche_id || !draft.slug || !draft.name}
              className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
