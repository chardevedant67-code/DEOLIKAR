/**
 * Independent checks for the calculator maths, run with:  npm run test:calc
 * Uses Node's built-in test runner — no extra dependencies.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SLIDER_STEPS,
  calculateSip,
  calculateSwp,
  logValueToPosition,
  positionToLogValue,
  rupeeStepFor,
  sipFutureValue,
  stepRupees,
} from "../src/lib/calculators.ts";
import { formatINR, formatINRCompact, formatINRWords, fill } from "../src/lib/format.ts";

/** Reference SIP: invest at the START of each month, then grow one month. Different algorithm from the closed form. */
function simulateSip(monthly: number, years: number, annualPercent: number): number {
  const r = annualPercent / 12 / 100;
  let balance = 0;
  for (let m = 0; m < years * 12; m++) balance = (balance + monthly) * (1 + r);
  return balance;
}

/** Reference SWP: grow one month, then withdraw (never below zero). */
function simulateSwp(initial: number, withdrawal: number, years: number, annualPercent: number) {
  const r = annualPercent / 12 / 100;
  let balance = initial;
  let withdrawn = 0;
  for (let m = 0; m < years * 12; m++) {
    balance *= 1 + r;
    const take = Math.min(withdrawal, balance);
    balance -= take;
    withdrawn += take;
  }
  return { balance, withdrawn };
}

const close = (actual: number, expected: number, tolerance = 1e-6) =>
  assert.ok(Math.abs(actual - expected) <= Math.max(1, Math.abs(expected)) * tolerance, `${actual} ≉ ${expected}`);

describe("SIP", () => {
  it("matches FV = P × [((1+r)^n − 1)/r] × (1+r) for the default inputs", () => {
    const result = calculateSip({ monthlyInvestment: 10_000, years: 10, annualReturnPercent: 12 });
    // Hand-checked: r = 0.01, n = 120 → factor 230.0386869 × 1.01 = 232.3390738
    close(result.futureValue, 10_000 * 232.3390738, 1e-6);
    assert.equal(result.totalInvested, 12_00_000);
    close(result.estimatedReturns, result.futureValue - 12_00_000);
    assert.equal(formatINR(result.totalInvested), "₹12,00,000");
    assert.equal(formatINR(result.futureValue), "₹23,23,391");
  });

  it("agrees with an independent month-by-month simulation across the whole input range", () => {
    for (const monthly of [500, 10_000, 1_00_000, 50_00_000]) {
      for (const years of [1, 7, 20, 40]) {
        for (const rate of [1, 8, 12, 25]) {
          const closed = calculateSip({ monthlyInvestment: monthly, years, annualReturnPercent: rate }).futureValue;
          close(closed, simulateSip(monthly, years, rate), 1e-9);
        }
      }
    }
  });

  it("supports the documented maximums (₹50,00,000/month, 40 years, 25%) without overflow or NaN", () => {
    const result = calculateSip({ monthlyInvestment: 50_00_000, years: 40, annualReturnPercent: 25 });
    assert.ok(Number.isFinite(result.futureValue) && result.futureValue > result.totalInvested);
    assert.equal(result.totalInvested, 50_00_000 * 480);
    assert.equal(result.yearly.length, 41); // year 0 … 40
  });

  it("handles a zero / near-zero rate safely (no division by zero)", () => {
    assert.equal(sipFutureValue(10_000, 0, 120), 1_200_000);
    assert.equal(sipFutureValue(10_000, 1e-14, 120), 1_200_000);
    const zero = calculateSip({ monthlyInvestment: 5_000, years: 5, annualReturnPercent: 0 });
    assert.equal(zero.futureValue, 300_000);
    assert.equal(zero.estimatedReturns, 0);
  });

  it("yearly series starts at the origin and is monotonically increasing", () => {
    const { yearly } = calculateSip({ monthlyInvestment: 25_000, years: 15, annualReturnPercent: 10 });
    assert.deepEqual(yearly[0], { year: 0, invested: 0, value: 0 });
    for (let i = 1; i < yearly.length; i++) {
      assert.ok(yearly[i].value > yearly[i - 1].value);
      assert.ok(yearly[i].invested > yearly[i - 1].invested);
      assert.ok(yearly[i].value >= yearly[i].invested);
    }
  });
});

