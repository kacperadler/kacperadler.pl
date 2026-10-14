# KA0088 - Review 1

- Job: 2026-10-14-review-ka0088-motion-tes-3e2ad48e
- Branch: h/2026-10-14-ka0088-motion-test-race-85b614c5
- Commit reviewed: 3f1d3d083126d36696ceef9fa4e62e617d9cd776
- Verdict: PASS

## Final message

Worktree clean, no residual edits.

---

**Findings:** none that block.

**Notes (non-blocking):**
- F1 in `findings.md` correctly flags an environment risk (dev-server reload racing with a pre-commit `astro check` during e2e), properly scoped as `open`, not part of this ticket's fix. Consistent with the harness's findings workflow.
- During my own verification, a first `CI=1 bun run test:e2e` run hit `EADDRINUSE :4329` because a sibling worktree's e2e run grabbed the port between `playwright.config.ts`'s free-port probe and the actual `astro preview` bind (TOCTOU, pre-existing in `playwright.config.ts`, untouched by this diff). A clean rerun gave `158 passed`, matching the worker's own "second run" result exactly.

**Checks run:**
- `bun run lint`: "Checked 114 files... No fixes applied."
- `bun run check`: "0 errors, 0 warnings, 0 hints."
- `bun run build`: completed, static + server output produced.
- `npx playwright test tests/e2e/ui-catalogue.spec.ts -g "hover, press and focus" --retries=0 --repeat-each=5`: 10/10 passed.
- Mutation test: temporarily reverted `expectMotion`'s no-preference branch to the old "sample `runningTransitions` right after the action" logic plus a 300ms artificial stall (matching worker's own described race repro). Result: reliably fails — `button hover: the face lifts off its layer / Expected: > 0 / Received: 0` — confirming the new wait-for-event approach is load-bearing, not a no-op; reverted the edit (`git checkout -- tests/e2e/ui-catalogue.spec.ts`), confirmed clean (`git status --short` empty).
- Full suite `CI=1 bun run test:e2e`: `158 passed (3.9m)`, no flaky retries.
- Em-dash scan on the diff: none.
- Diff file list: only `tests/e2e/ui-catalogue.spec.ts` and the ticket's `findings.md` — matches ticket scope (`Done means` / `Scope`), no `Dockerfile`/`nginx.conf`/`og-default.png.ts`/tokens touched, so no docker-build gate applies.
- Code review: `transitionsStartedBy` reuses the existing `runningTransitions` helper and the file's existing `window as unknown as {...}` cross-`evaluate` state pattern (same shape as `ruleFrames`/`ruleStop` elsewhere in this file and `__trackedEvents` in `contact-form.spec.ts`); reduced-motion branch is byte-for-byte the prior sampling logic, matching the ticket's "stays as it is" requirement; the press/keyboard-focus steps now wrap only the actual triggering action (`mouse.down()`, `Tab`), with precedent hover/blur steps run outside the helper and settled via the leading poll — matches the worker's description exactly.

PASS
