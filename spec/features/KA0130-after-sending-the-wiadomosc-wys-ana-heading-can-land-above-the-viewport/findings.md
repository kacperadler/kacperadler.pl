# KA0130 - Findings

## F1. The success card's null guard is untested

- Kind: note
- Found by: 2026-10-28-review-ka0130-success-in-84902ed7 (review), 2026-10-28
- Where: `src/scripts/contact-form.ts` (`revealSuccess`)
- What: `if (!(card && heading)) return` guards markup that is always rendered.
- Status: dropped (a tautology test would pin nothing)

