"use client";

import { useEffect, useState } from "react";

/**
 * True while the user is scrolling down past `threshold`, so a fixed header
 * can tuck away and give the content room. Any upward scroll brings it back.
 */
export function useHeaderHidden(threshold = 160): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) < 6) return;
      setHidden(delta > 0 && y > threshold);
      last = y;
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return hidden;
}
