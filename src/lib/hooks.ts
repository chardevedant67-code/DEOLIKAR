"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/** True when the visitor has asked the OS/browser for reduced motion. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
}

/** True on devices with a fine, hovering pointer (i.e. a mouse) — used to gate mouse-follow effects. */
export function useFinePointer(): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    () => false
  );
}

interface InViewOptions {
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

/** Returns a ref callback and whether the element has entered the viewport. */
export function useInView<T extends Element = HTMLDivElement>({
  once = true,
  threshold = 0.15,
  rootMargin = "0px 0px -8% 0px",
}: InViewOptions = {}) {
  const [node, setNode] = useState<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, once, threshold, rootMargin]);

  return [setNode, inView] as const;
}

/** Tracks an element's rendered width (px) with a ResizeObserver. */
export function useElementWidth<T extends HTMLElement = HTMLDivElement>() {
  const [node, setNode] = useState<T | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!node) return;
    // ResizeObserver reports the initial size as soon as it starts observing.
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return [setNode, width] as const;
}

/**
 * Debounced copy of a value — used to keep screen-reader announcements
 * from firing on every slider tick.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

/** Locks page scroll while `locked` is true (dialogs, mobile menu). */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { documentElement: root } = document;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [locked]);
}

/**
 * Writes a 0–1 `--progress` CSS variable on the element as it travels through the
 * viewport (0 as its top reaches `startAt` of the viewport height, 1 as its bottom
 * reaches `endAt`). CSS does the rest, so scrolling never re-renders React.
 * With reduced motion the element is simply fully "complete".
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  { startAt = 0.85, endAt = 0.4 }: { startAt?: number; endAt?: number } = {}
) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.style.setProperty("--progress", "1");
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const startY = vh * startAt;
      const endY = vh * endAt;
      const total = rect.height + startY - endY;
      const progress = Math.min(Math.max((startY - rect.top) / total, 0), 1);
      el.style.setProperty("--progress", progress.toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, reduced, startAt, endAt]);
}
