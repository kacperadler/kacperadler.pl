# KA0085 - Review 1

- Job: 2026-10-14-review-ka0085-360px-scro-5c274deb
- Branch: h/2026-10-14-ka0085-360px-scroll-ada4546a
- Commit reviewed: 62f5fac5c04c09237fb725559e1d0906ca96932c
- Verdict: PASS

## Final message

Clean. All evidence checks out.

## Findings

None blocking.

## Notes (non-blocking)

- F1 (`src/styles/global.css:92-101`, reduced-motion transitions every property under `transition-property: all`) is correctly filed as an open finding rather than fixed inline — stays within KA0085's `/ui`-only scope, flags the broader public-page risk for triage.
- The fix (`overflow-wrap: break-word` on `.mb-ui-title`) only stops this specific title from overflowing in the transitioning frame; other elements can still overflow the same way. Worker discloses this explicitly in F1, not hidden.

## Checks run

- `bun install --frozen-lockfile`: 358 packages, clean.
- `bun run lint`: "Checked 102 files… No fixes applied."
- `bun run check`: 0 errors, 0 warnings, 0 hints.
- `bun run build`: succeeds, static output.
- Targeted test with fix (`-g "does not scroll sideways at 360px" --repeat-each 10 --retries 0`): 10/10 passed.
- Same test with the fix reverted (`git checkout`-restored after): 5/5 failed, `Received: 368` every time, identical to the worker's claimed pre-fix evidence — confirms the test fails deterministically without the fix and the mutation (removing `overflow-wrap: break-word`) is caught.
- Full `npx playwright test`: 118 passed in 3.4m, matches worker's reported count exactly.
- Screenshots in `/tmp/ka0085-shots/`: `2-mobile-360.png` shows settled title "Katalog komponentów" wrapped normally at 360px; `3-first-frame-after-resize-360.png` shows the held first frame with "komponentó / w" breaking — matches the worker's described mechanism (vw-based `clamp()` font-size still at its 1280px-wide value under the 0.01ms reduced-motion transition). `1-desktop-1440.png` shows title unbroken at 1440px, confirming `overflow-wrap: break-word` has no visible effect once the word fits.
- `git diff` for em-dash (U+2014): no match.
- Commit messages (`fix(KA0085): …`, `docs(KA0085): …`) match existing repo convention of ticket-ID scopes (`fix(KA0084): …`, `docs(KA0083): …` in prior history).
- Diff scope: 3 files only (`findings.md`, `catalogue.astro`, `ui-catalogue.spec.ts`), consistent with the ticket's Scope and Out clause (spinner position/slide directions untouched).
- `findings.md` is new on this branch (`git show main:…` confirms absent from `main`), `Status: open`, matching the findings-file convention.
- No `structure` test exists in `tests/e2e/` or `test/` — worker's claim that the ticket's "structure test holds" line refers to a nonexistent check is accurate.
- Working tree clean after review; no leftover throwaway scripts.

PASS
