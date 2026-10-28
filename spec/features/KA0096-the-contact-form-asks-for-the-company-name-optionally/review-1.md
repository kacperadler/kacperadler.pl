# KA0096 - Review 1

- Job: 2026-10-28-review-ka0096-company-fi-9fe6ffc7
- Branch: h/2026-10-28-ka0096-company-field-aeffbf3f
- Commit reviewed: d5c2b7e2e5f7d2ce45fbb69a90537e6ed4676903
- Verdict: PASS

## Final message

## Findings

None blocking.

## Notes

- `tests/e2e/dev-no-reload.spec.ts:16` flaked once (`Execution context was destroyed, most likely because of a navigation`) on the full run, then passed on retry (exit 0). Not touched by this branch's diff; pre-existing environment flake, not a regression.
- `.mb-field-optional` has no `text-transform` override, so `(opcjonalnie)` inherits `uppercase` from `.mb-label` and renders as `(OPCJONALNIE)` (confirmed via computed style and screenshot, matching the worker's own `06-mobile-optional-label.png`). Not a defect: the ticket and `AGENTS.md`/`DESIGN.md` consistently quote label text in natural case even though every `mb-label` (including `"Firma"` itself, rendered `FIRMA`) is uppercase by the same mechanism; this is the project's existing convention, not something the branch broke.

## Checks run

- `bun install --frozen-lockfile`: 378 packages, clean.
- `bun run lint`: `Checked 111 files... No fixes applied.`
- `bun run check`: `0 errors, 0 warnings, 0 hints`.
- `bun run build`: completed, no errors.
- `bun run test:e2e` (full suite, 192 tests): `1 flaky, 191 passed (3.4m)`, exit code 0. Flaky test is `dev-no-reload.spec.ts`, untouched by this diff.
- Contrast math (WCAG formula) for `--muted #9d9c95` on `--v2-bg #0a0c10` (idle) = 7.10:1, on `--v2-panel #14171c` (hover) = 6.52:1 — both ≥ 4.5:1 as the ticket's new Done-means line requires; `--ink-2` (label color) contrast is higher in both cases, so the hint reads dimmer as required.
- Mutation tests (throwaway edits in this worktree, restored with `git checkout --` after each):
  - `src/lib/lead.ts`: forced `company = true` (disabled length check) → caught by 3 tests (`contact-form.spec.ts` x2, `lead-api.spec.ts`), all now failing as expected.
  - `src/lib/leads-db.ts`: removed the `ALTER TABLE ... ADD COLUMN company` migration → caught by `leads-db.spec.ts`'s "from before the company field" test (`table leads has no column named company`).
  - `src/components/mb/field.astro`: set `.mb-field-optional` to `font-size: 11px; color: #555` (same size as label, sub-4.5:1 contrast) → caught by the new contact-form contrast test (`hintSize` no longer `< labelSize`).
- `git status --porcelain`: clean after each mutation restore.
- No em-dash (U+2014) in any added line (`grep -P '\x{2014}'` on added lines: no match).
- No `Dockerfile`/`nginx.conf`/`og-default.png.ts` touched → Docker build not required by the guide.
- No `tokens.css`/brand/palette change → no extra `DESIGN.md` token-table obligation beyond what was done.
- Scope check: all touched files are in the ticket's `In` scope (`lead.ts`, `leads-db.ts`, `api/lead.ts`, contact section, `polityka-prywatnosci.md`) or are convention-mandated doc/catalogue sync (`AGENTS.md`, `DESIGN.md`, `README.md`, `catalogue.astro`, `ticket.md` itself, per the human's explicit follow-up instruction to add the Done-means/Decisions lines).

PASS
