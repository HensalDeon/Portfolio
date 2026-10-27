import type { StaticImageData } from "next/image";

import { portrait } from "@/assets";

export const site = {
  name: "Hensal Deon",
  firstName: "Hensal",
  lastName: "Deon",
  role: "Senior Web Developer",
  company: "Eighty Six Media",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  tagline: "Fast, memorable websites for brands around the world.",
  description:
    "Hensal Deon is a senior web developer building marketing sites and web products with Next.js, Webflow and headless CMS platforms.",
  location: "India",
  /** IANA zone for the live clock in the header and footer. */
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
  availability: "Open to projects worldwide",
  /** Shown in giant type in the contact section when set; the form is used otherwise. */
  email: undefined as string | undefined,
  /**
   * Photo for the About section, imported from `@/assets` (4:5 crop works
   * best). A framed placeholder holds the space while this is unset.
   */
  portrait: portrait as StaticImageData | undefined,
  intro:
    "Senior web developer at Eighty Six Media. I build marketing sites and web products with Next.js, Webflow and headless CMS, most recently for IKEA, Mazain Sohar and the Blockchain Center.",
  statement:
    "I build websites that load before you notice and stay with you after you leave: fast, precise and quietly animated, for brands that care how they feel on screen.",
  about: [
    "I am a web developer from India working with teams and clients internationally. I started in 2023 building MERN applications and quickly moved into agency work, where I have shipped e-commerce, gift card and subscription experiences for IKEA in four countries, procurement and education platforms on Next.js, internal tools, and a run of Webflow sites for brands across industries.",
    "I care about the parts people feel but rarely name: load times, layout that holds together on every screen, motion that guides instead of distracts, and code the next developer can read. I work closely with designers and backend teams, and I am comfortable owning a build from first wireframe to launch.",
  ],
  contactBlurb:
    "Have a project in mind, or want to talk about a role? Send a note and I will get back to you soon.",
  socials: [
    { label: "GitHub", href: "https://github.com/HensalDeon" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/hensal-deon-472883227/" },
  ],
  since: 2023,
} as const;
