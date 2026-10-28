# KA0131 - Every e2e page load on the preview sends a pageview to the production Umami

```json
{
  "id": "KA0131",
  "title": "Every e2e page load on the preview sends a pageview to the production Umami",
  "date": "2026-10-28"
}
```

## Description

the e2e preview is a PROD build, so each page a spec opens loads `https://analytics.kacperadler.pl/script.js` when the browser is idle and POSTs a pageview to `https://analytics.kacperadler.pl/api/send` (seen with a Playwright script on `bun run preview`: one GET and one POST per `goto("/#contact")`, about 150-450 ms each). Headless Chromium sends no Do Not Track and the loader sets no `data-domains`, so the production dashboard counts `localhost` pageviews from every run of every worktree, and every spec that waits for `networkidle` on the preview depends on that remote server answering.

## Goal

Test runs no longer send pageviews to the production Umami, so the site's visit statistics count only real visitors.

- Kind: bug

Evidence:
- `src/components/layout/base-head.astro:157-189`, `playwright.config.ts` (`use`)
- Found by: 2026-10-28-ka0129-load-flakes-af11ddfd (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: keep the e2e browser off the analytics host, for example `launchOptions: { args: ["--host-resolver-rules=MAP analytics.kacperadler.pl ~NOTFOUND"] }` in `use` of `playwright.config.ts` (the script then fails at once), and decide whether the production loader should set `data-domains="kacperadler.pl"`. The `stubUmami` stubs in `contact-form.spec.ts` keep working either way (the tracker leaves an existing `window.umami` alone).
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- keep the e2e browser off the analytics host, for example `launchOptions: { args: ["--host-resolver-rules=MAP analytics.kacperadler.pl ~NOTFOUND"] }` in `use` of `playwright.config.ts` (the script then fails at once), and decide whether the production loader should set `data-domains="kacperadler.pl"`. The `stubUmami` stubs in `contact-form.spec.ts` keep working either way (the tracker leaves an existing `window.umami` alone).

## Decisions

- 2026-10-28: Source: F1 of KA0129
