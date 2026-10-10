# Styleguide

The conventions live in the repository; read them there, this file does not copy them:

- `CLAUDE.md`: `## Stack` (with `### Integracje runtime`), `## Konwencje`, `## Don't`, `## Komendy`, `## Hosting`. There is no `AGENTS.md` yet; KA0002 moves `CLAUDE.md` to it.
- `DESIGN.md`: the tokens in the frontmatter, `## Components`, `## Motion`, `## Do's and Don'ts`. Read it before touching anything visual.
- `CLAUDE.md` `## v2 redesign track` and `## Struktura`, `README.md` and `project-plan.md` are partly stale: v2 already lives at `/` (commit `6e1b55e`), `/v2`, `src/layouts/v2-layout.astro`, `body.v2-body` and the theme toggle are gone, and production is Dokploy, not Cloudflare Pages. Where they disagree with the code, the code is right. KA0002 fixes them.

What follows is only what those files do not say.

## Shape

- One ticket is the scope of a branch. The phases in `project-plan.md` are history, not a limit.
- Copy changes go in their own `copy(<section>): ...` commits, one section per commit, apart from code changes.
- A change in behaviour comes with a new or updated spec in `tests/e2e/`.
- A change to tokens (`src/styles/tokens.css`), the brand mark or the palette updates `DESIGN.md` in the same branch.
- A change to `Dockerfile`, `nginx.conf` or `src/pages/og-default.png.ts` is checked with `docker build -t kacperadler-pl-test .`.

## Simplest solution

- The site is a static Astro build. Content goes in the content collections (`src/content.config.ts`, `src/content/`), site facts in `src/data/site-config.ts`.
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
- Reviving the theming machinery (`data-theme`, a theme toggle, light values) the docs still describe.
