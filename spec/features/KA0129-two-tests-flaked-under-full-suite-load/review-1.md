# KA0129 - Review 1

- Job: 2026-10-28-review-ka0129-load-flake-eeeaa2e3
- Branch: h/2026-10-28-ka0129-load-flakes-af11ddfd
- Commit reviewed: 79a0b4a26ba5f349460f87dda5e876d7c6f21bd6
- Verdict: PASS

## Final message

Tree clean, nothing left to restore.

## Findings

None blocking.

## Notes

- `findings.md` F1-F3 correctly logged as `open` (not fixed by this branch), per the project's findings convention; coordinator will turn them into tickets at merge.
- F2 notes other specs (`a11y.spec.ts`, `design.spec.ts`, `send-a-lead.ts`) still wait for `networkidle` on the preview — out of this ticket's scope (only the two named flaky specs), correctly left alone.

## Checks run (in this worktree, on `79a0b4a2`)

- `bun install --frozen-lockfile`: 378 packages, ok.
- `bun run lint`: "Checked 116 files... No fixes applied."
- `bun run check`: 0 errors, 0 warnings, 0 hints.
- `bun run build`: completed, all routes including `/og-default.png`.
- `CI=true bun run test:e2e` (matches CI's 1-worker/retries mode): **219 passed**, no flakes, 4.4m.
- Mutation: removed `db.exec("PRAGMA busy_timeout = 5000");` from `savedLeads` in `tests/e2e/contact-form.spec.ts`, reran only the new test `"reading the lead store waits for a lead being written"` → failed with `Error: database is locked` on the run and both retries, exactly the fault the fix closes. Restored the file (`git checkout --`), tree now clean.
- Code inspection confirms the `networkidle` removal is sound rather than merely "passed in this run": `contact-form.ts` is imported as a bundled `<script>` in `base-layout.astro` (Astro emits these as `type="module"`), so by the HTML spec it runs as deferred script — after parsing, before `DOMContentLoaded`, which itself precedes the `load` event Playwright's `goto` waits for by default. Its `document.addEventListener("submit"/"input"/"change"/"click", …)` calls are top-level, so listeners are attached before `load` fires; removing `networkidle` cannot leave the form unwired when a test starts interacting with it.
- OG-image rewrite (read `dist/client/og-default.png` from disk, pixel checks unchanged, content-type check dropped) matches the ticket's own 2026-10-28 Decision approving exactly this swap; no further approval needed from me.
- No em-dash added anywhere in the diff (`grep -P '—'` on the full diff: empty).
- Diff touches only `tests/e2e/contact-form.spec.ts`, `tests/e2e/og-image.spec.ts`, and the ticket's `findings.md` — exactly the ticket's Scope, nothing else. Throwaway files (`ka0129-blackhole.config.ts`, `tests/e2e/ka0129-old.spec.ts`) are absent; worktree is clean.
- Two commits, Conventional Commits with `KA0129` scope, consistent with the project's branch shape.

PASS
