"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  SLIDER_STEPS,
  logValueToPosition,
  positionToLogValue,
  stepRupees,
} from "@/lib/calculators";
import { clamp, fill, formatINR, formatIndianNumber } from "@/lib/format";
import { InfoTip } from "../ui/InfoTip";

export type FieldKind = "currency" | "percent" | "years";

interface CalcFieldProps {
  label: string;
  tip: string;
  kind: FieldKind;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  /** "log" gives wide rupee ranges a usable slider (₹500 → ₹50,00,000). */
  scale?: "linear" | "log";
  /** Step for linear fields (percent: 0.5, years: 1). */
  step?: number;
  /** Suffix shown inside the input (e.g. "Years" / "%"). */
  suffix?: string;
  strings: { increase: string; decrease: string; rangeHint: string; rangeError: string; year: string; years: string };
}

function displayValue(kind: FieldKind, value: number): string {
  return kind === "currency" ? formatIndianNumber(value) : String(value);
}

/** Formats a min/max end-cap label under the slider. */
function endLabel(kind: FieldKind, value: number, strings: CalcFieldProps["strings"]): string {
  if (kind === "currency") return formatINR(value);
  if (kind === "percent") return `${value}%`;
  return `${value} ${value === 1 ? strings.year : strings.years}`;
}

/**
 * A calculator input: label + tooltip, ± buttons, a free-typing number field and a
 * slider — all bound to the same value. Typing is forgiving (you can clear the field
 * and retype); the value is clamped to the allowed range on blur.
 */
