"use client";

import {
  CalendarClock,
  ChartPie,
  ClipboardList,
  Compass,
  GraduationCap,
  RefreshCw,
  Sprout,
  Sunrise,
  Target,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

/** One icon per planning service, in the dictionary's item order. */
const PLANNING_ICONS = [ClipboardList, Target, GraduationCap, CalendarClock, ChartPie, Sunrise, Compass, RefreshCw, Sprout];

/**
 * "Our Financial Planning Services" — kept separate from the investment products
 * above it. Same card language as the service cards, without a detail panel.
 */
export function PlanningServices() {
  const { t } = useLanguage();

  return (
    <section id="planning" aria-labelledby="planning-heading" className="relative overflow-hidden bg-mist-50 py-20 sm:py-24 lg:py-32">
      <div aria-hidden className="bg-hairline-grid pointer-events-none absolute inset-0 opacity-60" />

      <div className="container-page relative">
        <SectionHeading id="planning-heading" eyebrow={t.nav.services} heading={t.planning.heading} />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {t.planning.items.map((item, i) => {
            const Icon = PLANNING_ICONS[i] ?? ClipboardList;
            return (
              <li key={item.title}>
                <Reveal delay={(i % 3) * 80} className="h-full">
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-mist-200 bg-white p-6 shadow-soft transition duration-300 ease-out hover:-translate-y-1.5 hover:border-royal-300 hover:shadow-lift sm:p-7">
                    <div className="relative flex items-start justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-royal-50 text-royal-600 transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-navy-950 group-hover:text-mint-400">
                        <Icon size={26} strokeWidth={1.75} aria-hidden />
                      </span>
                      <span
                        aria-hidden
                        className="font-display text-[2.6rem] font-extrabold leading-none tracking-tight text-mist-200 transition-colors duration-300 tabular group-hover:text-royal-200"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="relative mt-6 font-display text-[1.3rem] font-bold tracking-tight text-navy-950">{item.title}</h3>
                    <p className="relative mt-3 flex-1 text-[15px] leading-relaxed text-ink-600">{item.description}</p>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
