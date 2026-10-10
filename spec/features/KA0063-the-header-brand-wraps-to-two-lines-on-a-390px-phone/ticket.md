# KA0063 - The header brand wraps to two lines on a 390px phone

```json
{
  "id": "KA0063",
  "title": "The header brand wraps to two lines on a 390px phone",
  "date": "2026-10-10"
}
```

## Description

at 390px the brand, the "Porozmawiajmy" CTA and the menu button do not fit one row, so "Kacper" and "Adler" break onto two lines; `.nav .brand` measures 46.5px tall on both `/ui/proposal/baseline` and `/ui/proposal/professional` (one line would be about 28px).

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: improvement

Evidence:
- `src/components/layout/nav.astro` (`.brand`, `.nav-tail`)
- Found by: 2026-10-10-proposal-professional-943bf522 (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: keep the brand on one line (`white-space: nowrap`) and give the room elsewhere on narrow screens, for example a smaller CTA padding or the CTA only in the mobile sheet below a breakpoint. Out: the brand mark itself.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- keep the brand on one line (`white-space: nowrap`) and give the room elsewhere on narrow screens, for example a smaller CTA padding or the CTA only in the mobile sheet below a breakpoint. Out: the brand mark itself.

## Decisions

- 2026-10-10: Source: F2 of KA0043
