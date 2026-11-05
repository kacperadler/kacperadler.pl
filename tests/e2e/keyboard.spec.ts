import { expect, type Page, test } from "@playwright/test";
import sharp from "sharp";

// The home page by keyboard (KA0152): Tab reaches every control in the
// page's order, each one comes into view at once, clear of the sticky
// header, and shows that it has the focus - whatever draws it (the ring of
// global.css, a field's blue shadow, a choice chip's ring on its label).
// The check is the pixels: around the focused element the page must look
// different from the same spot with the focus gone.

// The controls Tab stops at, in document order: what a keyboard user can
// reach on the page as it loads (the mobile sheet stays closed, the success
// card and the honeypot are not shown, closed accordions hide their links).
const reachable = (page: Page) =>
  page.evaluate(() =>
    [
      ...document.querySelectorAll<HTMLElement>(
        "a[href], button, input, textarea, select, summary, [tabindex]"
      ),
    ]
      .filter(
        (el) =>
          el.tabIndex >= 0 &&
          !el.closest("[inert], dialog:not([open])") &&
          el.checkVisibility({ visibilityProperty: true }) &&
          (el.getClientRects().length > 0 || el.closest(".mb-choice"))
      )
      .map((el) => el.outerHTML.slice(0, 80))
  );

// Resolves once every transition on the page has ended: under
// no-preference the skip link slides in and a ring grows out of its edge.
const transitionsDone = (page: Page) =>
  page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation instanceof CSSTransition)
        .map((animation) => animation.finished)
    )
  );

// The focused element's box and 8px around it (a ring stands 3px off the
// edge, 2px wide; a field's shadow 4px), as raw pixels.
const shotAround = async (page: Page, rect: DOMRect) => {
  const viewport = page.viewportSize() ?? { height: 0, width: 0 };
  const x = Math.max(0, Math.floor(rect.x - 8));
  const y = Math.max(0, Math.floor(rect.y - 8));
  const clip = {
    height: Math.min(viewport.height, Math.ceil(rect.bottom + 8)) - y,
    width: Math.min(viewport.width, Math.ceil(rect.right + 8)) - x,
    x,
    y,
  };
  return sharp(await page.screenshot({ clip }))
    .raw()
    .toBuffer();
};

for (const run of [
  { height: 900, reducedMotion: "no-preference", width: 1440 },
  { height: 844, reducedMotion: "reduce", width: 390 },
] as const) {
  test(`at ${run.width}px under ${run.reducedMotion} Tab reaches every control in order, in view and visibly focused`, async ({
    browser,
  }) => {
    test.setTimeout(120_000);
    const context = await browser.newContext({
      reducedMotion: run.reducedMotion,
      viewport: { height: run.height, width: run.width },
    });
    const page = await context.newPage();
    await page.goto("/");
    // The entrance over, so nothing on the first screen still moves.
    await page.waitForTimeout(2500);
    const expected = await reachable(page);
    expect(expected.length).toBeGreaterThan(20);
    const header = await page
      .locator(".mb-header")
      .evaluate((el) => el.getBoundingClientRect().bottom);

    const stops: string[] = [];
    for (const _ of expected) {
      // biome-ignore lint/performance/noAwaitInLoops: one Tab at a time
      await page.keyboard.press("Tab");
      await transitionsDone(page);
      const stop = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        el.dataset.qaFocus = "";
        // A choice's checkbox sits under its chip; the chip shows the focus.
        const shown = el.closest(".mb-choice") ?? el;
        return {
          html: el.outerHTML.replace(' data-qa-focus=""', "").slice(0, 80),
          // The skip link and the header's own controls sit over the page.
          over: el.matches(".skip-link") || el.closest(".mb-header") !== null,
          rect: shown.getBoundingClientRect().toJSON() as DOMRect,
        };
      });
      stops.push(stop.html);
      // In view at once (no glide behind a Tab), clear of the header: the
      // whole element, or its first 40px where it is taller (the message
      // box shows where the caret is), a subpixel past the edge allowed.
      expect(stop.rect.top, stop.html).toBeGreaterThanOrEqual(
        stop.over ? 0 : header - 1
      );
      expect(
        Math.min(stop.rect.bottom, stop.rect.top + 40),
        stop.html
      ).toBeLessThanOrEqual(run.height + 1);
      // Seen focused: the spot changes when the focus goes.
      const focused = await shotAround(page, stop.rect);
      await page.evaluate(() => (document.activeElement as HTMLElement).blur());
      await transitionsDone(page);
      const blurred = await shotAround(page, stop.rect);
      expect(focused.equals(blurred), `${stop.html} shows no focus`).toBe(
        false
      );
      // Back on it, as Tab left it, so the next Tab moves on from here.
      await page.evaluate(() => {
        const el = document.querySelector<HTMLElement>("[data-qa-focus]");
        el?.removeAttribute("data-qa-focus");
        el?.focus({ focusVisible: true, preventScroll: true });
      });
    }
    // Every control, in the page's order.
    expect(stops).toEqual(expected);
    await context.close();
  });
}

// A link to a section of the page glides there; a script's scroll and
// reduced motion jump (scripts/glide.ts, global.css).
test("an in-page link glides to its section, other scrolls and reduced motion jump", async ({
  browser,
}) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    // biome-ignore lint/performance/noAwaitInLoops: one setting at a time
    const context = await browser.newContext({
      reducedMotion,
      viewport: { height: 900, width: 1440 },
    });
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForTimeout(2500);
    // A click that is not on a link to a #fragment marks nothing: a
    // script's scroll right after it jumps.
    await page.locator("#top h1").click();
    await page.evaluate(() =>
      document.querySelector("#faq")?.scrollIntoView({ block: "start" })
    );
    const jumped = await page.evaluate(() => window.scrollY);
    expect(jumped, reducedMotion).toBeGreaterThan(1000);
    await page.evaluate(() => window.scrollTo({ behavior: "instant", top: 0 }));
    const target = await page
      .locator("#faq")
      .evaluate((el) => el.getBoundingClientRect().top);
    await page
      .getByRole("navigation", { name: "Główna nawigacja" })
      .getByRole("link", { exact: true, name: "FAQ" })
      .click();
    // The scroll position on the next twelve frames.
    const ys = await page.evaluate(
      () =>
        new Promise<number[]>((resolve) => {
          const seen: number[] = [];
          const frame = () => {
            seen.push(Math.round(window.scrollY));
            if (seen.length < 12) {
              requestAnimationFrame(frame);
            } else {
              resolve(seen);
            }
          };
          frame();
        })
    );
    const between = ys.filter((y) => y > 0 && y < target - 200);
    if (reducedMotion === "reduce") {
      expect(between, reducedMotion).toEqual([]);
    } else {
      expect(between.length, reducedMotion).toBeGreaterThan(2);
    }
    await expect
      .poll(() => page.evaluate(() => Math.round(window.scrollY)))
      .toBeGreaterThan(target - 200);
    // The glide over, its mark goes, so a script's scroll jumps.
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.dataset.glide ?? null)
      )
      .toBeNull();
    await page.evaluate(() =>
      document.querySelector("#top")?.scrollIntoView({ block: "start" })
    );
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await context.close();
  }
});
