import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import { Container } from "@/components/ui/container";
import { ProjectCover } from "@/components/ui/project-cover";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/content/site";
import { caseStudies, getCaseStudy } from "@/content/work";
import { caseStudyJsonLd, JsonLd } from "@/lib/json-ld";
import { pageTransition } from "@/lib/transitions";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const title = `${study.client} case study`;
  const url = `/work/${study.slug}`;
  // Nested openGraph and twitter objects replace the layout's rather than merge, so they are restated in full.
  return {
    title,
    description: study.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${title} · ${site.name}`,
      description: study.summary,
      siteName: site.name,
      locale: "en_US",
      authors: [site.name],
      tags: [...study.services, ...study.stack],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${site.name}`,
      description: study.summary,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const index = caseStudies.indexOf(study);
  const next = caseStudies[(index + 1) % caseStudies.length]!;
  const [, ...gallery] = study.gallery;

  const meta = [
    { label: "Platform", items: [study.platform] },
    { label: "Services", items: study.services },
    { label: "Stack", items: study.stack },
  ];

  return (
    <ViewTransition {...pageTransition}>
      <main id="main">
        <JsonLd data={caseStudyJsonLd(study)} />
        <article id="top">
          <Container className="pt-28 lg:pt-36">
            <div className="flex items-center justify-between font-eyebrow text-muted">
              <Link
                href="/#work"
                transitionTypes={["nav-back"]}
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                All work
              </Link>
              <span className="tabular-nums">
                Case {String(index + 1).padStart(2, "0")} /{" "}
                {String(caseStudies.length).padStart(2, "0")}
              </span>
            </div>

            <h1 className="mt-10 font-display text-[clamp(4rem,14vw,14rem)]">
              <span className="block overflow-hidden py-[0.04em]">
                <span className="block animate-line-up motion-reduce:animate-none">
                  {study.client}
                </span>
              </span>
            </h1>

            <div className="mt-8 grid gap-10 border-t border-line pt-8 lg:grid-cols-12 lg:gap-8">
              <Reveal className="lg:col-span-6">
                <p className="text-[clamp(1.5rem,2.6vw,2.5rem)] leading-[1.1] font-medium tracking-[-0.025em] text-balance">
                  {study.headline}
                </p>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-6">
                <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
                  {meta.map((group) => (
                    <div key={group.label}>
                      <dt className="font-eyebrow text-muted">{group.label}</dt>
                      <dd className="mt-3">
                        <ul className="flex flex-col gap-1 text-sm">
                          {group.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  ))}
                  <div>
                    <dt className="font-eyebrow text-muted">Live</dt>
                    <dd className="mt-3">
                      <ul className="flex flex-col gap-1 text-sm">
                        {study.links.map((link) => (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noreferrer"
                              className="underline decoration-line underline-offset-4 transition-colors hover:decoration-foreground"
                            >
                              {link.label}
                              <ArrowUpRight
                                className="ml-1 inline h-3.5 w-3.5 align-[-2px]"
                                aria-hidden
                              />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </div>
          </Container>

          <Container className="mt-14 sm:mt-20">
            <ViewTransition name={`cover-${study.slug}`} share="morph" default="none">
              <ProjectCover
                image={study.cover}
                video={study.video}
                alt={study.gallery[0]?.caption ?? `${study.client} website`}
                tint={study.tint}
                sizes="(min-width: 1440px) 1200px, 90vw"
                eager
              />
            </ViewTransition>
          </Container>

          <Container className="grid gap-10 py-24 sm:py-32 lg:grid-cols-12 lg:gap-8">
            <h2 className="font-eyebrow text-muted lg:col-span-3">Overview</h2>
            <div className="flex flex-col gap-6 lg:col-span-8 lg:col-start-5">
              {study.overview.map((paragraph) => (
                <Reveal inView key={paragraph.slice(0, 24)}>
                  <p className="text-[clamp(1.25rem,1.9vw,1.75rem)] leading-[1.35] tracking-[-0.01em]">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
          </Container>

          <section className="surface-ink py-24 sm:py-32">
            <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
              <h2 className="font-eyebrow text-muted lg:col-span-3">Highlights</h2>
              <ol className="lg:col-span-8 lg:col-start-5">
                {study.highlights.map((highlight, i) => (
                  <li key={highlight} className="border-b border-line first:border-t">
                    <Reveal
                      inView
                      delay={i * 0.05}
                      className="flex items-baseline gap-6 py-6 sm:py-8"
                    >
                      <span className="font-eyebrow text-muted tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[clamp(1.5rem,3vw,2.75rem)] leading-tight font-semibold tracking-[-0.025em]">
                        {highlight}
                      </span>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </Container>
          </section>

          {gallery.length > 0 && (
            <Container className="grid gap-6 py-24 sm:grid-cols-2 sm:py-32">
              {gallery.map((item) => (
                <figure key={item.caption} className="reveal-clip">
                  <ProjectCover
                    image={item.image}
                    video={item.video}
                    alt={item.caption}
                    tint={study.tint}
                    sizes="(min-width: 640px) 45vw, 90vw"
                  />
                  <figcaption className="mt-3 font-eyebrow text-muted">{item.caption}</figcaption>
                </figure>
              ))}
            </Container>
          )}

          <Link
            href={`/work/${next.slug}`}
            transitionTypes={["nav-forward"]}
            className="group block border-t border-line focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none focus-visible:ring-inset"
          >
            <Container className="flex flex-col gap-4 py-16 sm:py-24">
              <span className="flex items-center justify-between font-eyebrow text-muted">
                Next case
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1"
                  aria-hidden
                />
              </span>
              <span className="font-display text-[clamp(4rem,12vw,12rem)] transition-[color,font-stretch] duration-700 ease-out-expo group-hover:text-accent group-hover:[font-stretch:80%]">
                {next.client}
              </span>
            </Container>
          </Link>
        </article>
      </main>
    </ViewTransition>
  );
}
