# KA0045 - The hero and status card still present only a frontend engineer

```json
{
  "id": "KA0045",
  "title": "The hero and status card still present only a frontend engineer",
  "date": "2026-10-10"
}
```

## Description

KA0026 put the AI offer first in the services, the hero subline, `siteConfig.description` and `llms*.txt`, but the h1 ("Buduję interfejsy dla produktów..."), `siteConfig.role` ("Frontend Engineer", also the page title, OG alt and `llms.txt` heading) and the status card's STACK line (React Native · TypeScript · Astro) describe only frontend work. A visitor who came for AI agents or training reads a frontend portfolio above the fold.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: improvement

Evidence:
- `src/components/sections/hero.astro:12`, `src/data/site-config.ts` (`role`, `tagline`)
- Found by: 2026-10-10-ai-offer-first-658231fb (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: a copy ticket for the hero h1, `role` / `tagline` and the status card that names the AI offer next to the frontend work; the human decides the positioning.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- a copy ticket for the hero h1, `role` / `tagline` and the status card that names the AI offer next to the frontend work; the human decides the positioning.

## Decisions

- 2026-10-10: Source: F2 of KA0026
- 2026-10-10: Dropped: KA0036 (Inżynier oprogramowania) carries it.
