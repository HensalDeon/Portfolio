import {
  aneco,
  animemaster,
  blockchaincenter,
  buzzgram,
  customcreation,
  designcove,
  ecwrd,
  f8,
  familysub,
  giftcards,
  goodseoul,
  gsu,
  keralarealtor,
  mazaintrading,
  mgps,
  mudmaxanimations,
  nexsphere,
  sfm,
  sssl,
  traction,
  trsutcapital,
  wac,
} from "@/assets";

import type { StaticImageData } from "next/image";

import type { LoopVideoSource } from "@/components/ui/loop-video";

export const platforms = ["Next.js", "React", "Webflow", "Three.js", "Other"] as const;
export type Platform = (typeof platforms)[number];

export type ExternalLink = { label: string; href: string };

export type CaseStudy = {
  slug: string;
  client: string;
  /** One sentence that sits under the title. */
  headline: string;
  /** Short paragraph for the home page list. */
  summary: string;
  platform: Platform;
  services: string[];
  stack: string[];
  links: ExternalLink[];
  cover: StaticImageData;
  /** Screen recording shown in place of the cover still. */
  video?: LoopVideoSource;
  /** Backdrop colour for the framed cover. */
  tint: string;
  gallery: { image: StaticImageData; caption: string; video?: LoopVideoSource }[];
  overview: string[];
  highlights: string[];
};

export type ArchiveProject = {
  name: string;
  platform: Platform;
  /** A few words on what it is. */
  kind: string;
  tags: string[];
  image: StaticImageData;
  href: string;
  /** True when the link points at source code rather than a live site. */
  source?: boolean;
};

