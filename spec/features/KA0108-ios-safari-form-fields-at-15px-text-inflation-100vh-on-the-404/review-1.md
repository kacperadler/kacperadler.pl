# KA0108 - Review 1

- Job: 2026-10-28-review-ka0108-ios-form-z-ca038759
- Branch: h/2026-10-28-ka0108-ios-form-zoom-a732fb46
- Commit reviewed: 022ecfe16580949eab49c5cb2e24b54052490b9c
- Verdict: FAIL

## Final message

## Findings

**`src/components/mb/pagination.astro:266` — out-of-scope change, no prior consultation.** Ticket KA0108's Scope `In:` names exactly "the two field sizes" (Done means repeats the same text verbatim), and the audit it came from (`spec/features/KA0104-.../findings.md` F4) lists `Where:` as only `input.astro:29` and `textarea.astro:23` — not `pagination.astro`. The same audit's F5, two findings below, does cite `pagination.astro:269` (for a different bug, the forced-colors focus ring), so the auditor had already inspected that file and chose not to include its font-size in F4. The worker raised the pagination jump field from 13px to `max(16px, 1rem)` anyway, added it to the new `tests/e2e/ios-safari.spec.ts`, and documented it as a blanket rule in `AGENTS.md`'s Konwencje — then asked in the final message "please confirm that is wanted." That is disclosure after the commit, not the consultation `AGENTS.md` `## Don't` requires before going beyond a ticket's Scope ("Nie wychodź poza Scope ticketu bez konsultacji"). No `findings.md` entry was filed for it either (worker's own message: "no new findings.md entries"), so the project's normal path for an audit gap that's not an authorized fix - raise it for a future ticket's Decisions - wasn't used.
- The fix itself is correct and the mutation confirms the spec enforces it: reverting the line to 13px fails `tests/e2e/ios-safari.spec.ts:51` ("no field's text is under 16px") with `Expected: "16px", Received: "13px"`, restored afterward.
- This is still scope creep under the review guide's own "PASS when all hold" bar ("The branch stays inside its ticket's scope") and its FAIL bar ("The branch breaks a rule in AGENTS.md `## Don't`"), independent of code quality.

## Notes

- The two named fields (`input.astro:31`, `textarea.astro:23`), `global.css`'s `-webkit-text-size-adjust: 100%`, and `404.astro`'s `100svh` match the ticket's Done means exactly, with a correct comment on each and no `maximum-scale`/`user-scalable` added (`base-head.astro:40` unchanged).
- `tests/e2e/ios-safari.spec.ts` is well-targeted: covers both named fields plus root-font and viewport variation, `text-size-adjust` on `/` and the 404, and the 404's `min-height` plus a regex check that only `100svh` (no `vh`/`dvh`/`lvh`) appears in the rule.

## Checks run

- `bun install --frozen-lockfile`: 378 packages, clean.
- `bun run lint`: "Checked 112 files in 449ms. No fixes applied."
- `bun run check`: 0 errors, 0 warnings, 0 hints.
- `bun run build`: completes, static pages + `/api/lead` server entry built.
- `bun run test:e2e` (full suite): 189 passed, 1 flaky (`dev-no-reload.spec.ts`, unrelated to this diff, a known pre-existing dev-server-reload race, passed on Playwright's internal retry).
- Mutation `pagination.astro` jump field back to `13px`, `bunx playwright test tests/e2e/ios-safari.spec.ts --retries=0`: 1 failed (the field-size test, expected 16px got 13px) as the worker's table claims; file restored via `git checkout --`, `git status` clean after.
- No em-dash (U+2014) in the diff (`git diff ... | grep -P '\x{2014}'`: empty).
- No tokens/brand/palette touched, so no `DESIGN.md` update required; `Dockerfile`/`nginx.conf`/`og-default.png.ts` untouched, so no Docker build required.

FAIL
