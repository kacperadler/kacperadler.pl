# Styleguide

The conventions live in the repository; read them there, this file does not copy them:

- `AGENTS.md`: `## Stack` (with `### Integracje runtime`), `## Konwencje`, `## Don't`, `## Komendy`, `## Hosting`, `## Wygląd`, `## Struktura`.
- `DESIGN.md`: the tokens in the frontmatter, `## Components`, `## Motion`, `## Do's and Don'ts`. Read it before touching anything visual.
- `project-plan.md` is history: its phases are closed and its plan sections describe what was intended then. `DESIGN.md` still names `/v2`, `v2.astro`, `body.v2-body` and the theme toggle in places (KA0002 findings, F1). Where a doc disagrees with the code, the code is right.

What follows is only what those files do not say.

## Shape

- One ticket is the scope of a branch. The phases in `project-plan.md` are history, not a limit.
- Copy changes go in their own `copy(<section>): ...` commits, one section per commit, apart from code changes.
- A change in behaviour comes with a new or updated spec in `tests/e2e/`.
- A change to tokens (`src/styles/tokens.css`), the brand mark or the palette updates `DESIGN.md` in the same branch.
- A change to `Dockerfile`, `nginx.conf` or `src/pages/og-default.png.ts` is checked with `docker build -t kacperadler-pl-test .`.

## Simplest solution

- The site is a static Astro build; the only exception is the lead-store API route, rendered on demand (`prerender = false`) with the Node adapter. Content goes in the content collections (`src/content.config.ts`, `src/content/`), site facts in `src/data/site-config.ts`. Case studies and blog posts are Markdown or MDX entries, not JSON.
- Reuse the UI primitives in `src/components/ui/` (`button.astro`, `card.astro`, `input.astro`, `textarea.astro`) and the shared styles in `src/styles/global.css` before writing a new component or new CSS.
- Behaviour is vanilla TS in `src/scripts/`; CSS and the platform before a new dependency.

## Prefer

- Polish copy, in the tone of the existing sections.
- A hyphen (` - `) where an em-dash would go.
- Existing tokens from `src/styles/tokens.css` over raw values.

## Avoid

- Em-dashes (U+2014), anywhere: copy, docs, comments, generated text. Never add one.
- English user-facing copy.
- Cookies, third-party scripts or trackers.
- Reviving the theming machinery (`data-theme`, a theme toggle, light values) that `project-plan.md` and `DESIGN.md` still describe.
