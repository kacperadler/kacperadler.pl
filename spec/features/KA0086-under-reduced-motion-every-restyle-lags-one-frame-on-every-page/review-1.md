# KA0086 - Review 1

- Job: 2026-10-14-review-ka0086-reduced-mo-a890c6ee
- Branch: h/2026-10-14-ka0086-reduced-motion-la-639ffec2
- Commit reviewed: ee7295e82e217ccc081c6249bd780d393ae3245d
- Verdict: PASS

## Final message

Clean, single conventional commit with scope matching ticket. All checks pass, mutation test confirms the new spec actually detects the regression, and the removed workarounds are verified redundant by passing existing/new tests. Scope matches ticket exactly (global.css fix + required check of contact-form.ts/mobile-sheet.ts/e2e specs, DESIGN.md updated since it documents motion behavior).

Findings: none blocking.

Notes:
- Per-component `transition: none` reduced-motion blocks (e.g. `card.astro`, `input.astro`) are now redundant given the global `*` `!important` override, except where pseudo-elements like `::details-content` aren't reached by `*`; harmless duplication, not a defect, within ticket's explicit option to keep them.

Checks run (in this worktree, branch tip ee7295e):
- `bun install --frozen-lockfile`: 358 packages, ok.
- `bun run lint`: ultracite check, 102 files, no fixes needed.
- `bun run check`: astro check, 0 errors/0 warnings/0 hints.
- `bun run build`: completed, 4 pages built.
- `bunx playwright test` (full suite): 119 passed (3.6m).
- Mutation: reverted `src/styles/global.css` to `transition-duration: 0.01ms !important`, ran `design.spec.ts -g "under reduced motion a resize restyles every page"`: failed with 80+ listed running transitions (nav column-gap, section margins, h2 font-size, etc.) exactly as the pre-fix report described — confirms the new test catches the regression. Restored file via `git checkout --`.
- Read `card.astro`, `mobile-sheet.ts`, `contact-form.ts`: no `transitionend` reliance beyond `card.astro`'s listener, which only clears `data-bar-out`, never set under reduced motion (guarded by `!reducedMotion.matches`) — fix is safe there.
- Confirmed `mobile-sheet.astro`'s new explicit selector list covers every element that declares `transition` in the file (4/4); existing reduced-motion focus test (`mobile-sheet.spec.ts`) already in the passing 119.
- Confirmed `accordion-item.astro`'s own `::details-content` reduced-motion block is untouched by the diff, consistent with the worker's note that `*` doesn't reach that pseudo-element.
- Verified no em-dash added, no Dockerfile/nginx.conf/og-default.png.ts touched (no docker build needed).

PASS
