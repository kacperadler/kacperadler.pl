# KA0117 - Review 1

- Job: 2026-10-28-review-ka0117-derived-co-65207487
- Branch: h/2026-10-28-ka0117-derived-colours-4daffb81
- Commit reviewed: b63f05e05d00152ba6c0158129830e8864c7b2af
- Verdict: PASS

## Final message

No em-dash. All checks pass, scope matches ticket exactly (2-line fix + DESIGN.md + test), destructive mixes left untouched as decided, no scope creep, no Dockerfile/nginx/og-image touch.

Checks run:
- `bun run lint`: clean, no fixes.
- `bun run check`: 0 errors/warnings/hints.
- `bun run build`: succeeds.
- `bun run test:e2e` (full suite, clean working tree, run twice): 229 passed both times.
- Mutation test (reverted `--v2-line` to old hardcoded `rgba(236, 231, 220, 0.1)`, isolated run of `design.spec.ts -g hairline`): fails exactly as the worker's final message claims (`#ff0000: hairline [32,34,36], ink at 10% [34,10,14]`). Confirms the new test actually catches the regression it's meant to catch, not a tautology.
- Diff scope matches ticket's Done means/Scope exactly: `tokens.css:47` now `oklch(from var(--ink) l c h / 0.1)`, comment updated, `DESIGN.md:107` row updated with new value and painted RGB, new e2e test added. No em-dash introduced. No touch to Dockerfile/nginx/og-default.png.ts. Destructive button/badge `color-mix(in srgb, ...)` left alone, as ticket required.

Note: first full-suite run raced with a throwaway mutation I made concurrently (background job started, then I edited `tokens.css` before confirming the build had already consumed it) — discarded that result and reran clean twice to be sure; both clean runs show 229/229.

PASS
