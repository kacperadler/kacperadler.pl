# KA0113 - Findings

## F1. Below 340px the 12vw cap makes the hero headline slightly smaller than its 40px floor

- Kind: note
- Found by: 2026-10-28-review-ka0113-fluid-rhyt-6ba55197 (review), 2026-10-28
- Where: `src/components/mb/sections/hero.astro:173`
- What: 38.4px at 320px instead of 40px; smaller, never overflowing.
- Status: dropped (about 4% on rare widths, no visible harm)

## F2. The ticket's 404 clamp is already covered by section-head

- Kind: note
- Found by: 2026-10-28-review-ka0113-fluid-rhyt-6ba55197 (review), 2026-10-28
- Where: `src/pages/404.astro`
- What: the 404 heading renders through SectionHead since KA0102.
- Status: dropped (nothing to do)

