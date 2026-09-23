"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Lang } from "@/lib/i18n/dictionary";

const OPTIONS: { lang: Lang; label: string }[] = [
  { lang: "en", label: "English" },
  { lang: "hi", label: "हिंदी" },
];

/** Segmented English | हिंदी control. Labels stay in their own language at all times. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.nav.languageLabel}
      className={`relative inline-grid grid-cols-2 rounded-full border border-mist-300 bg-white/90 p-0.5 text-[13px] font-semibold shadow-sm ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-navy-950 transition-transform duration-300 ease-out"
        style={{ transform: lang === "hi" ? "translateX(100%)" : "translateX(0)" }}
      />
      {OPTIONS.map((option) => {
        const active = lang === option.lang;
        return (
          <button
            key={option.lang}
            type="button"
            lang={option.lang}
            aria-pressed={active}
            onClick={() => setLang(option.lang)}
            className={`relative z-10 min-h-9 whitespace-nowrap rounded-full px-3 leading-none transition-colors duration-300 ${
              active ? "text-white" : "text-ink-600 hover:text-navy-950"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
