import { capabilities } from "@/content/data";
import { site } from "@/content/site";
import type { CaseStudy } from "@/content/work";

type Thing = Record<string, unknown>;

const PERSON_ID = `${site.url}/#person`;
const WEBSITE_ID = `${site.url}/#website`;

/** Absolute URL for a site path or a bundled asset's `src`. */
export function absoluteUrl(path: string): string {
  return new URL(path, `${site.url}/`).toString();
}

/**
 * Structured data for search engines, rendered as a JSON-LD script. `<` is
 * escaped so no string in the payload can close the tag early.
 */
export function JsonLd({ data }: { data: Thing }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(
          /</g,
          "\\u003c",
        ),
      }}
    />
  );
}

const person: Thing = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: site.name,
  givenName: site.firstName,
  familyName: site.lastName,
  jobTitle: site.role,
  description: site.description,
  url: site.url,
  ...(site.portrait && { image: absoluteUrl(site.portrait.src) }),
  worksFor: { "@type": "Organization", name: site.company },
  address: { "@type": "PostalAddress", addressCountry: "IN" },
  knowsAbout: capabilities
    .filter((group) => group.title !== "Workflow")
    .flatMap((group) => group.items),
  sameAs: site.socials.map((social) => social.href),
};

const website: Thing = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: site.url,
  name: site.name,
  description: site.description,
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
};

/** The home page: a profile of the person behind the site. */
export const homeJsonLd: Thing = {
  "@graph": [
    person,
    website,
    {
      "@type": "ProfilePage",
      "@id": `${site.url}/#profile`,
      url: site.url,
      name: `${site.name} · ${site.role}`,
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: { "@id": PERSON_ID },
    },
  ],
};

/** A case study page: the project as a creative work, with a breadcrumb back home. */
export function caseStudyJsonLd(study: CaseStudy): Thing {
  const url = absoluteUrl(`/work/${study.slug}`);
  return {
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        url,
        name: `${study.client} case study`,
        headline: study.headline,
        description: study.summary,
        image: absoluteUrl(study.cover.src),
        keywords: [...study.services, ...study.stack].join(", "),
        about: { "@type": "Organization", name: study.client },
        author: { "@id": PERSON_ID },
        creator: { "@id": PERSON_ID },
        isPartOf: { "@id": WEBSITE_ID },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.name, item: site.url },
          { "@type": "ListItem", position: 2, name: study.client, item: url },
        ],
      },
    ],
  };
}
