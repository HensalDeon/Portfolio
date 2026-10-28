# Hensal Deon Portfolio

Personal portfolio built with Next.js 16, React 19, TypeScript, Tailwind CSS 4 and three.js. A bold editorial site: a full-bleed name and particle monogram in the hero, five case studies with their own pages, an archive index with cursor previews, experience and a contact form backed by EmailJS, behind a branded curtain preloader.

## Stack

| Area      | Choice                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, static rendering), React 19                                               |
| Language  | TypeScript, strict mode                                                                           |
| Styling   | Tailwind CSS 4 with CSS variable design tokens                                                    |
| Motion    | CSS keyframes, scroll timelines, Lenis smooth scroll, React view transitions                      |
| WebGL     | Plain three.js particle field built from the monogram strokes                                     |
| Theming   | next-themes, light and dark with system default                                                   |
| Fonts     | Archivo (variable width) for display and body, Instrument Serif italic accents, Geist Mono labels |
| Tooling   | ESLint 9 flat config, Prettier with Tailwind plugin                                               |
| Hosting   | Netlify, via `@netlify/plugin-nextjs`                                                             |

## Getting started

```bash
npm install
cp .env.example .env   # then fill in values
npm run dev
```

The site runs at `http://localhost:3000`.

## Scripts

| Command                | What it does                        |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Start the development server        |
| `npm run build`        | Production build with type checking |
| `npm run start`        | Serve the production build          |
| `npm run lint`         | ESLint                              |
| `npm run typecheck`    | TypeScript without emitting         |
| `npm run format`       | Prettier, write mode                |
| `npm run format:check` | Prettier, check mode                |

## Environment variables

| Variable                          | Purpose                                        |
| --------------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`            | Canonical URL used for metadata and Open Graph |
| `GOOGLE_SITE_VERIFICATION`        | Optional Search Console verification token     |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID`  | EmailJS service for the contact form           |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | EmailJS template for the contact form          |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`  | EmailJS public key                             |

## SEO

- Metadata in `src/app/layout.tsx` (canonical URLs, Open Graph profile, Twitter card, robots directives) and per case study in `src/app/work/[slug]/page.tsx`
- `robots.txt`, `sitemap.xml` and the web manifest are generated from `src/app/robots.ts`, `sitemap.ts` and `manifest.ts`
- JSON-LD from `src/lib/json-ld.tsx`: Person, WebSite and ProfilePage on the home page; CreativeWork and BreadcrumbList on each case study
- Branded social cards for the home page and every case study, drawn by `src/lib/og-card.tsx`

## Project structure

```
src/
├── app/                  # App Router: layout, home page, work/[slug] case studies, not-found, globals.css, OG image, icons
├── assets/               # Project screenshots imported through next/image
├── components/
│   ├── brand/            # HD monogram and the curtain preloader
│   ├── layout/           # Navbar, theme toggle, footer
│   ├── hero/             # Particle monogram (three.js) and its deferred React wrapper
│   ├── sections/         # Hero, work, archive index, about, experience, contact
│   ├── ui/               # Container, buttons, reveals, marquee, magnetic, cursor label, project cover
│   └── providers/        # Theme provider and Lenis smooth scroll
├── content/              # Typed site content: site.ts, nav.ts, data.ts, work.ts
├── hooks/                # Scroll, visibility, reduced motion and deferred-scene hooks
└── lib/                  # Utilities and shared view-transition props
```

## Content

All copy and data lives in `src/content/`. Edit `site.ts` for name, role, location, availability, email and social links; `data.ts` for services, capabilities and experience; and `work.ts` for the featured case studies (each gets a page at `/work/<slug>`, a cover tint and gallery) and the archive list. Setting `site.email` shows it in large type in the contact section. Screenshots are WebP at 1200px wide and are imported through `src/assets/index.ts`.

## Brand

The mark is a stroke-built HD monogram (`src/components/brand/monogram.tsx`): the H's right leg doubles as the D's spine, with the crossbar in the accent colour. The same strokes drive the favicon (`src/app/icon.svg`, OS-aware light/dark), the Apple touch icon and Open Graph image (both generated with `next/og`), and the curtain preloader (`src/components/brand/preloader.tsx`), which draws the mark in on load before the page is revealed. Hero entrance animations read the `--intro-delay` CSS variable (`src/components/brand/intro.ts`) so they play in step with the curtain lifting.

## Hero particles

`src/components/hero/monogram-field.ts` rasterises the monogram strokes, samples a few thousand points from the ink and renders them as a three.js point cloud with a small custom shader. The points assemble when the intro curtain lifts, part around the pointer and dissolve as the hero scrolls away. The SVG mark holds the space until then: the field (and three.js) only loads once the intro has finished and the browser is idle, pauses offscreen, renders a still frame for reduced motion, and is skipped when the user is saving data.

## Deployment

Deployed to Netlify via `@netlify/plugin-nextjs` (configured in `netlify.toml`); any Next.js host works otherwise, and Vercel needs no configuration. Canonical, Open Graph, sitemap and structured-data URLs use `NEXT_PUBLIC_SITE_URL`, falling back to the `URL` Netlify sets to the site's primary domain at build time.

## Contact

- [LinkedIn](https://www.linkedin.com/in/hensal-deon-472883227/)
- [GitHub](https://github.com/HensalDeon)
