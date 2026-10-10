# KA0026 - Offer: AI agents, automation, Claude Code and Codex training

```json
{
  "id": "KA0026",
  "title": "Offer: AI agents, automation, Claude Code and Codex training",
  "date": "2026-10-10"
}
```

## Description

The vision adds implementing AI agents in companies, automation, and Claude Code / Codex training to the offer; `src/content/services/` has five cards (web apps, internal tools, landing pages, mobile apps, business cards), each `{title, description, tags, order}`.

## Goal

The site offers what Kacper sells now, first: the people the vision names see the AI offer before the rest and send the form.

- Kind: improvement

## Done means

- New service card(s) for AI agents and automation in companies, and Claude Code / Codex training, written in the voice, length and shape of the existing five (first person, one or two sentences, 3-4 tags); one card or two, the worker's call from what reads best in the grid, said in the final message with the copy.
- The AI offer has `order: 1` and comes first in the services section and in `llms.txt` / `llms-full.txt`; the others keep their relative order.
- The services grid still lays out (KA0005's spec passes for the new count); screenshots of the section, desktop and mobile, in the final message; no em-dash.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass (and the Biome format check that replaces `prettier --check`, once KA0024 is in).

## Scope

In:
- `src/content/services/`, `src/pages/llms*.txt.ts`, the hero or nav copy only if it names the services, layout styles only if the grid needs it.

Out:
- Prices, a separate training page.

## Decisions

- 2026-10-10: The human: focus on developing KA first; remove `.claude`, `.vscode`, `.zed`; with Biome, Prettier is not needed; look over the repo for what to clean and what to keep; drop `project-plan.md`, turn what is left into tickets, and improve `README.md`.
- 2026-10-10: The human: model the AI offer on the existing cards, and put it first.
