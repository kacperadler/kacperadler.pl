# KA0166 - Review 1

- Job: 2026-11-10-review-acf984d9
- Branch: arthur/2026-11-10-worker-b3acd0e9
- Commit reviewed: 595abdf010bc0f409950151258157bba73a8425e
- Verdict: PASS

## Final message

No blocking findings. The branch removes the "§ NN / …" label from every section head and keeps the heading where it stood on `main`, as KA-D22 and KA-D24 require. The base is 073047b, measured against a build of it.

- **Label gone everywhere:** the `label` prop, the `<p class="mb-section-label">`, its styles and every caller's `label=` are removed. A grep of `src` and `tests` for `mb-section-label`, `mb-ui-counter` and `§ 0` finds nothing.
- **`mb-section` counter kept:** the ticket says to remove it only if nothing else reads it. `card.astro`'s item numbers ("01.3") read it, so keeping it follows the ticket.
- **Spacing matches `main`:** `src/components/mb/section-head.astro:42-56,166-168,189` sets `--mb-head-top: calc(24px + 12px * 1.55)` plus 32 / 24 / 16px. That equals the old 24px padding plus the label's 18.6px line plus its gap. This holds because body `line-height: 1.55` is at `global.css:46`, and the 16px case comes from the old `row-gap` with a zero label margin.
- **Geometry check against `main`:** I built `main` and the branch, then measured every section head on `/`, `/404.html`, `/polityka-prywatnosci/` and `/regulamin/` at 320, 390, 880, 881 and 1440px. I recorded the head's position and height, the heading's and lede's offsets, and the document height. All 20 combinations are identical. One 881px run first showed a page 37px shorter; after waiting for the page to settle, both read 10065px on every run, so it was a loading delay.
- **Screenshots:** the `#problems` head at 1440px on `main` and on the branch differs only by the missing label line. The 390px branch shot shows the dimension line, heading, brace with callout A, and lede intact.
- **Tests:** the new spacing test in `tests/e2e/home.spec.ts:129-158` catches a broken offset. With the poster's `+ 24px` removed and the ≤880px padding set to a bare 24px, 3 of its 4 rows failed (`Received: 25`, expected 59.6). The fourth row, legal page at 1440px, is non-poster and above 880px, so those two changes don't touch it. I restored the file with `git checkout`, and `git status` was clean afterwards. The updated specs (`blueprint.spec.ts` 404 head starts with its h1, the `design.spec.ts` lists, the home structure check) now assert there is no label and no longer pin it.

## Notes
- (minor) `src/pages/_ui/catalogue.astro:1441-1455`: the `.mb-ui-counter` wrappers are gone, so the two catalogue heads now count up the `/ui` page's own `mb-section` counter. Cards after them in the catalogue may show a different section number than before. `[INFERENCE]`, not checked; dev-only page, and `ui-catalogue.spec.ts` doesn't check card numbers.
- (minor) The worker's message says Lighthouse needs a run outside the sandbox. I ran it here through the bundled Playwright Chromium (see Checks). The ticket's "screenshots against `main`" item is covered by the screenshots and measurements above.

## Checks run
- `npm run lint`: 138 files checked, no fixes applied.
- `npm run check`: 0 errors, 0 warnings, 1 hint (`rec.scrollMax`, in code this branch doesn't touch).
- `npm test`: 262 passed, 8 skipped (Docker specs), 5.9 min. The axe checks run inside this suite.
- Hand mutation of the spacing rule: 3 of the 4 new spacing tests failed as described; file restored.
- Geometry of `main` against the branch: identical in all 20 page and width combinations.
- Lighthouse 12.8.2 on `/`, `main` against the branch, two runs each:

  | Run | Mobile perf, `main` | Mobile perf, branch | Desktop perf, both |
  |---|---|---|---|
  | 1 | 88 | 94 | 100 |
  | 2 | 94 | 92 | 100 |

  Accessibility, best practices and SEO were 100 everywhere and CLS 0.000. Mobile LCP was about 2.8s on both, so the branch is no worse.
- Screenshots of the `#problems` head at 390 and 1440px on both builds.

PASS