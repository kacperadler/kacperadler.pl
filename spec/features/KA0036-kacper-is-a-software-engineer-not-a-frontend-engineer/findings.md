# KA0036 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. `AGENTS.md` and `README.md` still call Kacper a Frontend Engineer

- Kind: cleanup
- Found by: 2026-10-10-software-engineer-title-257297e0 (worker), 2026-10-10
- Where: `AGENTS.md:3`, `README.md:3`
- What: after KA0036 the site names the role "Inżynier oprogramowania" (`siteConfig.role`), but the first line of `AGENTS.md` says "Frontend Engineer (~5 lat, React/TS)" and `README.md` says "Frontend Engineera"; the README's offer list also leaves out the AI agents and automation that KA0026 put first.
- Suggestion: say "Inżynier oprogramowania" in both and add the AI offer to the README's list; site code stays as it is.
- Status: ticket KA0047 (KA0050 folded into it)

## F2. The h1, tagline, OG tagline and status card stack still describe only frontend work

- Kind: improvement
- Found by: 2026-10-10-software-engineer-title-257297e0 (worker), 2026-10-10
- Where: `src/components/sections/hero.astro:12` (h1 "Buduję interfejsy dla produktów..."), `src/data/site-config.ts` (`tagline`, also the OG image and `llms*.txt` quote), `src/components/sections/hero.astro:58` (Stack: React Native · TypeScript · Astro), `src/lib/seo.ts:67` (`knowsAbout` without AI or automation)
- What: KA0036 changed only the title, as its Goal asks. The rest of the positioning KA0026 F2 named is unchanged: above the fold and in the OG image a visitor still reads "Buduję interfejsy" next to a frontend-only stack.
- Suggestion: a copy ticket in which the human picks the h1 / tagline wording and the stack line that names the AI work; `knowsAbout` gains AI agents and automation. Experience roles stay.
- Status: ticket KA0051
