# Changelog

Generated from `spec/features/` by `h changelog`; a hand edit is overwritten at the next merge.

## 2026-10-28

### Added

- KA0075 The home page layout and sections present Kacper better (01f7736)

## 2026-10-14

### Added

- KA0027 Leads stored in SQLite through one on-demand API route (ca675a8)
- KA0054 Patterns not yet in the catalogue (4759f70)
- KA0073 The OG image still draws the old design (4f06881)
- KA0083 The /ui components get the feedback of 2026-10-14: buttons, loading, avatars, radio, choice, card, contact form (d2b3973)
- KA0084 The card bar slides in and out in the direction the cursor moves (ca27cd4)

### Fixed

- KA0074 `bun run check` reads the Playwright HTML report when `CI` is set (4e894b9)
- KA0078 Pagination jump needs a page that reads its query (f6f7342)
- KA0085 /ui scrolls 8px sideways at 360px on the first load, now and then (66b0825)
- KA0086 Under reduced motion every restyle lags one frame on every page (128929f)
- KA0088 The "move under no-preference" motion test races the transitions it looks for (4d67b3d)
- KA0089 /api/lead has no rate limit: a script can fill the database and the inbox (1878aa9)
- KA0090 A blueprint-live proposal spec fails under the full parallel run (43a16d1)
- KA0091 A commit (`astro check`) in the worktree during e2e coincided with a dev-server page navigation (67f1fb5)
- KA0092 Parallel e2e runs from two worktrees can take the same preview port (bb6279f)

## 2026-10-11

### Fixed

- KA0081 Blueprint-live: the rulers stand still as in blueprint (c73d020)

## 2026-10-10

### Added

- KA0001 Onboarding: vision and criteria for kacperadler.pl (87eb449)
- KA0003 Update dependencies, Astro to the newest release (8412871)
- KA0005 The dropped email-templates offer is still on the site (d80d012)
- KA0026 Offer: AI agents, automation, Claude Code and Codex training (7453229)
- KA0028 Case studies in MDX: collection, list and page (6feb382)
- KA0036 Kacper is a software engineer, not a frontend engineer (a8f5655)
- KA0037 Component catalogue at /ui (140ac4d)
- KA0038 Design proposals at /ui/proposal/<id> (4d48281)
- KA0039 Design proposal: minimal (354a688)
- KA0040 Design proposal: brutalist (9ae67a7)
- KA0041 Design proposal: modernist (c8267fd)
- KA0042 Design proposal: computer (8269e9e)
- KA0043 Design proposal: professional (86692e8)
- KA0044 Design proposal: minimal brutalism (7913cf5)
- KA0065 Design proposal: minimal brutalism computer (b0634b2)
- KA0067 Keep only the minimal brutalism proposal (85fb50e)
- KA0068 Minimal brutalism components in the /ui catalogue (a271183)
- KA0069 The landing page in minimal brutalism (1928b85)
- KA0071 Minimal brutalism components: the human's first round of fixes (6bddfbb)
- KA0072 A signature of Kacper's own in the minimal brutalism style (890ae8d)
- KA0076 Signature proposal: editorial (8d3181c)
- KA0077 Signature proposal: live-grid (06004dd)
- KA0080 Design proposal: blueprint drawn on scroll (a7c100d)

### Fixed

- KA0004 Harness gap: no `test` script, so `npm test` fails (a6bd5fb)
- KA0009 The privacy policy says the site stores a theme preference in `localStorage` (8a20178)
- KA0014 `@types/node` 26 typechecks against a newer Node than CI and Docker run (2ec2514)
- KA0015 The mobile menu has no accessible name (c12cd49)
- KA0016 The e2e suite cannot start Astro 7 preview: it detaches (2f475d1)
- KA0019 The modal mobile sheet does not move or hold focus (40e700a)
- KA0022 contact-form e2e spec fails now and then in parallel runs (3da9e1f)
- KA0079 Blueprint: the cell tag is unreadable on hover (5677b49)

### Changed

- KA0002 Docs match the code and the harness standards (AGENTS.md) (237e8a7)
- KA0006 Em-dashes left in generated text and docs (f8e8e2e)
- KA0008 `DESIGN.md` still describes `/v2` and the theme toggle (977143c)
- KA0010 Code comments still point at `v2-layout` and `body.v2-body` (d450f62)
- KA0012 `@/stores` path alias with no `src/stores` (aa7a919)
- KA0013 astro-icon 1.2 warns on every build about a missing `src/icons` (e5eee8c)
- KA0017 CSS still carries `light-dark()` pairs whose light half never renders (bba607f)
- KA0024 Drop editor and agent configs, Biome formats .astro instead of Prettier (478c000)
- KA0025 Drop project-plan.md and rewrite README.md (1918d42)
- KA0047 review.md still says package.json has no test script (882b23a)
