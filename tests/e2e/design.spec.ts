import { expect, type Page, test } from "@playwright/test";

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

// The section rhythm and the headlines are fluid (KA0113): one clamp() each,
// rem bounds and a rem + vw slope from a 390px phone to the 1160px
// container, so they grow with the width without a step and follow the
// reader's default font size, set here as a browser preference over CDP.
const sizesAt = async (page: Page, width: number) => {
  await page.setViewportSize({ height: 900, width });
  return page.evaluate(() => {
    const px = (selector: string, property: "fontSize" | "marginTop") =>
      Number.parseFloat(
        getComputedStyle(document.querySelector(selector) as Element)[property]
      );
    return {
      block: px(".mb-problems-close", "marginTop"),
      hero: px("h1", "fontSize"),
      section: px(".mb-services", "marginTop"),
      title: px(".mb-section-title", "fontSize"),
    };
  });
};

const setDefaultFontSize = async (page: Page, standard: number) => {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Page.enable");
  await cdp.send("Page.setFontSizes", { fontSizes: { fixed: 13, standard } });
};

test.describe("fluid sizes", () => {
  test("the section rhythm and the headlines grow with the width without a step, held at a phone and the container", async ({
    page,
  }) => {
    await page.goto("/");
    const phone = { block: 32, hero: 40, section: 88, title: 32 };
    const desk = { block: 48, hero: 64, section: 136, title: 54 };
    for (const width of [360, 390]) {
      // biome-ignore lint/performance/noAwaitInLoops: one width at a time
      const at = await sizesAt(page, width);
      for (const key of Object.keys(phone) as (keyof typeof phone)[]) {
        expect(at[key], `${key} at ${width}px`).toBeCloseTo(phone[key], 2);
      }
    }
    for (const width of [1160, 1440]) {
      // biome-ignore lint/performance/noAwaitInLoops: one width at a time
      const at = await sizesAt(page, width);
      for (const key of Object.keys(desk) as (keyof typeof desk)[]) {
        expect(at[key], `${key} at ${width}px`).toBeCloseTo(desk[key], 2);
      }
    }

    // In between every size sits strictly between its ends and grows with
    // each 20px of width; across 880px it moves by a sliver, not a step.
    let previous = await sizesAt(page, 400);
    for (let width = 420; width <= 1140; width += 20) {
      // biome-ignore lint/performance/noAwaitInLoops: one width at a time
      const at = await sizesAt(page, width);
      for (const key of Object.keys(phone) as (keyof typeof phone)[]) {
        expect(at[key], `${key} at ${width}px`).toBeGreaterThan(phone[key]);
        expect(at[key], `${key} at ${width}px`).toBeLessThan(desk[key]);
        expect(at[key], `${key} at ${width}px`).toBeGreaterThan(previous[key]);
        expect(
          at[key] - previous[key],
          `${key} from ${width - 20}px to ${width}px`
        ).toBeLessThan(2);
      }
      previous = at;
    }
  });

  test("the headlines and the rhythm follow the reader's default font size", async ({
    page,
  }) => {
    await setDefaultFontSize(page, 20);
    await page.goto("/");
    const wide = await sizesAt(page, 1920);
    expect(wide.hero).toBeCloseTo(80, 2);
    expect(wide.title).toBeCloseTo(67.5, 2);
    expect(wide.section).toBeCloseTo(170, 2);
    expect(wide.block).toBeCloseTo(60, 2);
    // At 1000px every size is on its slope at both settings, so only the
    // slope's rem share can make the larger font larger there.
    const larger = await sizesAt(page, 1000);
    await setDefaultFontSize(page, 16);
    await page.reload();
    const usual = await sizesAt(page, 1000);
    for (const key of Object.keys(larger) as (keyof typeof larger)[]) {
      expect(larger[key], `${key} at 1000px`).toBeGreaterThan(usual[key]);
    }
  });

  // A larger default font must not push a headline's longest unbreakable
  // word past a phone's edge: the headlines are capped at a share of the
  // viewport.
  test("with a large default font on a narrow screen no page scrolls sideways", async ({
    page,
  }) => {
    await page.goto("/realizacje/");
    const cases = await page
      .locator("#top a[href^='/realizacje/']")
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute("href") ?? "")
      );
    expect(cases.length).toBeGreaterThan(0);

    for (const standard of [20, 24, 32]) {
      // biome-ignore lint/performance/noAwaitInLoops: one setting at a time
      await setDefaultFontSize(page, standard);
      for (const path of [...PAGES, ...cases]) {
        // biome-ignore lint/performance/noAwaitInLoops: one page at a time
        await page.goto(path, { waitUntil: "domcontentloaded" });
        await page.evaluate(() => document.fonts.ready);
        for (const width of [320, 360, 390, 430, 480, 600]) {
          // biome-ignore lint/performance/noAwaitInLoops: one width at a time
          await page.setViewportSize({ height: 800, width });
          const frame = await page.evaluate(() => ({
            client: document.documentElement.clientWidth,
            scroll: document.documentElement.scrollWidth,
          }));
          expect(
            frame.scroll,
            `${path} at ${width}px, default font ${standard}px`
          ).toBeLessThanOrEqual(frame.client);
        }
      }
    }
  });
});