describe("SWP", () => {
  it("matches an independent simulation for the default inputs", () => {
    const result = calculateSwp({ initialInvestment: 10_00_000, monthlyWithdrawal: 25_000, annualReturnPercent: 10, years: 10 });
    const ref = simulateSwp(10_00_000, 25_000, 10, 10);
    close(result.remainingCorpus, ref.balance, 1e-9);
    close(result.totalWithdrawn, ref.withdrawn, 1e-9);
    // accounting identity: remaining + withdrawn = initial + returns
    close(result.remainingCorpus + result.totalWithdrawn, 10_00_000 + result.estimatedReturns, 1e-9);
  });

  it("never lets the balance go negative and stops withdrawing once exhausted", () => {
    const result = calculateSwp({ initialInvestment: 10_00_000, monthlyWithdrawal: 1_00_000, annualReturnPercent: 1, years: 5 });
    assert.equal(result.remainingCorpus, 0);
    assert.ok(result.corpusDepletedAtYear !== null && result.corpusDepletedAtYear <= 2);
    assert.ok(result.totalWithdrawn > 10_00_000 * 0.99 && result.totalWithdrawn < 10_00_000 * 1.05);
    for (const point of result.yearly) assert.ok(point.balance >= 0);
  });

  it("reports no depletion when returns comfortably cover withdrawals", () => {
    const result = calculateSwp({ initialInvestment: 1_00_00_000, monthlyWithdrawal: 25_000, annualReturnPercent: 12, years: 20 });
    assert.equal(result.corpusDepletedAtYear, null);
    assert.ok(result.remainingCorpus > 1_00_00_000);
  });

  it("supports the documented maximums (₹5,00,00,000 initial, ₹50,00,000/month, 40 years, 25%)", () => {
    const result = calculateSwp({ initialInvestment: 5_00_00_000, monthlyWithdrawal: 50_00_000, annualReturnPercent: 25, years: 40 });
    assert.ok(Number.isFinite(result.remainingCorpus));
    assert.equal(result.yearly.length, 41);
    assert.equal(result.yearly[0].balance, 5_00_00_000);
  });
});

describe("slider scales", () => {
  it("log scale hits both endpoints exactly and round-trips typical values", () => {
    for (const [min, max] of [
      [500, 50_00_000],
      [10_000, 5_00_00_000],
      [1_000, 50_00_000],
    ] as const) {
      assert.equal(positionToLogValue(0, min, max), min);
      assert.equal(positionToLogValue(SLIDER_STEPS, min, max), max);
      assert.equal(logValueToPosition(min, min, max), 0);
      assert.equal(logValueToPosition(max, min, max), SLIDER_STEPS);
    }
    const pos = logValueToPosition(10_000, 500, 50_00_000);
    assert.ok(Math.abs(positionToLogValue(pos, 500, 50_00_000) - 10_000) <= 500);
  });

  it("log slider values are always inside the range and snap to natural steps", () => {
    for (let p = 0; p <= SLIDER_STEPS; p += 7) {
      const value = positionToLogValue(p, 500, 50_00_000);
      assert.ok(value >= 500 && value <= 50_00_000);
      if (value < 50_00_000 && value > 500) assert.equal(value % rupeeStepFor(value), 0);
    }
  });

  it("+/- buttons step naturally and clamp at the limits", () => {
    assert.equal(stepRupees(10_000, 1, 500, 50_00_000), 11_000);
    assert.equal(stepRupees(10_000, -1, 500, 50_00_000), 9_500);
    assert.equal(stepRupees(500, -1, 500, 50_00_000), 500);
    assert.equal(stepRupees(50_00_000, 1, 500, 50_00_000), 50_00_000);
    assert.equal(stepRupees(10_250, 1, 500, 50_00_000), 11_000);
  });
});

describe("Indian formatting", () => {
  it("groups digits the Indian way (never ₹1,000,000)", () => {
    assert.equal(formatINR(1_00_000), "₹1,00,000");
    assert.equal(formatINR(10_00_000), "₹10,00,000");
    assert.equal(formatINR(1_00_00_000), "₹1,00,00,000");
    assert.equal(formatINR(50_00_000), "₹50,00,000");
    assert.equal(formatINR(5_00_00_000), "₹5,00,00,000");
    assert.equal(formatINR(500), "₹500");
    assert.equal(formatINR(12_34_56_789), "₹12,34,56,789");
  });

  it("compact and word forms use lakh / crore", () => {
    assert.equal(formatINRCompact(50_00_000), "₹50L");
    assert.equal(formatINRCompact(1_00_00_000), "₹1Cr");
    assert.equal(formatINRCompact(2_50_000), "₹2.5L");
    const units = { lakh: "Lakh", crore: "Crore", lakhCrore: "Lakh Crore" };
    assert.equal(formatINRWords(23_23_391, units), "₹23.23 Lakh");
    assert.equal(formatINRWords(2_32_33_907, units), "₹2.32 Crore");
    assert.equal(formatINRWords(50_000, units), "");
  });

  it("fills translation templates", () => {
    assert.equal(fill("Allowed range: {min} to {max}", { min: "₹500", max: "₹50,00,000" }), "Allowed range: ₹500 to ₹50,00,000");
  });
});
