# KA0152 - Review 1

- Job: 2026-11-05-review-4b102012
- Branch: arthur/2026-11-05-worker-e334f830
- Commit reviewed: f0ec529ae4a0d11921df5dfd0c0da8948b2abfe7
- Verdict: PASS

## Final message

The branch meets KA0152 and has no blocking finding. All accessibility bars I checked hold, and the two new guards catch the regressions they are meant to catch. As you asked, I did not rerun the full suite. The blind score (KA0153: 8.6) and the LeadApartament wording are for the owner, so neither counts here.

**Findings against the ticket's Done means:**
- **Recordings:** `jury/` holds the frames the ticket asks for. `d-motion` and `m-motion` have 40 frames each, `d-reduced` and `m-reduced` have 20 each, and `frames.json` plus `record.mjs` show how they were made. `jury-after.md` calls itself a self-score, cites the frames by name, and gives a Lighthouse median of 95 / 100 / 100 / 100.
- **Page height (KA0151):** it is fixed in `src/components/mb/sections/how-i-work.astro:88` (process row gap 280px → 64px), `src/components/mb/process-figure.astro:140` (drawings capped at 80px), `src/styles/tokens.css:73` (section gap 136px → 120px at 1160px) and `src/styles/global.css:148` (each field pads half a gap). It is guarded by `tests/e2e/home.spec.ts:960`, which allows at most 9500px. The card reports 9326px.
- **Focus ring guard:** `tests/e2e/keyboard.spec.ts` checks focus by comparing pixels before and after blur. It also checks that every Tab stop comes in the page's order and lands in view below the header, at 1440px with motion on and at 390px with reduced motion. With the global ring removed (`global.css:84` set to `outline: none`), both keyboard tests failed at the brand link with "shows no focus".
- **Reduced-motion guard:** the in-page link glide is new. It only scrolls smoothly under `html[data-glide]`, which `src/scripts/glide.ts` sets for 2s after a click on a `#` link, and only when the visitor allows motion. With the motion condition taken off that rule (`global.css:34` changed to `@media all`), the glide test failed on the `reduce` run (`between` had 12 entries, expected none). `design.spec.ts:120` also forces `data-glide` before its motion scan under reduced motion.
- **Axe with motion on:** `tests/e2e/a11y.spec.ts:73` adds axe checks at 1440px and 390px with motion on, after the entrance and in the middle of the process section.
- **Copy:** en dashes in ranges are replaced with hyphens on the page, in `llms.txt` and in `llms-full.txt`. No em dash is added anywhere in the diff.
- **Brand hover (`brand.astro`):** it follows the hover convention. The real hover sits under `(hover: hover) and (pointer: fine)`, there is a forced `[data-state="hover"]` for `/ui`, and the shadow transition only runs when the visitor allows motion. `AGENTS.md` and `DESIGN.md` are updated to match.

## Notes
- (risk) `src/components/mb/link.astro:68`: the FAQ inline link's underline disappears in forced-colors mode. It is now `text-decoration: none` plus a `linear-gradient` background, and forced-colors mode removes gradient backgrounds. In Windows High Contrast the link "formularzu" keeps only its system link colour and loses its underline. `text-decoration` survives that mode.
- (minor) `src/scripts/glide.ts:22`: a second link click within 2s does not cancel the first timer. The glide mark is removed 2s after the first click, possibly while the second glide is still running. Clearing the previous timeout would fix it.
- (minor) `src/components/mb/link.astro:73`: `box-decoration-break: clone` has no `-webkit-` prefix, so Safari draws one continuous strip across a wrapped link. This only shows if the link wraps.
- (minor) `src/content/experience/leadapartament.json:5`: the rewritten description is waiting for the owner's approval, as noted in the task.

## Checks run
- **Focus ring mutation:** `bunx playwright test tests/e2e/keyboard.spec.ts` with the global focus ring set to `outline: none`. Both Tab-order tests failed ("shows no focus") and the glide test passed. I restored the file with `git checkout`.
- **Reduced-motion mutation:** `bunx playwright test tests/e2e/keyboard.spec.ts -g glides` with the glide rule's motion condition removed. The test failed on the `reduce` run. I restored the file with `git checkout`, and `git status --short` was clean afterwards.
- **`npm run mutate`:** not run, because `package.json` has no `mutate` script.

PASS