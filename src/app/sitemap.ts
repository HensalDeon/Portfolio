import type { MetadataRoute } from "next";

import { site } from "@/content/site";
import { caseStudies } from "@/content/work";
import { absoluteUrl } from "@/lib/json-ld";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      changeFrequency: "monthly",
      priority: 1,
      ...(site.portrait && { images: [absoluteUrl(site.portrait.src)] }),
    },
    ...caseStudies.map((study) => ({
      url: absoluteUrl(`/work/${study.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.8,
      images: [absoluteUrl(study.cover.src)],
    })),
  ];
}
