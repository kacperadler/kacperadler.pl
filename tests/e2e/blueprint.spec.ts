import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";

// The blueprint: every public page is an engineer's drawing, standing
// complete; the first screen enters once on page load (src/styles/global.css,
// header.astro, hero.astro). These run on the production build.

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
const OTHER_PAGES = [
  "/polityka-prywatnosci/",
  "/regulamin/",
  "/realizacje/",
  "/this-route-does-not-exist",
];
// The entrance ends by 1.7s (the last trust bar cell); the hero pen runs
// 1s from 0.4s.
const ENTRANCE_MS = 1700;
const PEN_MS = 1000;
const PEN_FROM_MS = 400;
// Chrome writes an inset of nothing as "inset(0px)", "inset(0px 0px 0%)"...
const UNCLIPPED = /^inset\(0(?:px|%)?(?: 0(?:px|%)?){0,3}\)$/;
const LEGAL_PAGE = /\/polityka-prywatnosci\/?$/;
const HOME = /\/(?:#top)?$/;
const KEYFRAME_META = ["offset", "computedOffset", "easing", "composite"];

// The components paint the hero's rules over borders they make transparent.
const NO_COLOR = "rgba(0, 0, 0, 0)";

interface HeadDrawing {
  border: string;
  brace: number;
  callout: number;
  dimension: number;
  label: number;
  rule: number;
  ticks: number;
}

// How far each part of a section head is drawn, 0 to 1 (to three
// places), read from what the browser paints: the rule's background
// width, and the clip-path (inset(top right bottom left)) that hides the
// rest of each mark.
const headDrawing = (head: Locator): Promise<HeadDrawing> =>
  head.evaluate((el) => {
    const em = el.querySelector("em");
    const label = el.querySelector(".mb-section-label");
    if (!(em && label)) {
      throw new Error("The section head has no label or <em>.");
    }
    const drawnPart = (hidden: number, whole: number) =>
      Math.round((1 - hidden / whole) * 1000) / 1000;
    const inset = (node: Element, pseudo: string | null, side: number) => {
      const clip = getComputedStyle(node, pseudo).clipPath;
      const values = clip
        .slice(clip.indexOf("(") + 1, -1)
        .split(" ")
        .map(Number.parseFloat);
      return values[side] ?? 0;
    };
    const written = (node: Element, pseudo: string | null) =>
      drawnPart(inset(node, pseudo, 1), 100);
    const own = getComputedStyle(el);
    return {
      border: own.borderTopColor,
      brace: written(em, "::after"),
      callout: written(em, "::before"),
      dimension: written(el, "::after"),
      label: written(label, null),
      rule: drawnPart(100 - Number.parseFloat(own.backgroundSize), 100),
      ticks: drawnPart(inset(el, "::before", 0), 50),
    };
  });

interface Motion {
  /** delay + duration, ms */
  endsMs: number;
  iterations: number;
  name: string;
  onScroll: boolean;
  piece: string;
  /** --bl-p of the pen's pieces, opacity of the rising ones */
  progress: number;
  properties: string[];
}

// Every animation the blueprint runs (bl-*), named by its keyframes and
// "<tag.classes> <pseudo>", with its timing, its animated properties and
// how far it has got.
const motions = (page: Page): Promise<Motion[]> =>
  page.evaluate(
    (meta) =>
      document
        .getAnimations()
        .filter(
          (a): a is CSSAnimation =>
            a instanceof CSSAnimation && a.animationName.startsWith("bl-")
        )
        .map((a) => {
          const effect = a.effect as KeyframeEffect;
          const target = effect.target as Element;
          const timing = effect.getComputedTiming();
          const style = getComputedStyle(target, effect.pseudoElement);
          return {
            endsMs: Number(timing.delay) + Number(timing.duration),
            iterations: timing.iterations ?? 1,
            name: a.animationName,
            onScroll: !(a.timeline instanceof DocumentTimeline),
            piece: [
              [target.localName, ...target.classList].join("."),
              effect.pseudoElement ?? "",
            ]
              .join(" ")
              .trim(),
            progress:
              a.animationName === "bl-draw"
                ? Number(style.getPropertyValue("--bl-p"))
                : Number(style.opacity),
            properties: [
              ...new Set(effect.getKeyframes().flatMap((k) => Object.keys(k))),
            ]
              .filter((k) => !meta.includes(k))
              .sort(),
          };
        }),
    KEYFRAME_META
  );

// Holds every blueprint animation at `ms` into the page load, or lets
// them run on with `null`.
const entranceAt = (page: Page, ms: number | null) =>
  page.evaluate((at) => {
    for (const a of document.getAnimations()) {
      if (
        a instanceof CSSAnimation &&
        a.animationName.startsWith("bl-") &&
        a.timeline instanceof DocumentTimeline
      ) {
        if (at === null) {
          a.play();
        } else {
          a.pause();
          a.currentTime = at;
        }
      }
    }
  }, ms);

const entranceDone = (page: Page) =>
  page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter(
          (a) =>
            a instanceof CSSAnimation &&
            a.animationName.startsWith("bl-") &&
            a.timeline instanceof DocumentTimeline
        )
        .map((a) => a.finished)
    )
  );

