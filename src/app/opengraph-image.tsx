import { site } from "@/content/site";
import { ogSize, renderOgCard } from "@/lib/og-card";

export const alt = `${site.name}, ${site.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgCard({
    label: site.role,
    aside: site.location,
    line: site.tagline,
    title: site.name,
  });
}
