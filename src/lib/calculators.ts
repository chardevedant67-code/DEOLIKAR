/**
 * Pure calculator maths. Everything shown in the calculator UI (results, charts,
 * year-by-year tables) is derived from these functions and the user's inputs.
 */

/** Below this monthly rate the closed-form SIP annuity divides by ~0, so we use the r = 0 limit. */
const ZERO_RATE_EPSILON = 1e-10;

export interface SipInputs {
  monthlyInvestment: number;
  years: number;
  annualReturnPercent: number;
}

export interface SipYearPoint {
  year: number;
  invested: number;
  value: number;
}

export interface SipResult {
  totalInvested: number;
  estimatedReturns: number;
  futureValue: number;
  /** Includes year 0 so charts start at the origin. */
  yearly: SipYearPoint[];
}

/**
 * Future value of a SIP with payments at the start of each month:
 * FV = P × [((1 + r)^n − 1) / r] × (1 + r)
 * P = monthly investment, r = annual return / 12 / 100, n = years × 12.
 */
export function sipFutureValue(monthlyInvestment: number, monthlyRate: number, months: number): number {
  if (months <= 0 || monthlyInvestment <= 0) return 0;
  if (Math.abs(monthlyRate) < ZERO_RATE_EPSILON) return monthlyInvestment * months;
  return monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
}

export function calculateSip({ monthlyInvestment, years, annualReturnPercent }: SipInputs): SipResult {
  const r = annualReturnPercent / 12 / 100;
  const wholeYears = Math.max(0, Math.round(years));
  const totalMonths = wholeYears * 12;

  const yearly: SipYearPoint[] = [{ year: 0, invested: 0, value: 0 }];
  for (let y = 1; y <= wholeYears; y++) {
    const n = y * 12;
    yearly.push({ year: y, invested: monthlyInvestment * n, value: sipFutureValue(monthlyInvestment, r, n) });
  }

  const totalInvested = monthlyInvestment * totalMonths;
  const futureValue = sipFutureValue(monthlyInvestment, r, totalMonths);
  const estimatedReturns = Math.max(futureValue - totalInvested, 0);

  return { totalInvested, estimatedReturns, futureValue, yearly };
}

export interface SwpInputs {
  initialInvestment: number;
  monthlyWithdrawal: number;
  annualReturnPercent: number;
  years: number;
}

export interface SwpYearPoint {
  year: number;
  balance: number;
  cumulativeWithdrawn: number;
}

export interface SwpResult {
  totalWithdrawn: number;
  remainingCorpus: number;
  estimatedReturns: number;
  /** Year in which the estimated corpus reaches zero, or null if it lasts the chosen duration. */
  corpusDepletedAtYear: number | null;
  /** Includes year 0 so charts start at the initial investment. */
  yearly: SwpYearPoint[];
}

/**
 * Month-by-month simulation: the corpus earns the assumed monthly return, then the
 * monthly withdrawal is taken. Withdrawals stop once the corpus is exhausted.
 */
export function calculateSwp({
  initialInvestment,
  monthlyWithdrawal,
  annualReturnPercent,
  years,
}: SwpInputs): SwpResult {
  const r = annualReturnPercent / 12 / 100;
  const wholeYears = Math.max(0, Math.round(years));
  const totalMonths = wholeYears * 12;

  let balance = initialInvestment;
  let cumulativeWithdrawn = 0;
  let depletedAtYear: number | null = null;
  const yearly: SwpYearPoint[] = [{ year: 0, balance: initialInvestment, cumulativeWithdrawn: 0 }];

  for (let m = 1; m <= totalMonths; m++) {
    balance = balance * (1 + r);
    const withdrawal = Math.min(monthlyWithdrawal, Math.max(balance, 0));
    balance -= withdrawal;
    cumulativeWithdrawn += withdrawal;

    if (balance <= 1e-6) {
      balance = 0;
      if (depletedAtYear === null) depletedAtYear = Math.ceil(m / 12);
    }

    if (m % 12 === 0) {
      yearly.push({ year: m / 12, balance, cumulativeWithdrawn });
    }
  }

  const remainingCorpus = Math.max(balance, 0);
  const estimatedReturns = Math.max(remainingCorpus + cumulativeWithdrawn - initialInvestment, 0);

  return {
    totalWithdrawn: cumulativeWithdrawn,
    remainingCorpus,
    estimatedReturns,
    corpusDepletedAtYear: depletedAtYear,
    yearly,
  };
}

/* ------------------------------------------------------------------ */
/* Slider scales                                                       */
/* ------------------------------------------------------------------ */

/** Slider resolution for log-scaled fields (0 … SLIDER_STEPS). */
export const SLIDER_STEPS = 1000;

/**
 * Rupee step that feels natural at a given magnitude — used for the +/- buttons and
 * for snapping the log slider so it never lands on awkward values like ₹10,347.
 */
export function rupeeStepFor(value: number): number {
  if (value < 10_000) return 500;
  if (value < 1_00_000) return 1_000;
  if (value < 10_00_000) return 10_000;
  if (value < 1_00_00_000) return 1_00_000;
  return 5_00_000;
}

/** Slider position (0…SLIDER_STEPS) → value on a log scale between min and max. */
export function positionToLogValue(position: number, min: number, max: number): number {
  if (position <= 0) return min;
  if (position >= SLIDER_STEPS) return max;
  const raw = min * Math.pow(max / min, position / SLIDER_STEPS);
  const step = rupeeStepFor(raw);
  const snapped = Math.round(raw / step) * step;
  return Math.min(Math.max(snapped, min), max);
}

/** Value → slider position on a log scale. */
export function logValueToPosition(value: number, min: number, max: number): number {
  const v = Math.min(Math.max(value, min), max);
  return Math.round((Math.log(v / min) / Math.log(max / min)) * SLIDER_STEPS);
}

/** Next/previous "natural" rupee value for the +/- buttons. */
export function stepRupees(value: number, direction: 1 | -1, min: number, max: number): number {
  const step = direction === 1 ? rupeeStepFor(value) : rupeeStepFor(Math.max(value - 1, 0));
  const next = direction === 1 ? (Math.floor(value / step) + 1) * step : (Math.ceil(value / step) - 1) * step;
  return Math.min(Math.max(next, min), max);
}
