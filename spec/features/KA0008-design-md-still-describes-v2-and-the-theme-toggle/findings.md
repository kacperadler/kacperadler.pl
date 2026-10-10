# KA0008 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. CSS still carries `light-dark()` pairs whose light half never renders

- Kind: cleanup
- Found by: 2026-10-10-design-md-dark-only-at-78ab9b6c (worker), 2026-10-10
- Where: `src/styles/tokens.css:1-4`, `src/styles/tokens.css:23-55`; `light-dark(` also in `src/styles/global.css:58`, `src/components/ui/button.astro:112`, `src/components/ui/button.astro:131`, `src/components/ui/card.astro:50`, `src/components/layout/nav.astro:77`, `src/components/layout/nav.astro:148`, `src/components/layout/footer.astro:110`, `src/components/contact/contact-form.astro:286`, `src/components/sections/hero.astro:184`, `src/components/sections/contact.astro:96`, `src/layouts/base-layout.astro:187`, `src/layouts/base-layout.astro:204`, `src/layouts/base-layout.astro:213`
- What: `color-scheme: dark` on `:root` locks every `light-dark()` to its dark value, so each pair carries a dead light value; the `tokens.css` header comment itself says "Future cleanup can drop the pairs entirely". `DESIGN.md` now documents one dark value per token (KA0008), so the CSS is the last place light values remain. The `tokens.css` comment on `--paper` also still calls the contact form "the v1 contact form". KA0008's Scope put CSS out.
- Suggestion: replace each `light-dark(a, b)` with `b`, drop the header note and the "v1" wording in `tokens.css`; rendered colors must not change (compare screenshots before and after). `DESIGN.md` needs no change, its values are already the dark ones.
- Status: ticket KA0017

## F2. `bun run test:e2e` fails when another worktree's job holds port 4329

- Kind: risk
- Found by: 2026-10-10-design-md-dark-only-at-78ab9b6c (worker), 2026-10-10
- Where: `playwright.config.ts` (`webServer` on port 4329)
- What: Parallel jobs run in worktrees on one machine and every one starts `astro preview --port 4329`. On this job, `bun run test:e2e` stopped with `Error: http://localhost:4329 is already used` while `ss -ltnp 'sport = :4329'` showed `astro preview` from `2026-10-10-mobile-menu-accessible-n-264b11e8`. KA0012's review hit the same and worked around it with a throwaway config on port 4341. Turning on `reuseExistingServer` would be worse: it would test the other worktree's build.
- Suggestion: let the port come from an environment variable (default 4329, as `AGENTS.md` says) so the harness can give each job its own, or pick a free port at config load; document it in `AGENTS.md` `## Komendy`.
- Status: dropped (KA0016 covers it; ticket KA0018 dropped)
