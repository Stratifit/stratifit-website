"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { tLabel } from "@/lib/stratifit-i18n";

/* ------------------------------------------------------------------ */
/*  Language list - single source of truth for the entire header.    */
/*  `labelKey` is resolved via tLabel() so dropdown labels change    */
/*  with the active language (e.g. "Anglais" when French is active). */
/* ------------------------------------------------------------------ */

export const languages = [
  { code: "EN", flag: "🇺🇸", labelKey: "lang_english" },
  { code: "FR", flag: "🇫🇷", labelKey: "lang_french" },
  { code: "DE", flag: "🇩🇪", labelKey: "lang_german" },
  { code: "ES", flag: "🇪🇸", labelKey: "lang_spanish" },
];

interface LanguageDropdownProps {
  size?: "sm" | "md";
}

export function LanguageDropdown({ size = "md" }: LanguageDropdownProps) {
  const { langCode, setLangCode, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const isSm = size === "sm";
  const buttonClasses = isSm ? "px-2.5 py-2 text-xs" : "px-3 py-2.5 text-sm";
  const chevronSize = isSm ? "w-2.5 h-2.5" : "w-3 h-3";
  const dropdownMinWidth = isSm ? "min-w-[140px]" : "min-w-[160px]";
  const dropdownItemPadding = isSm ? "px-3 py-2" : "px-4 py-2.5";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Select language"
        aria-expanded={open}
        className={`flex items-center gap-2 ${buttonClasses} rounded-full bg-white/5 border border-white/10 hover:border-amber/30 transition-all font-medium text-white`}
      >
        <span className="text-base leading-none">
          {languages.find((l) => l.code === langCode)?.flag}
        </span>
        <span>{langCode}</span>
        <svg
          className={`${chevronSize} transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 top-full mt-2 bg-card-dark border border-white/10 rounded-xl py-1 shadow-2xl ${dropdownMinWidth} z-50 overflow-hidden`}
          >
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLangCode(l.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 ${dropdownItemPadding} text-sm transition-colors ${langCode === l.code ? "text-amber bg-amber/5" : "text-gray-300 hover:text-white hover:bg-white/5"}`}
              >
                <span className="text-base leading-none">{l.flag}</span>
                <span className={`font-medium ${isSm ? "text-xs" : ""}`}>
                  {isSm ? l.code : tLabel(l.labelKey, lang)}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
