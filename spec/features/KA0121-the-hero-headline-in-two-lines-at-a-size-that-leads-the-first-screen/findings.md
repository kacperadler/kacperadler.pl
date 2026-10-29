# KA0121 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The process section's button widens a 320px page until Geist loads

- Kind: bug
- Found by: 2026-10-29-ka0121-hero-headline-bd4f4424 (worker), 2026-10-29
- Where: `src/components/mb/sections/how-i-work.astro:49-53`
- What: at a 320px viewport with the woff2 fonts blocked (the fallback face a visitor sees before Geist loads), the home page scrolls sideways: the white layer of "Umów bezpłatną rozmowę" under the process steps ends at x=335 (a throwaway Playwright probe listing every leaf element whose right edge passes 320px; the same with this ticket's hero reverted to `HEAD`, so it is not caused by it). `a11y.spec.ts` "no page scrolls sideways ... with a fallback font" runs only at 360 and 1440, so it does not see it.
- Suggestion: let that button take the column's width and wrap its label on a narrow screen, as the hero's buttons do at 880px and below (`width: 100%`, `white-space: normal`), and add 320 to the fallback-font widths in `a11y.spec.ts`. A metric-matched fallback `@font-face` (`size-adjust`) for Geist would shrink the gap for every headline and button, but changes every page's fallback layout and is a larger call.
- Status: open