export function CalcField({
  label,
  tip,
  kind,
  value,
  onChange,
  min,
  max,
  scale = "linear",
  step = 1,
  suffix,
  strings,
}: CalcFieldProps) {
  const uid = useId();
  const inputId = `${uid}-input`;
  const labelId = `${uid}-label`;
  const hintId = `${uid}-hint`;
  const errorId = `${uid}-error`;

  const inputRef = useRef<HTMLInputElement>(null);
  const caretDigits = useRef<number | null>(null);
  const [draft, setDraft] = useState<string | null>(null);

  const parsedDraft = draft === null || draft === "" || draft === "." ? null : Number(draft.replace(/,/g, ""));
  const underMin = draft !== null && parsedDraft !== null && parsedDraft < min;
  const emptyDraft = draft !== null && (draft === "" || draft === ".");
  const invalid = underMin || emptyDraft;

  // Restore the caret after Indian-grouping commas are re-inserted while typing.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el || caretDigits.current === null || draft === null || kind !== "currency") return;
    let seen = 0;
    let pos = 0;
    while (pos < draft.length && seen < caretDigits.current) {
      if (/\d/.test(draft[pos])) seen++;
      pos++;
    }
    el.setSelectionRange(pos, pos);
    caretDigits.current = null;
  }, [draft, kind]);

  const commit = (n: number) => onChange(clamp(kind === "percent" ? Math.round(n * 100) / 100 : Math.round(n), min, max));

  const handleType = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;

    if (kind === "currency") {
      const caret = event.target.selectionStart ?? raw.length;
      caretDigits.current = raw.slice(0, caret).replace(/\D/g, "").length;
      const digits = raw.replace(/\D/g, "").slice(0, 10);
      if (digits === "") {
        setDraft("");
        return;
      }
      const n = Number(digits);
      const bounded = Math.min(n, max);
      setDraft(formatIndianNumber(bounded));
      if (bounded >= min) commit(bounded);
      return;
    }

    if (kind === "percent") {
      let cleaned = raw.replace(/[^\d.]/g, "");
      const firstDot = cleaned.indexOf(".");
      if (firstDot !== -1) {
        cleaned = cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "").slice(0, 2);
      }
      cleaned = cleaned.slice(0, 5);
      if (cleaned !== "" && cleaned !== "." && Number(cleaned) > max) cleaned = String(max);
      setDraft(cleaned);
      const n = Number(cleaned);
      if (cleaned !== "" && cleaned !== "." && n >= min) commit(n);
      return;
    }

    const digits = raw.replace(/\D/g, "").slice(0, 2);
    const bounded = digits !== "" && Number(digits) > max ? String(max) : digits;
    setDraft(bounded);
    if (bounded !== "" && Number(bounded) >= min) commit(Number(bounded));
  };

  const handleBlur = () => {
    if (draft !== null && parsedDraft !== null) commit(parsedDraft);
    setDraft(null);
  };

  const nudge = (direction: 1 | -1) => {
    setDraft(null);
    if (kind === "currency") {
      onChange(stepRupees(value, direction, min, max));
    } else {
      const next = Math.round((value + direction * step) * 100) / 100;
      onChange(clamp(next, min, max));
    }
  };

  const sliderValue = scale === "log" ? logValueToPosition(value, min, max) : value;
  const sliderMin = scale === "log" ? 0 : min;
  const sliderMax = scale === "log" ? SLIDER_STEPS : max;
  const sliderStep = scale === "log" ? 1 : step;
  const fillPct = ((sliderValue - sliderMin) / (sliderMax - sliderMin)) * 100;

  const unit =
    kind === "currency" ? "" : kind === "percent" ? "%" : ` ${value === 1 ? strings.year : strings.years}`;
  const valueText = kind === "currency" ? formatINR(value) : `${value}${unit}`;

  const btn =
    "flex h-14 w-12 shrink-0 items-center justify-center rounded-2xl border border-mist-300 bg-white text-navy-900 transition duration-200 hover:border-royal-400 hover:text-royal-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-mist-300 disabled:hover:text-navy-900";

  return (
    <div>
      <div className="flex items-center gap-1">
        <label id={labelId} htmlFor={inputId} className="text-[15px] font-semibold text-navy-950">
          {label}
        </label>
        <InfoTip text={tip} label={`${label}: ${tip}`} />
      </div>

      <div className="mt-3 flex items-stretch gap-2">
        <button
          type="button"
          className={btn}
          onClick={() => nudge(-1)}
          disabled={value <= min}
          aria-label={`${strings.decrease}: ${label}`}
        >
          <Minus size={18} aria-hidden />
        </button>

        <div className="relative min-w-0 flex-1">
          {kind === "currency" ? (
            <span aria-hidden className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-lg font-bold text-ink-400">
              ₹
            </span>
          ) : null}
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            inputMode={kind === "percent" ? "decimal" : "numeric"}
            autoComplete="off"
            enterKeyHint="done"
            value={draft ?? displayValue(kind, value)}
            onChange={handleType}
            onFocus={(e) => e.currentTarget.select()}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            aria-invalid={invalid}
            aria-describedby={`${hintId}${invalid ? ` ${errorId}` : ""}`}
            className={`tabular h-14 w-full rounded-2xl border bg-white text-center font-display text-[1.35rem] font-bold text-navy-950 outline-none transition placeholder:text-ink-400 focus:ring-4 ${
              kind === "currency" ? "px-9" : "pl-3 pr-14"
            } ${invalid ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-mist-300 focus:border-royal-500 focus:ring-royal-100"}`}
          />
          {suffix ? (
            <span aria-hidden className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-ink-500">
              {suffix}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          className={btn}
          onClick={() => nudge(1)}
          disabled={value >= max}
          aria-label={`${strings.increase}: ${label}`}
        >
          <Plus size={18} aria-hidden />
        </button>
      </div>

      <span id={hintId} className="sr-only">
        {fill(strings.rangeHint, { min: endLabel(kind, min, strings), max: endLabel(kind, max, strings) })}
      </span>

      <div className="mt-2">
        <input
          type="range"
          className="slider"
          min={sliderMin}
          max={sliderMax}
          step={sliderStep}
          value={sliderValue}
          aria-labelledby={labelId}
          aria-valuetext={valueText}
          onChange={(e) => {
            setDraft(null);
            const raw = Number(e.target.value);
            onChange(scale === "log" ? positionToLogValue(raw, min, max) : raw);
          }}
          style={{ "--fill": `${fillPct}%` } as React.CSSProperties}
        />
        <div aria-hidden className="tabular -mt-0.5 flex justify-between text-xs font-medium text-ink-500">
          <span>{endLabel(kind, min, strings)}</span>
          <span>{endLabel(kind, max, strings)}</span>
        </div>
      </div>

      {invalid ? (
        <p id={errorId} role="alert" className="mt-2 text-xs font-medium text-red-600">
          {fill(strings.rangeError, { min: endLabel(kind, min, strings), max: endLabel(kind, max, strings) })}
        </p>
      ) : null}
    </div>
  );
}
