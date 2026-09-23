"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { scrollToSection } from "@/lib/planner-context";
import { useScrollState } from "@/lib/scrollStore";
import { NAV_ITEMS } from "@/lib/sections";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { btnPrimary } from "./ui/buttons";

export function Header() {
  const { t } = useLanguage();
  const { scrolled, activeNav } = useScrollState();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close the menu if the viewport grows to the desktop layout while it is open.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const go = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          scrolled ? "bg-white/90 shadow-header backdrop-blur-xl" : "bg-white/0"
        }`}
      >
        <div
          className={`container-page flex items-center justify-between gap-3 transition-[height] duration-300 ease-out ${
            scrolled ? "h-[3.9rem] xl:h-[4.1rem]" : "h-[4.6rem] xl:h-[5.25rem]"
          }`}
        >
          <a
            href="#home"
            onClick={go("home")}
            aria-label={t.nav.homeLinkLabel}
            className="shrink-0 rounded-xl transition-transform duration-300 hover:scale-[1.02]"
          >
            <Logo
              priority
              className={`transition-[width] duration-300 ease-out ${
                scrolled ? "w-[7.6rem] sm:w-[8.4rem] xl:w-[8.8rem]" : "w-[8.2rem] sm:w-[9.2rem] xl:w-[10.2rem]"
              }`}
              sizes="(min-width: 1280px) 164px, 148px"
            />
          </a>

          <nav aria-label={t.nav.primaryNavLabel} className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const active = activeNav === item.key;
                return (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      onClick={go(item.href.slice(1))}
                      aria-current={active ? "location" : undefined}
                      className={`group relative block whitespace-nowrap rounded-full px-2 py-2 text-[14px] font-medium transition-colors 2xl:px-3.5 ${
                        active ? "text-royal-700" : "text-ink-700 hover:text-navy-950"
                      }`}
                    >
                      {t.nav[item.key]}
                      <span
                        aria-hidden
                        className={`absolute inset-x-2 -bottom-0.5 h-0.5 2xl:inset-x-3.5 origin-left rounded-full bg-royal-600 transition-transform duration-300 ${
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
            <LanguageSwitcher className="shrink-0" />
            <div className="hidden md:block">
              <a href="#contact" onClick={go("contact")} className={`${btnPrimary} whitespace-nowrap !min-h-11 !px-4 !text-[13.5px] 2xl:!px-5 2xl:!text-[14px]`}>
                {t.nav.cta}
                <ArrowRight size={16} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={t.nav.menuLabel}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-mist-300 bg-white/90 text-navy-950 shadow-sm transition-colors hover:border-royal-400 xl:hidden"
            >
              <Menu size={20} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} returnFocusTo={menuButtonRef} />
    </>
  );
}
