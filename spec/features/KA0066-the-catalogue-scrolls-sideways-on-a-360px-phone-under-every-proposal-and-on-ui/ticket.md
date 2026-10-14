# KA0066 - The catalogue scrolls sideways on a 360px phone, under every proposal and on /ui

```json
{
  "id": "KA0066",
  "title": "The catalogue scrolls sideways on a 360px phone, under every proposal and on /ui",
  "date": "2026-10-10",
  "after": [
    "KA0067"
  ]
}
```

## Description

at a 360px viewport `document.documentElement.scrollWidth` is 369 on `/ui/proposal/baseline`, `/ui/proposal/computer`, `/ui/proposal/minimal-brutalism` and `/ui/proposal/minimal-brutalism-computer`. The elements past the right edge are the form samples (`.ui-sample`, `.field`, `.v2-input`) in the 320px-minimum columns of `.ui-grid-wide`, inside the 32px padding of `.ui-form-surface` and the 16px of `.container`. The page scrolls sideways by 9px, so a proposal can't be judged on a small phone without that scroll. Measured with a throwaway Playwright script listing the elements whose right edge passes `innerWidth`.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: bug

Evidence:
- `src/pages/_ui/catalogue.astro` (`.ui-grid-wide`, `grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))`)
- Found by: 2026-10-10-proposal-mb-computer-45b066a9 (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: cap the column minimum at the available width, `minmax(min(100%, 320px), 1fr)`, the way the minimal brutalism proposal does for `.exp-list`. The catalogue's content and states stay as they are.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- cap the column minimum at the available width, `minmax(min(100%, 320px), 1fr)`, the way the minimal brutalism proposal does for `.exp-list`. The catalogue's content and states stay as they are.

## Decisions

- 2026-10-10: Source: F1 of KA0065
- 2026-10-10: After KA0067: the catalogue fix applies to what is left.
- 2026-10-10: Also F3 of KA0069: the 360px test on the dev catalogue is flaky (368px once).
- 2026-10-14: The human approved it; the coordinator found it already done in main: .mb-ui-grid-wide uses minmax(min(100%, 320px), 1fr) (src/pages/_ui/catalogue.astro:1557, since KA0069 3aefdd3); KA0085 covers the 360px test. Dropped as already fixed.
