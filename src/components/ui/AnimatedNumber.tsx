"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface AnimatedNumberProps {
  value: number;
  format: (value: number) => string;
  durationMs?: number;
  className?: string;
}

/**
 * Smoothly tweens a displayed number whenever its value changes (calculator results).
 * The animated text is hidden from assistive tech; screen readers get the final,
 * fully formatted value instead of a stream of intermediate numbers.
 */
export function AnimatedNumber({ value, format, durationMs = 650, className }: AnimatedNumberProps) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    if (reduced || from === value) {
      fromRef.current = value;
      setDisplay(value);
      return;
    }

    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = from + (value - from) * eased;
      fromRef.current = current;
      setDisplay(current);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, durationMs, reduced]);

  return (
    <span className={className}>
      <span aria-hidden="true">{format(display)}</span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}
