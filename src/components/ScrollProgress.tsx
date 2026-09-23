"use client";

import { useEffect } from "react";
import { startScrollTracking } from "@/lib/scrollStore";

/**
 * Starts scroll tracking (header state, active section, journey step) and
 * renders the thin reading-progress line at the very top of the viewport.
 * Progress is driven by a CSS variable, so scrolling never re-renders React.
 */
export function ScrollProgress() {
  useEffect(() => startScrollTracking(), []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]">
      <div
        className="h-full origin-left bg-gradient-to-r from-royal-600 via-royal-400 to-mint-500"
        style={{ transform: "scaleX(var(--scroll, 0))" }}
      />
    </div>
  );
}
