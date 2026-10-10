# KA0068 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. Under reduced motion the mobile sheet opens without focus on its close button

- Kind: bug
- Found by: 2026-10-10-mb-components-394266f9 (worker), 2026-10-10
- Where: `src/styles/global.css:92-100`, `src/components/layout/mobile-sheet.astro:63-90`
- What: with `prefers-reduced-motion: reduce`, opening the menu on the home page at 360px leaves focus on `<body>` instead of the "Zamknij menu" button; the sheet itself is visible and Tab then wraps inside it. Cause: global.css sets `transition-duration: 0.01ms !important` on every element, and an element with no `transition` of its own has `transition-property: all`, so the sheet's children fade their inherited `visibility` in over 0.01ms and are still `hidden` at the moment `scripts/mobile-sheet.ts` calls `focus()`. Reproduced with Playwright (`reducedMotion: "reduce"`, viewport 360x800, `/` on `bun dev`, click `[data-menu-open]`, read `document.activeElement`): `<body>`; without reduced motion it is the close button. `tests/e2e/mobile-sheet.spec.ts` runs without reduced motion, so it does not see it.
- Suggestion: in the reduced-motion block of `layout/mobile-sheet.astro`, set `transition-property: none` on `.sheet :global(*)` as `mb/mobile-sheet.astro` does (KA0068), and run the focus assertions of `mobile-sheet.spec.ts` under `reducedMotion: "reduce"` too. KA0069 replaces the sheet with the mb one, so this can also be dropped if KA0069 lands first.
- Status: ticket KA0070
