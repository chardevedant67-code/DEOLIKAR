"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { type Dictionary, type Lang, dictionaries } from "./dictionary";
import { getServerSnapshot, getSnapshot, readStoredLang, setStoredLang, subscribe } from "./langStore";

interface LanguageContextValue {
  lang: Lang;
  t: Dictionary;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const t = dictionaries[lang];

  // Keep <html lang>, the document title and meta description in step with the chosen language.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.setAttribute("data-lang", lang);
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.meta.description);
    // Only reveal the page once the DOM shows the visitor's stored language (avoids an English flash).
    if (lang === readStoredLang()) root.setAttribute("data-ready", "");
  }, [lang, t]);

  const setLang = useCallback((next: Lang) => setStoredLang(next), []);

  const value = useMemo<LanguageContextValue>(() => ({ lang, t, setLang }), [lang, t, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
