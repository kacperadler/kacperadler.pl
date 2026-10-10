# KA0028 - Review 2

- Job: 2026-10-10-review-case-studies-fram-c6ca5ee3
- Branch: h/2026-10-10-case-studies-frame-57492fb9
- Commit reviewed: 4c6e60a40b3e0fcf74fe22e9b15e2fd7f38d647d
- Verdict: PASS

## Final message

Worktree clean, no leftover edits.

---

**Findings:** none that block merge.

**Notes (non-blocking):**
- `spec/features/KA0024-.../review-2.md` and `KA0026-.../review-2.md`, brought in by the merge from `main`, already contain an em-dash (U+2014) on lines committed to `main` before this merge (commit `0dcbcd7`, pre-existing). Not authored by this branch; per the review guide, pre-existing em-dashes on lines the branch did not add are not a FAIL reason.

**Checks run (in this worktree, on commit `4c6e60a`):**
- `bun install --frozen-lockfile`: 358 packages, clean.
- `bun run lint` (ultracite check): 65 files, no fixes needed.
- `bun run check`: 0 errors, 0 warnings, 0 hints.
- `bun run build`: 4 pages, no `/realizacje/` directory, no `realizacje` string in `dist/index.html`, confirmed with `src/content/case-studies/` empty (matches repo state).
- `bun run test:e2e`: 29/29 passed, including `tests/e2e/case-studies.spec.ts` which covers both the fixture-present and no-case-studies builds (nav labels, sitemap, llms*.txt, axe).
- Seeded `tests/fixtures/case-studies/przyklad.mdx` into `src/content/case-studies/`, rebuilt: 6 pages, `/realizacje/przyklad/` and `/realizacje/index.html` built. Served via `astro preview`, screenshotted with Playwright:
  - List page (desktop, 1280×900): renders company (PwC Polska), role, period (2021-2023), summary and "Zobacz realizację" link in a card.
  - Desktop nav: "Realizacje" present between "Usługi" and "Proces".
  - Mobile sheet (375×812): "Realizacje" present in the sheet link list.
  - Reverted fixture, rebuilt: back to 4 pages, no `dist/realizacje`, no "Realizacje" text in `dist/index.html` — confirms the gated-build behavior in both directions, not just via test assertions.
- Diffed the four named conflict files (`AGENTS.md`, `nav.astro`, `mobile-sheet.astro`, `experience.astro`) against the actual main parent used in the merge (`1b18a7f`, matching the task's stated base): each differs from main only by the branch's own additions (async `primaryNav()` + active-link highlighting in `nav.astro`, async menu list in `mobile-sheet.astro`, case-study link in `experience.astro`; `AGENTS.md`'s Content Collections/Case studies lines). No conflict markers, no placeholder text (`grep` for `<<<<<<<`/`=======`/`>>>>>>>` across the tree: none in source, one hit in an unrelated already-reviewed KA0026 doc quoting the pattern as prose).
- Confirmed the AI offer from main (`ai-agents.json`, order 1) and the AI radio (`value="ai"`, label "AI i automatyzacje") in `contact-form.astro` both survived the merge.
- `Dockerfile`, `nginx.conf`, `src/pages/og-default.png.ts` untouched in the reviewed range: no `docker build` required.
- `git status --short`: clean before and after the review (fixture copy/removal and build artifacts were reverted/untracked).

PASS
