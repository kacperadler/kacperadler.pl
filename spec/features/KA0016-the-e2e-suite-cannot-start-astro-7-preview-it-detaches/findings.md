
## F1. contact-form.spec.ts:173 failed once in a parallel run

- Kind: risk
- Found by: 2026-10-10-review-e2e-preview-stays-de4a76ea (review), 2026-10-10
- Where: `tests/e2e/contact-form.spec.ts:173`
- What: one failure with 4 workers and no `CI`; three reruns under the same conditions passed.
- Suggestion: find why it can fail (timing on the form state machine) and make it deterministic.
- Status: ticket KA0022
