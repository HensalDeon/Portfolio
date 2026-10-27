import { ImageResponse } from "next/og";

import { monogramDataUrl } from "@/components/brand/monogram";
import { site } from "@/content/site";

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAME = site.name.toUpperCase();

const LABELS = [site.role, site.location].map((text) => text.toUpperCase());

/**
 * Archivo subset to the characters a card needs. Without a browser user agent
 * Google Fonts serves TrueType, which ImageResponse can read. Returns null if
 * the request fails, and the card falls back to the default font.
 */
async function loadArchivo(axes: string, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Archivo:${axes}&text=${encodeURIComponent(text)}`,
    ).then((response) => response.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return url ? await fetch(url).then((response) => response.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

/** Social card in the site's signal orange, with the name set large like the hero. */
export default async function OpenGraphImage() {
  const [display, text] = await Promise.all([
    loadArchivo("wdth,wght@75,800", NAME),
    loadArchivo("wght@400", [site.tagline, ...LABELS].join("")),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: "#e5400e",
        color: "#111110",
        fontFamily: text ? "Archivo Text" : "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img
            alt=""
            width={48}
            height={48}
            src={monogramDataUrl({ foreground: "#111110", accent: "#f1efe9", strokeWidth: 6 })}
          />
          {site.role}
        </div>
        <div>{site.location}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 36, maxWidth: 1000, lineHeight: 1.2 }}>{site.tagline}</div>
        <div
          style={{
            fontSize: display ? 188 : 150,
            lineHeight: 0.9,
            letterSpacing: display ? -2 : -6,
            fontFamily: display ? "Archivo Display" : "sans-serif",
          }}
        >
          {NAME}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        ...(display ? [{ name: "Archivo Display", data: display, weight: 800 as const }] : []),
        ...(text ? [{ name: "Archivo Text", data: text, weight: 400 as const }] : []),
      ],
    },
  );
}
