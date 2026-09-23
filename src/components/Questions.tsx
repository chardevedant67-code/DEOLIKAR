"use client";

import { ArrowUpRight } from "lucide-react";
import type { ServiceKey } from "@/lib/i18n/dictionary";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { scrollToSection, usePlanner } from "@/lib/planner-context";
import { Reveal } from "./ui/Reveal";
import { btnPrimary } from "./ui/buttons";

/**
 * Each question leads somewhere useful: the first two open the contact form with the
 * matching requirement preselected; the third points at the Goal Planner.
 */
const QUESTION_TARGETS: (ServiceKey | "goals")[] = ["sip", "mutualFunds", "goals"];

export function Questions() {
  const { t } = useLanguage();
  const { setRequirement } = usePlanner();

  const open = (target: ServiceKey | "goals") => {
    if (target === "goals") {
      scrollToSection("goal-planner");
      return;
    }
    setRequirement(target);
    scrollToSection("contact");
  };

  return (
    <section id="questions" aria-label={t.questions.text} className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container-page">
        <ul className="grid gap-4 md:grid-cols-3">
          {t.questions.items.map((question, i) => (
            <li key={question}>
              <Reveal delay={i * 90} className="h-full">
                <button
                  type="button"
                  onClick={() => open(QUESTION_TARGETS[i])}
                  className="group relative flex h-full min-h-44 w-full flex-col justify-between overflow-hidden rounded-[1.75rem] border border-mist-200 bg-mist-50 p-6 text-left transition duration-300 hover:-translate-y-1.5 hover:border-navy-950 hover:bg-navy-950 hover:shadow-lift sm:p-7"
                >
                  <span
                    aria-hidden
                    className="font-display text-[3.4rem] font-extrabold leading-none text-royal-200 transition-colors duration-300 group-hover:text-royal-400/50"
                  >
                    ?
                  </span>
                  <span className="mt-6 flex items-end justify-between gap-4">
                    <span className="font-display text-[1.3rem] font-bold leading-snug tracking-tight text-navy-950 transition-colors duration-300 group-hover:text-white">
                      {question}
                    </span>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-navy-950 shadow-soft transition duration-300 group-hover:bg-royal-500 group-hover:text-white">
                      <ArrowUpRight size={18} aria-hidden className="transition-transform duration-300 group-hover:rotate-45" />
                    </span>
                  </span>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={200}>
          <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center text-center">
            <p className="font-display text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-semibold leading-snug tracking-tight text-navy-900">
              {t.questions.text}
            </p>
            <button type="button" onClick={() => scrollToSection("contact")} className={`${btnPrimary} mt-7`}>
              {t.contact.heading}
              <ArrowUpRight size={18} aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
