"use client";

import { Scale } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Reveal } from "./ui/Reveal";

/** Clear and complete, but deliberately quiet — the exact supplied disclaimer, in full. */
export function Disclaimer() {
  const { t } = useLanguage();
  const d = t.disclaimerSection;

  return (
    <section id="disclaimer" aria-labelledby="disclaimer-heading" className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-mist-200 bg-mist-50 p-6 sm:p-9">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-navy-800 shadow-soft ring-1 ring-mist-200">
                <Scale size={19} aria-hidden />
              </span>
              <h2 id="disclaimer-heading" className="font-display text-xl font-extrabold tracking-tight text-navy-950 sm:text-2xl">
                {d.heading}
              </h2>
            </div>

            <div className="mt-6 space-y-3.5 text-[14.5px] leading-[1.75] text-ink-600">
              {d.paragraphs.map((paragraph, i) => (
                <p key={paragraph} className={i === 0 ? "font-semibold text-navy-900" : undefined}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
