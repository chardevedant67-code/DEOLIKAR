"use client";

import Image from "next/image";
import { useRef } from "react";
import { useScrollProgress } from "@/lib/hooks";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Reveal } from "./ui/Reveal";

export function About() {
  const { t } = useLanguage();
  const a = t.about;
  const timelineRef = useRef<HTMLDivElement>(null);
  useScrollProgress(timelineRef, { startAt: 0.97, endAt: 0.8 });

  return (
    <section id="about" aria-labelledby="about-heading" className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Statement */}
        <div className="lg:col-span-5">
          <Reveal>
            <p className="tracking-caps flex items-center gap-3 text-xs font-semibold text-royal-600">
              <span aria-hidden className="h-px w-8 bg-royal-600/40" />
              {t.nav.about}
            </p>
            <h2 id="about-heading" className="h-section mt-4 text-[clamp(1.9rem,1.3rem+2.6vw,3.15rem)] text-navy-950">
              {a.heading}
            </h2>
          </Reveal>

          <Reveal delay={120} className="mt-10 lg:mt-14">
            {/* Supplied portrait, shown at its original proportions (1024 × 1143). */}
            <div className="max-w-sm overflow-hidden rounded-[1.75rem] border border-mist-200 bg-mist-50 shadow-soft">
              <Image
                src="/about/portrait.png"
                alt={a.photoAlt}
                width={1024}
                height={1143}
                sizes="(min-width: 640px) 384px, calc(100vw - 2.5rem)"
                className="block h-auto w-full"
              />
            </div>
          </Reveal>
        </div>

        {/* Content + timeline */}
        <div className="lg:col-span-7">
          <div className="space-y-6">
            {a.paragraphs.map((paragraph, i) => (
              <Reveal key={paragraph} delay={i * 90}>
                <p
                  className={
                    i === 0
                      ? "font-display text-[clamp(1.2rem,1rem+0.8vw,1.55rem)] font-semibold leading-snug text-navy-900"
                      : "text-base leading-[1.8] text-ink-600 sm:text-[17px]"
                  }
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="mt-12">
            <div className="rounded-[1.75rem] border border-mist-200 bg-mist-50 p-6 sm:p-8">
              <p className="tracking-caps text-[11px] font-semibold text-ink-500">{a.timelineLabel}</p>

              <div ref={timelineRef} className="journey-root relative mt-6">
                <ol className="relative grid gap-5 sm:grid-cols-4 sm:gap-0">
                  {/* track: vertical on mobile, horizontal on sm+ */}
                  <span aria-hidden className="absolute bottom-3 left-[0.6rem] top-3 w-px bg-mist-300 sm:bottom-auto sm:left-[12.5%] sm:right-[12.5%] sm:top-[0.65rem] sm:h-px sm:w-auto" />
                  <span
                    aria-hidden
                    className="tl-line absolute bottom-3 left-[0.6rem] top-3 w-px bg-royal-600 sm:bottom-auto sm:left-[12.5%] sm:right-[12.5%] sm:top-[0.65rem] sm:h-px sm:w-auto"
                  />
                  {a.timeline.map((label, i) => (
                    <li
                      key={label}
                      className="tl-node relative flex items-center gap-4 sm:flex-col sm:gap-3 sm:text-center"
                      style={{ "--at": (0.04 + 0.82 * (i / 3)).toFixed(3) } as React.CSSProperties}
                    >
                      <span className="tl-dot relative z-10 h-[1.3rem] w-[1.3rem] shrink-0 rounded-full border-2 transition-shadow" />
                      <span className="tl-label font-display text-[15px] font-bold tracking-tight">{label}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
