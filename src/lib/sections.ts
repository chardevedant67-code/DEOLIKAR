export type NavKey = "home" | "about" | "services" | "calculator" | "approach" | "contact";

/**
 * Page sections in scroll order. `step` maps each one onto the five-step
 * journey indicator (Goal → Understand → Plan → Invest → Review) and `nav`
 * onto the header link that should read as active while it is on screen.
 */
export const SECTIONS = [
  { id: "home", step: 0, nav: "home" },
  { id: "services", step: 1, nav: "services" },
  { id: "why-us", step: 1, nav: "services" },
  { id: "about", step: 1, nav: "about" },
  { id: "approach", step: 2, nav: "approach" },
  { id: "calculator", step: 2, nav: "calculator" },
  { id: "goal-planner", step: 2, nav: "calculator" },
  { id: "start", step: 3, nav: "contact" },
  { id: "questions", step: 3, nav: "contact" },
  { id: "contact", step: 4, nav: "contact" },
  { id: "disclaimer", step: 4, nav: "contact" },
] as const satisfies readonly { id: string; step: number; nav: NavKey }[];

export type SectionId = (typeof SECTIONS)[number]["id"];

export const NAV_ITEMS: readonly { key: NavKey; href: string }[] = [
  { key: "home", href: "#home" },
  { key: "about", href: "#about" },
  { key: "services", href: "#services" },
  { key: "calculator", href: "#calculator" },
  { key: "approach", href: "#approach" },
  { key: "contact", href: "#contact" },
];
