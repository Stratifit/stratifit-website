"use client";

import { useState, useMemo } from "react";
import { useCms, saveCmsData, createCmsItem, deleteCmsItem } from "@/lib/use-cms";
import {
  type ProjectItem,
  type TranslatableArray,
  type TranslatableString,
} from "@/lib/cms-types";
import { slugify } from "@/lib/slugify";

/* ------------------------------------------------------------------ */
/*  Local helpers                                                      */
/* ------------------------------------------------------------------ */

type LangCode = "en" | "de" | "fr" | "es";
const LANGS: readonly LangCode[] = ["en", "de", "fr", "es"] as const;

function pickLocalized(
  v: TranslatableString | string | null | undefined,
  lang: LangCode,
): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  return v[lang] ?? v.en ?? "";
}

function pickLocalizedArray(
  v: TranslatableArray | string[] | null | undefined,
  lang: LangCode,
): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  return v[lang] ?? v.en ?? [];
}

interface ProjectRow extends Omit<
  ProjectItem,
  "title" | "description" | "tags" | "challenge" | "solution" | "results" | "short_label" | "services"
> {
  title: TranslatableString;
  description: TranslatableString;
  tags: TranslatableArray;
  challenge: TranslatableString;
  solution: TranslatableString;
  results: TranslatableArray;
  short_label: TranslatableString;
  services: TranslatableArray;
}

type ProjectDraft = Omit<ProjectRow, "id">;

const EMPTY_DRAFT: ProjectDraft = {
  sort_order: 99,
  slug: "",
  title: { en: "", de: "", fr: "", es: "" },
  category: "",
  description: { en: "", de: "", fr: "", es: "" },
  image: "",
  tags: { en: [], de: [], fr: [], es: [] },
  challenge: { en: "", de: "", fr: "", es: "" },
  solution: { en: "", de: "", fr: "", es: "" },
  results: { en: [], de: [], fr: [], es: [] },
  short_metric: "",
  short_label: { en: "", de: "", fr: "", es: "" },
  client: "",
  industry: "",
  timeline: "",
  services: { en: [], de: [], fr: [], es: [] },
  gallery: [],
  is_active: true,
};

