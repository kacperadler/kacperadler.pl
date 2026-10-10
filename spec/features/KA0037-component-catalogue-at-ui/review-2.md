# KA0037 - Review 2

- Job: 2026-10-10-review-ui-catalogue-2115398b
- Branch: h/2026-10-10-ui-catalogue-47d20fec
- Commit reviewed: 41f1462a2c373b4bacbbe30d7451b76116a36b70
- Verdict: PASS

## Final message

Clean worktree, both before and after removing generated artifacts (gitignored).

---

**Findings:** none blocking.

**Notes (non-blocking):**
- `field.astro` hardcodes `#c44545` for the error text/border (moved verbatim from the pre-existing `contact-form.astro`, not introduced by this branch). It fails WCAG AA contrast (3.66:1), correctly logged as open finding F1 with an honest axe-exclude (`.field .err`) and a clear explanation; this is a pre-existing site bug the ticket's "no visual change" constraint correctly blocks from being silently fixed here. Not a FAIL per the review guide (explicit "known contrast issue (F1), pending the human: not a FAIL reason" in task Focus).
- `src/pages/_ui/index.astro` lives at `_ui/`, not the `ui/` path the ticket literally named. Necessary: Astro has no "exclude this specific `src/pages/` route from build" switch, and the underscore-prefix convention is what lets `astro.config.mjs`'s dev-only `injectRoute` be the only thing that ever serves it. Worker disclosed this explicitly for the next worker/reviewer; it satisfies the ticket's actual Done-means requirement (absent from prod build) rather than the literal path string.
- F2–F4 (disabled-state styling, legal-page `.prose` duplication, patterns not yet catalogued) are honestly scoped out and logged, not required by this ticket's Done means.

**Checks run (in this worktree, this range):**
- `bun install --frozen-lockfile`: 357 packages, clean.
- `bun run lint`: 74 files, no fixes needed.
- `bun run check`: 0 errors / 0 warnings / 0 hints.
- `bun run build`: 4 pages; confirmed no `dist/ui`, no `/ui` in `dist/sitemap-0.xml`, no `href="/ui` anywhere in `dist/`.
- `bun run test:e2e`: 30/30 passed (includes home a11y, contact-form, mobile-sheet, nav-active, skip-link, and the new `ui-catalogue` spec against a second dev-server instance).
- Mutation checks (throwaway edits, restored via `git checkout --`):
  - Removed `.btn-primary:is(:hover, [data-state="hover"])` forced-selector → "a forced hover paints like a real one" test failed as expected.
  - Removed the `.field .err` axe-exclude → axe genuinely reports `color-contrast` 3.66:1 on `#c44545`/`#14171c`, confirming F1 is real, not a cover story.
  - Forced `astro.config.mjs`'s `injectRoute` to fire unconditionally (not just `command === "dev"`) → both "has no /ui page" and "neither the sitemap nor the home page points to /ui" tests failed as expected, with the sitemap literally containing `/ui/`.
- Diff review: every new `src/components/ui/*` component traced to the exact duplicate markup/CSS it replaces in `nav.astro`, `footer.astro`, `mobile-sheet.astro`, `hero.astro`, `services.astro`, `how-i-work.astro`, `experience.astro`, `contact-form.astro`; removed CSS blocks match 1:1 what the new components now render (e.g. `.status-pill`, `.exp-meta`/`.exp-meta-now`, `.step-badge`, `.chip`, `.radio`, `.field`/`.err`, `.footer-col a`, `.nav-links a`). `global.css`'s spotlight selector consolidation (`.service-panel`/`.step-panel`/`.exp-panel` → `.v2-card`) is sound because all three sections pass that class via `<Card>` already.
- Grepped diff for em-dash (U+2014) additions: none. Grepped for Tailwind/cookie/tracker/data-theme additions: none (only prose comments documenting the *absence* of a Tailwind dependency).
- `DESIGN.md`/`AGENTS.md` updated with the new components, catalogue, and prose port, consistent with styleguide's "shape" requirement.

No commands in the review guide's PASS list failed; no FAIL condition from the guide or `AGENTS.md` `## Don't` applies to this diff; ticket's Done-means items are all present and test-verified.

PASS
