# KA0069 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The OG image still draws the old design

- Kind: improvement
- Found by: 2026-10-10-landing-in-mb-d0b2016c (worker), 2026-10-10
- Where: `src/pages/og-default.png.ts:6-7,79,109,122,141`
- What: the share image is built in the old vocabulary: a dot grid (`GRID`, the `<circle>` pattern), the photo in a rounded panel (`rx`/`ry` = `PHOTO_RADIUS`) and a rounded brand mark (`rx="6"`). Every page now renders minimal brutalism (square cells in ink rules on a solid substrate), so a shared link previews a design the site no longer has. KA0069 left it alone: its Done means keeps SEO output as it is (`og-default.png` is byte-identical to the build before the switch).
- Suggestion: redraw it in the new vocabulary - solid `base`, the photo in a square 1px ink frame, the square brand mark, heavy Geist-like headline - keeping 1200×630 and the path; check with `docker build -t kacperadler-pl-test .` as AGENTS.md requires for this file.
- Status: open

## F2. `bun run check` reads the Playwright HTML report when `CI` is set

- Kind: bug
- Found by: 2026-10-10-landing-in-mb-d0b2016c (worker), 2026-10-10
- Where: `playwright.config.ts` (`reporter`), `tsconfig.json` / `astro check` input
- What: with `CI` set (as in this job's shell) a run with a failing test retries it and records a trace (`trace: "on-first-retry"`), and the `html` reporter bundles the trace viewer into `playwright-report/trace/`. A later `bun run check` in the same tree then printed that viewer's minified source as diagnostics, although the folder is gitignored; after `rm -rf playwright-report test-results` the same `bun run check` reported 0 errors. After a run where everything passed (no trace), check passes with the report folder present. CI runs check before e2e, so it does not hit it there; a local or agent run in that order after a failure does.
- Suggestion: exclude `playwright-report` and `test-results` from what `astro check` reads (`exclude` in `tsconfig.json`), or write the HTML report outside the source tree.
- Status: open
