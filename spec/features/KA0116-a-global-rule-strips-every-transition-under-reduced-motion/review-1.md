# KA0116 - Review 1

- Job: 2026-10-28-review-ka0116-reduced-mo-c10095d8
- Branch: h/2026-10-28-ka0116-reduced-motion-f79e6032
- Commit reviewed: 2e8612a4893e5e9ecf42c42d6a0f84f8c4c24e6b
- Verdict: PASS

## Final message

Worktree clean, nothing to restore.

## Findings

None that block merge.

## Notes

- Ticket's cost estimate was "21 component files"; branch touches 20 (`accordion-item`, `badge`, `breadcrumb`, `button`, `card`, `checkbox`, `choice`, `contact-form`, `input`, `link`, `mobile-sheet`, `pagination`, `prose`, `radio`, `sections/{about,cases,services,trust}`, `spinner`, `textarea`) plus `global.css` — within the ticket's [INFERENCE] estimate, not a gap; every `reduce` block named in the ticket's evidence is gone (`rg` confirms 0 remaining `prefers-reduced-motion: reduce` blocks in `src/`), and every transform/height/shadow/scroll-smooth transition the ticket names is now inside a `no-preference` block while colour/opacity/filter fades (`background-color`, `border-color`, `color`, `box-shadow`, `filter`, `opacity`, `outline-color` longhands) stay unconditional.
- `button.astro`'s unconditional `visibility: hidden` base rule plus the `no-preference` override to `visible` is a correct inversion of the old reduce-only rule; verified by the new `layerShown` assertions in `ui-catalogue.spec.ts` and by watching the real press interaction in the full e2e run.
- `tests/e2e/motion.ts` is a well-built shared helper (`FADES` list, `motionOf`) reused by `design.spec.ts` and `ui-catalogue.spec.ts`; the new `design.spec.ts` test asserts both "nothing moves under reduce" and "scroll-behavior/color-transition exist under no-preference", directly proving the ticket's Goal.
- Docs (`AGENTS.md`, `DESIGN.md`) updated to describe the new opt-in-motion convention, as required since this is a project-wide pattern change.
- No em-dash introduced, no Tailwind/CMS/islands, no Dockerfile/nginx/og-image touch (so no docker-build gate applies), no light-theme or theming-machinery revival.

## Checks run (in this worktree, at 2e8612a)

- `bun install --frozen-lockfile`: 378 packages, ok.
- `bun run lint`: `Checked 117 files in 449ms. No fixes applied.` — pass.
- `bun run check`: `0 errors, 0 warnings, 0 hints` — pass.
- `bun run build`: completes, static + server output generated — pass.
- `bun run test:e2e -- --retries=0` (run 1): `228 passed (4.0m)`, 0 failed, 0 flaky.
- `bun run test:e2e -- --retries=0` (run 2): `228 passed (3.6m)`, 0 failed, 0 flaky, `EXIT:0`.
- Manually read every changed component's CSS diff to confirm colour/opacity transitions stayed unconditional and only transform/height/shadow/animation/scroll-behavior moved into `no-preference` blocks (accordion-item, badge, breadcrumb, button, card, checkbox, choice, contact-form, input, link, mobile-sheet, pagination, prose, radio, sections/{about,cases,services,trust}, spinner, textarea, global.css) — all consistent with the ticket's Done-means instruction.
- `git diff --name-only` against range: no Dockerfile/nginx.conf/og-default.png.ts touch, no em-dash in diff, no scope creep outside the ticket's named files plus tests/docs.

PASS
