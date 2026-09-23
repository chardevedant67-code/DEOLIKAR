"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatedNumber } from "../ui/AnimatedNumber";

/** One line of the results "equation": label, animated ₹ value and a readable magnitude ("₹2.32 Crore"). */
export function EquationRow({
  label,
  value,
  format,
  words,
  dot,
  sign,
  emphasised = false,
}: {
  label: string;
  value: number;
  format: (value: number) => string;
  words?: string;
  dot?: string;
  sign?: "+" | "−";
  emphasised?: boolean;
}) {
  const text = format(value);
  // Long crore-scale figures step down a size so they never overflow their card.
  const size = emphasised
    ? text.length > 16
      ? "text-[1.55rem] sm:text-[2.1rem]"
      : text.length > 12
        ? "text-[1.9rem] sm:text-[2.6rem]"
        : "text-[2.3rem] sm:text-[3.2rem]"
    : text.length > 15
      ? "text-lg sm:text-[1.35rem]"
      : "text-[1.35rem] sm:text-[1.6rem]";

  if (emphasised) {
    return (
      <div className="pt-6 lg:pt-9">
        <p className="flex items-center gap-2.5 text-[15px] font-semibold text-white">{label}</p>
        <AnimatedNumber
          value={value}
          format={format}
          className={`tabular mt-2 block font-display font-extrabold tracking-tight text-mint-400 ${size}`}
        />
        {words ? <p className="tabular mt-1.5 text-sm font-medium text-white/50">≈ {words}</p> : null}
      </div>
    );
  }

  return (
    <div className="py-3.5 lg:py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="flex items-center gap-2.5 text-sm font-medium text-white/70">
          {dot ? <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: dot }} /> : null}
          {sign ? (
            <span aria-hidden className="w-3 text-base text-white/40">
              {sign}
            </span>
          ) : null}
          {label}
        </p>
        <AnimatedNumber value={value} format={format} className={`tabular font-display font-bold tracking-tight text-white ${size}`} />
      </div>
      {words ? <p className="tabular mt-1 text-right text-xs font-medium text-white/45">≈ {words}</p> : null}
    </div>
  );
}

/** Collapsible year-by-year table — also the accessible alternative to the chart. */
export function BreakdownTable({
  caption,
  columns,
  rows,
  showLabel,
  hideLabel,
}: {
  caption: string;
  columns: string[];
  rows: string[][];
  showLabel: string;
  hideLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const regionId = useId();

  return (
    <div className="mt-6 border-t border-white/10 pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={regionId}
        className="group flex min-h-11 items-center gap-2 rounded-full pr-3 text-sm font-semibold text-royal-200 transition-colors hover:text-white"
      >
        {open ? hideLabel : showLabel}
        <ChevronDown size={16} aria-hidden className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div
          id={regionId}
          tabIndex={0}
          role="region"
          aria-label={caption}
          className="mt-3 max-h-80 overflow-auto rounded-2xl border border-white/10 bg-white/[0.04]"
        >
          <table className="tabular w-full min-w-[30rem] border-collapse text-left text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead className="sticky top-0 bg-navy-900 text-xs text-white/60">
              <tr>
                {columns.map((column, i) => (
                  <th key={column} scope="col" className={`px-4 py-3 font-semibold ${i === 0 ? "" : "text-right"}`}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {rows.map((row) => (
                <tr key={row[0]} className="text-white/85">
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="px-4 py-2.5 font-semibold text-white">
                        {cell}
                      </th>
                    ) : (
                      <td key={i} className="px-4 py-2.5 text-right">
                        {cell}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

export function LegendChip({ color, label, dashed = false }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-2 text-xs font-medium text-white/75">
      <span
        aria-hidden
        className="h-[3px] w-5 rounded-full"
        style={dashed ? { backgroundImage: `linear-gradient(90deg, ${color} 50%, transparent 50%)`, backgroundSize: "6px 3px" } : { background: color }}
      />
      {label}
    </span>
  );
}
