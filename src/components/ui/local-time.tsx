"use client";

import { useEffect, useState } from "react";

import { site } from "@/content/site";

const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: site.timeZone,
});

/**
 * The current time where I am, ticking each minute. It renders a placeholder
 * on the server and during hydration so the markup never mismatches.
 */
export function LocalTime({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timer: number;
    const tick = () => {
      const date = new Date();
      setNow(date);
      timer = window.setTimeout(tick, 60_000 - (date.getTime() % 60_000) + 50);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <time className={className} dateTime={now?.toISOString()} suppressHydrationWarning>
      {now ? formatter.format(now) : "--:--"} {site.timeZoneLabel}
    </time>
  );
}
