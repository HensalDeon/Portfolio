"use client";

import { useEffect, useRef, useState } from "react";

import { Monogram } from "@/components/brand/monogram";
import type { MonogramField } from "@/components/hero/monogram-field";
import { useDeferredScene } from "@/hooks/use-deferred-scene";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

function readColors(element: Element): [string, string] {
  const style = getComputedStyle(element);
  return [
    style.getPropertyValue("--foreground").trim() || "#111110",
    style.getPropertyValue("--accent").trim() || "#e5400e",
  ];
}

/**
 * The hero's particle monogram. The outlined SVG mark holds the space from
 * first paint; the WebGL field (and three.js with it) loads only once the
 * intro has finished and the browser is idle, then cross-fades in. If WebGL
 * is unavailable or the user is saving data, the SVG simply stays.
 */
export function HeroMark({ className }: { className?: string }) {
  const { ref, nearViewport, status } = useDeferredScene("0px");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<MonogramField | null>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = ref.current;
    if (status !== "mounted" || !canvas || !wrapper) return;

    let cancelled = false;
    let themeObserver: MutationObserver | undefined;
    let frame = 0;
    let onScroll: (() => void) | undefined;

    import("@/components/hero/monogram-field")
      .then(({ createMonogramField }) => {
        if (cancelled) return;
        const [color, accent] = readColors(wrapper);
        const field = createMonogramField(canvas, { color, accent, reducedMotion: reduced });
        fieldRef.current = field;

        themeObserver = new MutationObserver(() => field.setColors(...readColors(wrapper)));
        themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["class"],
        });

        // Dissolve as the hero scrolls away: 0 while the mark is in place, 1 once
        // it has travelled most of the viewport.
        const update = () => {
          frame = 0;
          const rect = wrapper.getBoundingClientRect();
          const travelled = Math.max(0, -rect.top + window.innerHeight * 0.15);
          field.setScatter(Math.min(1, travelled / (window.innerHeight * 0.9)));
        };
        onScroll = () => {
          if (!frame) frame = requestAnimationFrame(update);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        update();

        field.setActive(true);
        requestAnimationFrame(() => setReady(true));
      })
      .catch(() => {
        // No WebGL (or the chunk failed): the SVG mark stays in place.
      });

    return () => {
      cancelled = true;
      themeObserver?.disconnect();
      if (onScroll) window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      fieldRef.current?.dispose();
      fieldRef.current = null;
      setReady(false);
    };
  }, [status, reduced, ref]);

  useEffect(() => {
    fieldRef.current?.setActive(nearViewport);
  }, [nearViewport, ready]);

  return (
    <div ref={ref} aria-hidden className={cn("relative", className)}>
      <Monogram
        className={cn(
          "absolute inset-[18%] h-auto w-auto text-line transition-opacity duration-1000",
          ready && "opacity-0",
        )}
      />
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 h-full w-full transition-opacity duration-1000",
          ready ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
