"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Mail, Phone, X } from "lucide-react";
import { CONTACT, MAILTO_HREF, TEL_HREF, buildWhatsAppLink } from "@/lib/contact";
import { useScrollLock } from "@/lib/hooks";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { scrollToSection } from "@/lib/planner-context";
import { useScrollState } from "@/lib/scrollStore";
import { NAV_ITEMS } from "@/lib/sections";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { btnPrimary } from "./ui/buttons";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  returnFocusTo: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Full-width sheet built on the native <dialog> element, which gives us a real
 * focus trap, Escape-to-close and inert background for free.
 */
export function MobileMenu({ open, onClose, returnFocusTo }: MobileMenuProps) {
  const { t } = useLanguage();
  const { activeNav } = useScrollState();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useScrollLock(open);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const navigate = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    onClose();
    // Wait a beat so the scroll lock is released before scrolling.
    window.setTimeout(() => scrollToSection(id), 60);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label={t.nav.mobileNavLabel}
      className="sheet menu-sheet"
      onClose={() => {
        onClose();
        returnFocusTo.current?.focus();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="sheet-panel mx-auto flex max-h-[100svh] w-full max-w-2xl flex-col overflow-y-auto rounded-b-[2rem] bg-white px-5 pb-7 pt-3 shadow-2xl sm:px-8">
        <div className="flex h-[4.2rem] items-center justify-between">
          <Logo className="w-[7.8rem]" sizes="140px" />
          <button
            type="button"
            onClick={onClose}
            aria-label={t.nav.closeMenu}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-mist-300 text-navy-950 transition-colors hover:border-royal-400"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <nav aria-label={t.nav.mobileNavLabel} className="mt-3">
          <ul className="divide-y divide-mist-200">
            {NAV_ITEMS.map((item, i) => {
              const active = activeNav === item.key;
              return (
                <li key={item.key}>
                  <a
                    href={item.href}
                    onClick={navigate(item.href.slice(1))}
                    aria-current={active ? "location" : undefined}
                    className={`group flex min-h-14 items-center justify-between gap-4 py-2 font-display text-[1.35rem] font-bold tracking-tight transition-colors ${
                      active ? "text-royal-600" : "text-navy-950"
                    }`}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="w-6 text-xs font-semibold text-ink-400 tabular">{String(i + 1).padStart(2, "0")}</span>
                      {t.nav[item.key]}
                    </span>
                    <ArrowRight
                      size={18}
                      aria-hidden
                      className="text-ink-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-royal-600"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-6 flex flex-col gap-3">
          <a href="#contact" onClick={navigate("contact")} className={`${btnPrimary} w-full`}>
            {t.nav.cta}
            <ArrowRight size={17} aria-hidden />
          </a>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={TEL_HREF}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-mist-300 text-sm font-semibold text-navy-950"
            >
              <Phone size={16} aria-hidden />
              {t.hero.callNow}
            </a>
            <a
              href={buildWhatsAppLink(t.floating.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-mint-500/40 bg-mint-50 text-sm font-semibold text-mint-700"
            >
              <WhatsAppIcon size={17} />
              {t.hero.whatsappUs}
              <span className="sr-only">{t.a11y.opensInNewTab}</span>
            </a>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-mist-200 pt-5">
          <LanguageSwitcher />
          <a href={MAILTO_HREF} className="flex items-center gap-2 text-sm font-medium text-ink-600">
            <Mail size={16} aria-hidden />
            <span className="max-w-[10.5rem] truncate">{CONTACT.email}</span>
          </a>
        </div>
      </div>
    </dialog>
  );
}