// Down the page as a wheel does, 100px a frame, to the bottom.
const scrollThrough = async (page: Page) => {
  const end = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight
  );
  for (let top = 0; top < end + 100; top += 100) {
    // biome-ignore lint/performance/noAwaitInLoops: one frame at a time
    await page.evaluate(async (y) => {
      window.scrollTo({ behavior: "instant", top: y });
      const { promise, resolve } = Promise.withResolvers<void>();
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      await promise;
    }, top);
  }
};

// How far the page scrolls sideways: 0 when nothing overflows the viewport.
const sideways = (page: Page) =>
  page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth
  );

// The parts below the first screen, as they stand: a section head's
// drawing on its own border, a cell's frame and number, the rail, the
// footer's legend. All of it complete, whether or not the page has been
// scrolled.
const expectBelowDrawn = async (page: Page) => {
  const head = await headDrawing(page.locator("#contact .mb-section-head"));
  expect(head).toMatchObject({
    brace: 1,
    callout: 1,
    dimension: 1,
    label: 1,
    rule: 1,
    ticks: 1,
  });
  expect(head.border).not.toBe(NO_COLOR);
  const card = page.locator("#cases .mb-card").first();
  await expect(card).not.toHaveCSS("border-top-color", NO_COLOR);
  expect(
    await card.evaluate((el) =>
      ["", "::before"].map((pseudo) =>
        getComputedStyle(el, pseudo || null).getPropertyValue("--bl-p")
      )
    )
  ).toEqual(["1", "1"]);
  expect(
    await page
      .locator(".mb-step-marker")
      .first()
      .evaluate((el) => getComputedStyle(el, "::before").clipPath)
  ).toMatch(UNCLIPPED);
  expect(
    await page
      .locator(".mb-footer-bottom")
      .evaluate((el) => getComputedStyle(el, "::after").clipPath)
  ).toMatch(UNCLIPPED);
  await expect(page.locator(".mb-footer")).not.toHaveCSS(
    "border-top-color",
    NO_COLOR
  );
};

