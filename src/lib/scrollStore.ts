import { useSyncExternalStore } from "react";
import { SECTIONS, type NavKey } from "./sections";

export interface ScrollState {
  /** True once the page has scrolled a little — drives the compact header. */
  scrolled: boolean;
  /** True once the hero is behind us — drives the journey rail visibility. */
  pastHero: boolean;
  activeNav: NavKey;
  /** 0–4: Goal, Understand, Plan, Invest, Review. */
  journeyStep: number;
}

const INITIAL: ScrollState = { scrolled: false, pastHero: false, activeNav: "home", journeyStep: 0 };

let state: ScrollState = INITIAL;
const listeners = new Set<() => void>();

function commit(next: ScrollState) {
  if (
    next.scrolled === state.scrolled &&
    next.pastHero === state.pastHero &&
    next.activeNav === state.activeNav &&
    next.journeyStep === state.journeyStep
  ) {
    return;
  }
  state = next;
  listeners.forEach((l) => l());
}

function measure() {
  const y = window.scrollY;
  const doc = document.documentElement;
  const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
  // Progress goes straight to a CSS variable so scrolling never re-renders React.
  doc.style.setProperty("--scroll", String(Math.min(Math.max(y / max, 0), 1)));

  // The section that has crossed 40% of the viewport height is "current".
  const line = window.innerHeight * 0.4;
  let current: (typeof SECTIONS)[number] = SECTIONS[0];
  for (const section of SECTIONS) {
    const el = document.getElementById(section.id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= line) current = section;
  }

  // At the very bottom of the page, the last section always wins.
  if (window.innerHeight + y >= doc.scrollHeight - 4) current = SECTIONS[SECTIONS.length - 1];

  commit({
    scrolled: y > 12,
    pastHero: y > window.innerHeight * 0.55,
    activeNav: current.nav,
    journeyStep: current.step,
  });
}

/** Starts tracking scroll position. Returns a cleanup function. */
export function startScrollTracking(): () => void {
  let frame = 0;
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      measure();
    });
  };
  measure();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    if (frame) cancelAnimationFrame(frame);
  };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useScrollState(): ScrollState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => INITIAL
  );
}
