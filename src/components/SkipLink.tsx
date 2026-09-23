"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function SkipLink() {
  const { t } = useLanguage();
  return (
    <a
      href="#main"
      className="fixed left-4 top-4 z-[130] -translate-y-24 rounded-full bg-navy-950 px-5 py-3 text-sm font-semibold text-white shadow-lift transition-transform focus:translate-y-0"
    >
      {t.a11y.skipToContent}
    </a>
  );
}
