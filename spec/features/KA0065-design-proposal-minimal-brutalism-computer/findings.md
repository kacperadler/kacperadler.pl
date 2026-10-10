# KA0065 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The catalogue scrolls sideways on a 360px phone, under every proposal and on /ui

- Kind: bug
- Found by: 2026-10-10-proposal-mb-computer-45b066a9 (worker), 2026-10-10
- Where: `src/pages/_ui/catalogue.astro` (`.ui-grid-wide`, `grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))`)
- What: at a 360px viewport `document.documentElement.scrollWidth` is 369 on `/ui/proposal/baseline`, `/ui/proposal/computer`, `/ui/proposal/minimal-brutalism` and `/ui/proposal/minimal-brutalism-computer`. The elements past the right edge are the form samples (`.ui-sample`, `.field`, `.v2-input`) in the 320px-minimum columns of `.ui-grid-wide`, inside the 32px padding of `.ui-form-surface` and the 16px of `.container`. The page scrolls sideways by 9px, so a proposal can't be judged on a small phone without that scroll. Measured with a throwaway Playwright script listing the elements whose right edge passes `innerWidth`.
- Suggestion: cap the column minimum at the available width, `minmax(min(100%, 320px), 1fr)`, the way the minimal brutalism proposal does for `.exp-list`. The catalogue's content and states stay as they are.
- Status: open
