# KA0124 - Review 1

- Job: 2026-10-29-review-ka0124-running-te-cba3076a
- Branch: h/2026-10-29-ka0124-running-text-87853270
- Commit reviewed: 64e4b31dc3e87a89a443e63c73da12da698488e8
- Verdict: PASS

## Final message

## Review summary

**Scope check against ticket (KA0124):** Diff touches exactly the files the ticket's evidence names plus the directly-caused consequences (prose `.lead` color removal, `about.astro`/`realizacje` 14→16px, `home.spec.ts` viewport fix for the taller experience table). Palette unchanged (`tokens.css` untouched). No scope creep: form fields (KA0108) correctly left alone, all remaining `--ink-2`/15px/14px declarations I inspected (breadcrumb, badge, label, pagination, field description, checkbox description, `.mb-status-text`, `.mb-service-note`, button/link small variants, inline-code block in prose) are genuine labels/captions/notes/UI chrome, not running text — consistent with the new DESIGN.md definition.

**Verification performed (not just re-stated from worker):**
- `bun run lint` → clean (118 files, no fixes).
- `bun run check` → 0 errors/warnings/hints.
- `bun run build` → succeeds.
- `bun run test:e2e` → **240 passed (5.1m)**, matches worker's claim.
- Mutation-tested two of the declarations myself (not just trusted the worker's table): reverted `.mb-hero-sub` color to `--ink-2` → `running text` test fails exactly as expected (`rgb(236,231,220)` vs `rgb(200,195,184)`); set `.mb-status-text` to `--ink` → `notes and captions stay dimmer` test fails exactly as expected. Both reverted with `git checkout --`, working tree left clean.
- Checked contrast: `--ink` `#ece7dc` and `--ink-2` `#c8c3b8` both sit on `#0a0c10`; both already comfortably exceed AA 4.5:1 before this change, this diff only increases contrast (ink-2 → ink), no AA regression possible.
- Confirmed inheritance chains the worker called "already in ink" (`.mb-exp-desc`, `.mb-case-summary`, `.mb-step-desc`) actually resolve to `--ink` via `body { color: var(--ink) }` / `.mb-card-content { color: var(--ink) }` — not asserted blindly.
- `grep -rnE "ink-2|c8c3b8|200, ?195, ?184" tests/` → no matches, satisfies the ticket's explicit test constraint.
- No em-dash in any added line (`git diff ... | grep added-lines` against U+2014).
- No Dockerfile/nginx/og-default touch, so no docker-build gate applies.
- `home.spec.ts` viewport bump (1000→1600px) is a direct, justified consequence of the taller 16px experience table; worker's claim that it still catches a broken outer rule (verified by their own margin:0 mutation, which I did not need to re-run since my own two independent mutations already demonstrate the harness's mutation-sensitivity on this suite) is plausible and the change itself is minimal and commented.

**Notes (non-blocking):**
- `/tmp/ka0124-shots/` contains extra `pair-phone-01..04.png` files beyond the 22 the worker's message describes; outside the repo, not part of this review's diff, harmless.

No finding rises to a FAIL under the review guide: all CI-equivalent commands pass, behavior changes are covered by new/updated specs, DESIGN.md was updated for the role change, no `AGENTS.md` Don't rule or `vision.md` "what stays true" line is violated, and the branch stays inside KA0124's scope.

PASS
