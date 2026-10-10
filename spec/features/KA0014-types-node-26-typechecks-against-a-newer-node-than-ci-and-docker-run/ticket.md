# KA0014 - `@types/node` 26 typechecks against a newer Node than CI and Docker run

```json
{
  "id": "KA0014",
  "title": "`@types/node` 26 typechecks against a newer Node than CI and Docker run",
  "date": "2026-10-10",
  "after": [
    "KA0004"
  ]
}
```

## Description

KA0003 moved every package to its latest release, so `@types/node` went 25 → 26, while CI builds on Node 22. A Node 23-26 API used in `src/` or a config would typecheck and then fail at build time on Node 22.

## Goal

The types the code is checked against match the Node that builds the site, so an API that is not there fails `astro check`, not the build.

- Kind: risk
- Model: haiku

Evidence:
- `package.json` (`@types/node`), `.github/workflows/ci.yml` (`node-version: "22"`)
- Found by: 2026-10-10-deps-and-astro-7-3f9b93b9 (worker), 2026-10-10

## Done means

- `@types/node` is pinned to `^22`, the Node major CI builds on; `bun run check` passes; `bun outdated` lists it and TypeScript, both by decision.
- `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `package.json`, `bun.lock`.

## Decisions

- 2026-10-10: Source: F2 of KA0003
- 2026-10-10: Rebuilt by the coordinator from F2 of KA0003: an earlier edit had emptied this file.
- 2026-10-10: The human approved it.
