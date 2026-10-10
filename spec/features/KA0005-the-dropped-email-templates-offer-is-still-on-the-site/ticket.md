# KA0005 - The dropped email-templates offer is still on the site

```json
{
  "id": "KA0005",
  "title": "The dropped email-templates offer is still on the site",
  "date": "2026-10-10"
}
```

## Description

Kacper dropped email templates from the offer (KA0001 answers, question 1), but the services collection still publishes "Szablony email" (order 6), so it renders in the services section.

## Goal

The site offers what the vision says: email templates are dropped from the offer, so the services section shows five cards and stays laid out well.

- Kind: improvement

Evidence:
- `src/content/services/email-templates.json`
- Found by: 2026-10-10-onboard-kacperadler-pl-6c85f5ea (worker), 2026-10-10

## Done means

- `src/content/services/email-templates.json` is removed; nothing else references it; the services section renders five cards, and the e2e suite passes. Screenshots of the services section at mobile and desktop width, sent with the final message.
- `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `src/content/services/email-templates.json`, and the services grid styles only if five cards break its layout.

Out:
- The new offer (AI agents, automation, Claude Code / Codex training): its own ticket.

## Decisions

- 2026-10-10: Source: F2 of KA0001
- 2026-10-10: The human approved it.
- 2026-10-10: The human accepted the screenshots ("KA0005 ok"): merge after a PASS.
