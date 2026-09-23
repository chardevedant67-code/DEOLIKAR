"use client";

import { CalendarClock, GraduationCap, House, Sunrise, Target } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * Abstract financial-planning visual: a growth curve that draws itself, goal
 * markers along it, and a Plan → Invest → Review timeline. It is purely
 * conceptual — there are deliberately no figures, returns or balances in it.
 * Mouse-follow parallax is driven by the --px/--py/--sx/--sy variables that
 * <Hero> sets on its root element (and only on fine-pointer devices).
 */

// Curve, in a 500 × 540 coordinate space. Node coordinates sit exactly on the path.
const CURVE =
  "M28 450C90 448 130 420 180 392C235 360 262 344 300 300C340 254 372 200 410 158C435 130 455 112 476 96";
const NODES = [
  { x: 180, y: 392 },
  { x: 300, y: 300 },
  { x: 410, y: 158 },
] as const;
const END = { x: 476, y: 96 };
const W = 500;
const H = 540;

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

function Float({
  className = "",
  depth,
  motion,
  index,
  children,
}: {
  className?: string;
  depth: number;
  motion: "float-a" | "float-b" | "float-c";
  index: number;
  children: React.ReactNode;
}) {
  return (
    <div className={`parallax absolute ${className}`} style={{ "--depth": depth } as React.CSSProperties}>
      <div className="intro" style={{ "--i": index + 6 } as React.CSSProperties}>
        <div className={motion}>{children}</div>
      </div>
    </div>
  );
}

