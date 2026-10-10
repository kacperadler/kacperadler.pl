# Audit

## The question

What in the repository today works against `spec/vision.md`, or will cost the next ticket time, and is not already a ticket?

## Worth a ticket

- A regression against `spec/vision.md` `## What stays true`: Lighthouse scores, bundle or image weight, an axe violation, motion that ignores `prefers-reduced-motion`, content that needs JavaScript, a cookie or third-party script, non-Polish copy.
- Docs that drift from the code: `AGENTS.md`, `README.md`, `DESIGN.md` describing files, routes or hosting that no longer exist.
- Dead code: an empty content collection such as `src/content/blog`, components or scripts nothing imports.
- Versions pinned out of step: `packageManager` in `package.json` and the `oven/bun` image in `Dockerfile` against the Node version in `.github/workflows/ci.yml`.
- Em-dashes (U+2014) in copy, docs or generated text, such as `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts` and `DESIGN.md`.
- The site saying something the vision no longer does, such as an offer item that was dropped.

## Not worth a ticket

- Single dependency bumps; Dependabot (`.github/dependabot.yml`) opens them, and KA0003 carries the backlog.
- Anything already covered by an open ticket (KA0003 dependencies).
- Style or taste with no rule behind it in `.agents/harness/criteria/styleguide.md`, `AGENTS.md` or `DESIGN.md`.
- `project-plan.md` describing a past state: it is history.

## Priorities

1. A break of `## What stays true`, most of all the contact form not delivering leads.
2. Copy or offer that contradicts the vision.
3. Doc drift that would mislead the next worker.
4. Dead code and version pins.
