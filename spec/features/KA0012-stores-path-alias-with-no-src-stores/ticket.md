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

Evidence:
- `tsconfig.json:13`, `astro.config.mjs:24`
- Found by: 2026-10-10-docs-and-agents-md-508a76bc (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: remove the alias from both files; `project-plan.md` Faza 0 lists it as history and stays as it is.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- remove the alias from both files; `project-plan.md` Faza 0 lists it as history and stays as it is.

## Decisions

- 2026-10-10: Source: F5 of KA0002
