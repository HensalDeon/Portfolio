import { site } from "@/content/site";
import { caseStudies, getCaseStudy } from "@/content/work";
import { ogSize, renderOgCard } from "@/lib/og-card";

export const alt = `Case study by ${site.name}`;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export default async function CaseStudyImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug)!;
  return renderOgCard({
    label: "Case study",
    aside: site.name,
    line: study.headline,
    title: study.client,
  });
}
