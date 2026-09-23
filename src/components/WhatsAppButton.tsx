"use client";

import { buildWhatsAppLink } from "@/lib/contact";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";

/**
 * Floating WhatsApp button — bottom-right on every screen size. On mobile it sits on
 * the same row as the Call button (see CallButton) so the two never stack over content.
 */
export function WhatsAppButton() {
  const { t } = useLanguage();

  return (
    <a
      href={buildWhatsAppLink(t.floating.whatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${t.floating.whatsappAria} ${t.a11y.opensInNewTab}`}
      className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_30px_-10px_rgba(18,140,70,0.75)] transition duration-300 hover:-translate-y-1 hover:bg-[#1fbd5b] active:scale-95 md:bottom-7 md:right-7 md:h-[3.75rem] md:w-[3.75rem]"
    >
      <WhatsAppIcon size={30} />
      <span
        aria-hidden
        className="pointer-events-none absolute right-full mr-3 hidden translate-x-2 whitespace-nowrap rounded-full bg-navy-950 px-4 py-2 text-[13px] font-semibold text-white opacity-0 shadow-lift transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block"
      >
        {t.floating.whatsappTooltip}
      </span>
    </a>
  );
}
