"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { GoalKey, ServiceKey } from "./i18n/dictionary";

export type CalculatorTab = "sip" | "swp";

interface PlannerContextValue {
  /** Service (or "general") preselected in the contact form's Investment Requirement field. */
  requirement: ServiceKey | "general" | "";
  setRequirement: (requirement: ServiceKey | "general" | "") => void;
  /** Goal picked in the Goal Planner; used to prefill the contact message. */
  goal: GoalKey | null;
  setGoal: (goal: GoalKey | null) => void;
  /** Active calculator tab, so other sections can deep-link to SIP or SWP. */
  calculatorTab: CalculatorTab;
  setCalculatorTab: (tab: CalculatorTab) => void;
  /** Index of the service whose detail panel is open (cards and footer links both open it). */
  serviceIndex: number | null;
  setServiceIndex: (index: number | null) => void;
}

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [requirement, setRequirementState] = useState<PlannerContextValue["requirement"]>("");
  const [goal, setGoalState] = useState<GoalKey | null>(null);
  const [calculatorTab, setCalculatorTabState] = useState<CalculatorTab>("sip");
  const [serviceIndex, setServiceIndexState] = useState<number | null>(null);

  const setRequirement = useCallback((value: PlannerContextValue["requirement"]) => setRequirementState(value), []);
  const setGoal = useCallback((value: GoalKey | null) => setGoalState(value), []);
  const setCalculatorTab = useCallback((tab: CalculatorTab) => setCalculatorTabState(tab), []);
  const setServiceIndex = useCallback((index: number | null) => setServiceIndexState(index), []);

  const value = useMemo<PlannerContextValue>(
    () => ({ requirement, setRequirement, goal, setGoal, calculatorTab, setCalculatorTab, serviceIndex, setServiceIndex }),
    [requirement, setRequirement, goal, setGoal, calculatorTab, setCalculatorTab, serviceIndex, setServiceIndex]
  );

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner(): PlannerContextValue {
  const ctx = useContext(PlannerContext);
  if (!ctx) {
    throw new Error("usePlanner must be used within a PlannerProvider");
  }
  return ctx;
}

/** Smooth-scrolls to a section by id (respecting reduced motion) and updates the URL hash. */
export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  if (history.replaceState) history.replaceState(null, "", `#${id}`);
}
