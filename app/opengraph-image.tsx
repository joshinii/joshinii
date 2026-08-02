import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { contact, positioning } from "@/content/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${contact.name} — ${contact.role}`;

/**
 * The OG card carries the same palette, the same typefaces, and the same one
 * artifact as the hero.
 *
 * satori can't reach the next/font webfonts and doesn't read woff2, so the two
 * families are vendored as TTFs under assets/fonts and loaded here. This route
 * is statically generated, so the reads happen at build time.
 */
export default async function OpenGraphImage() {
  const [serif, mono] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Newsreader-Regular.ttf")),
    readFile(join(process.cwd(), "assets/fonts/IBMPlexMono-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#faf7f2",
          color: "#1a1714",
          padding: "68px 80px",
          fontFamily: "Newsreader",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 20,
            letterSpacing: "0.14em",
            color: "#776f67",
            fontFamily: "IBM Plex Mono",
          }}
        >
          {contact.role.toUpperCase()} / {contact.location.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, lineHeight: 1.0, letterSpacing: "-0.02em" }}>
            Joshini
          </div>
          <div style={{ fontSize: 88, lineHeight: 1.0, letterSpacing: "-0.02em" }}>
            M Naagraj
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 32,
              color: "#5c544b",
              maxWidth: 880,
            }}
          >
            {positioning}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 18,
            borderTop: "1px solid #ded5c8",
            paddingTop: 26,
            fontFamily: "IBM Plex Mono",
          }}
        >
          <span style={{ fontSize: 38, color: "#776f67" }}>20 min</span>
          <span style={{ fontSize: 38, color: "#776f67" }}>&#8594;</span>
          <span style={{ fontSize: 38, color: "#b4501e" }}>5 min</span>
          <span
            style={{
              fontSize: 17,
              letterSpacing: "0.14em",
              color: "#5c544b",
              marginLeft: 14,
            }}
          >
            QUEUE PROCESSING, AFTER A KAFKA REBUILD
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Newsreader", data: serif, style: "normal", weight: 400 },
        { name: "IBM Plex Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
