# KA0086 - Findings

## F1. Per-component reduced-motion `transition: none` blocks are now redundant

- Kind: cleanup
- Found by: 2026-10-14-review-ka0086-reduced-mo-a890c6ee (review 1 note), 2026-10-14
- Where: e.g. `src/components/mb/card.astro`, `input.astro`
- What: the global `* { transition-property: none !important }` under reduced motion covers them, except pseudo-elements `*` does not reach (e.g. `::details-content`).
- Status: dropped (harmless duplication; the ticket allowed keeping them, and removing them risks the pseudo-element cases)
