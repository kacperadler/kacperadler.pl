# KA0103 - Findings

## F1. The visibilitychange listener stays attached after the paint observer starts the entrance

- Kind: note
- Found by: 2026-10-28-review-ka0103-3fad62f8 (review), 2026-10-28
- Where: `src/components/base-head.astro`
- What: a later visibility change calls afterFrames() again; the write is idempotent.
- Status: dropped (harmless, no visible effect)

## F2. The hidden-before-paint fallback test cannot prove real background-tab rAF throttling headless

- Kind: note
- Found by: 2026-10-28-review-ka0103-3fad62f8 (review), 2026-10-28
- Where: `tests/e2e/blueprint.spec.ts`
- What: acknowledged limit of headless Chrome.
- Status: dropped (no way to test it in CI)

## F3. Commit scope is the ticket id, not a component

- Kind: note
- Found by: 2026-10-28-review-ka0103-3fad62f8 (review), 2026-10-28
- Where: branch commits
- What: style deviation from the review guide's example.
- Status: dropped (ticket-id scope is the convention here)
