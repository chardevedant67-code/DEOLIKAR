"use client";

import { useMemo } from "react";
import { Info } from "lucide-react";
import { calculateSip } from "@/lib/calculators";
import { fill, formatINR, formatINRCompact, formatINRWords } from "@/lib/format";
import { useDebouncedValue } from "@/lib/hooks";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Donut } from "../charts/Donut";
import { LineAreaChart, type ChartSeries } from "../charts/LineAreaChart";
import { CalcField } from "./CalcField";
import { BreakdownTable, EquationRow, LegendChip } from "./parts";

export interface SipState {
  monthly: number;
  years: number;
  rate: number;
}

export const SIP_DEFAULTS: SipState = { monthly: 10_000, years: 10, rate: 12 };
export const SIP_LIMITS = {
  monthly: { min: 500, max: 50_00_000 },
  years: { min: 1, max: 40 },
  rate: { min: 1, max: 25 },
} as const;

const BLUE = "#5b93ee";
const MINT = "#47cf98";

export function SIPCalculator({ state, onChange }: { state: SipState; onChange: (next: SipState) => void }) {
  const { t } = useLanguage();
  const c = t.calculator;
  const s = c.sip;

  const result = useMemo(
    () => calculateSip({ monthlyInvestment: state.monthly, years: state.years, annualReturnPercent: state.rate }),
    [state.monthly, state.years, state.rate]
  );

  const x = useMemo(() => result.yearly.map((p) => p.year), [result]);
  const series = useMemo<ChartSeries[]>(
    () => [
      { key: "invested", label: s.investedAmount, color: BLUE, values: result.yearly.map((p) => p.invested), area: true, width: 2 },
      { key: "value", label: s.estimatedPortfolioValue, color: MINT, values: result.yearly.map((p) => p.value), area: true, width: 3 },
    ],
    [result, s.investedAmount, s.estimatedPortfolioValue]
  );

  const words = (n: number) => formatINRWords(n, { lakh: c.lakh, crore: c.crore, lakhCrore: c.lakhCrore });
  const returnsShare = result.futureValue > 0 ? Math.round((result.estimatedReturns / result.futureValue) * 100) : 0;

  const summary = useDebouncedValue(
    fill(c.resultsSummarySip, {
      amount: formatINR(state.monthly),
      years: state.years,
      invested: formatINR(result.totalInvested),
      returns: formatINR(result.estimatedReturns),
      value: formatINR(result.futureValue),
    }),
    700
  );

  const strings = {
    increase: c.increase,
    decrease: c.decrease,
    rangeHint: c.rangeHint,
    rangeError: c.rangeError,
    year: c.year,
    years: c.years,
  };

  return (
    <div>
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Inputs */}
        <div className="rounded-[2rem] border border-mist-200 bg-white p-6 shadow-soft sm:p-8 lg:col-span-5">
          <h3 className="tracking-caps text-[11px] font-bold text-ink-500">{c.inputsHeading}</h3>
          <div className="mt-6 space-y-8">
            <CalcField
              label={s.monthlyInvestment.label}
              tip={s.monthlyInvestment.tip}
              kind="currency"
              scale="log"
              value={state.monthly}
              min={SIP_LIMITS.monthly.min}
              max={SIP_LIMITS.monthly.max}
              onChange={(monthly) => onChange({ ...state, monthly })}
              strings={strings}
            />
            <CalcField
              label={s.investmentDuration.label}
              tip={s.investmentDuration.tip}
              kind="years"
              suffix={state.years === 1 ? c.year : c.years}
              value={state.years}
              min={SIP_LIMITS.years.min}
              max={SIP_LIMITS.years.max}
              onChange={(years) => onChange({ ...state, years })}
              strings={strings}
            />
            <CalcField
              label={s.expectedReturn.label}
              tip={s.expectedReturn.tip}
              kind="percent"
              step={0.5}
              suffix="%"
              value={state.rate}
              min={SIP_LIMITS.rate.min}
              max={SIP_LIMITS.rate.max}
              onChange={(rate) => onChange({ ...state, rate })}
              strings={strings}
            />
          </div>
          <p className="mt-7 flex items-start gap-2.5 rounded-2xl bg-royal-50 p-4 text-[13px] leading-relaxed text-royal-700">
            <Info size={16} className="mt-0.5 shrink-0" aria-hidden />
            {s.illustrativeNote}
          </p>
        </div>

        {/* Results */}
        <div className="on-dark relative flex flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-950 via-navy-900 to-[#06265f] p-6 text-white shadow-lift sm:p-8 lg:col-span-7">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-royal-500/25 blur-3xl" />
          <h3 className="tracking-caps relative text-[11px] font-bold text-royal-300">{c.resultsHeading}</h3>

          <div className="relative mt-4 divide-y divide-white/10">
            <EquationRow label={s.totalInvested} value={result.totalInvested} format={formatINR} words={words(result.totalInvested)} dot={BLUE} />
            <EquationRow label={s.estimatedReturns} value={result.estimatedReturns} format={formatINR} words={words(result.estimatedReturns)} dot={MINT} sign="+" />
            <EquationRow label={s.estimatedFutureValue} value={result.futureValue} format={formatINR} words={words(result.futureValue)} emphasised />
          </div>

          <div className="relative mt-8 flex flex-col items-start gap-6 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:gap-8 lg:mt-auto">
            <Donut
              size={132}
              stroke={17}
              segments={[
                { label: s.investedAmount, value: result.totalInvested, color: BLUE },
                { label: s.estimatedReturns, value: result.estimatedReturns, color: MINT },
              ]}
            >
              <span className="tabular font-display text-xl font-extrabold text-white">{returnsShare}%</span>
            </Donut>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white/50">{s.donutTitle}</p>
              <ul className="mt-3 space-y-2.5">
                <li className="flex items-center justify-between gap-4 text-sm">
                  <span className="flex items-center gap-2.5 text-white/80">
                    <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: BLUE }} />
                    {s.investedAmount}
                  </span>
                  <span className="tabular font-bold text-white">{100 - returnsShare}%</span>
                </li>
                <li className="flex items-center justify-between gap-4 text-sm">
                  <span className="flex items-center gap-2.5 text-white/80">
                    <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: MINT }} />
                    {s.estimatedReturns}
                  </span>
                  <span className="tabular font-bold text-white">{returnsShare}%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="on-dark mt-5 rounded-[2rem] bg-navy-950 p-5 text-white shadow-lift sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <h3 className="font-display text-lg font-bold tracking-tight sm:text-xl">{s.growthChartTitle}</h3>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <LegendChip color={BLUE} label={s.investedAmount} />
            <LegendChip color={MINT} label={s.estimatedPortfolioValue} />
          </div>
        </div>

        <div className="mt-5">
          <LineAreaChart
            tone="dark"
            x={x}
            series={series}
            ariaLabel={s.growthChartTitle}
            xAxisLabel={c.yearAxisLabel}
            yAxisLabel={s.estimatedPortfolioValue}
            tooltipTitle={(year) => `${c.year} ${year}`}
            formatValue={formatINR}
            formatTick={formatINRCompact}
            hint={c.chartHint}
          />
        </div>
        <p aria-hidden className="mt-2 text-xs text-white/40">
          {c.chartHint}
        </p>

        <BreakdownTable
          caption={s.tableCaption}
          columns={[c.year, s.investedAmount, s.estimatedReturns, s.estimatedPortfolioValue]}
          rows={result.yearly
            .filter((p) => p.year > 0)
            .map((p) => [String(p.year), formatINR(p.invested), formatINR(Math.max(p.value - p.invested, 0)), formatINR(p.value)])}
          showLabel={c.viewBreakdown}
          hideLabel={c.hideBreakdown}
        />
      </div>

      <p role="status" className="sr-only">
        {summary}
      </p>
    </div>
  );
}
