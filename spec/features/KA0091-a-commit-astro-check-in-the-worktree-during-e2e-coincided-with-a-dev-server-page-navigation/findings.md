# Findings

## F1. Review notes: the template's structure-test line, and a fix wider than the ticket's example

- Kind: note
- Found by: 2026-10-14-review-ka0091-dev-reload-50ec974a (review notes), 2026-10-14
- Where: ticket template's Done means; `astro.config.mjs`
- What: this repository has no structure test, though every ticket's Done means names one; the fix ignores every path, wider than the ticket's example, because any source write reloads the page.
- Status: dropped (the wider fix meets the Goal; KA tickets name `bun run check` and `bun run test` from now on)
