import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: ReactNode[];
  className?: string;
  /** Seconds for one full loop. */
  duration?: number;
  /** Rendered between items. */
  separator?: ReactNode;
};

/**
 * An endless ticker in pure CSS. The item list is rendered twice and the track
 * slides by half its width, so the loop is seamless. The second copy is hidden
 * from assistive technology; reduced motion stops the track.
 */
export function Marquee({ items, className, duration = 40, separator }: MarqueeProps) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <li key={index} className="flex shrink-0 items-center">
          {item}
          {separator}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("marquee flex overflow-hidden", className)}>
      <div
        className="marquee-track flex w-max"
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
