import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// In Next 16 the image function's `params` and `id` arrive as Promises, so this
// must be async. This route takes neither, but writing it synchronously is a
// Next 15 pattern and no longer correct.
//
// No external font is fetched: the default face keeps the build offline-safe.
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#faf9f7",
          color: "#111110",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#d6421f",
          }}
        >
          Portfolio
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 34,
              color: "#6b6a66",
            }}
          >
            {site.role}
          </div>
        </div>

        {/* Accent rule, matching the site's primary structural device. */}
        <div
          style={{ display: "flex", height: 6, width: 200, background: "#d6421f" }}
        />
      </div>
    ),
    size
  );
}
