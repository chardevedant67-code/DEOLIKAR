"use client";

import { useInView } from "@/lib/hooks";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in milliseconds. */
  delay?: number;
  variant?: "up" | "fade" | "scale" | "left" | "right";
}

/**
 * Reveals content as it scrolls into view. Progressive enhancement: the
 * hidden state only applies when JS is running (see `.js .reveal` in globals.css),
 * and prefers-reduced-motion disables the motion entirely.
 */
export function Reveal({ children, className = "", delay = 0, variant = "up" }: RevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      data-reveal={variant}
      className={`reveal${inView ? " is-in" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
