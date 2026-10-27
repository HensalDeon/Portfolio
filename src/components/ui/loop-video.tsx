"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export type LoopVideoSource = {
  /** Path under /public, e.g. /videos/ikea-food.mp4 */
  src: string;
  /** Still of the first frame, shown until the video plays and whenever motion is off. */
  poster: string;
  width: number;
  height: number;
};

type LoopVideoProps = {
  video: LoopVideoSource;
  label: string;
  className?: string;
};

/** Share of the video that must be on screen for it to play. */
const PLAY_RATIO = 0.15;

function savingData(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return nav.connection?.saveData === true;
}

/**
 * A muted, looping screen recording. Browsers fetch a poster as soon as the
 * attribute exists, so even the poster waits until the element is within
 * about a screen of the viewport (the width and height attributes hold its
 * space until then). The video itself loads once the element is on screen; it plays while a slice of it is visible
 * and pauses otherwise. Reduced motion (the OS setting or the header toggle)
 * and data saving both leave the poster in place.
 */
export function LoopVideo({ video, label, className }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [near, setNear] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (reduced || savingData()) {
      element.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) setLoad(true);
        if (entry.intersectionRatio >= PLAY_RATIO) {
          // play() rejects if the source is still being attached; the next
          // threshold crossing or the canplay listener below retries.
          element.play().catch(() => {});
        } else {
          element.pause();
        }
      },
      { threshold: [0, PLAY_RATIO] },
    );
    observer.observe(element);

    const resume = () => {
      const rect = element.getBoundingClientRect();
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      if (visible >= rect.height * PLAY_RATIO) element.play().catch(() => {});
    };
    element.addEventListener("canplay", resume);

    return () => {
      observer.disconnect();
      element.removeEventListener("canplay", resume);
    };
  }, [reduced]);

  // A <source> added after mount is not picked up until the element reloads.
  useEffect(() => {
    if (load) ref.current?.load();
  }, [load]);

  return (
    <video
      ref={ref}
      aria-label={label}
      poster={near ? video.poster : undefined}
      width={video.width}
      height={video.height}
      muted
      loop
      playsInline
      // "none" keeps the page light until the element is near; "auto" then lets
      // load() actually fetch, so canplay fires and playback can start.
      preload={load ? "auto" : "none"}
      className={cn("h-auto w-full bg-subtle", className)}
    >
      {load ? <source src={video.src} type="video/mp4" /> : null}
    </video>
  );
}
