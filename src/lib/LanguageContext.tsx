"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { Language } from "@/lib/cms-types";

/* ------------------------------------------------------------------ */
/*  Language display code → internal Language type mapping            */
/* ------------------------------------------------------------------ */

const CODE_TO_LANG: Record<string, Language> = {
  EN: "en",
  DE: "de",
  FR: "fr",
  ES: "es",
};

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface LanguageContextValue {
  lang: Language;
  langCode: string; // "EN", "DE", "FR", "ES" — for the header switcher
  setLangCode: (code: string) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  langCode: "EN",
  setLangCode: () => {},
});

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "stratifit-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [langCode, setLangCodeState] = useState<string>("EN");

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && CODE_TO_LANG[stored]) {
        setLangCodeState(stored);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  const setLangCode = useCallback((code: string) => {
    if (!CODE_TO_LANG[code]) return;
    setLangCodeState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore
    }
  }, []);

  const lang: Language = CODE_TO_LANG[langCode] ?? "en";

  return (
    <LanguageContext.Provider value={{ lang, langCode, setLangCode }}>
      {children}
    </LanguageContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
