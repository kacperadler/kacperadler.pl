# KA0141 - The experience list's logos stay grey on a phone

```json
{
  "id": "KA0141",
  "title": "The experience list's logos stay grey on a phone",
  "date": "2026-10-29"
}
```

## Description

the "Pełne doświadczenie" accordion in `#about` greys its logos the same way the trust bar and the cases did before KA0127 (`opacity: 0.6; filter: grayscale(100%)` at rest, colour only on `:hover` under `(hover: hover) and (pointer: fine)`), so on a phone a visitor never sees ReX, LeadBuster and the rest in their colours there. KA0127's approved decision covers only the trust bar and the cases. Reproduce: open `/` on a 390px touch viewport, open the accordion; every logo is grey.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: improvement

Evidence:
- `src/components/mb/sections/about.astro:236-257` (`.mb-exp-logo`)
- Found by: 2026-10-29-ka0127-logos-4b88a47a (worker), 2026-10-29

## Done means

- The fix, with a test that proves it: move the grey rest state of `.mb-exp-logo` into the existing `@media (hover: hover) and (pointer: fine)` block, as KA0127 did in `trust.astro` and `cases.astro`, add `.mb-exp-logo` to `LOGOS` in `tests/e2e/touch-hover.spec.ts`, and widen the sentence in `DESIGN.md` (Motion) and `AGENTS.md` ("Hover tylko pod myszą") to the experience list.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- move the grey rest state of `.mb-exp-logo` into the existing `@media (hover: hover) and (pointer: fine)` block, as KA0127 did in `trust.astro` and `cases.astro`, add `.mb-exp-logo` to `LOGOS` in `tests/e2e/touch-hover.spec.ts`, and widen the sentence in `DESIGN.md` (Motion) and `AGENTS.md` ("Hover tylko pod myszą") to the experience list.

## Decisions

- 2026-10-29: Source: F1 of KA0127
- 2026-10-29: Dropped: the human wants the About logos to stay grey on phones.
