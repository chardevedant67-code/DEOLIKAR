"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useElementWidth, useInView, usePrefersReducedMotion } from "@/lib/hooks";

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
  values: number[];
  /** Fill the region under the line. */
  area?: boolean;
  width?: number;
  dashed?: boolean;
}

interface LineAreaChartProps {
  /** X categories (e.g. years 0…N). Series values are aligned by index. */
  x: number[];
  series: ChartSeries[];
  ariaLabel: string;
  xAxisLabel: string;
  yAxisLabel: string;
  tooltipTitle: (x: number) => string;
  formatValue: (value: number) => string;
  formatTick: (value: number) => string;
  hint?: string;
  tone?: "dark" | "light";
}

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */

function niceStep(raw: number): number {
  if (!(raw > 0)) return 1;
  const exponent = Math.floor(Math.log10(raw));
  const base = Math.pow(10, exponent);
  const f = raw / base;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * base;
}

/** Monotone cubic (Fritsch–Carlson) path — smooth, and never overshoots the data. */
function monotonePath(points: [number, number][]): string {
  const n = points.length;
  if (n === 0) return "";
  if (n === 1) return `M${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;

  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = points[i + 1][0] - points[i][0];
    slope[i] = (points[i + 1][1] - points[i][1]) / dx[i];
  }

  const tangent: number[] = new Array(n);
  tangent[0] = slope[0];
  tangent[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i++) {
    tangent[i] = slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      tangent[i] = 0;
      tangent[i + 1] = 0;
      continue;
    }
    const a = tangent[i] / slope[i];
    const b = tangent[i + 1] / slope[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      tangent[i] = k * a * slope[i];
      tangent[i + 1] = k * b * slope[i];
    }
  }

  let d = `M${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const c1x = x0 + dx[i] / 3;
    const c1y = y0 + (tangent[i] * dx[i]) / 3;
    const c2x = x1 - dx[i] / 3;
    const c2y = y1 - (tangent[i + 1] * dx[i]) / 3;
    d += `C${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  }
  return d;
}

/** Linear resample so a curve can morph between arrays of different lengths. */
function resample(values: number[], length: number): number[] {
  if (values.length === length) return values;
  if (values.length === 0) return new Array(length).fill(0);
  if (values.length === 1) return new Array(length).fill(values[0]);
  const out: number[] = new Array(length);
  for (let j = 0; j < length; j++) {
    const pos = length === 1 ? 0 : (j / (length - 1)) * (values.length - 1);
    const lo = Math.floor(pos);
    const hi = Math.min(lo + 1, values.length - 1);
    out[j] = values[lo] + (values[hi] - values[lo]) * (pos - lo);
  }
  return out;
}

/** Tweens every series toward its target whenever the targets change. */
function useTweenedSeries(targets: number[][], enabled: boolean, durationMs = 600): number[][] {
  const [display, setDisplay] = useState<number[][]>(targets);
  const currentRef = useRef<number[][]>(targets);
  const frameRef = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(frameRef.current);
    if (!enabled) {
      currentRef.current = targets;
      return;
    }
    const from = targets.map((t, i) => resample(currentRef.current[i] ?? t, t.length));
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = targets.map((t, i) => t.map((v, j) => from[i][j] + (v - from[i][j]) * eased));
      currentRef.current = next;
      setDisplay(next);
      if (p < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [targets, enabled, durationMs]);

  return enabled ? display : targets;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const PAD_TOP = 26;
const PAD_RIGHT = 14;
const PAD_BOTTOM = 44;

export function LineAreaChart({
  x,
  series,
  ariaLabel,
  xAxisLabel,
  yAxisLabel,
  tooltipTitle,
  formatValue,
  formatTick,
  hint,
  tone = "light",
}: LineAreaChartProps) {
  const uid = useId().replace(/:/g, "");
  const reduced = usePrefersReducedMotion();
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const [viewRef, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [active, setActive] = useState<number | null>(null);

  const targets = useMemo(() => series.map((s) => s.values), [series]);
  const animated = useTweenedSeries(targets, !reduced);
  // While the tween catches up with a new x-length, fall back to the exact targets.
  const values = animated.map((v, i) => (v.length === x.length ? v : targets[i]));

  const dark = tone === "dark";
  const axisColor = dark ? "rgba(255,255,255,0.58)" : "#5a6b88";
  const gridColor = dark ? "rgba(255,255,255,0.09)" : "#e1e9f6";
  const height = width < 460 ? 290 : width < 820 ? 340 : 400;

  const n = x.length;
  const rawMax = Math.max(1, ...values.flat().filter(Number.isFinite));
  const step = niceStep(rawMax / 4);
  const yMax = Math.max(step, Math.ceil(rawMax / step) * step);
  const yTicks: number[] = [];
  for (let v = 0; v <= yMax + step / 1000; v += step) yTicks.push(v);

  const maxLabelChars = Math.max(...yTicks.map((t) => formatTick(t).length));
  const padLeft = Math.round(maxLabelChars * 6.6 + 16);
  const plotW = Math.max(width - padLeft - PAD_RIGHT, 10);
  const plotH = height - PAD_TOP - PAD_BOTTOM;

  const px = (i: number) => padLeft + (n <= 1 ? 0 : (i / (n - 1)) * plotW);
  const py = (v: number) => PAD_TOP + plotH - (v / yMax) * plotH;

  // X tick labels — thin them out until they have room to breathe.
  const xTickIdx = useMemo(() => {
    const labelRoom = 46;
    const maxLabels = Math.max(2, Math.floor(plotW / labelRoom));
    const stride = [1, 2, 5, 10, 20].find((s) => Math.floor((n - 1) / s) + 1 <= maxLabels) ?? 20;
    const idx: number[] = [];
    for (let i = 0; i < n; i += stride) idx.push(i);
    if (idx[idx.length - 1] !== n - 1 && n - 1 - idx[idx.length - 1] >= stride / 2) idx.push(n - 1);
    return idx;
  }, [n, plotW]);

  const paths = series.map((s, si) => {
    const pts: [number, number][] = values[si].map((v, i) => [px(i), py(Math.max(v, 0))]);
    const line = monotonePath(pts);
    const base = PAD_TOP + plotH;
    const area = pts.length > 1 ? `${line}L${pts[pts.length - 1][0].toFixed(2)} ${base}L${pts[0][0].toFixed(2)} ${base}Z` : "";
    return { line, area };
  });

  const setFromPointer = (event: React.PointerEvent<SVGRectElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const rel = (event.clientX - rect.left) / rect.width;
    setActive(Math.min(Math.max(Math.round(rel * (n - 1)), 0), n - 1));
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const last = n - 1;
    const move = (to: number) => {
      event.preventDefault();
      setActive(Math.min(Math.max(to, 0), last));
    };
    if (event.key === "ArrowRight") move((active ?? -1) + 1);
    else if (event.key === "ArrowLeft") move((active ?? last + 1) - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(last);
    else if (event.key === "Escape") setActive(null);
  };

  const safeActive = active !== null && active < n ? active : null;
  const tipLeft = safeActive !== null ? px(safeActive) : 0;
  const flip = width > 0 && tipLeft > width * 0.58;

  return (
    <div ref={viewRef}>
      <div
        ref={wrapRef}
        tabIndex={0}
        role="group"
        aria-label={ariaLabel}
        aria-describedby={hint ? `${uid}-hint` : undefined}
        onKeyDown={onKeyDown}
        onBlur={() => setActive(null)}
        className="relative w-full select-none rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-royal-400"
        style={{ height }}
      >
        {hint ? (
          <span id={`${uid}-hint`} className="sr-only">
            {hint}
          </span>
        ) : null}

        {width > 0 ? (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block overflow-visible" aria-hidden="true">
            <defs>
              {series.map((s) => (
                <linearGradient key={s.key} id={`${uid}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={s.color} stopOpacity={dark ? 0.34 : 0.28} />
                  <stop offset="1" stopColor={s.color} stopOpacity="0" />
                </linearGradient>
              ))}
            </defs>

            <text x={0} y={11} fill={axisColor} fontSize="11" fontWeight="600">
              {yAxisLabel}
            </text>

            {/* grid + y labels */}
            {yTicks.map((tick) => (
              <g key={tick}>
                <line x1={padLeft} x2={padLeft + plotW} y1={py(tick)} y2={py(tick)} stroke={gridColor} strokeWidth="1" />
                <text x={padLeft - 10} y={py(tick) + 4} textAnchor="end" fill={axisColor} fontSize="11">
                  {formatTick(tick)}
                </text>
              </g>
            ))}

            {/* x labels */}
            {xTickIdx.map((i) => (
              <text key={i} x={px(i)} y={PAD_TOP + plotH + 20} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} fill={axisColor} fontSize="11">
                {x[i]}
              </text>
            ))}
            <text x={padLeft + plotW / 2} y={height - 6} textAnchor="middle" fill={axisColor} fontSize="11" fontWeight="600">
              {xAxisLabel}
            </text>

            {/* areas */}
            {series.map((s, i) =>
              s.area && paths[i].area ? (
                <path
                  key={`${s.key}-area`}
                  d={paths[i].area}
                  fill={`url(#${uid}-${s.key})`}
                  style={{ opacity: inView ? 1 : 0, transition: "opacity 1.2s ease 0.35s" }}
                />
              ) : null
            )}

            {/* lines */}
            {series.map((s, i) => (
              <path
                key={`${s.key}-line`}
                d={paths[i].line}
                fill="none"
                stroke={s.color}
                strokeWidth={s.width ?? 2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                style={{
                  strokeDasharray: s.dashed ? "0.012 0.014" : 1,
                  strokeDashoffset: s.dashed || inView ? 0 : 1,
                  opacity: s.dashed && !inView ? 0 : 1,
                  transition: "stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s ease",
                }}
              />
            ))}

            {/* crosshair */}
            {safeActive !== null ? (
              <g>
                <line x1={px(safeActive)} x2={px(safeActive)} y1={PAD_TOP} y2={PAD_TOP + plotH} stroke={dark ? "rgba(255,255,255,0.35)" : "#93b6f4"} strokeWidth="1" strokeDasharray="3 4" />
                {series.map((s, i) => (
                  <circle
                    key={s.key}
                    cx={px(safeActive)}
                    cy={py(Math.max(values[i][safeActive], 0))}
                    r="5"
                    fill={dark ? "#011434" : "#fff"}
                    stroke={s.color}
                    strokeWidth="2.5"
                  />
                ))}
              </g>
            ) : null}

            {/* pointer capture */}
            <rect
              x={padLeft}
              y={PAD_TOP}
              width={plotW}
              height={plotH}
              fill="transparent"
              style={{ touchAction: "pan-y", cursor: "crosshair" }}
              onPointerMove={setFromPointer}
              onPointerDown={setFromPointer}
              onPointerLeave={(e) => {
                if (e.pointerType === "mouse") setActive(null);
              }}
            />
          </svg>
        ) : null}

        {safeActive !== null ? (
          <div
            role="presentation"
            className={`pointer-events-none absolute top-6 z-10 min-w-44 rounded-xl px-3.5 py-3 text-xs shadow-lift ${
              dark ? "bg-white text-navy-950" : "bg-navy-950 text-white"
            }`}
            style={{ left: tipLeft + (flip ? -14 : 14), transform: flip ? "translateX(-100%)" : undefined }}
          >
            <p className={`font-semibold ${dark ? "text-ink-500" : "text-white/60"}`}>{tooltipTitle(x[safeActive])}</p>
            <div className="mt-2 space-y-1.5">
              {series.map((s, i) => (
                <div key={s.key} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                    <span className={dark ? "text-ink-600" : "text-white/75"}>{s.label}</span>
                  </span>
                  <span className="tabular font-bold">{formatValue(targets[i][safeActive])}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Announce keyboard exploration to assistive tech */}
        <span className="sr-only" aria-live="polite">
          {safeActive !== null
            ? `${tooltipTitle(x[safeActive])}. ${series.map((s, i) => `${s.label}: ${formatValue(targets[i][safeActive])}`).join(". ")}`
            : ""}
        </span>
      </div>
    </div>
  );
}