export function HeroVisual() {
  const { t } = useLanguage();
  const v = t.hero.visual;
  const goals = t.goalPlanner.goals;
  const nodeLabels = [goals.home, goals.childEducation, goals.retirement];

  return (
    <div data-stage role="img" aria-label={v.ariaLabel} className="relative mx-auto mb-14 w-full max-w-[34rem] lg:mb-10 lg:max-w-none">
      {/* Navy stage */}
      <div className="relative aspect-[500/540] overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-950 via-navy-900 to-[#06265f] shadow-[0_40px_80px_-30px_rgba(1,20,52,0.65)] ring-1 ring-white/10">
        <div aria-hidden className="bg-hairline-grid-dark absolute inset-0 opacity-70" />
        <div aria-hidden className="stage-glow absolute inset-0" />

        <p className="tracking-caps absolute left-5 top-5 text-[11px] font-semibold text-royal-300 sm:left-6 sm:top-6 sm:text-[11.5px]">
          {v.longTermView}
        </p>

        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="stage-line" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#5b93ee" />
              <stop offset="1" stopColor="#47cf98" />
            </linearGradient>
            <linearGradient id="stage-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5b93ee" stopOpacity="0.32" />
              <stop offset="1" stopColor="#5b93ee" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g className="parallax" style={{ "--depth": 5 } as React.CSSProperties}>
            {/* axis + milestone ticks */}
            <path d="M28 478H476" stroke="rgba(147,182,244,0.28)" strokeWidth="1" />
            {NODES.map((n) => (
              <path
                key={n.x}
                className="stage-fade"
                d={`M${n.x} ${n.y + 12}V478`}
                stroke="rgba(147,182,244,0.4)"
                strokeWidth="1"
                strokeDasharray="3 5"
              />
            ))}

            {/* regular-investing baseline */}
            <path
              className="stage-fade"
              d="M28 450L476 318"
              stroke="rgba(198,216,250,0.4)"
              strokeWidth="1.25"
              strokeDasharray="2 7"
              strokeLinecap="round"
            />

            {/* growth curve */}
            <path className="stage-fade" d={`${CURVE}L476 478L28 478Z`} fill="url(#stage-area)" />
            <path
              className="stage-curve"
              pathLength="1"
              d={CURVE}
              stroke="url(#stage-line)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* goal nodes */}
            {NODES.map((n, i) => (
              <g key={n.x} style={{ "--n": i + 1 } as React.CSSProperties}>
                <circle className="stage-ring" cx={n.x} cy={n.y} r="10" fill="#5b93ee" />
                <circle className="stage-node" cx={n.x} cy={n.y} r="7" fill="#011434" stroke="#93b6f4" strokeWidth="2.5" />
                <circle className="stage-node" cx={n.x} cy={n.y} r="2.5" fill="#93b6f4" />
              </g>
            ))}
            <g style={{ "--n": 4 } as React.CSSProperties}>
              <circle className="stage-ring" cx={END.x} cy={END.y} r="12" fill="#47cf98" />
              <circle className="stage-node" cx={END.x} cy={END.y} r="7" fill="#47cf98" />
            </g>
          </g>
        </svg>

        {/* goal tags (HTML so the text stays crisp and readable at every size) */}
        {NODES.map((n, i) => (
          <div
            key={n.x}
            className="parallax absolute"
            style={
              {
                right: pct(W - n.x, W),
                bottom: pct(H - n.y, H),
                "--depth": 9,
              } as React.CSSProperties
            }
          >
            <div
              className="stage-tag mb-3.5 mr-1.5 whitespace-nowrap rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur sm:mb-4 sm:px-3 sm:text-xs"
              style={{ "--n": i + 1 } as React.CSSProperties}
            >
              {nodeLabels[i]}
            </div>
          </div>
        ))}

        {/* Plan → Invest → Review */}
        <ol className="absolute inset-x-5 bottom-[1.1rem] flex items-center justify-between sm:inset-x-7 sm:bottom-6" aria-hidden="true">
          {v.stages.map((stage, i) => (
            <li
              key={stage}
              className="stage-step flex items-center gap-2 text-[11px] font-semibold tracking-wide text-white sm:text-xs"
              style={{ "--n": i + 1 } as React.CSSProperties}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-royal-300/60 bg-royal-500/25 text-[10.5px] font-bold text-royal-200 tabular">
                {i + 1}
              </span>
              {stage}
              {i < v.stages.length - 1 ? <span className="ml-1 hidden h-px w-6 bg-white/25 sm:block lg:w-4 xl:w-8" /> : null}
            </li>
          ))}
        </ol>
      </div>

      {/* Floating cards */}
      <Float className="-top-5 right-3 sm:-right-5" depth={-14} motion="float-a" index={0}>
        <div className="flex items-center gap-3 rounded-2xl bg-white px-3.5 py-3 shadow-lift ring-1 ring-navy-950/5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal-50 text-royal-600">
            <CalendarClock size={18} aria-hidden />
          </span>
          <span>
            <span className="block text-[13px] font-bold leading-tight text-navy-950">{v.sipDiscipline}</span>
            <span className="mt-1.5 flex gap-1" aria-hidden>
              {[1, 1, 1, 1, 1, 0, 0].map((on, i) => (
                <span key={i} className={`h-1.5 w-1.5 rounded-full ${on ? "bg-royal-600" : "bg-mist-300"}`} />
              ))}
            </span>
          </span>
        </div>
      </Float>

      <Float className="-left-3 top-[30%] hidden sm:block lg:hidden xl:-left-8 xl:block" depth={12} motion="float-b" index={1}>
        <div className="rounded-2xl bg-white px-3.5 py-3 shadow-lift ring-1 ring-navy-950/5">
          <span className="flex items-center gap-2 text-[13px] font-bold text-navy-950">
            <Target size={16} className="text-royal-600" aria-hidden />
            {v.goalPlanning}
          </span>
          <span className="mt-2 flex gap-1.5" aria-hidden>
            {[GraduationCap, House, Sunrise].map((Icon, i) => (
              <span key={i} className="flex h-7 w-7 items-center justify-center rounded-lg bg-mist-100 text-navy-800">
                <Icon size={14} />
              </span>
            ))}
          </span>
        </div>
      </Float>

      <Float className="right-3 top-[calc(100%-0.5rem)] sm:-right-3" depth={-10} motion="float-c" index={2}>
        <div className="flex items-center gap-3 rounded-2xl bg-white px-3.5 py-3 shadow-lift ring-1 ring-navy-950/5">
          <svg width="38" height="38" viewBox="0 0 42 42" aria-hidden="true" className="-rotate-90">
            <circle cx="21" cy="21" r="15" fill="none" stroke="#e1e9f6" strokeWidth="7" />
            <circle cx="21" cy="21" r="15" fill="none" stroke="#1e55c4" strokeWidth="7" strokeDasharray="47 94.2" />
            <circle cx="21" cy="21" r="15" fill="none" stroke="#1fae78" strokeWidth="7" strokeDasharray="26 94.2" strokeDashoffset="-49" />
            <circle cx="21" cy="21" r="15" fill="none" stroke="#93b6f4" strokeWidth="7" strokeDasharray="14 94.2" strokeDashoffset="-77" />
          </svg>
          <span className="text-[13px] font-bold leading-tight text-navy-950">{v.portfolioJourney}</span>
        </div>
      </Float>
    </div>
  );
}
