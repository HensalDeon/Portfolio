import { ArrowUpRight } from "lucide-react";

import { Monogram } from "@/components/brand/monogram";
import { ContactForm } from "@/components/sections/contact-form";
import { Container } from "@/components/ui/container";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/content/site";

export function Contact() {
  return (
    <section id="contact" className="surface-accent overflow-hidden pt-16 sm:pt-24">
      <div aria-hidden>
        <Marquee
          duration={28}
          items={["Let's work together", "Let's work together"]}
          separator={<Monogram className="mx-[0.3em] h-[0.62em] w-[0.62em]" />}
          className="font-display text-[clamp(5rem,16vw,16rem)] leading-[0.9]"
        />
      </div>

      <Container className="grid gap-14 py-16 sm:py-24 lg:grid-cols-12 lg:gap-8">
        <Reveal inView className="flex flex-col gap-6 lg:col-span-5">
          <p className="font-eyebrow">(04) Contact</p>
          <h2 className="text-[clamp(2.5rem,4.6vw,4.5rem)] leading-[1] font-semibold tracking-[-0.035em] text-balance">
            Tell me about your{" "}
            <em className="font-serif text-[1.08em] font-normal tracking-normal">project.</em>
          </h2>
          <p className="max-w-md text-lg leading-relaxed">{site.contactBlurb}</p>

          {site.email ? (
            <a
              href={`mailto:${site.email}`}
              className="self-start text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold tracking-tight underline decoration-2 underline-offset-[0.2em] transition-[text-decoration-color] hover:decoration-transparent"
            >
              {site.email}
            </a>
          ) : null}

          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-eyebrow">
            {site.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                >
                  {social.label}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal inView delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <ContactForm />
        </Reveal>
      </Container>
    </section>
  );
}
