# KA0134 - The e2e run has no WebKit, so the sheet's Safari paths are only simulated

```json
{
  "id": "KA0134",
  "title": "The e2e run has no WebKit, so the sheet's Safari paths are only simulated",
  "date": "2026-10-29",
  "after": [
    "KA0132"
  ]
}
```

## Description

the menu sheet is now a native `<dialog>`, and three of its rules exist for Safari, which most phone visitors on iOS use: the fixed box and scroller held through the fade out (Safari has no `overlay`, so `close()` takes the dialog out of the top layer at once; Chromium keeps its own modal box while `overlay` transitions, so removing `position: fixed` passes every test in a normal Chromium run), the focus handed to the trigger on close (a click does not focus a button in Safari, so the dialog would return focus to the page), and the root `overflow: hidden` (Chromium never scrolls the page under the contained modal by wheel or key, so the lock is visible only to a finger on iOS). The spec covers them by simulating Safari in Chromium (an inline transition without `overlay`, a `dispatchEvent("click")` that leaves focus where it was, the root's computed `overflow`), not by running WebKit. `~/.cache/ms-playwright` holds only Chromium builds (`ls`). [INFERENCE] the same gap covers `ios-safari.spec.ts` and `touch-hover.spec.ts`, which also run in Chromium.

## Goal

The tests run the phone menu, the iOS form fields and touch behaviour in Safari's engine too, so a break that only iPhone visitors would see is caught before it reaches the site.

- Kind: risk

Evidence:
- `playwright.config.ts:116` (one `chromium` project); `tests/e2e/mobile-sheet.spec.ts`; `src/components/mb/mobile-sheet.astro` (`dialog.mb-sheet`, `html:has(.mb-sheet:modal)`, `overscroll-behavior`)
- Found by: 2026-10-28-ka0115-dialog-sheet-875a78e9 (worker), 2026-10-29

## Done means

- The fix, with a test that proves it: add a `webkit` project (Playwright's `devices["iPhone 15"]`) that runs `mobile-sheet.spec.ts`, `ios-safari.spec.ts` and `touch-hover.spec.ts`, with `bunx playwright install webkit` in CI; the Chromium-side simulations can then go. Out: running the whole suite in WebKit.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- add a `webkit` project (Playwright's `devices["iPhone 15"]`) that runs `mobile-sheet.spec.ts`, `ios-safari.spec.ts` and `touch-hover.spec.ts`, with `bunx playwright install webkit` in CI; the Chromium-side simulations can then go. Out: running the whole suite in WebKit.

## Decisions

- 2026-10-29: Source: F1 of KA0115
- 2026-10-29: The human approved it ("mozesz zrobic wszytskie 5").
