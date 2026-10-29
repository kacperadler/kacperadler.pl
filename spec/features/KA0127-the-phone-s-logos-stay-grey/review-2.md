# KA0127 - Review 2

- Job: 2026-10-29-review-ka0127-logos-9c575620
- Branch: h/2026-10-29-ka0127-logos-4b88a47a
- Commit reviewed: f62f239a4e1d7f843ccc2f7d56c7444f4453b7b9
- Verdict: PASS

## Final message

No findings. The fix from the earlier FAIL is in, and the branch now stays inside the ticket.

**Earlier finding (scope):** `git diff --stat c4b9462..f62f239` shows `about.astro` untouched. The only source files changed are `trust.astro` and `cases.astro`, which are the two rules the ticket's Decision names. The `.mb-exp-logo` rule, its test entry and its docs mention are gone, and the worker recorded the experience-list logos as an open finding (F1) in `findings.md` instead.

**Behaviour:**
- Grey at rest moved into the existing `@media (hover: hover) and (pointer: fine)` block in both files. Touch screens now show the logos in colour at rest.
- The hover restore rule sits in the same block.
- The forced `[data-state="hover"]` rule for `/ui` stays outside it, so the catalogue still works.
- `touch-hover.spec.ts` covers both sides: touch shows `none 1`, mouse shows `grayscale(1) 0.6`.
- `AGENTS.md` and `DESIGN.md` carry one updated sentence each, now naming only the trust bar and cases.

**Notes (non-blocking):**
- Screenshots: the `about-390-*` files are removed. `trust-390-*` and `cases-390-*` are present.
- No em-dash (U+2014) in the diff.

**Checks:**
- `bun run lint`: "Checked 120 files in 421ms. No fixes applied."
- `bun run check`: 0 errors, 0 warnings, 0 hints.
- `bun run build`: complete.
- `bun run test:e2e tests/e2e/touch-hover.spec.ts`: 7 passed.
- **Mutation:** I changed the `trust.astro` grey rule to `grayscale(0%)`. `mouse › the client logos are grey at rest` failed (expected `grayscale(1) 0.6`, got `grayscale(0) 0.6`). I restored the file; the worktree is clean.
- **Touch-side mutation:** I did not re-run it. The worker reports that undoing the `cases.astro` change fails `touch screen › the client logos show in colour at rest`.
- `bun run test:e2e` (full suite): 249 passed (4.1m).
- I did not run `docker build`. The branch touches no `Dockerfile`, `nginx.conf` or `og-default.png.ts`.

PASS
