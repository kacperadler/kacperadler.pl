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

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: improvement

Evidence:
- `src/pages/og-default.png.ts:6-7,79,109,122,141`
- Found by: 2026-10-10-landing-in-mb-d0b2016c (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: redraw it in the new vocabulary - solid `base`, the photo in a square 1px ink frame, the square brand mark, heavy Geist-like headline - keeping 1200×630 and the path; check with `docker build -t kacperadler-pl-test .` as AGENTS.md requires for this file.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- redraw it in the new vocabulary - solid `base`, the photo in a square 1px ink frame, the square brand mark, heavy Geist-like headline - keeping 1200×630 and the path; check with `docker build -t kacperadler-pl-test .` as AGENTS.md requires for this file.

## Decisions

- 2026-10-10: Source: F1 of KA0069
