import type { MetadataRoute } from "next";

import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} · ${site.role}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#f1efe9",
    theme_color: "#f1efe9",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
