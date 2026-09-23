import type { Lang } from "./i18n/dictionary";

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrNumberFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

/** Formats a number as Indian-grouped rupees, e.g. 1000000 -> "₹10,00,000". */
export function formatINR(value: number): string {
  if (!Number.isFinite(value)) return "₹0";
  return inrFormatter.format(Math.round(value)).replace(/\s/g, "");
}

/** Formats a plain number using Indian digit grouping, no currency symbol. */
export function formatIndianNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return inrNumberFormatter.format(Math.round(value));
}

/** Compact Indian-style label for chart ticks, e.g. 5000000 -> "₹50L", 10000000 -> "₹1Cr". */
export function formatINRCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e12) return `₹${trimDecimal(value / 1e12)}L Cr`;
  if (abs >= 1e7) return `₹${trimDecimal(value / 1e7)}Cr`;
  if (abs >= 1e5) return `₹${trimDecimal(value / 1e5)}L`;
  if (abs >= 1e3) return `₹${trimDecimal(value / 1e3)}K`;
  return `₹${Math.round(value)}`;
}

function trimDecimal(n: number): string {
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);
}

function trimTwo(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return String(Number(rounded.toFixed(2)));
}

export interface WordUnits {
  lakh: string;
  crore: string;
  lakhCrore: string;
}

/**
 * Readable Indian magnitude, e.g. 2323391 -> "₹23.23 Lakh", 23233910 -> "₹2.32 Crore".
 * Returns an empty string below one lakh, where the full figure is already easy to read.
 */
export function formatINRWords(value: number, units: WordUnits): string {
  const abs = Math.abs(value);
  if (!Number.isFinite(abs) || abs < 1e5) return "";
  if (abs >= 1e12) return `₹${trimTwo(value / 1e12)} ${units.lakhCrore}`;
  if (abs >= 1e7) return `₹${trimTwo(value / 1e7)} ${units.crore}`;
  return `₹${trimTwo(value / 1e5)} ${units.lakh}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Replaces `{token}` placeholders in a translated template. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => (key in values ? String(values[key]) : `{${key}}`));
}

export function langTag(lang: Lang): string {
  return lang === "hi" ? "hi-IN" : "en-IN";
}
