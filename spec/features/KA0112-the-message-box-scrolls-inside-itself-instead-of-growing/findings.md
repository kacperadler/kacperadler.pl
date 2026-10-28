# KA0112 - Findings

## F1. After a long message the success card is a tall, mostly empty box

- Kind: improvement
- Found by: coordinator, from desktop-4-success.png and review da1c6a33, 2026-10-28
- Where: `src/components/mb/sections/contact` form and success card sharing one grid cell
- What: a grown message box makes the sheet taller, and the success card fills that height with its small content centred in empty space.
- Suggestion: on success the sheet returns to the empty form's height (or the card keeps its natural height), without a layout jump that moves the page.
- Status: open

## F2. The fallback for browsers without field-sizing has no automated test

- Kind: note
- Found by: 2026-10-28-review-ka0112-textarea-g-da1c6a33 (review), 2026-10-28
- Where: `src/components/mb/textarea.astro`
- What: CI runs only Chromium, which supports the property.
- Status: dropped (no browser in CI lacks it; the fallback is today's box)
