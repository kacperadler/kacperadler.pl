# KA0073 - The OG image still draws the old design

```json
{
  "id": "KA0073",
  "title": "The OG image still draws the old design",
  "date": "2026-10-10"
}
```

## Description

the share image is built in the old vocabulary: a dot grid (`GRID`, the `<circle>` pattern), the photo in a rounded panel (`rx`/`ry` = `PHOTO_RADIUS`) and a rounded brand mark (`rx="6"`). Every page now renders minimal brutalism (square cells in ink rules on a solid substrate), so a shared link previews a design the site no longer has. KA0069 left it alone: its Done means keeps SEO output as it is (`og-default.png` is byte-identical to the build before the switch).

## Goal

A shared link (LinkedIn, Messenger, Slack) shows a preview image in the same minimal brutalism style as the site, not the old rounded, dot-grid design. The image is a screenshot in the ticket folder for the human to accept.

- Kind: improvement

Evidence:
- `src/pages/og-default.png.ts:6-7,79,109,122,141`
- Found by: 2026-10-10-landing-in-mb-d0b2016c (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: redraw it in the new vocabulary - solid `base`, the photo in a square 1px ink frame, the square brand mark, heavy Geist-like headline - keeping 1200×630 and the path; check with `docker build -t kacperadler-pl-test .` as AGENTS.md requires for this file.
- The headline is real Geist: a TTF (or OTF) copy of the site's Geist added to the repo for the image renderer, licence file included (Geist is OFL); the screenshot shows it.
- The favicon (`public/favicon.svg`, and `public/favicon.ico` regenerated from it, plus any other icon the layout links) draws the square mark like `src/components/mb/brand.astro`: `blue` block, 1px `ink` rule, heavy `k` in `base`; `DESIGN.md` records the change; screenshot of the favicon at 32px and 180px in the ticket folder.
- A screenshot of the new image (1200×630) in the ticket folder, sent to the human.
- `bun run check` and `bun run test` pass.

## Scope

In:
- redraw it in the new vocabulary - solid `base`, the photo in a square 1px ink frame, the square brand mark, heavy Geist-like headline - keeping 1200×630 and the path; check with `docker build -t kacperadler-pl-test .` as AGENTS.md requires for this file.

## Decisions

- 2026-10-10: Source: F1 of KA0069
- 2026-10-14: The human approved the ticket.
- 2026-10-14: The human: use real Geist in the OG image (add the font to the repo), and redraw the favicon in this same ticket (F1 of the branch).
- 2026-10-14: The human accepted the OG image and favicon as sent; mono labels stay DejaVu Mono (no Geist Mono).
