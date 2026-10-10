# KA0069 - Review 1

- Job: 2026-10-10-review-landing-in-mb-a68b6d20
- Branch: h/2026-10-10-landing-in-mb-d0b2016c
- Commit reviewed: 4aede4338d4d3d3ff7d42d8ec3ccfbb8b5128cdb
- Verdict: FAIL

## Final message

Both temp comparison worktrees removed, tree clean.

---

**Findings**

1. `src/pages/_ui/index.astro` and `src/pages/_ui/proposal/[id].astro`: the branch's own-document rewrite deliberately drops `contact-form.ts` from these dev-only pages — the stated fix for the real risk that the old `BaseLayout`-based proposal page's seven forms would POST to the production NocoDB. No test anywhere asserts this. I mutated the proposal page (re-added `import "@/scripts/contact-form.ts";` to its `<script>` block, restoring the exact condition the worker says they fixed) and reran `tests/e2e/ui-proposals.spec.ts` + `tests/e2e/ui-catalogue.spec.ts`: 24 passed, the same pre-existing unrelated 360px flake retried and passed — nothing caught the regression. Reverting `/ui`'s `index.astro` the same way would be equally invisible to the suite. This is exactly the PASS requirement "A change in behaviour has a new or updated spec in `tests/e2e/`" left unmet for a protective behavior the worker themselves flagged as safety-critical (accidental lead-store pollution from a dev tool). Restored the file before continuing (`git status` clean).

**Notes (non-blocking)**

- `tests/e2e/ui-catalogue.spec.ts:87` "does not scroll sideways at 360px" is flaky on the dev catalogue (368px once, passes on Playwright's CI retry). Pre-existing-shaped issue, not introduced by this diff's production-page fix; doesn't affect CI exit code (`retries: 2` in `playwright.config.ts`).
- Findings F1 (OG image still old design) and F2 (`astro check` reading `playwright-report`) are correctly scoped out and documented in `findings.md`, left `open` for the coordinator — consistent with ticket's "SEO output unchanged" requirement.

**Checks run** (in this worktree, `d7364f28..4aede43`)

- `bun install --frozen-lockfile`: 358 packages.
- `bun run lint`: 95 files, no fixes needed.
- `bun run check`: 0 errors/warnings/hints.
- `bun run build`: 4 pages, clean.
- `bun run test:e2e` (`CI=1`): 60 passed, 1 flaky (passed on retry) — exits 0, matches worker's "61 passed" claim.
- Mutation: reverted `.mb-sheet` reduced-motion `transition-property: none` block → `tests/e2e/mobile-sheet.spec.ts` "under reduced motion" test failed as claimed (`inactive` instead of focused). Restored.
- Mutation: reverted the 400px header wrap/arrow-hide fix in `src/components/mb/header.astro` → `tests/e2e/a11y.spec.ts` "no page scrolls sideways at 360px with a fallback font" failed (379px vs ≤360). Restored.
- Mutation: added `border-radius: 8px` to `.mb-card` → `tests/e2e/design.spec.ts` caught 21 offenders. Restored.
- Mutation: re-added `contact-form.ts` to the dev-only proposal page → full relevant suite still green (finding above). Restored.
- SEO/content parity: built base (`d7364f28`) and branch in separate worktrees (both with and without `E2E_FIXTURES=1`); `sitemap-0.xml`, `llms.txt`, `llms-full.txt`, `robots.txt`, `og-default.png` byte-identical; `<head>` identical once `<style>`/module-`<script>`/stylesheet-`<link>` stripped; visible body text identical (case-insensitive) on `/`, `/polityka-prywatnosci/`, `/regulamin/`, `/404`, `/realizacje/`, `/realizacje/przyklad/`.
- Confirmed deletions: `src/components/ui/`, `sections/`, `contact/`, old `layout/{header,footer,nav,mobile-sheet}.astro`, `spotlight.ts`, `nav-scroll.ts`, `/ui/mb`, `src/styles/proposals/minimal-brutalism/`, old `prose.css` — all gone; no dangling imports (`grep` clean).
- Confirmed `src/styles/proposals/baseline/` is the new design with no overrides (per Decisions), `/ui/proposal` frame retained.
- No em-dash (U+2014) added anywhere in the diff.
- No `translateY`/`backdrop-filter`/`radial-gradient`/nonzero `border-radius` introduced in CSS (only in docs prose and one test fixture simulating an override).
- `Dockerfile`, `nginx.conf`, `og-default.png.ts` untouched → no docker build required.

FAIL
