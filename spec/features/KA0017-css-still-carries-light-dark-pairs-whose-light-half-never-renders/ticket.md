# KA0017 - CSS still carries `light-dark()` pairs whose light half never renders

```json
{
  "id": "KA0017",
  "title": "CSS still carries `light-dark()` pairs whose light half never renders",
  "date": "2026-10-10",
  "after": [
    "KA0016"
  ]
}
```

## Description

`color-scheme: dark` on `:root` locks every `light-dark()` to its dark value, so each pair carries a dead light value; the `tokens.css` header comment itself says "Future cleanup can drop the pairs entirely". `DESIGN.md` now documents one dark value per token (KA0008), so the CSS is the last place light values remain. The `tokens.css` comment on `--paper` also still calls the contact form "the v1 contact form". KA0008's Scope put CSS out.

## Goal

The CSS says what renders: one dark value per color, as DESIGN.md and the dark-only vision say, so nobody edits a light value that never shows.

- Kind: cleanup

Evidence:
- `src/styles/tokens.css:1-4`, `src/styles/tokens.css:23-55`; `light-dark(` also in `src/styles/global.css:58`, `src/components/ui/button.astro:112`, `src/components/ui/button.astro:131`, `src/components/ui/card.astro:50`, `src/components/layout/nav.astro:77`, `src/components/layout/nav.astro:148`, `src/components/layout/footer.astro:110`, `src/components/contact/contact-form.astro:286`, `src/components/sections/hero.astro:184`, `src/components/sections/contact.astro:96`, `src/layouts/base-layout.astro:187`, `src/layouts/base-layout.astro:204`, `src/layouts/base-layout.astro:213`
- Found by: 2026-10-10-design-md-dark-only-at-78ab9b6c (worker), 2026-10-10

## Done means

- Every `light-dark(a, b)` in `src/` becomes `b`; `git grep -n 'light-dark(' src` finds nothing; the `tokens.css` header note and its "v1 contact form" wording are gone.
- Computed colors do not change: an e2e or throwaway Playwright check reads `getComputedStyle` of the tokens on `:root` and of a button, card, nav and the contact form before and after and they are equal; screenshots of home desktop and mobile before and after are pixel-identical.
- `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `src/styles/tokens.css`, `src/styles/global.css`, and the components and layouts listed under Evidence (the `light-dark()` lines only).

## Decisions

- 2026-10-10: Source: F1 of KA0008
- 2026-10-10: Approved under the human's standing word (every KA finding approved until the final report).
