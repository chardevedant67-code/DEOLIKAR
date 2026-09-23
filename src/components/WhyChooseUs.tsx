"use client";

import { Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Reveal } from "./ui/Reveal";

/** Splits "A. B. C." style statements into their sentences (handles the Devanagari danda too). */
function sentences(text: string): string[] {
  return text.match(/[^.।]+[.।]?/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
}

export function WhyChooseUs() {
  const { t } = useLanguage();
  const lines = sentences(t.whyChooseUs.statement);
  const tones = ["text-navy-950", "text-royal-600", "text-navy-950/55"];

  return (
    <section id="why-us" aria-labelledby="why-heading" className="relative overflow-hidden bg-mist-50 py-20 sm:py-24 lg:py-32">
      <div aria-hidden className="bg-hairline-grid pointer-events-none absolute inset-0 opacity-60" />

      <div className="container-page relative grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <h2 id="why-heading" className="h-section text-[clamp(1.9rem,1.3rem+2.6vw,3.15rem)] text-navy-950">
                {t.whyChooseUs.heading}
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="display mt-8 border-l-2 border-royal-500/40 pl-6 text-[clamp(1.6rem,1.1rem+1.9vw,2.5rem)]">
                {lines.map((line, i) => (
                  <span key={line} className={`block ${tones[i % tones.length]}`}>
                    {line}
                  </span>
                ))}
              </p>
            </Reveal>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {t.whyChooseUs.items.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={(i % 2) * 90} className="h-full">
                <div className="group relative h-full rounded-3xl border border-mist-200 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-royal-300 hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mint-50 text-mint-700 ring-1 ring-mint-500/25 transition duration-300 group-hover:bg-mint-500 group-hover:text-white">
                      <Check size={18} strokeWidth={2.75} aria-hidden />
                    </span>
                    <span aria-hidden className="tabular font-display text-sm font-bold text-ink-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-[1.08rem] font-bold leading-snug tracking-tight text-navy-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{item.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
