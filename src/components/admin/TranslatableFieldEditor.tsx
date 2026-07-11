"use client";

import { ALL_LANGUAGES, LANGUAGE_FLAGS, LANGUAGE_LABELS, type Language, type TranslatableString } from "@/lib/cms-types";
import { Flag } from "@/components/layout/Flag";

interface TranslatableFieldProps {
  label: string;
  value: TranslatableString;
  onChange: (value: TranslatableString) => void;
  type?: "text" | "textarea" | "richtext";
  placeholder?: string;
  rows?: number;
  required?: boolean;
  className?: string;
}

export function TranslatableFieldEditor({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  rows = 3,
  required,
  className = "",
}: TranslatableFieldProps) {
  const handleChange = (lang: Language, newVal: string) => {
    onChange({ ...value, [lang]: newVal });
  };

  return (
    <div className={className ? "space-y-2 " + className : "space-y-2"}>
      <label className="flex items-center gap-2 text-sm font-bold text-white">
        {label}
        {required && <span className="text-red-400 text-xs">*</span>}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {ALL_LANGUAGES.map((lang) => (
          <div key={lang}>
            <div className="flex items-center gap-1.5 mb-1">
              <Flag code={LANGUAGE_FLAGS[lang]} width={16} height={12} />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                {LANGUAGE_LABELS[lang]}
              </span>
            </div>
            {type === "textarea" || type === "richtext" ? (
              <textarea
                value={value[lang] || ""}
                onChange={(e) => handleChange(lang, e.target.value)}
                rows={type === "richtext" ? 8 : rows}
                placeholder={placeholder ?? LANGUAGE_LABELS[lang] + "..."}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none transition-colors resize-y"
              />
            ) : (
              <input
                type="text"
                value={value[lang] || ""}
                onChange={(e) => handleChange(lang, e.target.value)}
                placeholder={placeholder ?? LANGUAGE_LABELS[lang] + "..."}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none transition-colors"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface TranslatableArrayEditorProps {
  label: string;
  value: Record<Language, string[]>;
  onChange: (value: Record<Language, string[]>) => void;
  className?: string;
}

export function TranslatableArrayEditor({
  label,
  value,
  onChange,
  className = "",
}: TranslatableArrayEditorProps) {
  const addItem = (lang: Language) => {
    const updated = { ...value };
    updated[lang] = [...(updated[lang] || []), ""];
    onChange(updated);
  };

  const removeItem = (lang: Language, index: number) => {
    const updated = { ...value };
    updated[lang] = (updated[lang] || []).filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleItemChange = (lang: Language, index: number, newVal: string) => {
    const updated = { ...value };
    updated[lang] = [...(updated[lang] || [])];
    updated[lang][index] = newVal;
    onChange(updated);
  };

  return (
    <div className={className ? "space-y-2 " + className : "space-y-2"}>
      <label className="text-sm font-bold text-white">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ALL_LANGUAGES.map((lang) => (
          <div key={lang} className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Flag code={LANGUAGE_FLAGS[lang]} width={16} height={12} />
              <span className="text-[10px] font-bold text-gray-500 uppercase">
                {LANGUAGE_LABELS[lang]}
              </span>
              <button
                type="button"
                onClick={() => addItem(lang)}
                className="ml-auto text-[10px] text-amber font-bold hover:text-white transition-colors"
              >
                + Add
              </button>
            </div>
            {(value[lang] || []).map((item, i) => (
              <div key={lang + "-" + i} className="flex gap-1">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleItemChange(lang, i, e.target.value)}
                  placeholder={LANGUAGE_LABELS[lang] + " item " + (i + 1)}
                  className="flex-1 bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => removeItem(lang, i)}
                  className="px-2 text-xs text-gray-600 hover:text-red-400 transition-colors"
                >
                  x
                </button>
              </div>
            ))}
            {(!value[lang] || value[lang].length === 0) && (
              <p className="text-[10px] text-gray-600 italic">No items</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SaveStatus({
  status,
}: {
  status: "idle" | "saving" | "saved" | "error";
}) {
  if (status === "idle") return null;

  const config = {
    saving: { text: "Saving...", color: "text-amber", dot: "bg-amber" },
    saved: { text: "Saved", color: "text-emerald-400", dot: "bg-emerald-400" },
    error: { text: "Error saving", color: "text-red-400", dot: "bg-red-400" },
  };

  const c = config[status];

  return (
    <span className={"inline-flex items-center gap-1.5 text-xs font-medium " + c.color}>
      <span className={"w-1.5 h-1.5 rounded-full " + c.dot} />
      {c.text}
    </span>
  );
}
