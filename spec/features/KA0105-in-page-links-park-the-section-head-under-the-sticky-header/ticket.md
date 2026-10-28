# KA0105 - In-page links park the section head under the sticky header

```json
{
  "id": "KA0105",
  "title": "In-page links park the section head under the sticky header",
  "date": "2026-10-28"
}
```

## Description

good-css "Anchor targets that clear a sticky header" (`scroll-and-viewport.md`). Every nav link (`Oferta`, `Realizacje`, `Proces`, `O mnie`, `FAQ`, `Umów rozmowę`) scrolls its section's top edge to y=0, under the 71px (1440) / 65px (390) header. Measured on `/#cases`: the section's "§ … / Realizacje" label sits at y=25 and the dimension line above it is hidden at both widths; at 390 the h2 starts at y=60, so its top 5px are cut by the header (`screenshots/p1-anchor-cases-390-before.png`). Same numbers for `#services`, `#faq`, `#contact`. With `scroll-padding-block-start: 72px` the section lands at y=72: dimension line, label and headline all show (`p1-anchor-cases-{1440,390}-after.png`).

## Goal

A menu link lands the section with its § label and heading visible below the sticky header, at every width. Also carries KA0106 and KA0107 (one small CSS change, approved together): Paragraphs end without a lone word on the last line, on desktop and on a phone. On a phone held sideways every link in the open mobile menu, including FAQ and Umów rozmowę, can be reached.

- Kind: bug

Evidence:
- `src/styles/global.css:9-11` (the `html` rule, no scroll padding); `src/components/mb/header.astro:56-62` (the sticky header)
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: one declaration on `html`, `scroll-padding-block-start`, outside the motion query. Tie it to the header: it measured 65px at 360 and 390 but wraps to 105px at 320, so a fixed 72px undershoots on the narrowest phones; give the header a height token (or a per-breakpoint value) and read it in both places. Cost: 2-5 lines in `global.css` / `tokens.css` + `header.astro`, a `nav-active.spec.ts` or `home.spec.ts` assertion that the target's head is below the header. Out: nav-active's IntersectionObserver margins (`nav-active.ts:117`), unchanged.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- one declaration on `html`, `scroll-padding-block-start`, outside the motion query. Tie it to the header: it measured 65px at 360 and 390 but wraps to 105px at 320, so a fixed 72px undershoots on the narrowest phones; give the header a height token (or a per-breakpoint value) and read it in both places. Cost: 2-5 lines in `global.css` / `tokens.css` + `header.astro`, a `nav-active.spec.ts` or `home.spec.ts` assertion that the target's head is below the header. Out: nav-active's IntersectionObserver margins (`nav-active.ts:117`), unchanged.

## Decisions

- 2026-10-28: Source: F1 of KA0104
- 2026-10-28: The human approved KA0104's top three proposals (F1-F3) as one fix; this ticket carries F2 (KA0106) and F3 (KA0107) too: read their tickets for evidence and Done means. Before/after screenshots of all three.
