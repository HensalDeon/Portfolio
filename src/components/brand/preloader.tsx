"use client";

import { useEffect, useRef, useState } from "react";

import { INTRO_DONE_EVENT } from "@/components/brand/intro-signal";
import { Monogram } from "@/components/brand/monogram";
import { site } from "@/content/site";

/** Hard stop in case the exit animation never fires (e.g. animations disabled). */
const FALLBACK_MS = 4000;

const EXIT_ANIMATIONS = new Set(["preloader-exit", "preloader-fade"]);

/**
 * Full-screen curtain shown on first paint. The monogram draws itself stroke
 * by stroke, the name rises in, then the curtain lifts off the top of the
 * viewport with a curved trailing edge. Everything is server-rendered and
 * driven by CSS so it appears before hydration; React only removes it once
 * the exit animation has finished. That is read through the Web Animations
 * `finished` promise rather than an animationend event, so a device that
 * hydrates after the curtain has already left still unlocks straight away.
 */
export function Preloader() {
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";

    let cancelled = false;
    const finish = () => {
      if (!cancelled) setDone(true);
    };
    const exit = ref.current
      ?.getAnimations()
      .find(
        (animation) =>
          animation instanceof CSSAnimation && EXIT_ANIMATIONS.has(animation.animationName),
      );
    // `finished` settles immediately if the animation already ran; rejects if
    // it is cancelled, in which case the fallback timer still clears the curtain.
    exit?.finished.then(finish, () => {});
    const id = window.setTimeout(finish, FALLBACK_MS);

    return () => {
      cancelled = true;
      root.style.overflow = "";
      window.clearTimeout(id);
    };
  }, [done]);

  // Lets deferred work (the 3D scenes) know the main thread is free again.
  useEffect(() => {
    if (done) window.dispatchEvent(new Event(INTRO_DONE_EVENT));
  }, [done]);

  if (done) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      data-preloader=""
      className="preloader fixed inset-x-0 top-0 z-[100] bg-background text-foreground"
    >
      <div className="preloader-content relative flex h-svh flex-col items-center justify-center gap-7">
        <Monogram className="preloader-mark relative h-24 w-24 sm:h-28 sm:w-28" />
        <p className="relative overflow-hidden font-mono text-[11px] tracking-[0.25em] text-muted uppercase">
          <span className="preloader-line block">{site.name}</span>
        </p>
      </div>
    </div>
  );
}
