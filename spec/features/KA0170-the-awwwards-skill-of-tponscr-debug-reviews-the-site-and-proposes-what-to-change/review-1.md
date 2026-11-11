# KA0170 - Review 1

- Job: 2026-11-11-review-2c81167e
- Branch: arthur/2026-11-11-worker-2d091eda
- Commit reviewed: 480f53ecd1c77dd80c09fa5020d65a0ff6214ce6
- Verdict: PASS

## Final message

I found nothing that blocks the merge. The branch follows the approved plan and Decisions KA-D31 and KA-D33:
- **Hero:** the headline now has its own full-width row, at 44px on a phone up to 104px. Under it the subtitle sits on the left, the two buttons are stacked on the right, and "W liczbach" is a strip across the full width.
- **Case results:** three cases show a large number over a short label. ReX keeps its sentence.
- **Section intros:** the text under the big headings is 20px, 64px below the heading.
- **Contact:** "30-minutowej" no longer breaks at its hyphen.
- **404:** the page uses the same big heading as the home page sections.
- **Entrance animation:** it is shorter, about 1.5s, uses the power4.out curve, and the buttons come in with the subtitle.
- **Height limit:** the 1440px page height limit is 10100px in the test and in `AGENTS.md`.

## Notes
- (minor) spec/features/KA0170-the-awwwards-skill-of-tponscr-debug-reviews-the-site-and-proposes-what-to-change/: no blind jury scores. "Done means" asks for blind jury scores of the home page before and after, but `jury-before.md` and `jury-after.md` are not on the branch. The approved plan gives both to separate coordinator jobs (Option 1), so this branch cannot settle that item; it stays open.
- (minor) worker's final message: no Lighthouse numbers. The plan asks for them in the outcome and the worker gave none. My own runs are in the checks below.
- (minor) src/components/mb/section-head.astro:170: the big-heading layout now uses two equal columns. This puts the intro text in the right half; the plan only said "right column". It is documented in `AGENTS.md` and `DESIGN.md`, so no change is needed.
- (minor) src/components/mb/section-head.astro:184: large gap on the 404. The 64px gap under the heading also applies when the heading has no callout to clear. On the 404 that leaves a big empty space between the heading and its text (`after-404-1440.png`).

## Checks
- **`npm run check`:** 0 errors, 0 warnings, 1 hint.
- **`npm run lint`:** 139 files checked, no fixes needed.
- **`npm test`:** 270 passed, 12 skipped. The skipped tests need Docker, which this job has no access to. No changed file affects them: `nginx.conf`, the `Dockerfile` and the inline scripts in `base-head.astro` are untouched.
- **Lighthouse mobile:** three runs on the production build, served gzipped with `npx serve@14 dist/client`. Every run scored Performance 99, Accessibility 100, Best Practices 100, SEO 100. LCP was 1.9 to 2.0s, CLS 0, and the LCP element is the hero `h1`.
- **Hand mutations:** there is no `mutate` script, so I broke four behaviours by hand. The tests caught every one, and I restored each file with `git checkout`; the worktree is clean.
  - Gap under the heading set back to 24px: the intro-gap test failed, measuring 4.2px of clearance against the required 40px.
  - Hero button delay set back to 0.95s: the entrance test failed at 1440 and 360, with the buttons finishing at 1550ms instead of 900ms.
  - "30-minutowej" allowed to wrap: the test failed at 1080px, where the word split over two lines.
  - Case figures: I did not run a mutation for them. The cases test pins the three figures, their labels and the ReX sentence.
- **Screenshots:** I looked at `after/load-d1440/f-06.png`, `after/load-m390/f-07.png`, `after-404-1440.png` and `after-home-1440.png`. They match the plan's sketch: the buttons are on screen about 0.8s after load, and the 404 uses the big heading. I did not open the other PNGs.

PASS