/** A screen recording in /public/videos with a poster of its first frame (all are 1280×662). */
function clip(name: string): LoopVideoSource {
  return { src: `/videos/${name}.mp4`, poster: `/videos/${name}.webp`, width: 1280, height: 662 };
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "ikea",
    client: "IKEA",
    headline: "Food delivery, gift cards and a family subscription for IKEA in four countries.",
    summary:
      "Three customer-facing products for IKEA in the UAE, Qatar, Oman and Egypt: a food-ordering web app, a gift card store and a subscription that shares delivery benefits across a household.",
    platform: "React",
    services: ["Frontend development", "Checkout and payments", "Responsive UI"],
    stack: ["React", "PWA Studio", "GraphQL", "SCSS"],
    links: [
      { label: "Swedish Food Market", href: "https://food.ikea.ae" },
      { label: "Gift cards", href: "https://giftcards.ikea.ae/en" },
      { label: "Family Delivery", href: "https://subscribe.family.ikea.qa/en" },
    ],
    cover: sfm,
    video: clip("ikea-food"),
    tint: "#0058a3",
    gallery: [
      { image: sfm, caption: "Swedish Food Market, a progressive web app for ordering IKEA food" },
      {
        image: giftcards,
        caption: "Gift card store for the UAE, Qatar, Oman and Egypt",
        video: clip("ikea-giftcards"),
      },
      {
        image: familysub,
        caption: "Family Delivery subscription for Qatar and the UAE",
        video: clip("ikea-family"),
      },
    ],
    overview: [
      "Swedish Food Market brings IKEA's food range to customers' doors across the UAE, Qatar, Oman and Egypt. It is a progressive web app where customers browse and order authentic IKEA food for delivery, built to feel smooth on any device.",
      "Alongside it sit two more storefronts: a gift card store for the same four markets, and Family Delivery, a subscription in Qatar and the UAE where one plan shares rewards and delivery benefits across every member of a household.",
    ],
    highlights: [
      "Progressive web app on PWA Studio with GraphQL data",
      "Purchase and subscription flows with integrated payments",
      "One responsive system serving four markets",
    ],
  },
  {
    slug: "mazain-sohar",
    client: "Mazain Sohar",
    headline: "A procurement platform connecting industrial buyers with supply.",
    summary:
      "A modern procurement platform where industrial buyers connect with materials, tools, skilled manpower and trusted suppliers, built on Next.js with content in Sanity.",
    platform: "Next.js",
    services: ["Frontend development", "CMS integration"],
    stack: ["Next.js", "Sanity", "TypeScript"],
    links: [{ label: "mazaintrading.com", href: "https://www.mazaintrading.com/" }],
    cover: mazaintrading,
    video: clip("mazain-sohar"),
    tint: "#e9a23b",
    gallery: [{ image: mazaintrading, caption: "Home page for Mazain Sohar's industrial supply" }],
    overview: [
      "Mazain Sohar serves industrial buyers. The platform presents everything they need, from materials and tools to skilled manpower, and connects them with trusted suppliers through an efficient, easy experience.",
      "It is built with Next.js and TypeScript, with content managed in Sanity.",
    ],
    highlights: [
      "Next.js and TypeScript",
      "Content managed in Sanity",
      "Responsive across every device",
    ],
  },
  {
    slug: "blockchain-center",
    client: "The Blockchain Center",
    headline: "A Webflow site for a blockchain organisation.",
    summary:
      "A modern Webflow site with interactive elements, custom JavaScript and CMS-driven content that holds its design across every device.",
    platform: "Webflow",
    services: ["Webflow development", "Interaction", "CMS"],
    stack: ["Webflow", "JavaScript", "Webflow CMS"],
    links: [{ label: "theblockchaincenter.ae", href: "https://www.theblockchaincenter.ae/" }],
    cover: blockchaincenter,
    video: clip("blockchain-center"),
    tint: "#c9c2f5",
    gallery: [{ image: blockchaincenter, caption: "The Blockchain Center home page" }],
    overview: [
      "A modern Webflow site for a blockchain organisation, with interactive elements and custom JavaScript enhancements on top of Webflow's own interactions.",
      "Content runs through Webflow CMS collections, and the design stays responsive and consistent across devices.",
    ],
    highlights: [
      "Custom JavaScript on top of Webflow interactions",
      "CMS collections for dynamic content",
      "Consistent design across breakpoints",
    ],
  },
  {
    slug: "good-seoul",
    client: "Good Seoul",
    headline: "A food-focused website with immersive 3D.",
    summary:
      "A visually rich, food-focused site with Spline 3D scenes, immersive interactions and CMS-managed content, built as part of a team.",
    platform: "Webflow",
    services: ["Webflow development", "3D integration", "Motion"],
    stack: ["Webflow", "Spline", "JavaScript"],
    links: [{ label: "goodseoul.com", href: "https://goodseoul.com" }],
    cover: goodseoul,
    video: clip("good-seoul"),
    tint: "#f4d35e",
    gallery: [{ image: goodseoul, caption: "Good Seoul home page" }],
    overview: [
      "Good Seoul's site is visually rich and food-focused, with immersive interactions and 3D scenes.",
      "I worked with the team on the Spline scenes, custom JavaScript enhancements, smooth animations and CMS-managed content.",
    ],
    highlights: [
      "Spline 3D scenes embedded in Webflow",
      "Custom JavaScript interactions",
      "CMS-managed dynamic content",
    ],
  },
  {
    slug: "wacpro",
    client: "WACpro",
    headline: "An all-in-one ERP dashboard for running a company.",
    summary:
      "An internal ERP-style dashboard that brings accounts, HR, sales, projects, time tracking and AI integrations into one centralised control centre.",
    platform: "React",
    services: ["Frontend development", "Dashboard UI", "Data fetching"],
    stack: ["React", "SWR", "Python"],
    links: [{ label: "pro.webandcrafts.com", href: "https://pro.webandcrafts.com" }],
    cover: wac,
    tint: "#2b3a67",
    gallery: [{ image: wac, caption: "The WACpro sales pipeline and lead details" }],
    overview: [
      "WACpro is an internal dashboard, resembling an ERP system, designed for company management. It gives a team one comprehensive, centralised place to run the business.",
      "It covers admin, accounts, assets, calls, campaigns, clients, HR, meetings, project management, sales, settings, team management and time tracking, alongside AI integrations. The front end is built with React, with SWR for data fetching against a Python back end.",
    ],
    highlights: [
      "More than a dozen modules in one interface",
      "React front end with SWR data fetching",
      "AI integrations alongside day-to-day operations",
    ],
  },
];

