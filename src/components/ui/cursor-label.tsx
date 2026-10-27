"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type CursorLabelProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

/**
 * Shows a round label that follows the pointer while it is over the children,
 * for example "View case" over a project image. It is decorative: the link
 * around it carries the accessible name. Only fine pointers see it, and the
 * position is written straight to the element so moving never re-renders.
 */
export function CursorLabel({ label, children, className }: CursorLabelProps) {
  const labelRef = useRef<HTMLSpanElement>(null);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const element = labelRef.current;
    if (!element) return;
    const rect = event.currentTarget.getBoundingClientRect();
    element.style.translate = `${event.clientX - rect.left}px ${event.clientY - rect.top}px`;
  };

  return (
    <div onPointerMove={move} className={cn("group/cursor relative", className)}>
      {children}
      <span
        ref={labelRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-10 hidden pointer-fine:block"
      >
        <span className="flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 scale-0 items-center justify-center rounded-full bg-accent text-center font-eyebrow text-accent-foreground transition-transform duration-500 ease-out-expo group-hover/cursor:scale-100 motion-reduce:transition-none">
          {label}
        </span>
      </span>
    </div>
  );
}
