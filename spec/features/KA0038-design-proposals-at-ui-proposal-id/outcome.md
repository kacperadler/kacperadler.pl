# KA0038 - Outcome

- Merged: 2026-10-10, `4d48281`
- Branch: h/2026-10-10-proposal-frame-bfdbe7b6
- Reviews: review-1.md PASS
- Cost: worker $2.83, reviews $0.54; review rounds 1

## What went in

- `src/lib/proposals.ts`: loads every `src/styles/proposals/<id>/` (`meta.json` + `proposal.css`), fails loudly on a half folder, bad meta or non-slug id; sorted by id. `baseline` (the current design) ships as the sample.
- `src/pages/_ui/proposal/`: `/ui/proposal` lists proposals with a one-line description; `/ui/proposal/<id>` renders a home page copy and the catalogue with the proposal's CSS last in `<body>`, and a bar switching between proposals, the list and the current design.
- `src/pages/_ui/catalogue.astro`: the catalogue moved out of `/ui` so proposal pages reuse it; `/ui` wraps it and links the proposals.
- `src/layouts/base-layout.astro`: optional `proposal` prop sets `data-proposal` on `<html>`; production pages render without it.
- `astro.config.mjs`: `/ui`, `/ui/proposal`, `/ui/proposal/[id]` injected only under `astro dev`; no `dist/ui/`.
- `tests/e2e/ui-proposals.spec.ts`: list, switcher, a proposal page, CSS precedence, axe, and 404 in the production build. `AGENTS.md`: how to add a proposal.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
