"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { scrollToSection } from "@/lib/planner-context";
import { useScrollState } from "@/lib/scrollStore";

/** First section of each journey step, so each dot can jump to its stage. */
const STEP_TARGETS = ["home", "services", "approach", "start", "contact"] as const;

/**
 * "Your Financial Journey" indicator — Goal → Understand → Plan → Invest → Review.
 * A slim rail on wide screens that follows the visitor's scroll position and
 * quietly ties the page's sections into one story.
 */
export function JourneyRail() {
  const { t } = useLanguage();
  const { journeyStep, pastHero } = useScrollState();

  return (
    <nav
      aria-label={t.journey.label}
      className={`fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 transition-all duration-500 min-[1440px]:block ${
        pastHero ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-4 opacity-0"
      }`}
    >
      <ol className="glass flex flex-col items-end gap-0 rounded-full py-3 pl-3 pr-2.5 shadow-soft">
        {t.journey.steps.map((label, i) => {
          const active = i === journeyStep;
          const reached = i <= journeyStep;
          return (
            <li key={label} className="relative flex flex-col items-end">
              <a
                href={`#${STEP_TARGETS[i]}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection(STEP_TARGETS[i]);
                }}
                aria-current={active ? "step" : undefined}
                className="group flex items-center gap-2.5 py-1.5"
              >
                <span
                  className={`tracking-caps overflow-hidden whitespace-nowrap text-[11px] font-bold transition-all duration-500 ${
                    active
                      ? "max-w-0 text-royal-700 opacity-0 group-hover:max-w-32 group-hover:opacity-100 group-focus-visible:max-w-32 group-focus-visible:opacity-100 min-[1536px]:max-w-32 min-[1536px]:opacity-100"
                      : "max-w-0 text-ink-500 opacity-0 group-hover:max-w-32 group-hover:opacity-100 group-focus-visible:max-w-32 group-focus-visible:opacity-100"
                  }`}
                >
                  {label}
                </span>
                <span
                  className={`block rounded-full transition-all duration-500 ${
                    active
                      ? "h-3 w-3 bg-royal-600 ring-4 ring-royal-100"
                      : reached
                        ? "h-2 w-2 bg-royal-400"
                        : "h-2 w-2 bg-mist-300"
                  }`}
                />
              </a>
              {i < t.journey.steps.length - 1 ? (
                <span
                  aria-hidden
                  className={`h-4 w-px transition-colors duration-500 ${i < journeyStep ? "bg-royal-400" : "bg-mist-300"}`}
                  style={{ marginRight: "0.3rem" }}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
