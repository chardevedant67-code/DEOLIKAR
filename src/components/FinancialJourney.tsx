"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useScrollProgress } from "@/lib/hooks";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

/**
 * "Our Approach" — the four supplied steps as large cards joined by a line that
 * draws itself as the visitor scrolls, lighting each step in turn. Horizontal on
 * desktop, a vertical timeline on mobile. The activation is pure CSS driven by a
 * --progress variable (see useScrollProgress), so scrolling costs no re-renders.
 */
export function FinancialJourney() {
  const { t } = useLanguage();
  const a = t.approach;
  const rootRef = useRef<HTMLDivElement>(null);
  useScrollProgress(rootRef, { startAt: 0.95, endAt: 0.78 });

  return (
    <section id="approach" aria-labelledby="approach-heading" className="on-dark relative overflow-hidden bg-navy-950 py-20 text-white sm:py-24 lg:py-32">
      <div aria-hidden className="bg-hairline-grid-dark pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,#000,transparent_75%)]" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-royal-500/20 blur-[110px]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-mint-500/10 blur-[110px]" />

      <div className="container-page relative">
        <SectionHeading id="approach-heading" eyebrow={t.nav.approach} heading={a.heading} tone="dark" />

        <Reveal delay={100}>
          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-lg font-semibold text-royal-200 sm:text-xl">
            <span className="sr-only">{a.flowCaption}</span>
            {a.steps.map((step, i) => (
              <span key={step.number} aria-hidden className="flex items-center gap-3">
                {step.title}
                {i < a.steps.length - 1 ? <ArrowRight size={18} className="text-royal-400" /> : null}
              </span>
            ))}
          </p>
        </Reveal>

        <div ref={rootRef} className="journey-root relative mt-14 lg:mt-20">
          <ol className="relative grid gap-5 lg:grid-cols-4 lg:gap-6">
            {/* track */}
            <span
              aria-hidden
              className="absolute bottom-6 left-[1.05rem] top-6 w-px bg-white/15 lg:bottom-auto lg:left-[12.5%] lg:right-[12.5%] lg:top-[1.05rem] lg:h-px lg:w-auto"
            />
            <span
              aria-hidden
              className="journey-fill absolute bottom-6 left-[1.05rem] top-6 w-px bg-gradient-to-b from-royal-400 to-mint-400 lg:bottom-auto lg:left-[12.5%] lg:right-[12.5%] lg:top-[1.05rem] lg:h-px lg:w-auto lg:bg-gradient-to-r"
            />

            {a.steps.map((step, i) => (
              <li
                key={step.number}
                className="journey-node relative pl-14 lg:pl-0 lg:pt-16"
                style={{ "--at": (0.04 + 0.82 * (i / 3)).toFixed(3) } as React.CSSProperties}
              >
                <span
                  aria-hidden
                  className="journey-dot absolute left-0 top-0 z-10 h-[2.1rem] w-[2.1rem] rounded-full border-4 border-navy-950 lg:left-1/2 lg:-translate-x-1/2"
                />
                <div className="journey-card group relative h-full overflow-hidden rounded-[1.75rem] border bg-gradient-to-b from-white/[0.09] to-white/[0.03] p-6 backdrop-blur transition-colors duration-300 hover:from-white/[0.14] sm:p-7">
                  <span
                    aria-hidden
                    className="tabular pointer-events-none absolute -right-2 -top-4 font-display text-[7rem] font-extrabold leading-none text-white/[0.06]"
                  >
                    {step.number}
                  </span>
                  <p className="tracking-caps relative text-[11px] font-semibold text-royal-300">
                    {a.stepLabel} {step.number}
                  </p>
                  <h3 className="relative mt-3 font-display text-[1.7rem] font-extrabold tracking-tight text-white">{step.title}</h3>
                  <p className="relative mt-3 text-[15px] leading-relaxed text-white/70">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <Reveal delay={100}>
          <p className="display mt-16 max-w-3xl text-[clamp(1.5rem,1.1rem+1.6vw,2.4rem)] text-white lg:mt-20">
            {a.footerLine}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
