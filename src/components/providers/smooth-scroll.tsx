"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

let instance: Lenis | null = null;

/** The active Lenis instance, or null when smooth scrolling is off (reduced motion, before mount). */
export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Inertial wheel scrolling for the whole document. Touch keeps native
 * scrolling, and users who prefer reduced motion never get Lenis at all.
 * Lenis drives the real window scroll position, so IntersectionObservers,
 * scroll listeners and `position: sticky` all keep working unchanged.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      anchors: true,
      stopInertiaOnNavigate: true,
    });
    instance = lenis;
    return () => {
      lenis.destroy();
      instance = null;
    };
  }, [reduced]);

  return null;
}
