import { expect, type Page, test } from "@playwright/test";
import { FADES, motionOf } from "./motion";
import { offScaleText } from "./type-scale";

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

  // Under reduced motion nothing that moves transitions (a colour fades, it
  // never widens anything): a resize restyles the page's layout in the frame
  // it happens, so no element keeps a wide value for a frame and overflows
  // (KA0086). Paused animations hold that frame, so a transition started by
  // the resize is still listed when the page is read.
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
      // The page as a visitor sees it before the resize: loaded, in Geist.
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
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
      expect(
        frame.transitions.filter(
          (transition) => !FADES.includes(transition.split(" ").at(-1) ?? "")
        ),
        path
      ).toEqual([]);
      expect(frame.scroll, path).toBeLessThanOrEqual(frame.client);
    }
  });

  // Motion is opt-in (KA0116): every page moves under no-preference, and
  // under reduced motion nothing does - no transform, height, shadow or
  // focus ring transitions, no animation, no smooth scroll - while the
  // colour and opacity fades stay.
  test("under reduced motion nothing moves on any page, colour fades stay", async ({
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

    for (const path of [...PAGES, ...cases]) {
      // biome-ignore lint/performance/noAwaitInLoops: one page at a time
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(await motionOf(page), path).toEqual([]);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      expect(await motionOf(page), path).toContain(
        "html scroll-behavior: smooth"
      );
    }

    // The header's nav link still fades its colour on hover.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/");
    const nav = page
      .getByRole("navigation", { name: "Główna nawigacja" })
      .getByRole("link", { exact: true, name: "Oferta" });
    await nav.evaluate((el) => {
      el.addEventListener("transitionrun", (event) => {
        const { propertyName } = event as TransitionEvent;
        el.dataset.transitionsRun = `${el.dataset.transitionsRun ?? ""}${propertyName};`;
      });
    });
    await nav.hover();
    await expect(nav).toHaveAttribute("data-transitions-run", "color;");
  });

  // The hairline is mixed from the ink (KA0117), not a copy of its RGB: a new
  // --ink takes the hairline with it, and over the substrate today's ink
  // still paints the grey the hard-coded value did, rgb(32, 34, 36).
  test("the hairline is the ink at 10% and follows a new ink", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Paints the substrate, then the hairline (or a reference colour) over
    // it into one canvas pixel, with --ink set to `ink` while it is read.
    const paint = (ink: string | null, over: string) =>
      page.evaluate(
        ([newInk, colour]) => {
          const root = document.documentElement;
          if (newInk) {
            root.style.setProperty("--ink", newInk);
          }
          const probe = document.createElement("div");
          probe.style.color = colour;
          probe.style.backgroundColor = "var(--v2-bg)";
          document.body.append(probe);
          const { color, backgroundColor } = getComputedStyle(probe);
          probe.remove();
          root.style.removeProperty("--ink");
          const canvas = document.createElement("canvas");
          canvas.width = 1;
          canvas.height = 1;
          const context = canvas.getContext("2d") as CanvasRenderingContext2D;
          context.fillStyle = backgroundColor;
          context.fillRect(0, 0, 1, 1);
          context.fillStyle = color;
          context.fillRect(0, 0, 1, 1);
          return [...context.getImageData(0, 0, 1, 1).data.slice(0, 3)];
        },
        [ink, over] as const
      );

    expect(await paint(null, "var(--v2-line)")).toEqual([32, 34, 36]);
    // The trip through oklch may round a channel one step off the sRGB tint.
    for (const [ink, tenth] of [
      ["#ece7dc", "rgba(236, 231, 220, 0.1)"],
      ["#ff0000", "rgba(255, 0, 0, 0.1)"],
      ["#00ff80", "rgba(0, 255, 128, 0.1)"],
    ] as const) {
      // biome-ignore lint/performance/noAwaitInLoops: one ink at a time
      const hairline = await paint(ink, "var(--v2-line)");
      const reference = await paint(null, tenth);
      expect(
        Math.max(...hairline.map((c, i) => Math.abs(c - (reference[i] ?? 0)))),
        `${ink}: hairline ${hairline}, ink at 10% ${reference}`
      ).toBeLessThanOrEqual(1);
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

// Sets the browser's default font size and opens the page under it; waits
// until the root reads it, so no size is measured under another setting.
const openWithDefaultFont = async (
  page: Page,
  path: string,
  standard: number
) => {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Page.enable");
  await cdp.send("Page.setFontSizes", { fontSizes: { fixed: 13, standard } });
  await page.goto(path);
  await expect
    .poll(
      () =>
        page.evaluate(
          () => getComputedStyle(document.documentElement).fontSize
        ),
      `the root on ${path} under a ${standard}px default font`
    )
    .toBe(`${standard}px`);
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
    await openWithDefaultFont(page, "/", 20);
    const wide = await sizesAt(page, 1920);
    expect(wide.hero).toBeCloseTo(80, 2);
    expect(wide.title).toBeCloseTo(67.5, 2);
    expect(wide.section).toBeCloseTo(170, 2);
    expect(wide.block).toBeCloseTo(60, 2);
    // At 1000px every size is on its slope at both settings, so only the
    // slope's rem share can make the larger font larger there.
    const larger = await sizesAt(page, 1000);
    await openWithDefaultFont(page, "/", 16);
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
      for (const path of [...PAGES, ...cases]) {
        // biome-ignore lint/performance/noAwaitInLoops: one page at a time
        await openWithDefaultFont(page, path, standard);
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

// Running text - leads, card sentences, FAQ answers, the hero subtitle,
// prose - is set in the full ink at 16px or more; the dimmer grey stays for
// notes, captions and the drawing (KA0124). The ink is read from the page's
// own --ink, so the test follows the palette.
const RUNNING_TEXT = {
  "/": [
    ".mb-hero-sub",
    ".mb-section-lede",
    ".mb-problem",
    ".mb-problem-effect",
    ".mb-service-fact dd:not(.mb-service-note)",
    ".mb-services-apps-text",
    ".mb-cases-row dd",
    ".mb-step-desc",
    ".mb-about-text > p",
    ".mb-exp-desc",
    ".mb-faq .mb-accordion-content p",
    ".mb-form-success p",
  ],
  "/polityka-prywatnosci/": [".mb-section-lede", ".mb-prose p"],
  "/realizacje/": [".mb-section-lede", ".mb-case-summary"],
  case: [".mb-section-lede", ".mb-prose p"],
};

const NOTES = [
  ".mb-section-label",
  ".mb-status-caption",
  ".mb-trust-caption",
  ".mb-contact-label",
  "[data-contact-form] .mb-label",
  ".mb-footer-title",
  ".mb-status-text",
  ".mb-service-fact dt",
  ".mb-service-note",
  ".mb-cases-row dt",
];

// Each element the selectors match: its colour, its font size, and the
// colour --ink computes to on the same page.
const textOf = (page: Page, selectors: string[]) =>
  page.evaluate((list) => {
    const probe = document.createElement("span");
    probe.style.color = "var(--ink)";
    document.body.append(probe);
    const ink = getComputedStyle(probe).color;
    probe.remove();
    return list.map((selector) => ({
      elements: [...document.querySelectorAll(selector)].map((el) => {
        const style = getComputedStyle(el);
        return {
          color: style.color,
          size: Number.parseFloat(style.fontSize),
          text: (el.textContent ?? "").trim().slice(0, 40),
        };
      }),
      ink,
      selector,
    }));
  }, selectors);

test.describe("running text", () => {
  test("leads, card sentences, FAQ answers and prose are in the ink at 16px or more", async ({
    page,
  }) => {
    await page.goto("/realizacje/");
    const cases = await page
      .locator("#top a[href^='/realizacje/']")
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute("href") ?? "")
      );
    expect(cases.length).toBeGreaterThan(0);

    const { case: onCase, ...onPages } = RUNNING_TEXT;
    const checks = [
      ...Object.entries(onPages),
      ...cases.map((path) => [path, onCase] as const),
    ];
    for (const [path, selectors] of checks) {
      // biome-ignore lint/performance/noAwaitInLoops: one page at a time
      await page.goto(path, { waitUntil: "domcontentloaded" });
      for (const { elements, ink, selector } of await textOf(page, selectors)) {
        expect(elements.length, `${path} ${selector}`).toBeGreaterThan(0);
        for (const { color, size, text } of elements) {
          expect(color, `${path} ${selector} "${text}"`).toBe(ink);
          expect(size, `${path} ${selector} "${text}"`).toBeGreaterThanOrEqual(
            16
          );
        }
      }
    }
  });

  test("notes and captions stay dimmer than the running text", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    for (const { elements, ink, selector } of await textOf(page, NOTES)) {
      expect(elements.length, selector).toBeGreaterThan(0);
      for (const { color, text } of elements) {
        expect(color, `${selector} "${text}"`).not.toBe(ink);
      }
    }
  });
});

// Labels a visitor reads to understand the content are captions in the text
// face, written in sentence case and set as written; the drawing's own marks
// keep Geist Mono (KA0123).
const CONTENT_LABELS = [
  ".mb-status-caption",
  ".mb-trust-caption",
  ".mb-service-fact dt",
  ".mb-cases-row dt",
  ".mb-contact-label",
  "[data-contact-form] .mb-label",
  ".mb-footer-title",
];

// A capital, then small letters: the copy is written in sentence case.
const SENTENCE_CASE = /^\p{Lu}.*\p{Ll}/u;

// The drawing's marks, some of them drawn by a pseudo-element.
const DRAWING_MARKS: { pseudo?: string; selector: string }[] = [
  { selector: ".mb-section-label" },
  { pseudo: "::after", selector: ".mb-section-head" },
  { pseudo: "::before", selector: ".mb-card" },
  { pseudo: "::after", selector: ".mb-hero-grid" },
  { pseudo: "::before", selector: ".mb-hero-status" },
  { pseudo: "::after", selector: ".mb-footer-bottom" },
];

test.describe("content labels", () => {
  test("are captions in the text face, in sentence case, at 13px or more", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const labels = await page.evaluate(
      (list) =>
        list.map((selector) => ({
          elements: [...document.querySelectorAll(selector)].map((el) => {
            const style = getComputedStyle(el);
            return {
              family: style.fontFamily,
              size: Number.parseFloat(style.fontSize),
              spacing: style.letterSpacing,
              text: (el.textContent ?? "").trim(),
              transform: style.textTransform,
              weight: style.fontWeight,
            };
          }),
          selector,
        })),
      CONTENT_LABELS
    );
    for (const { elements, selector } of labels) {
      expect(elements.length, selector).toBeGreaterThan(0);
      for (const {
        family,
        size,
        spacing,
        text,
        transform,
        weight,
      } of elements) {
        const what = `${selector} "${text}"`;
        expect(family.split(",")[0]?.trim().replaceAll('"', ""), what).toBe(
          "Geist"
        );
        expect(transform, what).toBe("none");
        expect(spacing, what).toBe("normal");
        expect(size, what).toBeGreaterThanOrEqual(13);
        expect(weight, what).toBe("500");
        // Sentence case in the copy itself: a capital, then small letters.
        expect(text, what).toMatch(SENTENCE_CASE);
      }
    }
  });

  test("the drawing's marks keep Geist Mono", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const marks = await page.evaluate(
      (list) =>
        list.map(({ pseudo, selector }) => {
          const el = document.querySelector(selector);
          return {
            family: el ? getComputedStyle(el, pseudo).fontFamily : "",
            mark: `${selector}${pseudo ?? ""}`,
          };
        }),
      DRAWING_MARKS
    );
    for (const { family, mark } of marks) {
      expect(family.split(",")[0]?.trim().replaceAll('"', ""), mark).toBe(
        "Geist Mono"
      );
    }
  });
});

// Every production page holds its text to the scale (KA0126, KA0140,
// type-scale.ts), prose and the drawing's mono marks included. Off it: the
// headlines, the title block's figures and screen-reader-only words.
const PAGE_OFF_SCALE = "h1, h2, .mb-status-figure, .sr-only";

test.describe("type scale", () => {
  test("every page's text face uses only the small, body and lead sizes", async ({
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

    for (const path of [...PAGES, ...cases]) {
      for (const width of [390, 1440]) {
        // biome-ignore lint/performance/noAwaitInLoops: one page and width at a time
        await page.setViewportSize({ height: 900, width });
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        expect(
          await offScaleText(page, PAGE_OFF_SCALE),
          `${path} at ${width}px`
        ).toEqual([]);
      }
    }
  });
});
