import path from "node:path";
import sharp from "sharp";
import { siteConfig } from "@/data/site-config";

/* Build-time OG image (1200×630). Layout: paper background, photo
 * on the left occupying a 540px square slot, brand typography on the
 * right (name + role + tagline + url). System fonts in the SVG —
 * Geist isn't directly embeddable in sharp's SVG renderer (librsvg)
 * without extra tooling, and at OG thumbnail size the difference vs
 * the site is barely visible.
 *
 * Astro builds this once at `bun run build` and writes to
 * dist/og-default.png. siteConfig.ogImage points at /og-default.png. */

export const prerender = true;

const PAPER = "#f6f3ec";
const INK = "#141416";
const INK_2 = "#2a2a2f";
const BLUE = "#1e3a5f";

const PROTOCOL_RX = /^https?:\/\//;

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET(): Promise<Response> {
  const photoPath = path.resolve("./src/assets/me.jpg");
  const photoBuffer = await sharp(photoPath)
    .resize(540, 540, { fit: "cover", position: "attention" })
    .toBuffer();

  const name = escapeXml(siteConfig.name);
  const role = escapeXml(siteConfig.role.toUpperCase());
  const tagline = escapeXml(siteConfig.tagline);
  const url = escapeXml(siteConfig.url.replace(PROTOCOL_RX, ""));

  const overlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <style>
    .display { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; font-weight: 500; fill: ${INK}; letter-spacing: -0.035em; }
    .mono { font-family: ui-monospace, SFMono-Regular, monospace; }
    .role { fill: ${BLUE}; letter-spacing: 0.16em; }
    .tag { fill: ${INK_2}; }
    .url { fill: ${BLUE}; font-weight: 500; }
    .mark-bg { fill: ${BLUE}; }
    .mark-ch { fill: ${PAPER}; font-family: ui-monospace, SFMono-Regular, monospace; font-weight: 600; }
  </style>

  <rect class="mark-bg" x="1132" y="40" width="36" height="36" />
  <text class="mark-ch" x="1144" y="65" font-size="18">k</text>

  <text class="display" x="640" y="270" font-size="84">${name}</text>
  <text class="mono role" x="640" y="320" font-size="18">${role}</text>

  <line x1="640" y1="368" x2="700" y2="368" stroke="${BLUE}" stroke-width="2" />

  <text class="display tag" x="640" y="450" font-size="26" font-weight="400">${tagline}</text>
  <text class="mono url" x="640" y="560" font-size="22">${url}</text>
</svg>
`.trim();

  const png = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: PAPER,
    },
  })
    .composite([
      { input: photoBuffer, top: 45, left: 45 },
      { input: Buffer.from(overlay), top: 0, left: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
}
