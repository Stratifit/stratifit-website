"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiArrowLeft,
  HiPlus,
  HiTrash,
  HiArrowUp,
  HiArrowDown,
  HiExclamationTriangle,
} from "react-icons/hi2";
import {
  TranslatableFieldEditor,
  TranslatableArrayEditor,
  SaveStatus,
} from "@/components/admin/TranslatableFieldEditor";
import { sectionEditorConfigs } from "@/lib/content-editor-config";
import {
  emptyTranslatableString,
  emptyTranslatableArray,
  type Language,
} from "@/lib/cms-types";
import { hasSupabase } from "@/lib/supabase";
import {
  saveCmsData,
  createCmsItem,
  deleteCmsItem,
} from "@/lib/use-cms";
export default function ContentEditorPage() {
  const params = useParams();
  const section = params.section as string;
  const config = sectionEditorConfigs[section];

  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const fetchData = useCallback(async () => {
    if (!config) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cms/${config.table}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data: unknown = await res.json();
      setItems(
        config.single
          ? data
            ? [data as Record<string, unknown>]
            : []
          : Array.isArray(data)
            ? (data as Record<string, unknown>[])
            : [],
      );
    } catch (err) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(err instanceof Error ? err.message : "Error loading");
    } finally {
      setLoading(false);
    }
  }, [config]);

  // fetchData internally calls setLoading/setError/setItems, so the call from a
  // useEffect counts as a "setState in effect" per the react-compiler rule.
  // This is the canonical data-fetching pattern; we deliberately let the
  // effect trigger the state transitions rather than driving them off renders.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    fetchData();
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [fetchData]);

  if (!hasSupabase()) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/content"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <HiArrowLeft className="text-lg" />
          </Link>
          <div>
            <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-1">
              Content Editor
            </p>
            <h1 className="font-heading font-black text-2xl text-white">
              {config?.title ?? "Supabase Required"}
            </h1>
          </div>
        </div>
        <div className="bg-amber/5 border border-amber/20 rounded-2xl p-8 text-center">
          <HiExclamationTriangle className="text-amber text-3xl mx-auto mb-4" />
          <h2 className="font-heading font-bold text-lg text-white mb-2">
            Supabase Not Configured
          </h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-4">
            Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in
            .env.local then restart the dev server.
          </p>
          <ol className="text-xs text-gray-500 text-left max-w-md mx-auto space-y-1 list-decimal list-inside">
            <li>Create a project at supabase.com</li>
            <li>Run migration SQL from scripts/cms-migration.sql</li>
            <li>Copy URL and keys to .env.local</li>
          </ol>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Section not found: {section}</p>
        <Link
          href="/admin/content"
          className="text-amber text-sm mt-4 inline-block"
        >
          Back to Content
        </Link>
      </div>
    );
  }

  const updateField = (itemIndex: number, key: string, value: unknown) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[itemIndex] = { ...updated[itemIndex], [key]: value };
      return updated;
    });
  };

  const handleSave = async (itemIndex: number) => {
    const item = items[itemIndex];
    if (!item) return;
    setSaveStatus("saving");
    try {
      await saveCmsData(config.table, item);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleAdd = async () => {
    const newItem: Record<string, unknown> = {};
    config.translatableFields.forEach((f) => {
      newItem[f.key] =
        f.type === "array" ? emptyTranslatableArray() : emptyTranslatableString();
    });
    config.plainFields.forEach((f) => {
      if (f.type === "boolean") newItem[f.key] = true;
      else if (f.type === "number") newItem[f.key] = items.length;
      else if (f.type === "json-array") newItem[f.key] = [];
      else newItem[f.key] = "";
    });
    try {
      const created = await createCmsItem(config.table, newItem);
      setItems((prev) => [...prev, created as Record<string, unknown>]);
    } catch {
      alert("Failed to create item");
    }
  };

  const handleDelete = async (itemIndex: number) => {
    const item = items[itemIndex];
    if (!item?.id) return;
    if (!confirm("Delete this item?")) return;
    try {
      await deleteCmsItem(config.table, item.id as string);
      setItems((prev) => prev.filter((_, j) => j !== itemIndex));
    } catch {
      alert("Failed to delete");
    }
  };

  const handleMove = (from: number, to: number) => {
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    updated.forEach((it, i) => {
      it.sort_order = i;
    });
    setItems(updated);
    updated.forEach((it) => {
      saveCmsData(config.table, it).catch(() => {});
    });
  };

  const renderField = (
    item: Record<string, unknown>,
    itemIndex: number,
    field: { key: string; label: string; type: string; required?: boolean },
  ): React.ReactNode => {
    const val = item[field.key] as unknown;

    if (field.type === "array") {
      return (
        <TranslatableArrayEditor
          key={field.key}
          label={field.label}
          value={
            (val as Record<Language, string[]>) || emptyTranslatableArray()
          }
          onChange={(v) => updateField(itemIndex, field.key, v)}
        />
      );
    }

    if (
      field.type === "text" ||
      field.type === "textarea" ||
      field.type === "richtext"
    ) {
      return (
        <TranslatableFieldEditor
          key={field.key}
          label={field.label}
          value={
            (val as Record<Language, string>) || emptyTranslatableString()
          }
          onChange={(v) => updateField(itemIndex, field.key, v)}
          type={field.type as "text" | "textarea" | "richtext"}
          required={field.required}
        />
      );
    }

    if (field.type === "boolean") {
      return (
        <div key={field.key} className="space-y-1.5">
          <label className="text-sm font-bold text-white">
            {field.label}
          </label>
          <input
            type="checkbox"
            checked={Boolean(val)}
            onChange={(e) =>
              updateField(itemIndex, field.key, e.target.checked)
            }
            className="w-4 h-4 rounded accent-amber"
          />
        </div>
      );
    }

    if (field.type === "number") {
      return (
        <div key={field.key} className="space-y-1.5">
          <label className="text-sm font-bold text-white">
            {field.label}
          </label>
          <input
            type="number"
            value={Number(val) || 0}
            onChange={(e) =>
              updateField(itemIndex, field.key, Number(e.target.value))
            }
            className="w-full max-w-[120px] bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-amber/50 focus:outline-none transition-colors"
          />
        </div>
      );
    }

    const isTextarea =
      field.type === "json-array" || field.type === "json-object";
    return (
      <div key={field.key} className="space-y-1.5">
        <label className="text-sm font-bold text-white">{field.label}</label>
        {isTextarea ? (
          <textarea
            value={
              typeof val === "string" ? val : JSON.stringify(val, null, 2)
            }
            onChange={(e) => {
              try {
                updateField(
                  itemIndex,
                  field.key,
                  JSON.parse(e.target.value),
                );
              } catch {
                updateField(itemIndex, field.key, e.target.value);
              }
            }}
            rows={6}
            className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-gray-600 focus:border-amber/50 focus:outline-none transition-colors resize-y"
          />
        ) : (
          <input
            type="text"
            value={String(val ?? "")}
            onChange={(e) =>
              updateField(itemIndex, field.key, e.target.value)
            }
            className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none transition-colors"
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-6 h-6 border-2 border-amber/30 border-t-amber rounded-full animate-spin mx-auto" />
        <p className="text-xs text-gray-500 mt-3">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link
          href="/admin/content"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <HiArrowLeft className="text-lg" />
        </Link>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-1">
            Content Editor
          </p>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            {config.title}
          </h1>
          <p className="text-xs text-gray-400 mt-1">{config.description}</p>
        </div>
        <SaveStatus status={saveStatus} />
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={fetchData}
            className="text-amber text-xs mt-2 font-bold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!error && items.length === 0 && (
        <div className="text-center py-12 bg-card-dark rounded-2xl border border-white/5">
          <p className="text-gray-400 text-sm">No items yet.</p>
          {!config.single && (
            <button
              onClick={handleAdd}
              className="mt-3 px-6 py-2.5 bg-amber text-black font-bold text-sm rounded-xl hover:bg-amber-light transition-all inline-flex items-center gap-2"
            >
              <HiPlus className="text-base" /> Add First Item
            </button>
          )}
        </div>
      )}

      {/* Items */}
      {items.map((item, itemIndex) => (
        <motion.div
          key={(item.id as string) || itemIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden"
        >
          {/* Item toolbar */}
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-heading font-bold text-white text-sm">
                {config.single ? config.title : `Item ${itemIndex + 1}`}
              </h2>
              {!config.single && (item.id as string) && (
                <p className="text-[10px] font-mono text-gray-600">
                  ID: {String(item.id).slice(0, 8)}...
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!config.single && (
                <>
                  <button
                    onClick={() => handleMove(itemIndex, itemIndex - 1)}
                    disabled={itemIndex === 0}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <HiArrowUp className="text-sm" />
                  </button>
                  <button
                    onClick={() => handleMove(itemIndex, itemIndex + 1)}
                    disabled={itemIndex === items.length - 1}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <HiArrowDown className="text-sm" />
                  </button>
                  <button
                    onClick={() => handleDelete(itemIndex)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <HiTrash className="text-sm" />
                  </button>
                </>
              )}
              <button
                onClick={() => handleSave(itemIndex)}
                className="px-5 py-2 bg-amber text-black font-bold text-xs rounded-xl hover:bg-amber-light transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Translatable fields */}
          <div className="p-6 space-y-5">
            {config.translatableFields.map((field) =>
              renderField(item, itemIndex, field),
            )}

            {/* Non-translatable fields divider */}
            {config.plainFields.length > 0 && (
              <>
                <div className="border-t border-white/5 pt-5">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">
                    Non-Translatable Fields
                  </p>
                  <div className="space-y-5">
                    {config.plainFields.map((field) =>
                      renderField(item, itemIndex, field),
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      ))}

      {/* Add button for list-mode tables */}
      {!config.single && !error && items.length > 0 && (
        <button
          onClick={handleAdd}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-white/10 hover:border-amber/30 text-gray-500 hover:text-amber text-sm font-bold transition-all flex items-center justify-center gap-2"
        >
          <HiPlus className="text-base" /> Add New Item
        </button>
      )}
    </div>
  );
}