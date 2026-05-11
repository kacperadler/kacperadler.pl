import path from "node:path";
import sharp from "sharp";
import { siteConfig } from "@/data/site-config";

/* Build-time OG image (1200×630). Layout: dark v2 substrate with a
 * faint dot grid, photo on the left in a rounded panel (matches v2
 * radius-md), brand typography on the right (eyebrow + name + line +
 * tagline + url). System fonts in the SVG - Geist isn't directly
 * embeddable in sharp's SVG renderer (librsvg) without extra tooling,
 * and at OG thumbnail size the difference vs the site is barely
 * visible.
 *
 * Astro builds this once at `bun run build` and writes to
 * dist/og-default.png. siteConfig.ogImage points at /og-default.png. */

export const prerender = true;

/* v2 dark-mode palette. Lifted from tokens.css light-dark() dark
 * sides; v2 is dark-only so OG follows the same default. */
const BG = "#0a0c10";
const INK = "#ece7dc";
const INK_2 = "#c8c3b8";
const BLUE = "#8eaed8";
const LINE = "rgba(236, 231, 220, 0.1)";
const GRID = "rgba(236, 231, 220, 0.06)";
const ON_BLUE = "#0f1116";

const PHOTO_SIZE = 540;
const PHOTO_INSET = 45;
const PHOTO_RADIUS = 16;

const PROTOCOL_RX = /^https?:\/\//;

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/* Wrap a tagline onto at most two lines so it fits the 560px text
 * column at 26px font. Splits at the first comma when the string
 * exceeds the per-line budget - handles our typical "X dla Y, z
 * których Z" rhythm; falls back to a word-wrap loop otherwise. */
const MAX_LINE_CHARS = 32;

function wrapTagline(text: string): string[] {
  if (text.length <= MAX_LINE_CHARS) {
    return [text];
  }
  const commaIdx = text.indexOf(",");
  if (commaIdx > 0 && commaIdx <= MAX_LINE_CHARS) {
    return [text.slice(0, commaIdx + 1), text.slice(commaIdx + 1).trim()];
  }
  const words = text.split(" ");
  const lines: string[] = [""];
  for (const word of words) {
    const tail = lines.at(-1) ?? "";
    const candidate = tail ? `${tail} ${word}` : word;
    if (candidate.length <= MAX_LINE_CHARS) {
      lines[lines.length - 1] = candidate;
    } else {
      lines.push(word);
    }
  }
  return lines;
}

export async function GET(): Promise<Response> {
  const photoPath = path.resolve("./src/assets/me.jpg");

  /* Round the photo corners via SVG mask + dest-in composite. Mask
   * is a single rounded rect; sharp keeps photo pixels only where
   * the mask has alpha. */
  const photoMask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${PHOTO_SIZE}" height="${PHOTO_SIZE}">
      <rect width="${PHOTO_SIZE}" height="${PHOTO_SIZE}" rx="${PHOTO_RADIUS}" ry="${PHOTO_RADIUS}" fill="#fff" />
    </svg>`
  );

  const photoBuffer = await sharp(photoPath)
    .resize(PHOTO_SIZE, PHOTO_SIZE, { fit: "cover", position: "attention" })
    .composite([{ input: photoMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const name = escapeXml(siteConfig.name);
  const role = escapeXml(siteConfig.role.toUpperCase());
  const taglineLines = wrapTagline(siteConfig.tagline).map((line) =>
    escapeXml(line)
  );
  const url = escapeXml(siteConfig.url.replace(PROTOCOL_RX, ""));

  const taglineSvg = taglineLines
    .map(
      (line, idx) => `<tspan x="640" dy="${idx === 0 ? 0 : 34}">${line}</tspan>`
    )
    .join("");

  /* Background layer: dark substrate + tiled 24px dot grid via SVG
   * pattern. The dot color is rgba on cream so it reads as a faint
   * texture on the dark bg - mirrors v2's signature dot grid. */
  const backgroundLayer = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="${GRID}" />
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="${BG}" />
  <rect width="1200" height="630" fill="url(#dots)" />
</svg>
`.trim();

  /* Photo border overlay - thin rounded stroke in LINE color matching
   * the photo's rounded rect. Inset by 0.5px so the stroke sits on
   * the photo edge cleanly. */
  const photoBorder = `
<svg xmlns="http://www.w3.org/2000/svg" width="${PHOTO_SIZE}" height="${PHOTO_SIZE}">
  <rect x="0.5" y="0.5" width="${PHOTO_SIZE - 1}" height="${PHOTO_SIZE - 1}" rx="${PHOTO_RADIUS}" ry="${PHOTO_RADIUS}" fill="none" stroke="${LINE}" stroke-width="1" />
</svg>
`.trim();

  /* Foreground overlay: text column + brand mark. Position matches
   * v2 typography hierarchy: big display name → eyebrow mono blue →
   * accent line → tagline → url. */
  const overlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <style>
    .display { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; font-weight: 500; fill: ${INK}; letter-spacing: -0.035em; }
    .mono { font-family: ui-monospace, SFMono-Regular, monospace; }
    .role { fill: ${BLUE}; letter-spacing: 0.16em; }
    .tag { fill: ${INK_2}; }
    .url { fill: ${BLUE}; font-weight: 500; }
    .mark-bg { fill: ${BLUE}; }
    .mark-ch { fill: ${ON_BLUE}; font-family: ui-monospace, SFMono-Regular, monospace; font-weight: 600; }
  </style>

  <rect class="mark-bg" x="1132" y="40" width="36" height="36" rx="6" ry="6" />
  <text class="mark-ch" x="1144" y="65" font-size="18">k</text>

  <text class="display" x="640" y="270" font-size="84">${name}</text>
  <text class="mono role" x="640" y="320" font-size="18">${role}</text>

  <line x1="640" y1="368" x2="700" y2="368" stroke="${BLUE}" stroke-width="2" />

  <text class="display tag" x="640" y="430" font-size="26" font-weight="400">${taglineSvg}</text>
  <text class="mono url" x="640" y="560" font-size="22">${url}</text>
</svg>
`.trim();

  const png = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: BG,
    },
  })
    .composite([
      { input: Buffer.from(backgroundLayer), top: 0, left: 0 },
      { input: photoBuffer, top: PHOTO_INSET, left: PHOTO_INSET },
      { input: Buffer.from(photoBorder), top: PHOTO_INSET, left: PHOTO_INSET },
      { input: Buffer.from(overlay), top: 0, left: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
}
