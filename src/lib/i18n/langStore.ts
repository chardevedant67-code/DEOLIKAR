import type { Lang } from "./dictionary";

export const LANG_STORAGE_KEY = "deolikar-lang";

type Listener = () => void;

let currentLang: Lang = "en";
let hydrated = false;
const listeners = new Set<Listener>();

export function readStoredLang(): Lang {
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    return stored === "hi" ? "hi" : "en";
  } catch {
    return "en";
  }
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): Lang {
  if (!hydrated) {
    currentLang = readStoredLang();
    hydrated = true;
  }
  return currentLang;
}

export function getServerSnapshot(): Lang {
  return "en";
}

export function setStoredLang(lang: Lang): void {
  currentLang = lang;
  hydrated = true;
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // localStorage may be unavailable (e.g. private browsing) — language just won't persist.
  }
  listeners.forEach((listener) => listener());
}
