# KA0003 - Update dependencies, Astro to the newest release

```json
{
  "id": "KA0003",
  "title": "Update dependencies, Astro to the newest release",
  "date": "2026-10-10"
}
```

## Description

No Dependabot PR was ever merged. `bun outdated` on 2026-10-10: astro 6.2.1 (latest 7.3.8), @astrojs/sitemap 3.7.2 → 3.7.4, astro-icon 1.1.5 → 1.2.0, @playwright/test 1.59.1 → 1.64.0, @biomejs/biome 2.4.14 → 2.5.15, prettier-plugin-astro 0.14.1 → 1.1.1, lint-staged 16 → 17, sharp 0.34 → 0.35, and minor bumps of the rest.

## Goal

The site runs on current, supported releases, including the Astro 7 major, with every check green. The open Dependabot PRs are closed or superseded by this branch.

- Kind: improvement

## Done means

- Every package in `package.json` on its latest release (`bun outdated` lists nothing), `bun.lock` updated; Astro 7 migrated following its upgrade guide, with each breaking change that touched the code named in the final message.
- `packageManager` and the Dockerfile's bun version agree; the Playwright image or browser version in CI matches the new `@playwright/test`.
- The built site looks the same as before: screenshots of home and 404 before and after, sent with the final message.
- `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `package.json`, `bun.lock`, code the Astro 7 and Biome/Prettier majors require, `Dockerfile` and `.github/workflows/ci.yml` only for versions.

Out:
- New features or copy changes.

## Decisions

- 2026-10-10: The human (onboarding answer 11): update the packages and bump Astro, no Dependabot PR was merged.
- 2026-10-10: The human: KA0003 has no budget limit (h continue --budget 0).
