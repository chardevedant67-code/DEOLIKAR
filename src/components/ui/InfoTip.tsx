"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Info } from "lucide-react";

interface InfoTipProps {
  text: string;
  /** Accessible name for the trigger button. */
  label: string;
  tone?: "light" | "dark";
}

/** Small "i" button that reveals an explanatory tooltip on hover, focus or tap. */
export function InfoTip({ text, label, tone = "light" }: InfoTipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <span
      ref={wrapperRef}
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
          tone === "dark"
            ? "text-white/60 hover:bg-white/10 hover:text-white"
            : "text-ink-400 hover:bg-royal-50 hover:text-royal-600"
        }`}
      >
        <Info size={15} aria-hidden />
      </button>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className="absolute bottom-full left-0 z-30 mb-2 w-64 max-w-[calc(100vw-3rem)] rounded-xl bg-navy-950 px-3.5 py-2.5 text-xs font-normal leading-relaxed text-white shadow-lift"
        >
          {text}
        </span>
      ) : null}
    </span>
  );
}