export const archive: ArchiveProject[] = [
  {
    name: "DesignCove Architects",
    platform: "Next.js",
    kind: "Architecture and interiors studio",
    tags: ["Next.js", "Sanity", "TypeScript"],
    image: designcove,
    href: "https://designcovearchitects.vercel.app/",
  },
  {
    name: "ECWRD",
    platform: "Other",
    kind: "Workforce development council",
    tags: ["WordPress", "Tailwind CSS"],
    image: ecwrd,
    href: "https://ecwrd.ae/",
  },
  {
    name: "Function8",
    platform: "Next.js",
    kind: "Branding agency",
    tags: ["Next.js", "TypeScript"],
    image: f8,
    href: "https://www.f8ad.in/",
  },
  {
    name: "MGPS",
    platform: "Next.js",
    kind: "School website",
    tags: ["Next.js", "TypeScript"],
    image: mgps,
    href: "https://www.mgpschool.org/",
  },
  {
    name: "Global South Utilities",
    platform: "Webflow",
    kind: "Energy and water infrastructure",
    tags: ["Webflow", "CMS"],
    image: gsu,
    href: "https://www.gsu.ae/",
  },
  {
    name: "Aneco",
    platform: "Webflow",
    kind: "Water treatment technology",
    tags: ["Webflow", "CMS"],
    image: aneco,
    href: "https://aneco-me.ae/",
  },
  {
    name: "Nexsphere",
    platform: "Next.js",
    kind: "Creative agency",
    tags: ["Next.js", "Tailwind CSS"],
    image: nexsphere,
    href: "https://nexsphere.vercel.app",
  },
  {
    name: "Keralarealtor",
    platform: "Next.js",
    kind: "Real estate platform",
    tags: ["Next.js", "MongoDB"],
    image: keralarealtor,
    href: "https://keralarealtor.in",
  },
  {
    name: "Mudmax Animations",
    platform: "Three.js",
    kind: "Animation and VFX institute",
    tags: ["Three.js", "React"],
    image: mudmaxanimations,
    href: "https://mudmaxanimations.com/",
  },
  {
    name: "T-CraftStudio",
    platform: "Three.js",
    kind: "3D T-shirt customiser",
    tags: ["Three.js", "React"],
    image: customcreation,
    href: "https://t-craftstudio.netlify.app/",
  },
  {
    name: "Trust Capital",
    platform: "Other",
    kind: "Trading platform",
    tags: ["Laravel", "Tailwind CSS"],
    image: trsutcapital,
    href: "https://trustcapital.ae/",
  },
  {
    name: "Simple Search Solutions",
    platform: "React",
    kind: "Job search platform",
    tags: ["React", "Django"],
    image: sssl,
    href: "https://github.com/HensalDeon/SimpleSearchSolutions",
    source: true,
  },
  {
    name: "BuzzGram",
    platform: "React",
    kind: "Social media app",
    tags: ["React", "Node.js"],
    image: buzzgram,
    href: "https://github.com/HensalDeon/BuzzGram",
    source: true,
  },
  {
    name: "AnimeMaster",
    platform: "Next.js",
    kind: "Anime discovery app",
    tags: ["Next.js", "TypeScript"],
    image: animemaster,
    href: "https://github.com/HensalDeon/anime_master",
    source: true,
  },
  {
    name: "Traction",
    platform: "Other",
    kind: "RC car e-commerce",
    tags: ["Node.js", "MongoDB"],
    image: traction,
    href: "https://github.com/HensalDeon/TRACTION",
    source: true,
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
