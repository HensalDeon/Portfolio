"use client";

import { ArrowUpRight, Code } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { platforms, type ArchiveProject, type Platform } from "@/content/work";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type Filter = "All" | Platform;

export function ArchiveIndex({ projects }: { projects: ArchiveProject[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [hovered, setHovered] = useState<string | null>(null);
  // Preview images load only after the first hover, so the list costs nothing until used.
  const [armed, setArmed] = useState(false);

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["All", projects.length]]);
    for (const project of projects) {
      map.set(project.platform, (map.get(project.platform) ?? 0) + 1);
    }
    return map;
  }, [projects]);

  const filters: Filter[] = ["All", ...platforms.filter((p) => counts.has(p))];
  const visible = filter === "All" ? projects : projects.filter((p) => p.platform === filter);

  return (
    <div className="pt-24 sm:pt-32">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <h3 className="flex items-baseline gap-4">
          <span className="font-display text-[clamp(3rem,7vw,7rem)]">Archive</span>
          <span className="font-eyebrow text-muted tabular-nums">({projects.length})</span>
        </h3>
        <div
          role="group"
          aria-label="Filter the archive by platform"
          className="flex flex-wrap gap-2"
        >
          {filters.map((option) => {
            const active = option === filter;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(option)}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-line text-muted hover:border-foreground/40 hover:text-foreground",
                )}
              >
                {option}
                <span
                  className={cn(
                    "font-mono text-[11px] tabular-nums",
                    active ? "text-background/70" : "text-muted",
                  )}
                >
                  {counts.get(option)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 hidden grid-cols-12 gap-6 border-b border-line pb-3 font-eyebrow text-muted md:grid">
        <span className="col-span-6">Project</span>
        <span className="col-span-4">What it is</span>
        <span className="col-span-2 text-right">Platform</span>
      </div>

      <ul
        className="relative mt-8 border-t border-line md:mt-0 md:border-t-0"
        onPointerEnter={() => setArmed(true)}
        onPointerLeave={() => setHovered(null)}
      >
        {visible.map((project) => (
          <li key={project.name} className="border-b border-line">
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              onPointerEnter={() => setHovered(project.name)}
              onFocus={() => setHovered(null)}
              className="group relative grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none md:grid-cols-12 md:py-6"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-subtle transition-transform duration-500 ease-out-expo group-hover:scale-y-100 motion-reduce:transition-none"
              />
              <span className="relative flex items-center gap-3 text-[clamp(1.5rem,3vw,2.5rem)] leading-none font-semibold tracking-[-0.02em] transition-[font-stretch,translate] duration-500 ease-out-expo group-hover:translate-x-2 group-hover:[font-stretch:118%] md:col-span-6">
                {project.name}
              </span>
              <span className="relative col-start-1 text-sm text-muted md:col-span-4 md:col-start-auto">
                {project.kind}
              </span>
              <span className="relative col-start-2 row-span-2 row-start-1 flex items-center justify-end gap-3 md:col-span-2 md:col-start-auto md:row-span-1 md:row-start-auto">
                <span className="hidden font-eyebrow text-muted sm:inline">{project.platform}</span>
                {project.source ? (
                  <Code className="h-4 w-4" aria-hidden />
                ) : (
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                )}
                <span className="sr-only">{project.source ? "(source code)" : "(live site)"}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      {armed && <FloatingPreview projects={projects} active={hovered} />}
    </div>
  );
}

/**
 * A screenshot card that trails the pointer while it is over the archive list.
 * It eases toward the pointer each frame and leans into the direction of
 * travel. Fine pointers only; touch users go straight to the link.
 */
function FloatingPreview({
  projects,
  active,
}: {
  projects: ArchiveProject[];
  active: string | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const activeRef = useRef(active);
  const wake = useRef<() => void>(() => {});

  useEffect(() => {
    activeRef.current = active;
    if (active) wake.current();
  }, [active]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const pointer = { x: -1, y: -1 };
    const position = { x: 0, y: 0 };
    let frame = 0;

    // Runs while a row is hovered and until the card settles afterwards.
    const tick = () => {
      frame = 0;
      const ease = reduced ? 1 : 0.14;
      const dx = pointer.x - position.x;
      const dy = pointer.y - position.y;
      position.x += dx * ease;
      position.y += dy * ease;
      const tilt = reduced ? 0 : Math.max(-12, Math.min(12, dx * 0.06));
      element.style.transform = `translate3d(${position.x.toFixed(1)}px, ${position.y.toFixed(1)}px, 0) translate(2.5rem, -50%) rotate(${tilt.toFixed(2)}deg)`;
      if (activeRef.current || Math.abs(dx) + Math.abs(dy) > 0.5) {
        frame = requestAnimationFrame(tick);
      }
    };
    const start = () => {
      if (!frame && pointer.x >= 0) frame = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      if (pointer.x < 0) {
        position.x = event.clientX;
        position.y = event.clientY;
      }
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (activeRef.current) start();
    };
    wake.current = start;
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
      wake.current = () => {};
    };
  }, [reduced]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-40 hidden pointer-fine:block"
    >
      <div
        className={cn(
          "relative aspect-[16/10] w-[22rem] overflow-hidden rounded-sm bg-subtle shadow-2xl shadow-black/20 transition-[scale,opacity] duration-500 ease-out-expo",
          active ? "scale-100 opacity-100" : "scale-75 opacity-0",
        )}
      >
        {projects.map((project) => (
          <Image
            key={project.name}
            src={project.image}
            alt=""
            fill
            sizes="352px"
            className={cn(
              "object-cover object-top transition-opacity duration-300",
              project.name === active ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </div>
    </div>
  );
}
