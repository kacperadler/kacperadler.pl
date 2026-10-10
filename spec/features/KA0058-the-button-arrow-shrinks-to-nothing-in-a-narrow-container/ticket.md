# KA0058 - The button arrow shrinks to nothing in a narrow container

```json
{
  "id": "KA0058",
  "title": "The button arrow shrinks to nothing in a narrow container",
  "date": "2026-10-10"
}
```

## Description

the icon is a flex item without `flex-shrink: 0`; when the button is wider than its container the svg gives up its 14px first. On `/ui/proposal/minimal` (14px Geist, 22px padding) the primary md samples in the catalogue's 160px columns showed no arrow until the proposal set `flex-shrink: 0`. Not checked on the baseline design.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: bug

Evidence:
- `src/components/ui/button.astro` (`.btn :global(.btn-icon)`)
- Found by: 2026-10-10-proposal-minimal-a56f3f1a (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: `flex-shrink: 0` on `.btn-icon` in `button.astro`, like `.btn-spinner` already has.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- `flex-shrink: 0` on `.btn-icon` in `button.astro`, like `.btn-spinner` already has.

## Decisions

- 2026-10-10: Source: F3 of KA0039
