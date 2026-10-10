# KA0012 - `@/stores` path alias with no `src/stores`

```json
{
  "id": "KA0012",
  "title": "`@/stores` path alias with no `src/stores`",
  "date": "2026-10-10"
}
```

## Description

Both configs map `@/stores` to `src/stores`, which does not exist (nanostores was planned in `project-plan.md` but never added). The alias is dead config; `AGENTS.md` and `README.md` no longer list it.

## Goal

No dead path alias: `@/stores` goes from the configs until a store exists.

- Kind: cleanup
- Model: haiku

Evidence:
- `tsconfig.json:13`, `astro.config.mjs:24`
- Found by: 2026-10-10-docs-and-agents-md-508a76bc (worker), 2026-10-10

## Done means

- `@/stores` is gone from `tsconfig.json` and `astro.config.mjs`; nothing imports it; `project-plan.md` stays as it is.
- `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `tsconfig.json`, `astro.config.mjs`.

## Decisions

- 2026-10-10: Source: F5 of KA0002
- 2026-10-10: The human approved it.
