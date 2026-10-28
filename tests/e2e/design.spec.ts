import { expect, test } from "@playwright/test";

// Minimal brutalism on every production page (KA0069): square corners, no
// glass, no drifting ribbons over a dot grid - nothing of the old style.
const PAGES = [
  "/",
  "/polityka-prywatnosci/",
  "/regulamin/",
  "/realizacje/",
  "/this-route-does-not-exist",
];

test.describe("minimal brutalism", () => {
  test("no page has a rounded corner, glass or the old atmosphere", async ({
    page,
  }) => {
    await page.goto("/realizacje/");
    const cases = await page
      .locator("#top a[href^='/realizacje/']")
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute("href") ?? "")
      );
    expect(cases.length).toBeGreaterThan(0);

    for (const path of [...PAGES, ...cases]) {
      // biome-ignore lint/performance/noAwaitInLoops: one page at a time
      await page.goto(path, { waitUntil: "domcontentloaded" });
      // Elements that paint nothing (the hidden native checkbox under a choice
      // chip, opacity 0) keep their UA corners; only what shows counts.
      const offenders = await page.evaluate(() =>
        [...document.querySelectorAll("body *")]
          .filter((el) => {
            const style = getComputedStyle(el);
            return (
              el.checkVisibility({ opacityProperty: true }) &&
              (style.borderTopLeftRadius !== "0px" ||
                style.borderBottomRightRadius !== "0px" ||
                style.backdropFilter !== "none" ||
                style.backgroundImage.includes("radial-gradient"))
            );
          })
          .map((el) => `${el.tagName.toLowerCase()}.${el.className}`)
      );
      expect(offenders, path).toEqual([]);
    }
  });

  // Under reduced motion nothing transitions, also where no rule declares a
  // transition: a resize restyles the page in the frame it happens, so no
  // element keeps a wide value for a frame and overflows (KA0086). Paused
  // animations hold that frame, so a transition started by the resize is
  // still listed when the page is read.
  test("under reduced motion a resize restyles every page in the same frame", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/realizacje/");
    const cases = await page
      .locator("#top a[href^='/realizacje/']")
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute("href") ?? "")
      );
    expect(cases.length).toBeGreaterThan(0);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Animation.enable");

    for (const path of [...PAGES, ...cases]) {
      // biome-ignore lint/performance/noAwaitInLoops: one page at a time
      await page.setViewportSize({ height: 900, width: 1440 });
      await page.goto(path, { waitUntil: "networkidle" });
      await cdp.send("Animation.setPlaybackRate", { playbackRate: 0 });
      await page.setViewportSize({ height: 800, width: 360 });
      const frame = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
        transitions: document
          .getAnimations()
          .filter((a) => a instanceof CSSTransition)
          .map((a) => {
            const { target } = a.effect as KeyframeEffect;
            return `${target?.tagName.toLowerCase()}.${target?.className} ${a.transitionProperty}`;
          }),
      }));
      await cdp.send("Animation.setPlaybackRate", { playbackRate: 1 });
      expect(frame.transitions, path).toEqual([]);
      expect(frame.scroll, path).toBeLessThanOrEqual(frame.client);
    }
  });
});
