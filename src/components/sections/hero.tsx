import { ArrowDown, ArrowUpRight } from "lucide-react";

import { HeroMark } from "@/components/hero/hero-mark";
import { LinkButton } from "@/components/ui/button";
import { LocalTime } from "@/components/ui/local-time";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/content/site";

const gutter = "px-5 sm:px-8 lg:px-12";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col overflow-hidden pt-20 lg:pt-24">
      <Reveal className={`flex items-center justify-between gap-4 ${gutter}`}>
        <p className="flex items-center gap-2.5 font-eyebrow">
          <span
            className="h-2 w-2 animate-pulse-dot rounded-full bg-accent text-accent motion-reduce:animate-none"
            aria-hidden
          />
          {site.availability}
        </p>
        <p className="hidden font-eyebrow text-muted sm:block">
          {site.location} · <LocalTime className="tabular-nums" />
        </p>
      </Reveal>

      <div
        className={`grid flex-1 items-center gap-10 py-8 lg:grid-cols-12 lg:gap-8 lg:py-4 ${gutter}`}
      >
        <div className="flex flex-col gap-8 lg:col-span-7">
          <Reveal delay={0.1}>
            <p className="max-w-[18ch] text-[clamp(2.25rem,4.4vw,4.25rem)] leading-[1.02] font-medium tracking-[-0.03em] text-balance">
              Fast,{" "}
              <em className="font-serif text-[1.08em] font-normal tracking-[-0.01em] text-accent">
                memorable
              </em>{" "}
              websites for brands around the world.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="max-w-lg text-base leading-relaxed text-muted sm:text-lg">{site.intro}</p>
          </Reveal>

          <Reveal delay={0.3} className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <LinkButton href="#work">
                Selected work
                <ArrowDown className="h-4 w-4" aria-hidden />
              </LinkButton>
            </Magnetic>
            <Magnetic>
              <LinkButton href="#contact" variant="secondary">
                Get in touch
              </LinkButton>
            </Magnetic>
            <ul className="flex gap-5 font-eyebrow sm:ml-2">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-muted transition-colors hover:text-foreground"
                  >
                    {social.label}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <HeroMark className="mx-auto aspect-square w-[72vw] max-w-[20rem] lg:col-span-5 lg:mr-0 lg:w-full lg:max-w-[min(34rem,52svh)]" />
      </div>

      <div
        className={`flex items-end justify-between gap-6 pb-3 font-eyebrow text-muted ${gutter}`}
      >
        <span>
          {site.role} — {site.company}
        </span>
        <a
          href="#work"
          className="hidden items-center gap-2 transition-colors hover:text-foreground sm:inline-flex"
        >
          Scroll
          <ArrowDown className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>

      {/*
       * The name is the page's largest text and its LCP element. It is sized in
       * viewport units so it spans the full width: condensed and stacked on narrow
       * screens, one regular-width line on wide ones (13vw fills the row at 100%
       * width). The entrance is transform-only (see globals.css).
       */}
      <h1 className="px-3 pb-[1.2vw] font-display text-[30vw] text-foreground select-none sm:text-[13vw] sm:[font-stretch:100%]">
        <span className="sr-only">
          {site.name}, {site.role}
        </span>
        <span aria-hidden className="flex flex-col sm:flex-row sm:justify-between sm:gap-[0.15em]">
          {[site.firstName, site.lastName].map((word, index) => (
            <span
              key={word}
              className="-my-[0.06em] block overflow-hidden py-[0.06em] last:self-end sm:last:self-auto"
            >
              <span
                className="block animate-line-up motion-reduce:animate-none"
                style={{ animationDelay: `calc(var(--intro-delay, 0s) + ${0.05 + index * 0.08}s)` }}
              >
                {word}
              </span>
            </span>
          ))}
        </span>
      </h1>
    </section>
  );
}
