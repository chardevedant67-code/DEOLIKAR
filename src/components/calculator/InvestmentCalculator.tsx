"use client";

import { useRef, useState } from "react";
import { Info } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { type CalculatorTab, usePlanner } from "@/lib/planner-context";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { SIPCalculator, SIP_DEFAULTS, type SipState } from "./SIPCalculator";
import { SWPCalculator, SWP_DEFAULTS, type SwpState } from "./SWPCalculator";

const TABS: CalculatorTab[] = ["sip", "swp"];

export function InvestmentCalculator() {
  const { t } = useLanguage();
  const { calculatorTab, setCalculatorTab } = usePlanner();
  // Inputs live here so switching tabs never loses what the visitor entered.
  const [sip, setSip] = useState<SipState>(SIP_DEFAULTS);
  const [swp, setSwp] = useState<SwpState>(SWP_DEFAULTS);
  const tabRefs = useRef<Record<CalculatorTab, HTMLButtonElement | null>>({ sip: null, swp: null });

  const labels: Record<CalculatorTab, string> = { sip: t.calculator.sipTab, swp: t.calculator.swpTab };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = TABS.indexOf(calculatorTab);
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + TABS.length - 1) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    else return;
    event.preventDefault();
    setCalculatorTab(TABS[next]);
    tabRefs.current[TABS[next]]?.focus();
  };

  return (
    <section
      id="calculator"
      aria-labelledby="calculator-heading"
      className="relative overflow-hidden bg-gradient-to-b from-mist-50 via-royal-50/60 to-mist-50 py-20 sm:py-24 lg:py-32"
    >
      <div aria-hidden className="bg-hairline-grid pointer-events-none absolute inset-0 opacity-70" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-80 w-[60rem] max-w-full -translate-x-1/2 rounded-full bg-royal-400/10 blur-[120px]" />

      <div className="container-page relative">
        <SectionHeading
          id="calculator-heading"
          eyebrow={t.nav.calculator}
          heading={t.calculator.heading}
          subheading={t.calculator.subheading}
        />

        <Reveal className="mt-10 lg:mt-12">
          <div
            role="tablist"
            aria-label={t.calculator.tabsLabel}
            onKeyDown={onKeyDown}
            className="relative inline-grid w-full grid-cols-2 rounded-full bg-white p-1.5 shadow-soft ring-1 ring-mist-200 sm:w-auto sm:min-w-[26rem]"
          >
            <span
              aria-hidden
              className="absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-full bg-navy-950 shadow-[0_8px_20px_-8px_rgba(1,20,52,0.7)] transition-transform duration-300 ease-out"
              style={{ transform: calculatorTab === "swp" ? "translateX(100%)" : "translateX(0)" }}
            />
            {TABS.map((tab) => {
              const selected = calculatorTab === tab;
              return (
                <button
                  key={tab}
                  ref={(el) => {
                    tabRefs.current[tab] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`calc-tab-${tab}`}
                  aria-selected={selected}
                  aria-controls={`calc-panel-${tab}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setCalculatorTab(tab)}
                  className={`relative z-10 min-h-12 rounded-full px-5 text-[15px] font-semibold transition-colors duration-300 ${
                    selected ? "text-white" : "text-ink-600 hover:text-navy-950"
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-6">
          {TABS.map((tab) => (
            <div
              key={tab}
              role="tabpanel"
              id={`calc-panel-${tab}`}
              aria-labelledby={`calc-tab-${tab}`}
              hidden={calculatorTab !== tab}
            >
              {calculatorTab === tab ? (
                tab === "sip" ? (
                  <SIPCalculator state={sip} onChange={setSip} />
                ) : (
                  <SWPCalculator state={swp} onChange={setSwp} />
                )
              ) : null}
            </div>
          ))}
        </div>

        {/* Always visible, directly below the calculators */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-mist-300 bg-white/80 p-5 text-sm leading-relaxed text-ink-700 backdrop-blur">
          <Info size={18} className="mt-0.5 shrink-0 text-royal-600" aria-hidden />
          <p>{t.calculator.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
