# KA0019 - Review 1

- Job: 2026-10-10-review-focus-in-mobile-s-33ef4f12
- Branch: h/2026-10-10-focus-in-mobile-sheet-b69e556b
- Commit reviewed: b90928ec2c71cf98d34b73733a2e70c2d184a28d
- Verdict: PASS

## Final message

## Review: KA0019 — focus in mobile sheet

**Ticket conformance** (`spec/features/KA0019.../ticket.md` via `main`):
- Goal: focus moves into dialog on open, page behind is `inert`, focus returns to trigger on close (X/link/Escape). Diff in `src/scripts/mobile-sheet.ts` implements exactly this: `openSheet` sets `inert` on all `document.body` children except the sheet and focuses `[data-menu-close]`; `closeSheet` clears `inert` then focuses the trigger; all three close paths (X click, sheet-link click, Escape) route through `closeSheet`. `trapTab` wraps Tab/Shift+Tab at the sheet's edges since `inert` alone lets Tab leave the document at the last control.
- `tests/e2e/mobile-sheet.spec.ts`: new test asserts focus-on-open + `inert`, one full Tab lap wrapping back to close, Shift+Tab wrap to CTA, and focus/`inert` restored after X-close. Existing Escape and link-close tests gained the same focus/`inert` assertions. Matches the ticket's "Done means" literally.
- Look unchanged: diff touches only `.ts`/`.spec.ts`, no CSS/markup — matches "The look stays as is."
- Scope: only the sheet's script + its spec touched, as the ticket's Scope names (worker correctly notes the script lives in `mobile-sheet.ts`, not inline in the `.astro` file — matches the existing pre-change architecture, not a deviation).

**Verification performed in this review (not just re-stating worker's claims):**
- `bun run lint` → clean. `bun run check` → 0/0/0. `bunx prettier --check "**/*.astro"` → pass. `bun run build` → 4 pages. `bun run test:e2e` → 20 passed.
- Repeated `tests/e2e/mobile-sheet.spec.ts` alone 3x → 5/5 passed each time, no flake observed.
- Mutation testing (each reverted via `cp` from backup, confirmed `git diff` clean afterward):
  - No-op `trapTab` (disable wrap) → new test fails at the wrap-back-to-close step. Caught.
  - Strip the `inert` loop → new test fails on `toHaveJSProperty("inert", true)`. Caught.
  - Drop `.focus()` in `openSheet` → new test fails on `toBeFocused()` for close button. Caught.
  - Drop `getOpenButton()?.focus()` in `closeSheet` → **3** tests fail (new test, Escape test, link-close test), all on trigger-focus assertion. Caught, well-covered across all close paths.
- Throwaway script (deleted after, `git status` clean): simulated address-bar-style navigation (`location.href = ...`, bypassing in-sheet click handlers) while the sheet was open — new page loads with `.page-shell` `inert: false` and sheet closed. Confirms the ClientRouter/full-navigation concern the task flagged: a fresh DOM swap discards the old inert'd elements, so nothing can stay stuck inert. (A literal click on a behind-the-modal link correctly cannot fire at all while `inert` — that's the feature working, not a gap.)
- No em-dash (U+2014) added in the diff (`grep -P '\x{2014}'` on the diff → no match).
- No `AGENTS.md` `## Don't` items touched (no Tailwind, no theming, no scroll-listener, no cookies/trackers).

**Notes (non-blocking):**
- `trapTab`'s forward-tab condition (`!(event.shiftKey || (inside && active !== last))`) is a double-negated boolean; correct per mutation testing but could read more plainly. Not a defect.
- `noAwaitInLoops` biome-ignore has no prior precedent in the repo, but lint passes with it; comment justifies the sequential key presses correctly.

All five CI-equivalent checks green, ticket's Done-means bullets verified behaviorally (not just by reading), mutation testing shows the new/updated tests actually gate every piece of the fix (inert, wrap, focus-in, focus-back on all three close paths), and the ClientRouter edge case the task called out checks out clean.

PASS
