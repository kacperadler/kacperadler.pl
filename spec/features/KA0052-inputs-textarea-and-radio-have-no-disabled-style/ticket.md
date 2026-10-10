# KA0052 - Inputs, textarea and radio have no disabled style

```json
{
  "id": "KA0052",
  "title": "Inputs, textarea and radio have no disabled style",
  "date": "2026-10-10"
}
```

## Description

the "disabled" samples on `/ui` look the same as "empty"; only the cursor differs. Button dims to 60% opacity when disabled, the fields do not. The site never disables a field today.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: improvement

Evidence:
- `src/components/ui/input.astro`, `textarea.astro`, `radio.astro`
- Found by: 2026-10-10-ui-catalogue-47d20fec (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: decide the disabled look with the redesign (KA0038) and add it to the three components.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- decide the disabled look with the redesign (KA0038) and add it to the three components.

## Decisions

- 2026-10-10: Source: F2 of KA0037
