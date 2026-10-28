import { ViewTransition } from "react";

import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { homeJsonLd, JsonLd } from "@/lib/json-ld";
import { pageTransition } from "@/lib/transitions";

export default function HomePage() {
  return (
    <ViewTransition {...pageTransition}>
      <main id="main">
        <JsonLd data={homeJsonLd} />
        <Hero />
        <Work />
        <About />
        <Experience />
        <Contact />
      </main>
    </ViewTransition>
  );
}
