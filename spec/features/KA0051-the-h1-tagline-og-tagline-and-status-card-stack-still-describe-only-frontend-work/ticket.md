# KA0051 - The h1, tagline, OG tagline and status card stack still describe only frontend work

```json
{
  "id": "KA0051",
  "title": "The h1, tagline, OG tagline and status card stack still describe only frontend work",
  "date": "2026-10-10"
}
```

## Description

KA0036 changed only the title, as its Goal asks. The rest of the positioning KA0026 F2 named is unchanged: above the fold and in the OG image a visitor still reads "Buduję interfejsy" next to a frontend-only stack.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: improvement

Evidence:
- `src/components/sections/hero.astro:12` (h1 "Buduję interfejsy dla produktów..."), `src/data/site-config.ts` (`tagline`, also the OG image and `llms*.txt` quote), `src/components/sections/hero.astro:58` (Stack: React Native · TypeScript · Astro), `src/lib/seo.ts:67` (`knowsAbout` without AI or automation)
- Found by: 2026-10-10-software-engineer-title-257297e0 (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: a copy ticket in which the human picks the h1 / tagline wording and the stack line that names the AI work; `knowsAbout` gains AI agents and automation. Experience roles stay.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- a copy ticket in which the human picks the h1 / tagline wording and the stack line that names the AI work; `knowsAbout` gains AI agents and automation. Experience roles stay.

## Decisions

- 2026-10-10: Source: F2 of KA0036
- 2026-10-10: Waits for the redesign (KA0037-KA0044): the hero copy and layout are decided there, with the human.
- 2026-10-14: Folded into KA0075 with the redesign brief.
