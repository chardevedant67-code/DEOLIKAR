"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, MessageSquareText, X } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/contact";
import { useScrollLock } from "@/lib/hooks";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { scrollToSection, usePlanner } from "@/lib/planner-context";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";
import { ServiceIcon } from "./icons/ServiceIcons";
import { btnOutlineLight, btnLight } from "./ui/buttons";

interface ServiceModalProps {
  /** Index of the open service, or null when closed. */
  index: number | null;
  onChange: (index: number | null) => void;
}

/** Refined detail panel for a service — shows the same supplied description in larger type. */
export function ServiceModal({ index, onChange }: ServiceModalProps) {
  const { t } = useLanguage();
  const { setRequirement } = usePlanner();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const items = t.services.items;
  const open = index !== null;
  const service = index !== null ? items[index] : null;

  useScrollLock(open);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const step = (direction: 1 | -1) => {
    if (index === null) return;
    onChange((index + direction + items.length) % items.length);
  };

  const discuss = () => {
    if (!service) return;
    setRequirement(service.key);
    onChange(null);
    window.setTimeout(() => scrollToSection("contact"), 80);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="service-modal-title"
      className="sheet place-items-center open:grid"
      onClose={() => onChange(null)}
      onClick={(event) => {
        if (event.target === event.currentTarget) onChange(null);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1);
        if (event.key === "ArrowLeft") step(-1);
      }}
    >
      {service && index !== null ? (
        <div className="sheet-panel relative m-4 max-h-[calc(100svh-2rem)] w-[min(100%-2rem,44rem)] overflow-y-auto rounded-[2rem] bg-navy-950 text-white shadow-[0_50px_100px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
          <div aria-hidden className="bg-hairline-grid-dark pointer-events-none absolute inset-0 opacity-60" />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-royal-500/30 blur-3xl"
          />

          <div className="relative p-7 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 [--icon-accent-soft:rgba(71,207,152,0.2)] [--icon-accent:#47cf98] [--icon-badge-bg:#0a2f6b]">
                  <ServiceIcon service={service.key} className="h-9 w-9" />
                </span>
                <span className="tracking-caps text-xs font-semibold text-royal-300 tabular">
                  {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onChange(null)}
                aria-label={t.a11y.close}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            <h3 id="service-modal-title" className="h-section mt-8 text-[clamp(2rem,1.4rem+2.4vw,3rem)]">
              {service.title}
            </h3>
            <p className="mt-5 text-lg leading-relaxed text-white/80">{service.description}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={discuss} className={btnLight}>
                <MessageSquareText size={18} aria-hidden />
                {t.services.modal.discuss}
              </button>
              <a
                href={buildWhatsAppLink(t.floating.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className={btnOutlineLight}
              >
                <WhatsAppIcon size={18} />
                {t.services.modal.whatsapp}
                <span className="sr-only">{t.a11y.opensInNewTab}</span>
              </a>
            </div>

            <div className="mt-9 flex items-center justify-between gap-3 border-t border-white/10 pt-5 text-sm">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={`${t.services.modal.previous}: ${items[(index + items.length - 1) % items.length].title}`}
                className="group flex min-h-11 items-center gap-2 rounded-full pr-3 text-white/70 transition-colors hover:text-white"
              >
                <ArrowLeft size={16} aria-hidden className="transition-transform group-hover:-translate-x-1" />
                <span className="max-w-[9rem] truncate font-medium">{items[(index + items.length - 1) % items.length].title}</span>
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={`${t.services.modal.next}: ${items[(index + 1) % items.length].title}`}
                className="group flex min-h-11 items-center gap-2 rounded-full pl-3 text-white/70 transition-colors hover:text-white"
              >
                <span className="max-w-[9rem] truncate font-medium">{items[(index + 1) % items.length].title}</span>
                <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
