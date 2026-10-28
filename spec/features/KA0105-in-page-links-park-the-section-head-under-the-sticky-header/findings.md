# KA0105 - Findings

## F1. Header height between 343 and 359px wide

- Kind: note
- Found by: 2026-10-28-review-ka0105-good-css-t-175a8e73 (review), 2026-10-28
- Where: `src/styles/tokens.css` (`--mb-header`)
- What: the forced two-row header starts below 360px, the natural wrap at 342px; between them the stored height may be off by a row.
- Status: dropped (no common phone has that width)

## F2. Two mutations the tests do not catch

- Kind: note
- Found by: 2026-10-28-review-ka0105-good-css-t-175a8e73 (review), 2026-10-28
- Where: `.mb-header` min-height, the sheet's `overscroll-behavior: contain`
- What: disclosed by the worker with reasons.
- Status: dropped (no visible effect a test can pin)
