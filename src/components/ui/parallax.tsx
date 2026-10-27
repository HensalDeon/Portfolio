"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  /** Pixel offset at the start and end of the scroll range. */
  range?: [number, number];
  /**
   * Which part of the element's journey drives the effect: its full pass
   * through the viewport, or only from when its top reaches the viewport top
   * until it leaves (useful for content already on screen at load).
   */
  offset?: "enter-exit" | "top-exit";
};

/**
 * Nudges its children along the scroll axis as they pass through the viewport.
 * Native scrolling is untouched: a passive scroll listener reads the layout
 * position of an untransformed wrapper and applies a transform to the inner
 * element on the next frame. Reduced-motion users get a static element.
 */
export function Parallax({
  children,
  className,
  innerClassName,
  range = [24, -24],
  offset = "enter-exit",
}: ParallaxProps) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [from, to] = range;

  useEffect(() => {
    const track = outer.current;
    const target = inner.current;
    if (!track || !target) return;
    if (reduced) {
      target.style.transform = "";
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress =
        offset === "top-exit"
          ? -rect.top / rect.height
          : (viewport - rect.top) / (viewport + rect.height);
      const t = Math.min(1, Math.max(0, progress));
      target.style.transform = `translateY(${(from + (to - from) * t).toFixed(2)}px)`;
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduced, offset, from, to]);

  return (
    <div ref={outer} className={className}>
      <div ref={inner} className={cn("will-change-transform", innerClassName)}>
        {children}
      </div>
    </div>
  );
}
