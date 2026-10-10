# KA0026 - Offer: AI agents, automation, Claude Code and Codex training

```json
{
  "id": "KA0026",
  "title": "Offer: AI agents, automation, Claude Code and Codex training",
  "date": "2026-10-10"
}
```

## Description

The vision adds implementing AI agents in companies, automation, and Claude Code / Codex training to the offer; the services collection has five cards (web apps, internal tools, landing pages, mobile apps, business cards).

## Goal

The site offers what Kacper sells now, so the people the vision names find the new services and send the form.

- Kind: improvement

## Done means

- New services in `src/content/services/` with the copy the human approves (titles, descriptions, order); `llms.txt` and `llms-full.txt` list them; the services grid still lays out (KA0005's spec passes); screenshots desktop and mobile in the final message.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass (and the Biome format check that replaces `prettier --check`, once KA0024 is in).

## Scope

In:
- `src/content/services/`, `src/pages/llms*.txt.ts`, layout styles only if the grid needs it.

Out:
- Prices, a separate training page.

## Decisions

- 2026-10-10: The human: focus on developing KA first; remove `.claude`, `.vscode`, `.zed`; with Biome, Prettier is not needed; look over the repo for what to clean and what to keep; drop `project-plan.md`, turn what is left into tickets, and improve `README.md`.
- 2026-10-10: Needs from the human before it starts: how many cards (one per service or one AI card), and the copy or its points.
