# KA0115 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The e2e run has no WebKit, so the sheet's Safari paths are only simulated

- Kind: risk
- Found by: 2026-10-28-ka0115-dialog-sheet-875a78e9 (worker), 2026-10-29
- Where: `playwright.config.ts:116` (one `chromium` project); `tests/e2e/mobile-sheet.spec.ts`; `src/components/mb/mobile-sheet.astro` (`dialog.mb-sheet`, `html:has(.mb-sheet:modal)`, `overscroll-behavior`)
- What: the menu sheet is now a native `<dialog>`, and three of its rules exist for Safari, which most phone visitors on iOS use: the fixed box and scroller held through the fade out (Safari has no `overlay`, so `close()` takes the dialog out of the top layer at once; Chromium keeps its own modal box while `overlay` transitions, so removing `position: fixed` passes every test in a normal Chromium run), the focus handed to the trigger on close (a click does not focus a button in Safari, so the dialog would return focus to the page), and the root `overflow: hidden` (Chromium never scrolls the page under the contained modal by wheel or key, so the lock is visible only to a finger on iOS). The spec covers them by simulating Safari in Chromium (an inline transition without `overlay`, a `dispatchEvent("click")` that leaves focus where it was, the root's computed `overflow`), not by running WebKit. `~/.cache/ms-playwright` holds only Chromium builds (`ls`). [INFERENCE] the same gap covers `ios-safari.spec.ts` and `touch-hover.spec.ts`, which also run in Chromium.
- Suggestion: add a `webkit` project (Playwright's `devices["iPhone 15"]`) that runs `mobile-sheet.spec.ts`, `ios-safari.spec.ts` and `touch-hover.spec.ts`, with `bunx playwright install webkit` in CI; the Chromium-side simulations can then go. Out: running the whole suite in WebKit.
- Status: ticket KA0134