// The first screen as it stands once the entrance is over, or when there
// is none: the header and the hero's parts in place and opaque, the hero
// drawn.
const expectFirstScreenInPlace = async (page: Page) => {
  const state = await page.evaluate(() => {
    const style = (selector: string, pseudo?: string) =>
      getComputedStyle(document.querySelector(selector) as Element, pseudo);
    // A finished animation holds the identity matrix; untouched, "none".
    const rising = (selector: string) => {
      const s = style(selector);
      const m = new DOMMatrix(s.transform);
      return `${s.opacity} ${m.isIdentity ? "none" : s.transform}`;
    };
    const drawn = (selector: string, pseudo?: string) =>
      style(selector, pseudo).getPropertyValue("--bl-p");
    return {
      drawn: {
        brace: drawn(".mb-hero h1 em", "::after"),
        callout: drawn(".mb-hero h1 em", "::before"),
        datum: drawn(".mb-hero-grid", "::before"),
        status: drawn(".mb-hero-status"),
        statusHeader: drawn(".mb-hero-status", "::before"),
      },
      rising: {
        caption: rising(".mb-status-caption"),
        cell: rising("#trust .mb-card:last-child"),
        ctas: rising(".mb-hero-ctas"),
        h1: rising(".mb-hero h1"),
        header: rising(".mb-header"),
        row: rising(".mb-status-row:last-child"),
        statusCta: rising(".mb-status-cta"),
        sub: rising(".mb-hero-sub"),
      },
    };
  });
  for (const [piece, value] of Object.entries(state.rising)) {
    expect(value, piece).toBe("1 none");
  }
  for (const [piece, value] of Object.entries(state.drawn)) {
    expect(value, piece).toBe("1");
  }
};

