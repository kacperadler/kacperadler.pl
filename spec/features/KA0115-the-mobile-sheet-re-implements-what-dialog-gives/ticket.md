# KA0115 - The mobile sheet re-implements what `<dialog>` gives

```json
{
  "id": "KA0115",
  "title": "The mobile sheet re-implements what `<dialog>` gives",
  "date": "2026-10-28",
  "after": [
    "KA0117"
  ]
}
```

## Description

good-css "`:has()` for parent and page state" (`html:has(dialog:modal) { overflow: hidden }`) and "Enter and exit transitions from `display: none`" (`interaction.md`, `show-and-hide.md`). A `<dialog>` opened with `showModal()` makes the page inert, closes on Escape, returns focus to the opener and sits in the top layer; the scroll lock becomes one CSS rule. Visible change: none.

## Goal

The mobile menu sheet uses the native dialog element, keeping focus, Escape and the backdrop with less code.

- Kind: cleanup

Evidence:
- `src/scripts/mobile-sheet.ts:41-63` (inert on every body child, `aria-hidden`, body scroll lock), `:122-134` (Escape); `src/components/mb/mobile-sheet.astro:35`
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: render the sheet as `<dialog>`, open with `showModal()`, close with `close()`; drop the inert loop, the Escape branch and the inline scroll lock. AGENTS.md requires Tab to wrap inside the sheet; a modal dialog lets Tab leave to the browser UI, so `trapTab` stays. Cost: about 30 lines removed, `mobile-sheet.spec.ts` rerun (it asserts inert, focus and Esc), the ClientRouter swap (`syncOnLoad`) checked with an open dialog.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- render the sheet as `<dialog>`, open with `showModal()`, close with `close()`; drop the inert loop, the Escape branch and the inline scroll lock. AGENTS.md requires Tab to wrap inside the sheet; a modal dialog lets Tab leave to the browser UI, so `trapTab` stays. Cost: about 30 lines removed, `mobile-sheet.spec.ts` rerun (it asserts inert, focus and Esc), the ClientRouter swap (`syncOnLoad`) checked with an open dialog.

## Decisions

- 2026-10-28: Source: F11 of KA0104
- 2026-10-28: The human approved it; runs one at a time after KA0117 (shared CSS files).
