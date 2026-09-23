"use client";

import { Phone } from "lucide-react";
import { TEL_HREF } from "@/lib/contact";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/** Mobile-only sticky call bar. It leaves room on the right for the floating WhatsApp button. */
export function CallButton() {
  const { t } = useLanguage();

  return (
    <a
      href={TEL_HREF}
      aria-label={t.floating.callAria}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-[5.25rem] z-40 flex h-14 items-center justify-center gap-2.5 rounded-full bg-navy-950 text-[15px] font-semibold text-white shadow-[0_14px_30px_-10px_rgba(1,20,52,0.8)] ring-1 ring-white/10 transition duration-300 active:scale-[0.98] md:hidden"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-royal-500">
        <Phone size={16} aria-hidden />
      </span>
      <span className="tabular">{t.floating.callLabel}</span>
    </a>
  );
}
