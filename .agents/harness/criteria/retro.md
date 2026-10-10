# Retro

## The question

Across recent jobs here, what keeps costing time or review rounds, and which change to the criteria, the docs or the checks would stop it?

## A pattern

- The same thing in at least two jobs, not one bad run.
- Typical here: a worker trusting the history in `project-plan.md` (`/v2`, `v2-layout`, theming) over the code; e2e specs in `tests/e2e/` breaking on copy changes; `bun run test:e2e` failing on the environment (no `bun` on PATH, a missing Playwright browser) rather than on the code; a branch failing review for an em-dash or for skipping the `DESIGN.md` update.

## A good proposal

- Names the pattern, the jobs it showed up in, and one concrete change: a line in `.agents/harness/criteria/*.md`, a fix to a doc, or a check.
- Small enough to be one ticket.

## Leave alone

- `spec/vision.md`: it is the human's; propose changes, do not draft them.
- One-off failures with a clear single cause.
- The checks in `.github/workflows/ci.yml` and the hooks in `.husky/pre-commit`, unless a pattern shows they miss something.
