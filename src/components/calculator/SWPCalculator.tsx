"use client";

import { useMemo } from "react";
import { Info, TriangleAlert } from "lucide-react";
import { calculateSwp } from "@/lib/calculators";
import { fill, formatINR, formatINRCompact, formatINRWords } from "@/lib/format";
import { useDebouncedValue } from "@/lib/hooks";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { LineAreaChart, type ChartSeries } from "../charts/LineAreaChart";
import { CalcField } from "./CalcField";
import { BreakdownTable, EquationRow, LegendChip } from "./parts";

export interface SwpState {
  initial: number;
  withdrawal: number;
  rate: number;
  years: number;
}

export const SWP_DEFAULTS: SwpState = { initial: 10_00_000, withdrawal: 25_000, rate: 10, years: 10 };
export const SWP_LIMITS = {
  initial: { min: 10_000, max: 5_00_00_000 },
  withdrawal: { min: 1_000, max: 50_00_000 },
  rate: { min: 1, max: 25 },
  years: { min: 1, max: 40 },
} as const;

const BLUE = "#5b93ee";
const MINT = "#47cf98";
const SKY = "#93b6f4";

export function SWPCalculator({ state, onChange }: { state: SwpState; onChange: (next: SwpState) => void }) {
  const { t } = useLanguage();
  const c = t.calculator;
  const s = c.swp;

  const result = useMemo(
    () =>
      calculateSwp({
        initialInvestment: state.initial,
        monthlyWithdrawal: state.withdrawal,
        annualReturnPercent: state.rate,
        years: state.years,
      }),
    [state.initial, state.withdrawal, state.rate, state.years]
  );

  const x = useMemo(() => result.yearly.map((p) => p.year), [result]);
  const series = useMemo<ChartSeries[]>(
    () => [
      { key: "withdrawn", label: s.cumulativeWithdrawals, color: SKY, values: result.yearly.map((p) => p.cumulativeWithdrawn), width: 2, dashed: true },
      { key: "balance", label: s.balance, color: MINT, values: result.yearly.map((p) => p.balance), area: true, width: 3 },
    ],
    [result, s.balance, s.cumulativeWithdrawals]
  );

  const words = (n: number) => formatINRWords(n, { lakh: c.lakh, crore: c.crore, lakhCrore: c.lakhCrore });

  const summary = useDebouncedValue(
    fill(c.resultsSummarySwp, {
      initial: formatINR(state.initial),
      amount: formatINR(state.withdrawal),
      years: state.years,
      withdrawn: formatINR(result.totalWithdrawn),
      returns: formatINR(result.estimatedReturns),
      remaining: formatINR(result.remainingCorpus),
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
              label={s.initialInvestment.label}
              tip={s.initialInvestment.tip}
              kind="currency"
              scale="log"
              value={state.initial}
              min={SWP_LIMITS.initial.min}
              max={SWP_LIMITS.initial.max}
              onChange={(initial) => onChange({ ...state, initial })}
              strings={strings}
            />
            <CalcField
              label={s.monthlyWithdrawal.label}
              tip={s.monthlyWithdrawal.tip}
              kind="currency"
              scale="log"
              value={state.withdrawal}
              min={SWP_LIMITS.withdrawal.min}
              max={SWP_LIMITS.withdrawal.max}
              onChange={(withdrawal) => onChange({ ...state, withdrawal })}
              strings={strings}
            />
            <CalcField
              label={s.expectedReturn.label}
              tip={s.expectedReturn.tip}
              kind="percent"
              step={0.5}
              suffix="%"
              value={state.rate}
              min={SWP_LIMITS.rate.min}
              max={SWP_LIMITS.rate.max}
              onChange={(rate) => onChange({ ...state, rate })}
              strings={strings}
            />
            <CalcField
              label={s.withdrawalDuration.label}
              tip={s.withdrawalDuration.tip}
              kind="years"
              suffix={state.years === 1 ? c.year : c.years}
              value={state.years}
              min={SWP_LIMITS.years.min}
              max={SWP_LIMITS.years.max}
              onChange={(years) => onChange({ ...state, years })}
              strings={strings}
            />
          </div>
        </div>

        {/* Results */}
        <div className="on-dark relative flex flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-950 via-navy-900 to-[#06265f] p-6 text-white shadow-lift sm:p-8 lg:col-span-7">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-royal-500/25 blur-3xl" />
          <h3 className="tracking-caps relative text-[11px] font-bold text-royal-300">{c.resultsHeading}</h3>

          <div className="relative mt-4 divide-y divide-white/10">
            <EquationRow label={s.initialInvestment.label} value={state.initial} format={formatINR} words={words(state.initial)} dot={BLUE} />
            <EquationRow label={s.estimatedReturns} value={result.estimatedReturns} format={formatINR} words={words(result.estimatedReturns)} dot={MINT} sign="+" />
            <EquationRow label={s.totalWithdrawals} value={result.totalWithdrawn} format={formatINR} words={words(result.totalWithdrawn)} dot={SKY} sign="−" />
            <EquationRow label={s.remainingCorpus} value={result.remainingCorpus} format={formatINR} words={words(result.remainingCorpus)} emphasised />
          </div>

          {result.corpusDepletedAtYear !== null ? (
            <p role="status" className="relative mt-6 flex items-start gap-2.5 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-[13px] leading-relaxed text-amber-100">
              <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden />
              {s.depletedWarning}
            </p>
          ) : null}

          <p className="relative mt-auto flex items-start gap-2.5 pt-6 text-[13px] leading-relaxed text-white/60">
            <Info size={16} className="mt-0.5 shrink-0 text-royal-300" aria-hidden />
            {s.warning}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="on-dark mt-5 rounded-[2rem] bg-navy-950 p-5 text-white shadow-lift sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <h3 className="font-display text-lg font-bold tracking-tight sm:text-xl">{s.chartTitle}</h3>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <LegendChip color={MINT} label={s.balance} />
            <LegendChip color={SKY} label={s.cumulativeWithdrawals} dashed />
          </div>
        </div>

        <div className="mt-5">
          <LineAreaChart
            tone="dark"
            x={x}
            series={series}
            ariaLabel={s.chartTitle}
            xAxisLabel={c.yearAxisLabel}
            yAxisLabel={s.balance}
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
          columns={[c.year, s.balance, s.cumulativeWithdrawals]}
          rows={result.yearly.map((p) => [String(p.year), formatINR(p.balance), formatINR(p.cumulativeWithdrawn)])}
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
