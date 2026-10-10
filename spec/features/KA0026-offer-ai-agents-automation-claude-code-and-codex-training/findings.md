# KA0026 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The contact form has no project type for the AI offer

- Kind: improvement
- Found by: 2026-10-10-ai-offer-first-658231fb (worker), 2026-10-10
- Where: `src/components/contact/contact-form.astro:12`
- What: the "Typ projektu" radios are `webapp | landing | mobile | tool | other`. Someone who came for AI agents, automation or Claude Code / Codex training, now the first service card, has to pick "Inne", so the lead does not say what it is about and the `form-submit { type }` Umami event cannot count AI leads.
- Suggestion: add one radio for the AI offer (for example `{ label: "Agenci AI / szkolenie", value: "ai" }`), first in the list like the card, and cover it in `tests/e2e/contact-form.spec.ts`; check the radio row still wraps on mobile. The NocoDB form view may need the new value accepted on its side.
- Status: fixed in 6a3c226

## F2. The hero and status card still present only a frontend engineer

- Kind: improvement
- Found by: 2026-10-10-ai-offer-first-658231fb (worker), 2026-10-10
- Where: `src/components/sections/hero.astro:12`, `src/data/site-config.ts` (`role`, `tagline`)
- What: KA0026 put the AI offer first in the services, the hero subline, `siteConfig.description` and `llms*.txt`, but the h1 ("Buduję interfejsy dla produktów..."), `siteConfig.role` ("Frontend Engineer", also the page title, OG alt and `llms.txt` heading) and the status card's STACK line (React Native · TypeScript · Astro) describe only frontend work. A visitor who came for AI agents or training reads a frontend portfolio above the fold.
- Suggestion: a copy ticket for the hero h1, `role` / `tagline` and the status card that names the AI offer next to the frontend work; the human decides the positioning.
- Status: open
