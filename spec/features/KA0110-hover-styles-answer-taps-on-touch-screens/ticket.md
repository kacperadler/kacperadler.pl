# KA0110 - Hover styles answer taps on touch screens

```json
{
  "id": "KA0110",
  "title": "Hover styles answer taps on touch screens",
  "date": "2026-10-28",
  "after": [
    "KA0114"
  ]
}
```

## Description

good-css "Hover styles only where hover exists" (`interaction.md`) and the reset's `-webkit-tap-highlight-color: transparent` / `touch-action: manipulation` (`foundations.md`). None of the hover rules sit inside `@media (hover: hover) and (pointer: fine)`. [INFERENCE] on a phone a tap can leave a cell selected (panel lit, grips, blue "01.3 ↔ 368") or a button lifted until the next tap elsewhere, and Android draws its grey tap rectangle over the square cells; Chromium's mobile emulation does not reproduce sticky hover (probe: after a tap `:hover` did not match), so this needs a real phone. The press states (24 `:active` rules outside /ui, `rg -c`) already give touch feedback.

## Goal

On a touch screen a tap does not leave a hover look stuck on a card or button.

- Kind: improvement

Evidence:
- 43 `:hover` rules in 19 files under `src/components/mb/` (`rg -c ':hover'`), e.g. `card.astro:194-218` (the CAD selection), `button.astro:332-385` (fills and the lifted face); `src/styles/global.css` has no `-webkit-tap-highlight-color` or `touch-action`
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: wrap the hover selectors in the media query (they share their rule with `[data-state="hover"]` for the /ui catalogue, so each `:is(:hover, [data-state="hover"])` splits into a guarded `:hover` rule and an unguarded `[data-state]` rule), add the two reset lines. Cost: the largest CSS change in this list, 19 files, no visible change with a mouse; check on a real phone. Out: the `:active` styles.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- wrap the hover selectors in the media query (they share their rule with `[data-state="hover"]` for the /ui catalogue, so each `:is(:hover, [data-state="hover"])` splits into a guarded `:hover` rule and an unguarded `[data-state]` rule), add the two reset lines. Cost: the largest CSS change in this list, 19 files, no visible change with a mouse; check on a real phone. Out: the `:active` styles.

## Decisions

- 2026-10-28: Source: F6 of KA0104
- 2026-10-28: The human approved it; runs one at a time after KA0114 (shared CSS files).
