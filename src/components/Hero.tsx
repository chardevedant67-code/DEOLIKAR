"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Check, Phone, ShieldCheck } from "lucide-react";
import { TEL_HREF, buildWhatsAppLink } from "@/lib/contact";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { scrollToSection } from "@/lib/planner-context";
import { CONTACT } from "@/lib/contact";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";
import { HeroVisual } from "./HeroVisual";
import { btnPrimary, btnSecondary, btnWhatsApp } from "./ui/buttons";

/** Splits the headline around the highlighted phrase without altering the copy. */
function renderHeadline(headline: string, accent: string) {
  const at = headline.indexOf(accent);
  if (at === -1) return headline;
  return (
    <>
      {headline.slice(0, at)}
      <span className="text-royal-600">{accent}</span>
      {headline.slice(at + accent.length)}
    </>
  );
}

/**
 * Eases a normalised pointer position into CSS variables on the hero root so the
 * glow and decorative layers can drift slightly with the mouse. Only runs on
 * fine-pointer devices, and never with prefers-reduced-motion.
 */
function usePointerGlow(rootRef: React.RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    let frame = 0;
    let targetX = 0.7;
    let targetY = 0.3;
    let currentX = targetX;
    let currentY = targetY;

    const tick = () => {
      frame = 0;
      currentX += (targetX - currentX) * 0.09;
      currentY += (targetY - currentY) * 0.09;

      root.style.setProperty("--mx", `${(currentX * 100).toFixed(2)}%`);
      root.style.setProperty("--my", `${(currentY * 100).toFixed(2)}%`);
      root.style.setProperty("--px", ((currentX - 0.5) * 2).toFixed(3));
      root.style.setProperty("--py", ((currentY - 0.5) * 2).toFixed(3));

      const stage = root.querySelector("[data-stage]");
      if (stage) {
        const rect = stage.getBoundingClientRect();
        const sx = Math.min(Math.max((currentX * root.clientWidth - (rect.left - root.getBoundingClientRect().left)) / rect.width, 0.05), 0.95);
        const sy = Math.min(Math.max((currentY * root.clientHeight - (rect.top - root.getBoundingClientRect().top)) / rect.height, 0.05), 0.95);
        root.style.setProperty("--sx", `${(sx * 100).toFixed(1)}%`);
        root.style.setProperty("--sy", `${(sy * 100).toFixed(1)}%`);
      }

      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        frame = requestAnimationFrame(tick);
      }
    };

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      targetX = (event.clientX - rect.left) / rect.width;
      targetY = (event.clientY - rect.top) / rect.height;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      root.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rootRef, enabled]);
}

export function Hero() {
  const { t } = useLanguage();
  const rootRef = useRef<HTMLElement>(null);
  const finePointer = useFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  usePointerGlow(rootRef, finePointer && !reducedMotion);

  const go = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative isolate overflow-hidden bg-gradient-to-b from-white via-mist-50 to-white pb-24 pt-[7.25rem] sm:pt-32 lg:pb-32 lg:pt-40"
    >
      {/* Atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-hairline-grid absolute inset-0" />
        <div className="hero-glow absolute inset-0" />
        <svg
          className="parallax absolute -bottom-2 left-0 h-56 w-full text-royal-500/15"
          style={{ "--depth": 8 } as React.CSSProperties}
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          fill="none"
        >
          <path d="M0 200C200 190 300 150 480 140S760 150 900 90S1250 30 1440 10" stroke="currentColor" strokeWidth="2" />
          <path d="M0 200C200 190 300 150 480 140S760 150 900 90S1250 30 1440 10V220H0Z" fill="currentColor" opacity="0.35" />
        </svg>
      </div>

      <div className="container-page grid items-center gap-14 lg:grid-cols-12 lg:gap-8 xl:gap-14">
        <div className="lg:col-span-7">
          <p
            className="intro inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-0.5 rounded-3xl border border-mist-300 bg-white/80 py-1.5 pl-2 pr-3.5 text-[11.5px] font-semibold text-ink-700 shadow-sm backdrop-blur sm:rounded-full sm:text-[13px]"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-royal-50 text-royal-600">
              <ShieldCheck size={13} aria-hidden />
            </span>
            {t.hero.eyebrow}
            <span aria-hidden className="hidden h-3 w-px bg-mist-300 min-[420px]:block" />
            <span className="whitespace-nowrap text-royal-700">{t.trust.arn}</span>
          </p>

          <h1
            className="display intro mt-6 text-[clamp(2.55rem,1.5rem+4.7vw,4.9rem)] text-navy-950"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            {renderHeadline(t.hero.headline, t.hero.headlineAccent)}
          </h1>

          <p
            className="intro mt-6 max-w-2xl text-lg font-medium leading-relaxed text-navy-800 sm:text-xl"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            {t.hero.subheading}
          </p>

          <p
            className="intro mt-4 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-[17px]"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            {t.hero.paragraph}
          </p>

          <div className="intro mt-8" style={{ "--i": 4 } as React.CSSProperties}>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-mint-500/30 bg-mint-50 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-mint-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint-500 text-white">
                <Check size={14} strokeWidth={3} aria-hidden />
              </span>
              {t.hero.freeConsult}
            </p>
          </div>

          <div className="intro mt-5 flex flex-col gap-3 sm:flex-row" style={{ "--i": 5 } as React.CSSProperties}>
            <a href="#contact" onClick={go("contact")} className={btnPrimary}>
              {t.hero.primaryCta}
              <ArrowRight size={18} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="#services" onClick={go("services")} className={btnSecondary}>
              {t.hero.secondaryCta}
            </a>
          </div>

          <div
            className="intro mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-mist-200 pt-6"
            style={{ "--i": 6 } as React.CSSProperties}
          >
            <a href={TEL_HREF} className={`${btnSecondary} !min-h-11 !px-4 !text-sm`}>
              <Phone size={16} className="text-royal-600" aria-hidden />
              {t.hero.callNow}
            </a>
            <a
              href={buildWhatsAppLink(t.floating.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btnWhatsApp} !min-h-11 !px-4 !text-sm`}
            >
              <WhatsAppIcon size={17} />
              {t.hero.whatsappUs}
              <span className="sr-only">{t.a11y.opensInNewTab}</span>
            </a>
            <a href={TEL_HREF} className="tabular text-[15px] font-semibold tracking-wide text-navy-900 hover:text-royal-600">
              {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="intro pb-6 lg:col-span-5 lg:pb-0" style={{ "--i": 3 } as React.CSSProperties}>
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
