# Findings

## F1. Removing sendALead's wait fails only 1 in 10 runs

- Kind: note
- Found by: 2026-10-29-review-ka0132-networkidl-6c1b736c (review), 2026-10-29
- Where: `tests/e2e/send-a-lead.ts`
- What: the race the wait closes is narrow at the stub's speed, so a mutation removing it is caught only sometimes.
- Status: dropped, the shipped code keeps the wait and the worker disclosed the limit; a slowed stub only for this test is not worth it.

## F2. /ui specs still wait for networkidle

- Kind: note
- Found by: 2026-10-29-review-ka0132-networkidl-6c1b736c (review), 2026-10-29
- Where: `tests/e2e/ui-catalogue.spec.ts`
- What: five networkidle waits remain on the dev-only /ui page.
- Status: dropped, /ui runs on the dev server and never loads Umami, so it cannot hang on it.
