import { ImageResponse } from "next/og";

import { monogramDataUrl } from "@/components/brand/monogram";

export const ogSize = { width: 1200, height: 630 };

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

type OgCardProps = {
  /** Top-left label beside the monogram. */
  label: string;
  /** Top-right label. */
  aside: string;
  /** A sentence above the title. */
  line: string;
  /** Set large like the hero name. */
  title: string;
};

/** Social card in the site's signal orange, with the title set large like the hero. */
export async function renderOgCard({ label, aside, line, title }: OgCardProps) {
  const heading = title.toUpperCase();
  const [display, text] = await Promise.all([
    loadArchivo("wdth,wght@75,800", heading),
    loadArchivo("wght@400", [line, label.toUpperCase(), aside.toUpperCase()].join("")),
  ]);
  // 188px fits about eleven condensed capitals across the card; longer titles scale down.
  const fontSize = Math.round(Math.min(188, (188 * 11) / Math.max(11, heading.length)));

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
          {/* ImageResponse renders plain elements; next/image does not apply here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            width={48}
            height={48}
            src={monogramDataUrl({ foreground: "#111110", accent: "#f1efe9", strokeWidth: 6 })}
          />
          {label}
        </div>
        <div>{aside}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 36, maxWidth: 1000, lineHeight: 1.2 }}>{line}</div>
        <div
          style={{
            fontSize: display ? fontSize : fontSize * 0.8,
            lineHeight: 0.9,
            letterSpacing: display ? -2 : -6,
            fontFamily: display ? "Archivo Display" : "sans-serif",
          }}
        >
          {heading}
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        ...(display ? [{ name: "Archivo Display", data: display, weight: 800 as const }] : []),
        ...(text ? [{ name: "Archivo Text", data: text, weight: 400 as const }] : []),
      ],
    },
  );
}
