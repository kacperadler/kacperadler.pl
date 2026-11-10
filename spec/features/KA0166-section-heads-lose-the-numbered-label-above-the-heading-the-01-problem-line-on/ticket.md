# KA0166 - Section heads lose the numbered label above the heading (the "§ 01 / PROBLEM" line) on every page

```json
{
  "id": "KA0166",
  "title": "Section heads lose the numbered label above the heading (the \"§ 01 / PROBLEM\" line) on every page",
  "date": "2026-11-10"
}
```

## Description

Every section head shows a small mono label above its heading that says what the section is about, such as "§ 01 / PROBLEM" over "Brzmi znajomo?". The owner (2026-11-10, with `owner-screenshot.png` beside this ticket): "We should remove on every section this information what this section is about, we dont need it". The label goes from every page; the heading, the dimension line above it and the lede stay.

## Goal

The label is `<p class="mb-section-label">{label}</p>` in `src/components/mb/section-head.astro:34`, numbered by the `mb-section` counter (`::before` at `:119`). Every `<SectionHead>` passes a `label`: the home sections (`src/components/mb/sections/*.astro`: problems, services, how-i-work, cases, about, faq, contact), `src/pages/realizacje/[...index].astro`, `src/pages/realizacje/[slug].astro`, `src/pages/404.astro`, `src/layouts/legal-layout.astro`, and the UI catalogue (`src/pages/_ui/catalogue.astro`).

- Kind: ux

## Done means

- No page renders `.mb-section-label` or a "§ NN /" text: the `label` prop, its markup, its styles and the `mb-section` counter go (if nothing else reads the counter), and every caller stops passing it.
- Each section still has its accessible heading; the dimension line, brace and lede look as before. Checked in screenshots of the home page at 390 px and 1440 px against `main`.
- The e2e specs that read the label (`tests/e2e/blueprint.spec.ts:46` and `:665`, `home.spec.ts:112`, `design.spec.ts:493` and `:591`) are changed to assert the label is gone, or drop the assertion where it only pinned the label; the catalogue's description of the section head no longer mentions the label.
- The project's checks pass (lint, type check, unit and e2e tests as `AGENTS.md` lists them), and Lighthouse and axe are no worse.

## Scope

In:
- `src/components/mb/section-head.astro`, the callers listed in Goal, `src/styles/global.css` (only comments or rules about the label), the e2e specs listed, `src/pages/_ui/catalogue.astro`.

Out:
- Other numbered marks (card numbers "01.1", step markers): they stay unless the owner says otherwise.

## Decisions
- 2026-11-10: KA0166 approved: remove the section label on every section; the owner: "KA -> We should remove on every section this information what this section is about, we dont need it" (KA-D22)
