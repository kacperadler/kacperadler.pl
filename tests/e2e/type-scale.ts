import type { Page } from "@playwright/test";

// The text face keeps a short scale besides the headlines (KA0126): 14px
// small (captions, labels, buttons, the nav), 16px body, 20px lead (the hero
// subtitle, the about text, a card's title), and 12px for the form's
// "(opcjonalnie)" hint and the xs button. The drawing's mono marks keep
// their own sizes.
export const TEXT_SIZES: readonly number[] = [12, 14, 16, 20];

// Every shown text in the text face whose size is off the scale, as
// "<size> <element> <text>", leaving out the elements under `offScale`.
// Closed accordions are opened first, as they hold text too; run it under
// reduced motion, so an opened one shows at once.
export const offScaleText = (page: Page, offScale: string) =>
  page.evaluate(
    ({ selector, sizes }) => {
      for (const details of document.querySelectorAll("details")) {
        details.open = true;
      }
      const found: string[] = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
      );
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const el = node.parentElement;
        const text = (node.textContent ?? "").trim();
        if (!(el && text) || el.closest(selector)) {
          continue;
        }
        if (!el.checkVisibility({ visibilityProperty: true })) {
          continue;
        }
        const style = getComputedStyle(el);
        const size = Number.parseFloat(style.fontSize);
        if (style.fontFamily.includes("Mono") || sizes.includes(size)) {
          continue;
        }
        found.push(`${size}px ${el.className || el.tagName} "${text}"`);
      }
      return found;
    },
    { selector: offScale, sizes: TEXT_SIZES }
  );