export default function PortfolioAdminPage() {
  const { data, loading, error, mutate } = useCms<ProjectRow[]>("projects");
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [draft, setDraft] = useState<ProjectDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);

  const sorted = useMemo(
    () => (data ?? []).slice().sort((a, b) => a.sort_order - b.sort_order),
    [data],
  );

  /* ----- lifecycle helpers ----- */

  const startCreate = () => {
    setEditing({ id: "__new__", ...EMPTY_DRAFT } as ProjectRow);
    setDraft({ ...EMPTY_DRAFT });
  };

  const startEdit = (row: ProjectRow) => {
    setEditing(row);
    setDraft({
      sort_order: row.sort_order ?? 99,
      slug: row.slug ?? "",
      title:
        (typeof row.title === "object" && row.title !== null
          ? row.title
          : { en: String(row.title ?? ""), de: "", fr: "", es: "" }) ??
        { en: "", de: "", fr: "", es: "" },
      category: row.category ?? "",
      description:
        (typeof row.description === "object" && row.description !== null
          ? row.description
          : { en: String(row.description ?? ""), de: "", fr: "", es: "" }) ??
        { en: "", de: "", fr: "", es: "" },
      image: row.image ?? "",
      tags:
        typeof row.tags === "object" && !Array.isArray(row.tags) && row.tags !== null
          ? row.tags
          : { en: Array.isArray(row.tags) ? row.tags : [], de: [], fr: [], es: [] },
      challenge:
        (typeof row.challenge === "object" && row.challenge !== null
          ? row.challenge
          : { en: String(row.challenge ?? ""), de: "", fr: "", es: "" }) ??
        { en: "", de: "", fr: "", es: "" },
      solution:
        (typeof row.solution === "object" && row.solution !== null
          ? row.solution
          : { en: String(row.solution ?? ""), de: "", fr: "", es: "" }) ??
        { en: "", de: "", fr: "", es: "" },
      results:
        typeof row.results === "object" && !Array.isArray(row.results) && row.results !== null
          ? row.results
          : {
              en: Array.isArray(row.results) ? row.results : [],
              de: [],
              fr: [],
              es: [],
            },
      short_metric: row.short_metric ?? "",
      short_label:
        (typeof row.short_label === "object" && row.short_label !== null
          ? row.short_label
          : { en: String(row.short_label ?? ""), de: "", fr: "", es: "" }) ??
        { en: "", de: "", fr: "", es: "" },
      client: row.client ?? "",
      industry: row.industry ?? "",
      timeline: row.timeline ?? "",
      services:
        typeof row.services === "object" && !Array.isArray(row.services) && row.services !== null
          ? row.services
          : {
              en: Array.isArray(row.services) ? row.services : [],
              de: [],
              fr: [],
              es: [],
            },
      gallery: row.gallery ?? [],
      is_active: row.is_active !== false,
    });
  };

  const cancel = () => {
    setEditing(null);
    setDraft({ ...EMPTY_DRAFT });
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      // Auto-backfill slug from the English title when missing so admin
      // doesn't have to hand-write a slug for every project.
      const slug =
        draft.slug.trim() || slugify(pickLocalized(draft.title, "en")) || "untitled";
      const payload: ProjectDraft = { ...draft, slug };
      if (editing.id === "__new__") {
        await createCmsItem("projects", payload);
      } else {
        await saveCmsData("projects", { id: editing.id, ...payload });
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
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setSaving(true);
    try {
      await deleteCmsItem("projects", id);
      await mutate();
    } finally {
      setSaving(false);
    }
  };

  /* ----- JSONB helpers (mutate a single language slot in a draft) ----- */

  const setStringField = (
    field: "title" | "description" | "challenge" | "solution" | "short_label",
    lang: LangCode,
    value: string,
  ) =>
    setDraft((d) => ({
      ...d,
      [field]: {
        ...(d[field] ?? { en: "", de: "", fr: "", es: "" }),
        [lang]: value,
      },
    }));

  const setArrayField = (
    field: "tags" | "results" | "services",
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
        ...(d[field] ?? { en: [], de: [], fr: [], es: [] }),
        [lang]: arr,
      },
    }));
  };

  if (loading) return <div className="p-6 text-gray-400">Loading projects…</div>;
  if (error) return <div className="p-6 text-red-400">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Portfolio</h1>
          <p className="text-sm text-gray-400">
            Selected work shown on /portfolio and the homepage.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          + New project
        </button>
      </div>

      {/* List */}
      <div className="grid gap-4 md:grid-cols-2">
        {sorted.map((row) => (
          <div
            key={row.id}
            className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400">
                  {row.client} · {row.category}
                </div>
                <div className="text-base font-semibold text-white">
                  {pickLocalized(row.title, "en") || row.slug}
                </div>
                <div className="text-xs text-gray-500">/{row.slug}</div>
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
            <p className="text-sm text-gray-400 line-clamp-2">
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
            <div className="flex gap-2 pt-2">
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
        {sorted.length === 0 && (
          <div className="text-sm text-gray-400 col-span-2">No projects yet.</div>
        )}
      </div>

      {/* Editor */}
      {editing && (
        <div className="rounded-lg border border-white/10 bg-black/40 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {editing.id === "__new__" ? "New project" : "Edit project"}
            </h2>
            <button onClick={cancel} className="text-xs text-gray-400 hover:text-white">
              Cancel
            </button>
          </div>

          {/* Identity */}
          <div className="grid gap-3 md:grid-cols-4">
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
              <div className="text-xs text-gray-400">
                Slug{" "}
                <span className="text-gray-600">
                  (auto from title.en if left blank)
                </span>
              </div>
              <input
                value={draft.slug}
                onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
                placeholder="luxe-retail-app"
                className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white"
              />
            </label>
            <label className="space-y-1">
              <div className="text-xs text-gray-400">Category</div>
              <input
                value={draft.category}
                onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                placeholder="Brand Design"
                className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white"
              />
            </label>
            <label className="space-y-1">
              <div className="text-xs text-gray-400">Client</div>
              <input
                value={draft.client}
                onChange={(e) => setDraft((d) => ({ ...d, client: e.target.value }))}
                placeholder="Luxe (confidential)"
                className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white"
              />
            </label>
            <label className="space-y-1">
              <div className="text-xs text-gray-400">Industry</div>
              <input
                value={draft.industry}
                onChange={(e) => setDraft((d) => ({ ...d, industry: e.target.value }))}
                placeholder="Luxury E-commerce"
                className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white"
              />
            </label>
            <label className="space-y-1">
              <div className="text-xs text-gray-400">Timeline</div>
              <input
                value={draft.timeline}
                onChange={(e) => setDraft((d) => ({ ...d, timeline: e.target.value }))}
                placeholder="14 weeks"
                className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white"
              />
            </label>
            <label className="space-y-1">
              <div className="text-xs text-gray-400">Short metric</div>
              <input
                value={draft.short_metric}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, short_metric: e.target.value }))
                }
                placeholder="+69%"
                className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white"
              />
            </label>
          </div>

          {/* Title (per language) */}
          <fieldset className="space-y-2">
            <legend className="text-xs text-gray-400">Title (per language)</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {LANGS.map((lang) => (
                <input
                  key={lang}
                  placeholder={lang.toUpperCase()}
                  value={pickLocalized(draft.title, lang)}
                  onChange={(e) => setStringField("title", lang, e.target.value)}
                  className="rounded-md bg-black/30 border border-white/10 px-2 py-1.5 text-sm text-white"
                />
              ))}
            </div>
          </fieldset>

          {/* Description */}
          <fieldset className="space-y-2">
            <legend className="text-xs text-gray-400">Description (per language)</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {LANGS.map((lang) => (
                <textarea
                  key={lang}
                  placeholder={lang.toUpperCase()}
                  rows={3}
                  value={pickLocalized(draft.description, lang)}
                  onChange={(e) => setStringField("description", lang, e.target.value)}
                  className="rounded-md bg-black/30 border border-white/10 px-2 py-1 text-sm text-white"
                />
              ))}
            </div>
          </fieldset>

          {/* Challenge / Solution */}
          <div className="grid md:grid-cols-2 gap-4">
            <fieldset className="space-y-2">
              <legend className="text-xs text-gray-400">Challenge (per language)</legend>
              {LANGS.map((lang) => (
                <textarea
                  key={lang}
                  placeholder={lang.toUpperCase()}
                  rows={3}
                  value={pickLocalized(draft.challenge, lang)}
                  onChange={(e) => setStringField("challenge", lang, e.target.value)}
                  className="w-full rounded-md bg-black/30 border border-white/10 px-2 py-1 text-sm text-white"
                />
              ))}
            </fieldset>
            <fieldset className="space-y-2">
              <legend className="text-xs text-gray-400">Solution (per language)</legend>
              {LANGS.map((lang) => (
                <textarea
                  key={lang}
                  placeholder={lang.toUpperCase()}
                  rows={3}
                  value={pickLocalized(draft.solution, lang, )}
                  onChange={(e) => setStringField("solution", lang, e.target.value)}
                  className="w-full rounded-md bg-black/30 border border-white/10 px-2 py-1 text-sm text-white"
                />
              ))}
            </fieldset>
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

          {/* Tags / Services / Results */}
          <div className="grid md:grid-cols-2 gap-4">
            <fieldset className="space-y-2">
              <legend className="text-xs text-gray-400">Tags (one per line, per language)</legend>
              {LANGS.map((lang) => (
                <textarea
                  key={lang}
                  placeholder={`${lang.toUpperCase()} — tag per line`}
                  rows={2}
                  value={pickLocalizedArray(draft.tags, lang).join("\n")}
                  onChange={(e) => setArrayField("tags", lang, e.target.value)}
                  className="w-full rounded-md bg-black/30 border border-white/10 px-2 py-1 text-sm text-white"
                />
              ))}
            </fieldset>
            <fieldset className="space-y-2">
              <legend className="text-xs text-gray-400">Services (one per line, per language)</legend>
              {LANGS.map((lang) => (
                <textarea
                  key={lang}
                  placeholder={`${lang.toUpperCase()} — service per line`}
                  rows={2}
                  value={pickLocalizedArray(draft.services, lang).join("\n")}
                  onChange={(e) => setArrayField("services", lang, e.target.value)}
                  className="w-full rounded-md bg-black/30 border border-white/10 px-2 py-1 text-sm text-white"
                />
              ))}
            </fieldset>
          </div>
          <fieldset className="space-y-2">
            <legend className="text-xs text-gray-400">Results (one per line, per language) — used in case-study body</legend>
            {LANGS.map((lang) => (
              <textarea
                key={lang}
                placeholder={`${lang.toUpperCase()} — result per line`}
                rows={2}
                value={pickLocalizedArray(draft.results, lang).join("\n")}
                onChange={(e) => setArrayField("results", lang, e.target.value)}
                className="w-full rounded-md bg-black/30 border border-white/10 px-2 py-1 text-sm text-white"
              />
            ))}
          </fieldset>

          {/* Short label (per language) */}
          <fieldset className="space-y-2">
            <legend className="text-xs text-gray-400">Short label (next to metric, per language)</legend>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {LANGS.map((lang) => (
                <input
                  key={lang}
                  placeholder={lang.toUpperCase()}
                  value={pickLocalized(draft.short_label, lang)}
                  onChange={(e) => setStringField("short_label", lang, e.target.value)}
                  className="rounded-md bg-black/30 border border-white/10 px-2 py-1.5 text-sm text-white"
                />
              ))}
            </div>
          </fieldset>

          {/* Gallery (newline-separated URLs) */}
          <fieldset className="space-y-2">
            <legend className="text-xs text-gray-400">Gallery (one image URL per line)</legend>
            <textarea
              rows={3}
              value={draft.gallery.join("\n")}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  gallery: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .slice(0, 12),
                }))
              }
              className="w-full rounded-md bg-black/30 border border-white/10 px-2 py-1 text-sm text-white"
            />
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
              Active (visible on /portfolio and homepage carousel)
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
              disabled={
                saving ||
                !pickLocalized(draft.title, "en").trim() ||
                !draft.image.trim()
              }
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
