# KA0073 - Outcome

- Merged: 2026-10-14, `4f06881`
- Branch: h/2026-10-14-ka0073-og-image-76a0a62a
- Reviews: review-1.md PASS, review-2.md PASS
- Cost: worker $6.32, reviews $1.05; review rounds 2

## What went in

- `src/pages/og-default.png.ts`: the share image (still `/og-default.png`, 1200×630) is a minimal brutalism sheet: solid `base`, a 1px `ink` frame of two cells, the photo square on the left, on the right the square brand mark, the role label, the name in Geist ExtraBold, the tagline in Geist and the url; mono labels stay DejaVu Sans Mono. Geist is registered for the renderer by a one-letter warm-up render from the TTF.
- `src/assets/fonts/Geist-Variable.ttf` and `OFL.txt`: the font for the renderer and its licence.
- `public/favicon.svg`, `public/favicon.ico` (16, 32, 48 px): the square brand mark like `brand.astro`, the `k` as a shape so no font is needed.
- `tests/e2e/og-image.spec.ts`, `favicon.spec.ts`: the headline is set in Geist (fails on the DejaVu fallback); the favicon draws the square mark.
- `Dockerfile`, `DESIGN.md`, `AGENTS.md`: why DejaVu stays, the new mark and font, the new specs.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none open; no ticket made.
