# KA0001 - Onboarding: vision and criteria for kacperadler.pl

```json
{
  "id": "KA0001",
  "title": "Onboarding: vision and criteria for kacperadler.pl",
  "date": "2026-10-10"
}
```

## Description

The repository joins the harness. The onboarding job reads it and drafts `spec/vision.md` and `.agents/harness/criteria/*.md`, so later tickets, reviews and audits judge work here by this project's own rules.

## Goal

A vision and criteria the human accepts, built from what the repository already says: `README.md`, `CLAUDE.md`, `DESIGN.md`, `project-plan.md`, `.github/workflows/ci.yml`, `package.json` (Astro 6, Bun, Biome/Ultracite, Prettier, Playwright, Cloudflare Pages).

- Kind: improvement

## Done means

- The first run commits nothing and ends with a picture of the repository and at most 10 numbered questions, each with a proposed answer.
- After the human's answers: `spec/vision.md` and `.agents/harness/criteria/*.md` drafted from those answers and the repository's existing conventions (CLAUDE.md, DESIGN.md), not the harness's; the checks the criteria name are the repository's own (`bun run check`, `bun run lint`, `bun run build`, `bun run test:e2e`).
- The branch changes only those files and `findings.md` in this folder.

## Scope

In:
- `spec/vision.md`, `.agents/harness/criteria/*.md`, this ticket's `findings.md`.

Out:
- Any code, content or config change in the site.

## Decisions

- 2026-10-10: The human asked to clone git@github.com:kacperadler/kacperadler.pl.git and onboard it; prefix KA.