test.describe("the first screen's entrance", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  for (const width of [1440, 360]) {
    test(`on load the header, the headline, the hero drawing, the buttons and the trust bar come in as one sequence of about 1.7s at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ height: 900, width });
      await page.goto("/", { waitUntil: "load" });
      await expect(page.locator("html")).toHaveAttribute("data-bl-enter", "go");
      await expect(page.locator("html")).toHaveAttribute("data-bl-live", "");

      // Held at its first frame until that frame paints: every animation
      // of the entrance started no earlier than the first contentful
      // paint, and runs.
      const started = await page.evaluate(() => {
        const paint =
          performance.getEntriesByName("first-contentful-paint")[0]
            ?.startTime ?? Number.NaN;
        return document
          .getAnimations()
          .filter(
            (a) =>
              a instanceof CSSAnimation && a.animationName.startsWith("bl-")
          )
          .map((a) => ({
            afterPaint: Number(a.startTime) >= paint - 20,
            state: a.playState,
          }));
      });
      expect(started.length).toBeGreaterThan(0);
      for (const a of started) {
        expect(a.afterPaint).toBe(true);
        expect(a.state).not.toBe("paused");
      }

      const all = await motions(page);
      const byPiece = new Map(all.map((m) => [`${m.name} ${m.piece}`, m]));
      // The cast: what enters, in what order.
      const ends = (key: string) => byPiece.get(key)?.endsMs;
      expect(ends("bl-enter-down div.mb-header")).toBe(600);
      // The headline rises without fading, before the subtitle: painted
      // from the first frame, it stays the largest contentful paint.
      expect(ends("bl-enter-slide h1")).toBe(650);
      expect(byPiece.get("bl-enter-slide h1")?.properties).toEqual([
        "transform",
      ]);
      expect(ends("bl-enter p.mb-hero-sub")).toBe(900);
      expect(ends("bl-enter p.mb-status-caption")).toBe(1350);
      // The rows cascade, 80ms apart.
      expect(
        all
          .filter(
            (m) => m.name === "bl-enter" && m.piece === "div.mb-status-row"
          )
          .map((m) => m.endsMs)
      ).toEqual([1420, 1500, 1580]);
      expect(ends("bl-enter div.mb-status-cta")).toBe(1550);
      expect(ends("bl-enter div.mb-hero-ctas")).toBe(1550);
      // The trust bar closes the sequence: its caption, then the five
      // logo cells one after another, left to right, 80ms apart.
      expect(ends("bl-enter p.mb-trust-caption")).toBe(1450);
      expect(
        all
          .filter(
            (m) => m.name === "bl-enter" && m.piece === "li.mb-card.mb-card-sm"
          )
          .map((m) => Math.round(m.endsMs))
      ).toEqual([1380, 1460, 1540, 1620, 1700]);
      for (const piece of [
        "div.container.mb-hero-grid ::before",
        "div.container.mb-hero-grid ::after",
        "em ::before",
        "em ::after",
        "aside.mb-hero-status",
        "aside.mb-hero-status ::before",
      ]) {
        expect(ends(`bl-draw ${piece}`), piece).toBe(PEN_FROM_MS + PEN_MS);
      }
      // Nothing else of the blueprint moves: no piece below the first
      // screen, no ruler, nothing on a scroll timeline, nothing past
      // 1.7s, nothing but transform and opacity in the rising ones.
      expect(all.length).toBe(21);
      for (const m of all) {
        expect(m.onScroll, m.piece).toBe(false);
        expect(m.iterations, m.piece).toBe(1);
        expect(m.endsMs, m.piece).toBeLessThanOrEqual(ENTRANCE_MS);
        if (m.name !== "bl-draw") {
          expect(
            m.properties.every((p) => p === "opacity" || p === "transform"),
            `${m.name} ${m.piece}: ${m.properties.join(",")}`
          ).toBe(true);
        }
      }

      // Held at 0.15s: the header on its way down, the headline on its
      // way up and opaque, the subtitle not yet in, the hero undrawn. At
      // 0.8s: the headline in place, the subtitle on its last stretch,
      // the pen some way in, the buttons still to come.
      await entranceAt(page, 150);
      const early = await motions(page);
      const at = (list: Motion[], key: string) =>
        list.find((m) => `${m.name} ${m.piece}` === key)?.progress;
      const shift = (selector: string) =>
        page
          .locator(selector)
          .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).f);
      expect(at(early, "bl-enter-slide h1")).toBe(1);
      expect(await shift(".mb-hero h1")).toBeGreaterThan(0);
      expect(at(early, "bl-enter p.mb-hero-sub")).toBe(0);
      expect(at(early, "bl-draw aside.mb-hero-status")).toBe(0);
      expect(await shift(".mb-header")).toBeLessThan(0);
      await entranceAt(page, 800);
      const mid = await motions(page);
      expect(await shift(".mb-hero h1")).toBe(0);
      expect(at(mid, "bl-enter p.mb-hero-sub")).toBeGreaterThan(0);
      expect(at(mid, "bl-enter p.mb-hero-sub")).toBeLessThan(1);
      expect(at(mid, "bl-draw aside.mb-hero-status")).toBeCloseTo(
        (800 - PEN_FROM_MS) / PEN_MS,
        2
      );
      expect(at(mid, "bl-enter div.mb-hero-ctas")).toBe(0);
      expect(
        mid
          .filter((m) => m.piece === "li.mb-card.mb-card-sm")
          .map((m) => m.progress)
      ).toEqual([0, 0, 0, 0, 0]);
      // At 1.2s the cells are mid-cascade, each further in than the next:
      // the first nearly there, the last not started.
      await entranceAt(page, 1200);
      const cells = (await motions(page))
        .filter((m) => m.piece === "li.mb-card.mb-card-sm")
        .map((m) => m.progress);
      expect(cells).toHaveLength(5);
      expect(cells[0]).toBeGreaterThan(0.9);
      expect(cells[4]).toBe(0);
      for (let i = 1; i < 4; i += 1) {
        expect(cells[i - 1], `cell ${i}`).toBeGreaterThan(cells[i] ?? 1);
      }
      await entranceAt(page, 800);
      await expect(page.locator(".mb-hero-status")).toHaveCSS(
        "border-top-color",
        NO_COLOR
      );

      // Mid-entrance the page breaks no WCAG rule, and the rest of the
      // page already stands drawn.
      const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
      expect(results.violations).toEqual([]);
      await expectBelowDrawn(page);

      // Let go: it finishes and stays.
      await entranceAt(page, null);
      await entranceDone(page);
      await expectFirstScreenInPlace(page);
      expect((await motions(page)).every((m) => m.progress === 1)).toBe(true);
    });

    test(`scrolled through, nothing draws and nothing scrolls sideways at ${width}px`, async ({
      page,
    }) => {
      test.setTimeout(90_000);
      await page.setViewportSize({ height: 900, width });
      await page.goto("/", { waitUntil: "load" });
      await entranceDone(page);
      const before = (await motions(page)).length;
      expect(await sideways(page)).toBe(0);
      await scrollThrough(page);
      expect(await sideways(page)).toBe(0);
      // No animation started on the way down, none rides the scroll.
      const after = await motions(page);
      expect(after.length).toBe(before);
      expect(after.every((m) => m.progress === 1)).toBe(true);
      expect(after.filter((m) => m.onScroll).map((m) => m.piece)).toEqual([]);
      await expectBelowDrawn(page);
      const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
      expect(results.violations).toEqual([]);
    });
  }

  test("the rulers stand still from the start, before and after a scroll", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/", { waitUntil: "load" });
    const [before, after, scrolled] = await page.evaluate(async () => {
      const frame = document.querySelector(".mb-frame") as Element;
      const ticks = () =>
        ["::before", "::after"].map((pseudo) => {
          const s = getComputedStyle(frame, pseudo);
          return `${s.maskPosition} ${s.clipPath}`;
        });
      const atTop = ticks();
      window.scrollTo({ behavior: "instant", top: 1234 });
      const { promise, resolve } = Promise.withResolvers<void>();
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      await promise;
      return [atTop, ticks(), window.scrollY];
    });
    expect(scrolled).toBe(1234);
    expect(after).toEqual(before);
    for (const clip of before) {
      expect(clip.split(" ").slice(2).join(" ")).toMatch(UNCLIPPED);
    }
    expect(
      (await motions(page)).filter((m) => m.piece.includes(".mb-frame"))
    ).toEqual([]);
  });

  test("the title block's header is level with the headline", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/", { waitUntil: "load" });
    await entranceDone(page);
    const tops = await page.evaluate(() => {
      const top = (selector: string) =>
        Math.round(
          (document.querySelector(selector) as Element).getBoundingClientRect()
            .top
        );
      return {
        caption: top(".mb-status-caption"),
        headline: top(".mb-hero h1"),
      };
    });
    expect(Math.abs(tops.caption - tops.headline)).toBeLessThanOrEqual(2);
    expect(
      await page
        .locator(".mb-hero-status")
        .evaluate((el) => getComputedStyle(el, "::before").content)
    ).toContain("Rys. KA-001");
  });

  test("a cell under the cursor is selected whole: grips, and its number reads its width", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/", { waitUntil: "load" });
    const card = page.locator("#cases .mb-card").first();
    await card.scrollIntoViewIfNeeded();
    const box = await card.boundingBox();
    await page.mouse.move(
      (box?.x ?? 0) + (box?.width ?? 0) / 2,
      (box?.y ?? 0) + (box?.height ?? 0) / 2
    );
    const tag = await card.evaluate((el) => {
      const s = getComputedStyle(el, "::before");
      return {
        content: s.content,
        grips: getComputedStyle(el, "::after").visibility,
        reads: Number(s.getPropertyValue("--bl-w")),
        width: Math.round(el.getBoundingClientRect().width),
      };
    });
    expect(tag.content).toContain("↔");
    expect(tag.reads).toBe(tag.width);
    expect(tag.grips).toBe("visible");
    await page.mouse.move(0, 0);
    await expect
      .poll(() =>
        card.evaluate((el) => getComputedStyle(el, "::after").visibility)
      )
      .toBe("hidden");
  });

  for (const path of OTHER_PAGES) {
    test(`${path} has no hero: nothing animates, the page stands drawn`, async ({
      page,
    }) => {
      await page.setViewportSize({ height: 900, width: 1440 });
      await page.goto(path, { waitUntil: "load" });
      await expect(page.locator("html")).toHaveAttribute("data-bl-enter", "go");
      expect(
        (await motions(page)).filter((m) => m.name !== "bl-enter-down")
      ).toEqual([]);
      const head = page.locator("#top .mb-section-head").first();
      await expect(head).not.toHaveCSS("border-top-color", NO_COLOR);
      await expect(head).toHaveCSS("background-size", "100% 1px");
      await expect(page.locator(".mb-footer")).not.toHaveCSS(
        "border-top-color",
        NO_COLOR
      );
    });
  }

  // The 404 opens as every other page does: its h1 in a section head with
  // `404` for a label, under the rule drawn as a dimension line - ticks at
  // both ends and the head's own width in px on its middle (KA0102).
  test("the 404 opens with a section head, its rule a dimension line", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/this-route-does-not-exist", { waitUntil: "load" });
    const head = page.locator("#top .mb-section-head");
    await expect(head).toHaveCount(1);
    await expect(head.locator("h1")).toHaveText("Tej strony nie ma.");
    await expect(head.locator(".mb-section-label")).toHaveText("404");
    const rule = await head.evaluate((el) => {
      const ticks = getComputedStyle(el, "::before");
      const dimension = getComputedStyle(el, "::after");
      return {
        background: getComputedStyle(el).backgroundSize,
        dimension: Number(dimension.getPropertyValue("--bl-w")),
        dimensionClip: dimension.clipPath,
        dimensionContent: dimension.content,
        ticks: [ticks.borderLeftWidth, ticks.borderRightWidth],
        ticksClip: ticks.clipPath,
        ticksHeight: ticks.height,
        width: Math.round(el.getBoundingClientRect().width),
      };
    });
    expect(rule.background).toBe("100% 1px");
    expect(rule.ticks).toEqual(["1px", "1px"]);
    expect(rule.ticksHeight).toBe("11px");
    expect(rule.ticksClip).toMatch(UNCLIPPED);
    expect(rule.dimensionContent).toContain("counter(bl-w)");
    expect(rule.dimensionClip).toMatch(UNCLIPPED);
    expect(rule.width).toBeGreaterThan(0);
    expect(rule.dimension).toBe(rule.width);
  });

  test("a page reached through the ClientRouter shows at once, no entrance", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/polityka-prywatnosci/", { waitUntil: "load" });
    await entranceDone(page);
    await page
      .getByRole("navigation", { name: "Główna nawigacja" })
      .getByRole("link", { name: "Kacper Adler - Strona główna" })
      .click();
    await expect(page).toHaveURL(HOME);
    await expect(page.locator(".mb-hero h1")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-bl-live", "");
    await expect(page.locator("html")).not.toHaveAttribute("data-bl-enter");
    expect(await motions(page)).toEqual([]);
    await expectFirstScreenInPlace(page);
    await expectBelowDrawn(page);

    // And back to the legal page: the same.
    await page
      .locator(".mb-footer")
      .getByRole("link", { name: "Polityka prywatności" })
      .click();
    await expect(page).toHaveURL(LEGAL_PAGE);
    await expect(page.locator("html")).toHaveAttribute("data-bl-live", "");
    expect(await motions(page)).toEqual([]);
  });
});

test.describe("everything shows at once", () => {
  test.describe("under reduced motion", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("the first screen in place, the page drawn", async ({ page }) => {
      await page.setViewportSize({ height: 900, width: 1440 });
      await page.goto("/", { waitUntil: "load" });
      expect(await motions(page)).toEqual([]);
      await expectFirstScreenInPlace(page);
      await expect(page.locator(".mb-hero-status")).not.toHaveCSS(
        "border-top-color",
        NO_COLOR
      );
      await expectBelowDrawn(page);
    });
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("no mark on the page, the first screen in place, the page drawn", async ({
      page,
    }) => {
      await page.setViewportSize({ height: 900, width: 1440 });
      await page.goto("/");
      await expect(page.locator("html")).not.toHaveAttribute("data-bl-live");
      await expect(page.locator("html")).not.toHaveAttribute("data-bl-enter");
      await expectFirstScreenInPlace(page);
      await expect(page.locator(".mb-hero-status")).not.toHaveCSS(
        "border-top-color",
        NO_COLOR
      );
      await expectBelowDrawn(page);
    });
  });
});
