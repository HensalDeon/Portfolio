"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type ScrollWordsProps = {
  text: string;
  className?: string;
};

/**
 * A statement whose words light up one by one as it scrolls through the
 * viewport. Only one custom property is written per frame; each word works
 * out its own opacity in CSS (see `.scroll-word`). Without JavaScript, or
 * with reduced motion, every word is fully lit.
 */
export function ScrollWords({ text, className }: ScrollWordsProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (reduced) {
      element.style.removeProperty("--progress");
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      // Starts when the top passes 85% of the viewport, ends when the bottom reaches 45%.
      const start = viewport * 0.85;
      const end = viewport * 0.45;
      const progress = (start - rect.top) / (start - end + rect.height);
      element.style.setProperty("--progress", Math.min(1, Math.max(0, progress)).toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <p ref={ref} className={cn(className)} style={{ "--count": words.length } as CSSProperties}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="scroll-word transition-colors duration-200"
          style={{ "--index": index } as CSSProperties}
        >
          {word}
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </p>
  );
}
