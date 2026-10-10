# KA0069 - Review 2

- Job: 2026-10-10-review-landing-in-mb-37a6548b
- Branch: h/2026-10-10-landing-in-mb-d0b2016c
- Commit reviewed: 887e0c7bba6c64f5471b83fcf33d236fa260f32e
- Verdict: PASS

## Final message

The earlier FAIL is resolved. That finding was that nothing tested the dev pages dropping `contact-form.ts`. The new tests catch the regression it described.

**Findings**

None. The new work is test-only: `tests/e2e/send-a-lead.ts`, `ui-catalogue.spec.ts` and `ui-proposals.spec.ts` (49 added lines in total). The earlier review's other checks cover the rest of the range.

- **Helper:** `sendALead` stubs the NocoDB shared-view endpoint with `page.route("**/api/v1/db/public/shared-view/**")`. The pattern matches `siteConfig.nocodbFormUrl`, so no lead leaves the test.
- **Control test:** "the home page form sends a lead" runs on the production build and expects 1 request. This shows the helper really submits, so the 0 on the dev pages is meaningful.
- **Coverage:** `/ui` is tested once and `/ui/proposal/<id>` once per proposal folder. Only `baseline` exists now.

**Notes**

- The 360px flake in `ui-catalogue.spec.ts` was not seen this run. The F1 (OG image still the old design) and F2 (`astro check` reading the Playwright report) findings in `findings.md` stay out of scope.

**Checks run**

- `bun install --frozen-lockfile`: OK.
- `bun run lint`: 96 files, no fixes applied.
- `bun run check`: 0 errors, 0 warnings, 0 hints.
- `CI=1 bun run test:e2e`: 64 passed, matching the worker's claim. I did not run a separate `bun run build`; the e2e run builds `dist/` itself.
- **Mutation:** I re-added `import "@/scripts/contact-form.ts"` to both `src/pages/_ui/index.astro` and `src/pages/_ui/proposal/[id].astro`, then ran the "lead store" tests with `--retries=0`. Both dev-page tests failed with `Expected: 0, Received: 1`. I restored both files with `git checkout`, and the tree is clean.
- No em-dash found in the added lines (read from the diff output; I did not grep for it).

PASS
