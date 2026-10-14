import path from "node:path";
import sharp from "sharp";
import { siteConfig } from "@/data/site-config";

/* Build-time OG image (1200×630) in the site's minimal brutalism: a
 * ruled sheet of two cells on the solid `base` substrate, drawn with 1px
 * `ink` rules that share their edges. The left cell is the photo, square,
 * filling its frame; the right one reads as a ruled table: the square
 * brand mark and the role label, the heavy headline (the name), the
 * tagline, the url.
 *
 * The sans text (mark, headline, tagline) is the site's Geist. librsvg
 * (sharp's SVG renderer) reads fonts only through fontconfig, which
 * cannot load the site's woff2, so a TTF of variable Geist (npm `geist`
 * 1.7.2) sits in src/assets/fonts (OFL, licence beside it) and is
 * registered with fontconfig before the SVG renders. The mono labels stay
 * on the installed monospace (DejaVu Sans Mono in the Docker build stage).
 *
 * Astro builds this once at `bun run build` and writes to
 * dist/og-default.png. siteConfig.ogImage points at /og-default.png. */

export const prerender = true;

const GEIST_TTF = path.resolve("./src/assets/fonts/Geist-Variable.ttf");

/* Palette from tokens.css (DESIGN.md); the site is dark-only. */
const BASE = "#0a0c10";
const INK = "#ece7dc";
const INK_2 = "#c8c3b8";
const BLUE = "#8eaed8";

const WIDTH = 1200;
const HEIGHT = 630;

/* The sheet: inset on the substrate, the photo cell a square of the
 * sheet's height, the text cell the rest. Rules are 1px on whole pixels
 * (`crispEdges`), so the corners stay square at any scale. */
const INSET = 45;
const PHOTO_SIZE = HEIGHT - 2 * INSET;
const SHEET_RIGHT = WIDTH - INSET;
const SHEET_BOTTOM = HEIGHT - INSET;
const SPLIT = INSET + PHOTO_SIZE;
const PAD = 40;
const TEXT_X = SPLIT + PAD;

/* Rows of the text cell: identity (mark, label, headline), tagline, url. */
const MARK_SIZE = 36;
const MARK_Y = INSET + PAD;
const TAGLINE_RULE_Y = 385;
const URL_RULE_Y = 525;

const PROTOCOL_RX = /^https?:\/\//;

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/* Wrap a tagline to the text cell at 24px: break after its first comma
 * (our "X dla Y, z których Z" rhythm), then word-wrap each clause to the
 * per-line budget (about 12px a character, 490px of cell). */
const MAX_LINE_CHARS = 40;
const TAGLINE_LEADING = 32;
const TAGLINE_CAP = 17;

function wrapWords(text: string): string[] {
  const lines: string[] = [""];
  for (const word of text.split(" ")) {
    const tail = lines.at(-1) ?? "";
    const candidate = tail ? `${tail} ${word}` : word;
    if (!tail || candidate.length <= MAX_LINE_CHARS) {
      lines[lines.length - 1] = candidate;
    } else {
      lines.push(word);
    }
  }
  return lines;
}

function wrapTagline(text: string): string[] {
  const commaIdx = text.indexOf(",");
  if (commaIdx <= 0) {
    return wrapWords(text);
  }
  return [
    ...wrapWords(text.slice(0, commaIdx + 1)),
    ...wrapWords(text.slice(commaIdx + 1).trim()),
  ];
}

/* A 1px rule on whole pixels: a 1px-wide rect, not a stroked line. */
function rule(x: number, y: number, width: number, height: number): string {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${INK}" />`;
}

