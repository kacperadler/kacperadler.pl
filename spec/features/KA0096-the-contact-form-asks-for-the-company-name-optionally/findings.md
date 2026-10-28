# KA0096 - Findings

## F1. dev-no-reload.spec.ts flaked once on the full run

- Kind: note
- Found by: 2026-10-28-review-ka0096-company-fi-9fe6ffc7 (review), 2026-10-28
- Where: `tests/e2e/dev-no-reload.spec.ts:16`
- What: "Execution context was destroyed", passed on retry; not this branch.
- Status: dropped (KA0099 carries this flake)

## F2. "(opcjonalnie)" renders uppercase like every form label

- Kind: note
- Found by: 2026-10-28-review-ka0096-company-fi-9fe6ffc7 (review), 2026-10-28
- Where: `.mb-field-optional` under `.mb-label`
- What: inherits text-transform: uppercase.
- Status: dropped (the labels' convention; smaller and dimmer as asked)

