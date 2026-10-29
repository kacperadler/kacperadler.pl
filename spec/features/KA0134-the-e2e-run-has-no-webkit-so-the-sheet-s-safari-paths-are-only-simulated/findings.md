# KA0134 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The menu sheet does not fade out in WebKit, it vanishes

- Kind: improvement
- Found by: 2026-10-29-ka0134-webkit-13aa1d8d (worker), 2026-10-29
- Where: `src/components/mb/mobile-sheet.astro:106` (`transition` on `dialog.mb-sheet`), `src/scripts/mobile-sheet.ts:67` (`sheet.close()`)
- What: in Playwright's WebKit (1.64, "Version/27.2") a closing `<dialog>` starts no transition at all: right after `close()` the sheet has `display: none`, a 0x0 box and no animation, on the site and on a bare page with `dialog { transition: opacity 0.5s, display 0.5s allow-discrete }` (a plain `div` set to `display: none` with the same transition does fade). So iPhone visitors see the sheet fade in but snap shut, where DESIGN.md has every state change in `--mb-snap`. `mobile-sheet.spec.ts` ("the sheet fades in, and fades out on top of the page") now pins this WebKit state. [INFERENCE] iOS Safari behaves the same, as the dialog code is WebCore, not the port.
- Suggestion: fade the sheet out before `close()` in WebKit (for example `sheet.animate` on opacity, then `close()` on its `finished`), keeping Escape (`cancel`) on the same path and the focus return on `close`; then the WebKit expectation in that spec becomes the full-screen box, and the fixed box held through the fade matters there too. Out: any change to Chromium's `overlay` path.
- Status: open

## F2. Playwright's WebKit cannot show two Safari-only behaviours the site guards against

- Kind: risk
- Found by: 2026-10-29-ka0134-webkit-13aa1d8d (worker), 2026-10-29
- Where: `tests/e2e/mobile-sheet.spec.ts` ("Escape closes the sheet ...", "the page behind is locked ..."), `tests/e2e/ios-safari.spec.ts` ("text keeps its size ...")
- What: Playwright ships WebKit's Linux port, not iOS. There a clicked button takes focus (a probe: `page.click("#a")` in an `iPhone 15` context leaves `#a` focused), so the sheet's return of focus to the trigger is still simulated with `dispatchEvent("click")`; Playwright drives no finger pan, so the root `overflow: hidden` is still read from the computed style; and `CSS.supports("-webkit-text-size-adjust", "100%")` is false, so that test is skipped in WebKit. A real device run (BrowserStack, Sauce, or an iOS simulator through Appium) would cover all three; none is set up.
- Suggestion: decide whether a real-iOS check is worth a paid service or a macOS runner; until then the simulations stay. Out: replacing the WebKit project.
- Status: open
