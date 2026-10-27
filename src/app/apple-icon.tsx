import { ImageResponse } from "next/og";

import { monogramDataUrl } from "@/components/brand/monogram";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111110",
      }}
    >
      <img
        alt=""
        width={116}
        height={116}
        src={monogramDataUrl({ foreground: "#efede7", accent: "#ff5a26", strokeWidth: 6 })}
      />
    </div>,
    size,
  );
}
