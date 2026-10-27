"use client";

import { Pause, Play } from "lucide-react";
import { useEffect } from "react";

import { useMounted } from "@/hooks/use-mounted";
import { setMotionPaused, syncMotionAttribute, useMotionPaused } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Header button that pauses and resumes ambient motion (videos, particles, marquee). */
export function MotionToggle({ className }: { className?: string }) {
  const paused = useMotionPaused();
  const mounted = useMounted();

  useEffect(syncMotionAttribute, []);

  return (
    <button
      type="button"
      aria-pressed={mounted ? paused : undefined}
      aria-label="Pause motion"
      title={paused ? "Resume motion" : "Pause motion"}
      onClick={() => setMotionPaused(!paused)}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
        className,
      )}
    >
      {mounted && paused ? (
        <Play className="h-4 w-4" aria-hidden />
      ) : (
        <Pause className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
