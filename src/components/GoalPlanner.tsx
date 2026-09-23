"use client";

import { useRef } from "react";
import { ArrowRight, Calculator, Compass, GraduationCap, House, MessageSquareText, Plane, Sprout, Sunrise } from "lucide-react";
import { type GoalKey, goalKeys } from "@/lib/i18n/dictionary";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { scrollToSection, usePlanner } from "@/lib/planner-context";
import { Reveal } from "./ui/Reveal";
import { btnBlue, btnSecondary } from "./ui/buttons";

const GOAL_ICONS: Record<GoalKey, typeof House> = {
  childEducation: GraduationCap,
  retirement: Sunrise,
  home: House,
  travel: Plane,
  wealthCreation: Sprout,
  other: Compass,
};

/**
 * Optional planning aid: pick a goal, then continue to the calculator or the
 * consultation form. It deliberately makes no recommendation — it only starts the conversation.
 */
export function GoalPlanner() {
  const { t } = useLanguage();
  const { goal, setGoal, setCalculatorTab } = usePlanner();
  const g = t.goalPlanner;
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (event: React.KeyboardEvent) => {
    const current = goal ? goalKeys.indexOf(goal) : -1;
    let next = current;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % goalKeys.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + goalKeys.length) % goalKeys.length;
    else return;
    event.preventDefault();
    setGoal(goalKeys[next]);
    refs.current[goalKeys[next]]?.focus();
  };

  return (
    <section id="goal-planner" aria-labelledby="goal-heading" className="relative bg-white py-20 sm:py-24 lg:py-28">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.25rem] border border-mist-200 bg-gradient-to-br from-white via-royal-50/50 to-mist-50 p-6 shadow-soft sm:p-10 lg:p-14">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-royal-300/25 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-4">
                <p className="tracking-caps flex items-center gap-3 text-xs font-semibold text-royal-600">
                  <span aria-hidden className="h-px w-8 bg-royal-600/40" />
                  {g.eyebrow}
                </p>
                <h2 id="goal-heading" className="h-section mt-4 text-[clamp(1.7rem,1.2rem+2vw,2.6rem)] text-navy-950">
                  {g.heading}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-600">{g.prompt}</p>
              </div>

              <div className="lg:col-span-8">
                <div
                  role="radiogroup"
                  aria-label={g.goalsLabel}
                  onKeyDown={onKeyDown}
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                >
                  {goalKeys.map((key, i) => {
                    const Icon = GOAL_ICONS[key];
                    const selected = goal === key;
                    return (
                      <button
                        key={key}
                        ref={(el) => {
                          refs.current[key] = el;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        tabIndex={selected || (goal === null && i === 0) ? 0 : -1}
                        onClick={() => setGoal(selected ? null : key)}
                        className={`group flex min-h-[4.5rem] items-center gap-3 rounded-2xl border p-4 text-left text-[15px] font-semibold transition duration-300 ${
                          selected
                            ? "border-navy-950 bg-navy-950 text-white shadow-lift"
                            : "border-mist-200 bg-white text-navy-950 hover:-translate-y-0.5 hover:border-royal-300 hover:shadow-soft"
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                            selected ? "bg-white/15 text-mint-400" : "bg-royal-50 text-royal-600 group-hover:bg-royal-100"
                          }`}
                        >
                          <Icon size={20} aria-hidden />
                        </span>
                        {g.goals[key]}
                      </button>
                    );
                  })}
                </div>

                <div
                  aria-live="polite"
                  className={`mt-6 overflow-hidden rounded-2xl border transition-all duration-500 ${
                    goal ? "border-royal-200 bg-white p-5 sm:p-6" : "border-dashed border-mist-300 bg-transparent p-5"
                  }`}
                >
                  {goal ? (
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="tracking-caps text-[11px] font-bold text-royal-600">{g.goals[goal]}</p>
                        <p className="mt-1.5 font-display text-xl font-bold tracking-tight text-navy-950 sm:text-2xl">{g.response}</p>
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => {
                            setCalculatorTab("sip");
                            scrollToSection("calculator");
                          }}
                          className={`${btnSecondary} !min-h-11 !px-4 !text-sm`}
                        >
                          <Calculator size={16} className="text-royal-600" aria-hidden />
                          {g.tryCalculator}
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollToSection("contact")}
                          className={`${btnBlue} !min-h-11 !px-4 !text-sm`}
                        >
                          <MessageSquareText size={16} aria-hidden />
                          {g.discuss}
                          <ArrowRight size={15} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-ink-500">{g.emptyHint}</p>
                  )}
                </div>

                <p className="mt-4 text-xs leading-relaxed text-ink-500">{g.note}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
