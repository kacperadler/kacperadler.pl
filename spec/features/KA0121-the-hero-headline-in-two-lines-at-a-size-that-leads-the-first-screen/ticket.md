# KA0121 - The hero headline in two lines at a size that leads the first screen

```json
{
  "id": "KA0121",
  "title": "The hero headline in two lines at a size that leads the first screen",
  "date": "2026-10-28",
  "after": [
    "KA0123"
  ]
}
```

## Description

Taste Skill house rule "Headlines: two lines or fewer, at every width" and the laws "Two or three sizes do the visible work: one very large" (largest type: median 8.4vw on top sites, 5.0vw on weak ones) and "One dominant thing per screen" (`critique.md` pass 2). `inspect.mjs`: the h1 is 64px (4.4vw), four lines at 1440, `focal-point` FAIL ("the first screen has no dominant element"); the section h2s are 54px, so the hero barely outranks them (`type.md` §8). Throwaway at 1440: the h1 spans the full width above the two columns (subtitle and buttons left, the card right), `clamp(40px, 5.6vw, 84px)`; the card's rows set figure beside text so it is shorter; the subtitle 21px. Measured after: two lines, 80.6px (5.6vw), `focal-point` and the 1440 `headline-lines` FAILs gone; the hero buttons still sit on the card button's line, and the trust bar's caption moves into the first screen (`screenshots/p1-hero-1440-{before,after}.png`). At 390 the throwaway raises the h1 from 40 to 46px: still four lines (`p1-hero-390-{before,after}.png`); two lines on a phone need a headline of about 32 characters, and today's is 57.

## Goal

The first screen has one dominant element: the headline, larger and in two lines on a wide screen, so a visitor sees at once what Kacper does.

- Kind: improvement

Evidence:
- hero (#top), `src/components/mb/sections/hero.astro:166-177` (h1: `clamp(40px, 5.2vw, 64px)`, `max-width: 22ch`), `:115-122` (two-column grid), `:158-164` (text column padded to the card's caption line), `:289-321` (the card's rows)
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: the desktop rearrangement above, the phone at about 46px. Visitor sees: the headline as the one big thing on the first screen, set in two lines across the sheet, the figures and the buttons under it. Cost: about 50 lines of CSS in `hero.astro`, updating `blueprint.spec.ts:492-496` (headline level with the card's caption) and `home.spec.ts:516` ("the hero's text, buttons, card rows and figures sit on one grid"); the entrance moves the same elements (transform only), [INFERENCE] unchanged, to be checked in a recording. Approved decision: touches KA0075's hero layout (2026-10-26, "align everything neatly"; AGENTS.md: the headline on the card's caption line, the buttons on the card button's line - the second still holds); the copy stays. A shorter headline that fits two lines on a phone would touch KA0075's chosen H1 (2026-10-26) and is the human's call, not proposed here.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- the desktop rearrangement above, the phone at about 46px. Visitor sees: the headline as the one big thing on the first screen, set in two lines across the sheet, the figures and the buttons under it. Cost: about 50 lines of CSS in `hero.astro`, updating `blueprint.spec.ts:492-496` (headline level with the card's caption) and `home.spec.ts:516` ("the hero's text, buttons, card rows and figures sit on one grid"); the entrance moves the same elements (transform only), [INFERENCE] unchanged, to be checked in a recording. Approved decision: touches KA0075's hero layout (2026-10-26, "align everything neatly"; AGENTS.md: the headline on the card's caption line, the buttons on the card button's line - the second still holds); the copy stays. A shorter headline that fits two lines on a phone would touch KA0075's chosen H1 (2026-10-26) and is the human's call, not proposed here.

## Decisions

- 2026-10-28: Source: F1 of KA0118
- 2026-10-28: The human approved it (took the coordinator's recommendation).
