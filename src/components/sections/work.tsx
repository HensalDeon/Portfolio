import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";

import { ArchiveIndex } from "@/components/sections/archive-index";
import { CursorLabel } from "@/components/ui/cursor-label";
import { ProjectCover } from "@/components/ui/project-cover";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { archive, caseStudies, type CaseStudy } from "@/content/work";
import { cn } from "@/lib/utils";

export function Work() {
  return (
    <Section id="work">
      <SectionTitle
        index="01"
        title="Work"
        note={`${caseStudies.length} projects in depth, then the archive of everything else I have shipped.`}
      />

      <ol>
        {caseStudies.map((study, index) => (
          <FeaturedProject key={study.slug} study={study} index={index} />
        ))}
      </ol>

      <ArchiveIndex projects={archive} />
    </Section>
  );
}

function FeaturedProject({ study, index }: { study: CaseStudy; index: number }) {
  const flipped = index % 2 === 1;
  const number = `${String(index + 1).padStart(2, "0")} / ${String(caseStudies.length).padStart(2, "0")}`;

  return (
    <li className="border-b border-line py-12 sm:py-20">
      <Link
        href={`/work/${study.slug}`}
        transitionTypes={["nav-forward"]}
        className="group grid gap-8 rounded-sm focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-8 focus-visible:ring-offset-background focus-visible:outline-none lg:grid-cols-12 lg:gap-8"
      >
        <div
          className={cn(
            "reveal-clip lg:col-span-8",
            flipped ? "lg:order-2 lg:col-start-5" : "lg:col-start-1",
          )}
        >
          <CursorLabel label="View case">
            <ViewTransition name={`cover-${study.slug}`} share="morph" default="none">
              <ProjectCover
                image={study.cover}
                video={study.video}
                alt={`${study.client} website`}
                tint={study.tint}
                sizes="(min-width: 1024px) 56vw, 90vw"
                parallax
              />
            </ViewTransition>
          </CursorLabel>
        </div>

        <Reveal
          inView
          delay={0.1}
          className={cn(
            "flex flex-col justify-end gap-5 lg:col-span-4",
            flipped ? "lg:order-1 lg:col-start-1" : "lg:col-start-9",
          )}
        >
          <p className="flex items-center justify-between font-eyebrow text-muted">
            <span className="tabular-nums">{number}</span>
            <span>{study.platform}</span>
          </p>
          {/* Sized from the longest word so names like T-CraftStudio never break mid-word. */}
          <h3
            className="font-display text-[min(calc(170vw/var(--fit)),4.5rem)] transition-[font-stretch] duration-700 ease-out-expo group-hover:[font-stretch:76%] lg:text-[clamp(2.5rem,min(6vw,calc(56vw/var(--fit))),6.5rem)]"
            style={{ "--fit": longestWord(study.client) } as CSSProperties}
          >
            {study.client}
          </h3>
          <p className="text-lg leading-snug text-balance">{study.headline}</p>
          <ul className="flex flex-wrap gap-x-3 gap-y-1 font-eyebrow text-muted">
            {study.stack.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <span className="mt-2 inline-flex items-center gap-2 self-start text-sm font-medium">
            <span className="relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-out-expo group-hover:after:scale-x-100">
              View case study
            </span>
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </span>
        </Reveal>
      </Link>
    </li>
  );
}

function longestWord(text: string): number {
  return Math.max(...text.split(/\s+/).map((word) => word.length));
}
