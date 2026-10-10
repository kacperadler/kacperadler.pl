# KA0050 - `AGENTS.md` and `README.md` still call Kacper a Frontend Engineer

```json
{
  "id": "KA0050",
  "title": "`AGENTS.md` and `README.md` still call Kacper a Frontend Engineer",
  "date": "2026-10-10"
}
```

## Description

after KA0036 the site names the role "Inżynier oprogramowania" (`siteConfig.role`), but the first line of `AGENTS.md` says "Frontend Engineer (~5 lat, React/TS)" and `README.md` says "Frontend Engineera"; the README's offer list also leaves out the AI agents and automation that KA0026 put first.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: cleanup

Evidence:
- `AGENTS.md:3`, `README.md:3`
- Found by: 2026-10-10-software-engineer-title-257297e0 (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: say "Inżynier oprogramowania" in both and add the AI offer to the README's list; site code stays as it is.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- say "Inżynier oprogramowania" in both and add the AI offer to the README's list; site code stays as it is.

## Decisions

- 2026-10-10: Source: F1 of KA0036
- 2026-10-10: Folded into KA0047 (doc cleanup, running).
