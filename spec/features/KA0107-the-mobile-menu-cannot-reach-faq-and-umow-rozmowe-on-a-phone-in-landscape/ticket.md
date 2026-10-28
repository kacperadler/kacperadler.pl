# KA0107 - The mobile menu cannot reach FAQ and "Umów rozmowę" on a phone in landscape

```json
{
  "id": "KA0107",
  "title": "The mobile menu cannot reach FAQ and \"Umów rozmowę\" on a phone in landscape",
  "date": "2026-10-28",
  "after": [
    "KA0105"
  ]
}
```

## Description

good-css "Scroll area between a fixed header and footer" (`scroll-and-viewport.md`). The sheet is `position: fixed; inset: 0` with overflowing content and the page behind it is locked, so its overflow is unreachable. Measured with the sheet open and a 600px wheel scroll over it: at 844x390 FAQ and the CTA stay off-screen (content 128px taller than the sheet); at 667x375 "O mnie", FAQ and the CTA (143px). With `overflow-y: auto; overscroll-behavior: contain` on `.mb-sheet` every link and the CTA scroll into view (`screenshots/p3-sheet-844x390-{before,after}.png`). Portrait 390x844 does not overflow and keeps its layout (`p3-sheet-390x844-*`; 4001 of 1.3M pixels differ, all inside the label text, [INFERENCE] antialiasing of a scroll container). No 1440 shot: the sheet and its trigger exist only at 880px and below.

## Goal

On a phone held sideways every link in the open mobile menu, including FAQ and Umów rozmowę, can be reached.

- Kind: bug

Evidence:
- `src/components/mb/mobile-sheet.astro:79-94` (fixed sheet, no `overflow-y`); `src/scripts/mobile-sheet.ts:61-62` (body scroll locked)
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: those two declarations on `.mb-sheet`. The close button is `position: absolute` in the sheet (`mobile-sheet.astro:115-119`), so it scrolls away with the content; make it sticky, or keep it and rely on Esc and the links, as the ticket decides. Cost: 2-4 lines, a `mobile-sheet.spec.ts` case at 844x390 that scrolls the sheet and clicks the CTA.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- those two declarations on `.mb-sheet`. The close button is `position: absolute` in the sheet (`mobile-sheet.astro:115-119`), so it scrolls away with the content; make it sticky, or keep it and rely on Esc and the links, as the ticket decides. Cost: 2-4 lines, a `mobile-sheet.spec.ts` case at 844x390 that scrolls the sheet and clicks the CTA.

## Decisions

- 2026-10-28: Source: F3 of KA0104
- 2026-10-28: Carried by KA0105, approved together with it.
- 2026-10-28: The human dropped it: carried and merged by KA0105.
