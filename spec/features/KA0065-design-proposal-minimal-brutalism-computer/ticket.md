# KA0065 - Design proposal: minimal brutalism computer

```json
{
  "id": "KA0065",
  "title": "Design proposal: minimal brutalism computer",
  "date": "2026-10-10"
}
```

## Description

Six proposals live at `/ui/proposal/<id>` (KA0038-KA0044). The human asked for one more: `minimal-brutalism-computer`, the `minimal-brutalism` proposal (cells drawn by shared 1px ink lines, very heavy Geist headlines, hard offset shadow only on what you act on) crossed with the `computer` one (Geist Mono text, Geist Pixel headlines, windows with file names, reverse video, prompt-style labels, a cursor). Start from both folders in `src/styles/proposals/`; the result is one coherent style, not two stacked.

## Goal

The human sees how the site looks in a minimal brutalism direction with a computer/terminal character, on every component and the home page, and can pick it, drop it or take parts of it.

- Kind: improvement
- Model: anthropic/claude-opus-5-5

## Done means

- `src/styles/proposals/minimal-brutalism-computer/` with its CSS and `meta.json` (name "Minimal brutalism computer", a two-sentence description, references); `/ui/proposal/minimal-brutalism-computer` renders the catalogue and the home copy in it; colors only from the site's palette; any font self-hosted next to `proposal.css` with its license, as the other proposals do, and absent from the production build.
- Every component and state of the catalogue is styled deliberately in this direction, not left at the default; text contrast meets WCAG AA (axe zero on the proposal page, through the suite's loop over every proposal); any animation stops and respects `prefers-reduced-motion`.
- The final message gives a short note on what it took from each parent proposal; no screenshots.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `src/styles/proposals/minimal-brutalism-computer/`.

Out:
- The other proposals (copy from them, do not edit them), the frame (KA0038), the live site.

## Decisions

- 2026-10-10: The human: "one more version, add minimal-brutalism-computer". Proposals run on Opus; merge after PASS; no screenshots, the human clicks through on the dev server.
