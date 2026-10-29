# KA0132 - Review 1

- Job: 2026-10-29-review-ka0132-networkidl-6c1b736c
- Branch: h/2026-10-29-ka0132-networkidle-1fbb497b
- Commit reviewed: 3ba23751c189e2ea40a3e0fb6dcbad0889f5252c
- Verdict: PASS

## Final message

## Review: KA0132 — specs still waiting for networkidle on preview pages

### Findings
None that block the merge.

### Notes
- `tests/e2e/send-a-lead.ts`: deleting the `await Promise.race([answered, submittedNatively])` line (removing all synchronization) is not reliably caught at the stub's current speed — I reran the mutation myself (20 reps, 10 per `sendALead` call site) and got 1/10 failures on the `toBe(1)` assertion, 0/10 on `toBe(0)`. This matches the worker's own disclosure ("the race is real but narrow") and is a pre-existing property of this kind of browser-timing test, not a regression introduced by the fix — the shipped code keeps the synchronization line. Not worth a permanent slow-stub test per the project's own "don't add artificial test-only behavior" instinct; correctly called out as a limit rather than hidden.
- Remaining `networkidle` uses (`ui-catalogue.spec.ts:281,860,886,986,1077`) are all on `/ui`, which only exists under `astro dev` and never loads Umami — correctly left alone as outside "preview pages."

### Checks run (in this worktree, `a464032..3ba2375`)
- `bun install --frozen-lockfile` — ok.
- `bun run lint` — 119 files, no fixes needed.
- `bun run check` — 103 files, 0 errors/warnings/hints.
- `bun run build` — completed clean.
- `CI= bun run test:e2e` (full suite, chromium) — **240 passed**, no failures/flakes. Confirmed individually for the touched specs: `a11y.spec.ts` contact-form-error-states test, `contact-form.spec.ts` message-box-grows ("sendLong") test, `design.spec.ts` "resize restyles every page in the same frame" test, and both `sendALead` call sites in `ui-catalogue.spec.ts` — all green.
- Reproduced the bug this ticket fixes: reverted `send-a-lead.ts` to the old `page.waitForLoadState("networkidle")` helper with a 50ms-delayed lead-store stub → "the home page form sends a lead" failed 10/10 (`Received: 0`). Same slowdown against the branch's fixed helper → 10/10 passed. Confirms the fix closes the race the ticket describes.
- Mutation: deleted the sync line entirely at normal stub speed → 1/20 failed (narrow race, as above); restored file afterward, `git status` clean.
- No Dockerfile/nginx.conf/og-default.png.ts touched → Docker build check not applicable. No tokens/brand/palette touched → no `DESIGN.md` update required. Diff scoped to 4 files under `tests/e2e/`, matching the ticket's scope exactly. No em-dash in the diff. Single Conventional Commit (`test(KA0132): ...`) matches repo convention for ticket-scoped test commits.

PASS
