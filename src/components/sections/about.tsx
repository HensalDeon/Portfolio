import { Portrait } from "@/components/ui/portrait";
import { Reveal } from "@/components/ui/reveal";
import { ScrollWords } from "@/components/ui/scroll-words";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { capabilities, experiences, services } from "@/content/data";
import { site } from "@/content/site";
import { archive, caseStudies } from "@/content/work";

// Case studies can bundle several launches (IKEA is three), so count their links.
const projectCount =
  caseStudies.reduce((total, study) => total + study.links.length, 0) + archive.length;

const stats = [
  { value: `${projectCount}+`, label: "Projects shipped" },
  { value: String(experiences.length), label: "Teams worked with" },
  { value: String(site.since), label: "Building for the web since" },
];

export function About() {
  return (
    <Section id="about">
      <SectionTitle index="02" title="About" />

      <ScrollWords
        text={site.statement}
        className="mt-14 max-w-[30ch] text-[clamp(1.875rem,4.4vw,4.5rem)] leading-[1.04] font-medium tracking-[-0.035em] sm:mt-20"
      />

      <div className="mt-20 grid gap-14 sm:mt-28 lg:grid-cols-12 lg:gap-8">
        <div className="reveal-clip sm:max-w-sm lg:col-span-3 lg:max-w-none">
          <Portrait image={site.portrait} alt={`Portrait of ${site.name}`} />
          <p className="mt-3 flex justify-between font-eyebrow text-muted">
            <span>{site.name}</span>
            <span>{site.location}</span>
          </p>
        </div>

        <Reveal inView delay={0.05} className="flex flex-col gap-5 lg:col-span-4 lg:col-start-5">
          <h3 className="font-eyebrow text-muted">Background</h3>
          {site.about.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-base leading-relaxed sm:text-lg">
              {paragraph}
            </p>
          ))}
          <dl className="mt-6 grid grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-2 border-t border-line pt-4">
                <dt className="order-2 font-eyebrow text-muted">{stat.label}</dt>
                <dd className="order-1 font-display text-[clamp(2.5rem,4vw,3.75rem)] tabular-nums">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal inView delay={0.1} className="lg:col-span-4 lg:col-start-9">
          <h3 className="font-eyebrow text-muted">What I do</h3>
          <ol className="mt-5 border-t border-line">
            {services.map((service, index) => (
              <li
                key={service.title}
                className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-5"
              >
                <span className="pt-1 font-eyebrow text-muted tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="text-lg font-semibold tracking-tight">{service.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{service.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>

      <Reveal
        inView
        className="mt-20 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-10 sm:mt-28 lg:grid-cols-4"
      >
        {capabilities.map((group) => (
          <div key={group.title}>
            <h3 className="font-eyebrow text-muted">{group.title}</h3>
            <ul className="mt-4 flex flex-col gap-1.5 text-lg font-medium tracking-tight sm:text-xl">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
