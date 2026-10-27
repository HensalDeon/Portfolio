import { ArrowUp, ArrowUpRight } from "lucide-react";

import { Monogram } from "@/components/brand/monogram";
import { Container } from "@/components/ui/container";
import { LocalTime } from "@/components/ui/local-time";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="surface-ink">
      <Container className="grid gap-8 py-10 font-eyebrow text-muted sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
        <p className="flex items-center gap-3 text-foreground">
          <Monogram className="h-6 w-6" />
          &copy; {new Date().getFullYear()} {site.name}
        </p>
        <p>
          {site.location} · <LocalTime className="tabular-nums" />
        </p>
        <ul className="flex gap-6">
          {site.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
              >
                {social.label}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#top"
          className="inline-flex items-center gap-2 transition-colors hover:text-foreground lg:justify-self-end"
        >
          Back to top
          <ArrowUp className="h-3.5 w-3.5" aria-hidden />
        </a>
      </Container>
    </footer>
  );
}
