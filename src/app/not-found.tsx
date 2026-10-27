import { ArrowLeft } from "lucide-react";

import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main id="main">
      <Container className="flex min-h-svh flex-col justify-center gap-8 py-32">
        <p className="font-eyebrow text-muted">Error 404</p>
        <h1 className="font-display text-[clamp(5rem,22vw,22rem)]">Lost?</h1>
        <p className="max-w-md text-lg text-muted">
          This page does not exist, or it moved when the site was rebuilt.
        </p>
        <LinkButton href="/" className="self-start">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back home
        </LinkButton>
      </Container>
    </main>
  );
}