export async function GET(): Promise<Response> {
  const photoPath = path.resolve("./src/assets/me.jpg");

  /* sharp's text input loads `fontfile` into this process's fontconfig
   * set; rendering one glyph with it is what makes "Geist" resolvable for
   * librsvg in the overlay below. */
  await sharp({ text: { fontfile: GEIST_TTF, text: "k" } }).toBuffer();

  const photoBuffer = await sharp(photoPath)
    .resize(PHOTO_SIZE, PHOTO_SIZE, { fit: "cover", position: "attention" })
    .png()
    .toBuffer();

  const [first, ...rest] = siteConfig.name.split(" ");
  const nameLines = [first ?? "", rest.join(" ")].map(escapeXml);
  const role = escapeXml(siteConfig.role.toUpperCase());
  const taglineLines = wrapTagline(siteConfig.tagline);
  const taglineSvg = taglineLines
    .map(
      (line, idx) =>
        `<tspan x="${TEXT_X}" dy="${idx === 0 ? 0 : TAGLINE_LEADING}">${escapeXml(line)}</tspan>`
    )
    .join("");
  /* First baseline that centres the lines, cap height to last baseline,
   * in the row between the two rules. */
  const taglineBlock =
    TAGLINE_CAP + (taglineLines.length - 1) * TAGLINE_LEADING;
  const taglineY = Math.round(
    TAGLINE_RULE_Y +
      (URL_RULE_Y - TAGLINE_RULE_Y - taglineBlock) / 2 +
      TAGLINE_CAP
  );
  const url = escapeXml(siteConfig.url.replace(PROTOCOL_RX, ""));

  /* Over the photo: the sheet's outer rule, the rule the two cells share
   * and the row rules of the text cell. */
  const overlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" shape-rendering="crispEdges">
  <style>
    .display { font-family: Geist, sans-serif; font-weight: 800; fill: ${INK}; letter-spacing: -0.045em; }
    .mono { font-family: monospace; font-weight: 500; }
    .label { fill: ${INK_2}; letter-spacing: 0.14em; }
    .tag { font-family: Geist, sans-serif; fill: ${INK_2}; }
    .url { fill: ${BLUE}; }
    .mark-ch { font-family: Geist, sans-serif; font-weight: 800; fill: ${BASE}; }
  </style>

  ${rule(INSET, INSET, SHEET_RIGHT - INSET, 1)}
  ${rule(INSET, SHEET_BOTTOM - 1, SHEET_RIGHT - INSET, 1)}
  ${rule(INSET, INSET, 1, SHEET_BOTTOM - INSET)}
  ${rule(SHEET_RIGHT - 1, INSET, 1, SHEET_BOTTOM - INSET)}
  ${rule(SPLIT, INSET, 1, SHEET_BOTTOM - INSET)}
  ${rule(SPLIT, TAGLINE_RULE_Y, SHEET_RIGHT - SPLIT, 1)}
  ${rule(SPLIT, URL_RULE_Y, SHEET_RIGHT - SPLIT, 1)}

  <rect x="${TEXT_X}" y="${MARK_Y}" width="${MARK_SIZE}" height="${MARK_SIZE}" fill="${INK}" />
  <rect x="${TEXT_X + 1}" y="${MARK_Y + 1}" width="${MARK_SIZE - 2}" height="${MARK_SIZE - 2}" fill="${BLUE}" />
  <text class="mark-ch" x="${TEXT_X + MARK_SIZE / 2}" y="${MARK_Y + 26}" font-size="22" text-anchor="middle">k</text>
  <text class="mono label" x="${TEXT_X + MARK_SIZE + 16}" y="${MARK_Y + 24}" font-size="16">${role}</text>

  <text class="display" x="${TEXT_X}" y="240" font-size="96">${nameLines[0]}</text>
  <text class="display" x="${TEXT_X}" y="336" font-size="96">${nameLines[1]}</text>

  <text class="tag" x="${TEXT_X}" y="${taglineY}" font-size="24">${taglineSvg}</text>
  <text class="mono url" x="${TEXT_X}" y="${URL_RULE_Y + 38}" font-size="20">${url}</text>
</svg>
`.trim();

  const png = await sharp({
    create: {
      background: BASE,
      channels: 4,
      height: HEIGHT,
      width: WIDTH,
    },
  })
    .composite([
      { input: photoBuffer, left: INSET, top: INSET },
      { input: Buffer.from(overlay), left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
}
