import { Plus } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { experiences } from "@/content/data";

/**
 * Experience as a compact ledger on an inverted band. Each row is a native
 * disclosure, so the full detail is one click away and works without JS.
 */
export function Experience() {
  return (
    <Section id="experience" className="surface-ink">
      <SectionTitle
        index="03"
        title="Experience"
        note="Agency and product teams, from MERN applications to brand sites and e-commerce."
      />

      <div className="mt-10 hidden grid-cols-12 gap-6 pb-3 font-eyebrow text-muted md:grid">
        <span className="col-span-2">Years</span>
        <span className="col-span-5">Role</span>
        <span className="col-span-4">Company</span>
      </div>

      <ol className="border-t border-line md:border-t-0">
        {experiences.map((experience, index) => (
          <li
            key={`${experience.company}-${experience.start}`}
            className="border-b border-line md:first:border-t"
          >
            <Reveal inView delay={index * 0.05}>
              <details className="group">
                <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-6 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none md:grid-cols-12 md:py-8 [&::-webkit-details-marker]:hidden">
                  <span className="font-eyebrow text-muted tabular-nums md:col-span-2">
                    {experience.start === experience.end
                      ? experience.start
                      : `${experience.start} — ${experience.end}`}
                  </span>
                  <span className="col-start-1 text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight font-semibold tracking-[-0.02em] md:col-span-5 md:col-start-auto">
                    {experience.title}
                  </span>
                  <span className="col-start-1 text-base text-muted md:col-span-4 md:col-start-auto md:text-lg">
                    {experience.company}
                  </span>
                  <span className="col-start-2 row-span-3 row-start-1 flex justify-end md:col-span-1 md:col-start-auto md:row-span-1 md:row-start-auto">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-[transform,background-color] duration-500 ease-out-expo group-open:rotate-45 group-hover:bg-subtle">
                      <Plus className="h-4 w-4" aria-hidden />
                    </span>
                  </span>
                </summary>
                <div className="grid gap-4 pb-8 md:grid-cols-12 md:gap-6">
                  <div className="md:col-span-8 md:col-start-3">
                    <p className="text-lg leading-snug">{experience.summary}</p>
                    <ul className="mt-4 flex flex-col gap-2 text-sm leading-relaxed text-muted">
                      {experience.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span aria-hidden className="shrink-0 text-accent">
                            —
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
