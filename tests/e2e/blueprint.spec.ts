import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";

// The blueprint: every public page is an engineer's drawing made as you
// scroll (src/styles/global.css, src/scripts/blueprint-live.ts). These run
// on the production build.

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
const PAGES = [
  "/",
  "/polityka-prywatnosci/",
  "/regulamin/",
  "/realizacje/",
  "/this-route-does-not-exist",
];
const PARTS =
  ".mb-section-head, .mb-card, .mb-step, .mb-footer, .mb-footer-bottom";
const PEN_MS = 1800;
// Chrome writes an inset of nothing as "inset(0px)", "inset(0px 0px 0%)"...
const UNCLIPPED = /^inset\(0(?:px|%)?(?: 0(?:px|%)?){0,3}\)$/;
const LEGAL_PAGE = /\/polityka-prywatnosci\/?$/;

// The components paint their rules over borders they make transparent.
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
// rest of each mark. The ticks grow out of the rule (top inset 50% to 0);
// the dimension, the label, the brace and the callout are written left to
// right (right inset 100% to 0).
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

const undrawn: HeadDrawing = {
  border: NO_COLOR,
  brace: 0,
  callout: 0,
  dimension: 0,
  label: 0,
  rule: 0,
  ticks: 0,
};
const drawn: HeadDrawing = {
  border: NO_COLOR,
  brace: 1,
  callout: 1,
  dimension: 1,
  label: 1,
  rule: 1,
  ticks: 1,
};

// Puts the element's top edge `above` px over the viewport's bottom edge.
const raise = (el: Locator, above: number) =>
  el.evaluate((node, px) => {
    window.scrollTo({
      behavior: "instant",
      top:
        node.getBoundingClientRect().top +
        window.scrollY -
        window.innerHeight +
        px,
    });
  }, above);

// Scrolls the window to `top` and waits two frames, by which the page's
// IntersectionObserver has reported; returns where the window ended up.
const settleAt = (page: Page, top: number) =>
  page.evaluate(async (y) => {
    window.scrollTo({ behavior: "instant", top: y });
    const { promise, resolve } = Promise.withResolvers<void>();
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    await promise;
    return window.scrollY;
  }, top);

// Down the page as a wheel does, 100px a frame, to the bottom.
const scrollThrough = async (page: Page) => {
  const end = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight
  );
  for (let top = 0; top < end + 100; top += 100) {
    // biome-ignore lint/performance/noAwaitInLoops: one frame at a time
    await settleAt(page, top);
  }
};

// Holds the pen over every piece inside `part` at `progress` of its
// drawing (0 to 1), or lets it run on with `null`.
const penAt = (part: Locator, progress: number | null) =>
  part.evaluate((node, p) => {
    for (const a of document.getAnimations()) {
      const effect = a.effect as KeyframeEffect;
      if (
        a instanceof CSSAnimation &&
        a.animationName === "bl-draw" &&
        effect.target &&
        node.contains(effect.target)
      ) {
        if (p === null) {
          a.play();
        } else {
          a.pause();
          a.currentTime = p * Number(effect.getComputedTiming().duration);
        }
      }
    }
  }, progress);

interface Drawing {
  durationMs: number;
  iterations: number;
  onScroll: boolean;
  piece: string;
  progress: number;
}

// Every piece the pen animates, named "<keyframes> <tag.classes> <pseudo>"
// ("bl-draw article.mb-card.mb-card-default ::before"), with its timeline
// and its --bl-p.
const drawings = (page: Page): Promise<Drawing[]> =>
  page.evaluate(() =>
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
        return {
          durationMs: Number(timing.duration),
          iterations: timing.iterations ?? 1,
          onScroll: !(a.timeline instanceof DocumentTimeline),
          piece: [
            a.animationName,
            [target.localName, ...target.classList].join("."),
            effect.pseudoElement ?? "",
          ]
            .join(" ")
            .trim(),
          progress: Number(
            getComputedStyle(target, effect.pseudoElement).getPropertyValue(
              "--bl-p"
            )
          ),
        };
      })
  );

// The parts on the page that are visible and not yet marked drawn.
const unmarked = (page: Page) =>
  page.evaluate(
    (selector) =>
      [...document.querySelectorAll(selector)]
        .filter(
          (el) => el.checkVisibility() && !el.hasAttribute("data-bl-drawn")
        )
        .map((el) => el.outerHTML.slice(0, 80)),
    PARTS
  );

// How far the page scrolls sideways: 0 when nothing overflows the viewport.
const sideways = (page: Page) =>
  page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth
  );

// Nothing animated: the whole drawing stands at once, down to a section
// and cells far below the fold, on their own borders.
const expectDrawnAtOnce = async (page: Page) => {
  expect(await drawings(page)).toEqual([]);
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
  await Promise.all(
    [".mb-hero-status", "#cases .mb-card", ".mb-footer"].map((selector) =>
      expect(page.locator(selector).first()).not.toHaveCSS(
        "border-top-color",
        NO_COLOR
      )
    )
  );
  expect(
    await page
      .locator(".mb-step-marker")
      .first()
      .evaluate((el) => getComputedStyle(el, "::before").clipPath)
  ).toMatch(UNCLIPPED);
};

test.describe("the drawing as you scroll", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  for (const width of [1440, 360]) {
    test(`a section draws in order once it is whole on the screen and stays drawn on the way back at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ height: 900, width });
      await page.goto("/", { waitUntil: "networkidle" });
      await expect(page.locator("html")).toHaveAttribute("data-bl-live", "");
      const head = page.locator("#contact .mb-section-head");
      const height = (await head.boundingBox())?.height ?? 0;

      // Below the fold: nothing of it, its border included.
      await expect.poll(() => headDrawing(head)).toEqual(undrawn);

      // Half on the screen: still nothing, however long it stays there.
      await raise(head, height / 2);
      await page.waitForTimeout(1000);
      expect(await headDrawing(head)).toEqual(undrawn);

      // Whole on the screen, the pen starts. Each stage eases on its own:
      // a tenth into the rule's stage it has drawn less than a tenth (a
      // smoothstep's 0.028), nine tenths in, more than nine (0.972).
      await raise(head, height + 20);
      await expect(head).toHaveAttribute("data-bl-drawn", "");
      await penAt(head, 0.06);
      expect((await headDrawing(head)).rule).toBeCloseTo(0.028, 2);
      await penAt(head, 0.54);
      expect((await headDrawing(head)).rule).toBeCloseTo(0.972, 2);

      // Held at 0.3 of the drawing: only the rule, halfway out.
      await penAt(head, 0.3);
      const ruling = await headDrawing(head);
      expect(ruling.rule).toBeCloseTo(0.5, 2);
      expect(ruling).toMatchObject({
        brace: 0,
        callout: 0,
        dimension: 0,
        label: 0,
        ticks: 0,
      });

      // At 0.8: rule and ticks drawn; the dimension, the label and the
      // brace being written together; the callout not yet.
      await penAt(head, 0.8);
      const writing = await headDrawing(head);
      expect(writing).toMatchObject({ callout: 0, rule: 1, ticks: 1 });
      expect(writing.label).toBeCloseTo((0.8 - 0.7) * 5, 2);
      expect(writing.dimension).toBeCloseTo(writing.label, 3);
      expect(writing.brace).toBeCloseTo(writing.label, 3);

      // Half drawn, the page still breaks no WCAG rule.
      const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
      expect(results.violations).toEqual([]);

      // Let go, the pen finishes: all of it, on the painted rule.
      await penAt(head, null);
      await expect.poll(() => headDrawing(head)).toEqual(drawn);

      // Back to the top, the section under the fold again: still drawn.
      expect(await settleAt(page, 0)).toBe(0);
      expect(await headDrawing(head)).toEqual(drawn);
    });

    test(`scrolled through, every part of the home page is drawn on a clock, and nothing scrolls sideways, at ${width}px`, async ({
      page,
    }) => {
      test.setTimeout(90_000);
      await page.setViewportSize({ height: 900, width });
      await page.goto("/", { waitUntil: "networkidle" });
      expect(await sideways(page)).toBe(0);
      await scrollThrough(page);
      expect(await sideways(page)).toBe(0);

      // Every part on the page has been seen, so marked.
      expect(await unmarked(page)).toEqual([]);

      const pieces = await drawings(page);
      for (const [part, pseudo] of [
        ["mb-section-head", "::before"],
        ["mb-card", "::before"],
        ["mb-step-marker", "::before"],
        ["mb-footer-bottom", "::after"],
      ] as const) {
        expect(
          pieces.some(
            (d) => d.piece.includes(`.${part}`) && d.piece.endsWith(pseudo)
          ),
          `${part}${pseudo}`
        ).toBe(true);
      }
      // No piece follows the scroll: each plays once, on the clock, over
      // the same pen, however fast it was scrolled.
      for (const d of pieces) {
        expect(d.onScroll, d.piece).toBe(false);
        expect(d.iterations, d.piece).toBe(1);
        expect(d.durationMs, d.piece).toBe(PEN_MS);
      }
      await expect
        .poll(async () =>
          (await drawings(page))
            .filter((d) => d.progress !== 1)
            .map((d) => d.piece)
        )
        .toEqual([]);
    });

    test(`the hero draws once on load and nothing runs on a clock after, at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ height: 900, width });
      await page.goto("/", { waitUntil: "networkidle" });
      const all = await drawings(page);
      for (const d of all) {
        expect(d.iterations, d.piece).toBe(1);
        expect(d.onScroll, d.piece).toBe(false);
        expect(d.durationMs, d.piece).toBe(PEN_MS);
      }
      const onLoad = all.map((d) => d.piece);
      expect(
        onLoad.some(
          (piece) =>
            piece.includes(".mb-hero-grid") && piece.endsWith("::before")
        )
      ).toBe(true);
      expect(onLoad.some((piece) => piece.startsWith("bl-draw em "))).toBe(
        true
      );
      // Side by side the title block is on the screen and draws on load; in
      // one column it is under the fold and draws once it is on the screen.
      expect(onLoad.some((piece) => piece.includes(".mb-hero-status"))).toBe(
        width > 880
      );

      await page.evaluate(() =>
        Promise.all(
          document
            .getAnimations()
            .filter(
              (a) =>
                a instanceof CSSAnimation && a.animationName.startsWith("bl-")
            )
            .map((a) => a.finished)
        )
      );
      expect((await drawings(page)).map((d) => [d.piece, d.progress])).toEqual(
        onLoad.map((piece) => [piece, 1])
      );
    });
  }

  test("the title block's header is level with the headline", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/", { waitUntil: "networkidle" });
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

  test("a cell scrolled whole into view draws to the end by itself", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/", { waitUntil: "networkidle" });
    const card = page.locator("#cases .mb-card").first();
    const height = (await card.boundingBox())?.height ?? 0;
    const frame = () =>
      card.evaluate((el) =>
        ["", "::before"].map((pseudo) =>
          getComputedStyle(el, pseudo || null).getPropertyValue("--bl-p")
        )
      );
    expect(await frame()).toEqual(["0", "0"]);

    // Whole on the screen, and not a pixel further: the frame and the
    // number play through within the pen's time.
    await raise(card, height + 10);
    await expect.poll(frame, { timeout: 3000 }).toEqual(["1", "1"]);
    await expect(card).toHaveCSS("border-top-color", NO_COLOR);
    expect(
      (await drawings(page))
        .filter((d) => d.piece.includes(".mb-card") && d.progress === 1)
        .some((d) => d.durationMs === PEN_MS && !d.onScroll)
    ).toBe(true);
  });

  test("a cell under the cursor is selected whole while it is still drawing", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/", { waitUntil: "networkidle" });
    const card = page.locator("#cases .mb-card").first();
    const height = (await card.boundingBox())?.height ?? 0;
    await raise(card, height + 10);
    await expect(card).toHaveAttribute("data-bl-drawn", "");
    await penAt(card, 0.5);
    expect(
      await card.evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--bl-p")
      )
    ).toBe("0.5");
    await expect(card).toHaveCSS("border-top-color", NO_COLOR);

    const box = await card.boundingBox();
    await page.mouse.move(
      (box?.x ?? 0) + (box?.width ?? 0) / 2,
      (box?.y ?? 0) + (box?.height ?? 0) / 2
    );
    await expect(card).not.toHaveCSS("border-top-color", NO_COLOR);
    // The number is on at once, reads the cell's outer width (the
    // registered --bl-w the counter prints), and the grips show.
    const tag = await card.evaluate((el) => {
      const s = getComputedStyle(el, "::before");
      return {
        content: s.content,
        grips: getComputedStyle(el, "::after").visibility,
        pen: s.getPropertyValue("--bl-p"),
        reads: Number(s.getPropertyValue("--bl-w")),
        width: Math.round(el.getBoundingClientRect().width),
      };
    });
    expect(tag.content).toContain("↔");
    expect(tag.reads).toBe(tag.width);
    expect(tag.grips).toBe("visible");
    expect(tag.pen).toBe("1");
  });

  test("the rulers draw down on load and stand still while the page scrolls", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/", { waitUntil: "networkidle" });

    // The ticks' place on screen, before and two frames after a scroll.
    const [before, after, scrolled] = await page.evaluate(async () => {
      const frame = document.querySelector(".mb-frame") as Element;
      const ticks = () =>
        ["::before", "::after"].map(
          (pseudo) => getComputedStyle(frame, pseudo).maskPosition
        );
      const atTop = ticks();
      window.scrollTo({ behavior: "instant", top: 1234 });
      const { promise, resolve } = Promise.withResolvers<void>();
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      await promise;
      return [atTop, ticks(), window.scrollY];
    });
    expect(scrolled).toBe(1234);
    expect(after).toEqual(before);

    // Drawn down once, on load, on the clock.
    const rulers = (await drawings(page)).filter((d) =>
      d.piece.includes(".mb-frame")
    );
    expect(rulers.map((d) => [d.piece, d.onScroll, d.durationMs])).toEqual([
      ["bl-draw div.mb-frame ::before", false, PEN_MS],
      ["bl-draw div.mb-frame ::after", false, PEN_MS],
    ]);
  });

  for (const path of PAGES.slice(1)) {
    test(`${path} is live and drawn through`, async ({ page }) => {
      await page.setViewportSize({ height: 900, width: 1440 });
      await page.goto(path, { waitUntil: "networkidle" });
      await expect(page.locator("html")).toHaveAttribute("data-bl-live", "");
      await scrollThrough(page);
      expect(await unmarked(page)).toEqual([]);
      const pieces = await drawings(page);
      expect(pieces.some((d) => d.piece.includes(".mb-footer"))).toBe(true);
      for (const d of pieces) {
        expect(d.onScroll, d.piece).toBe(false);
        expect(d.durationMs, d.piece).toBe(PEN_MS);
      }
      await expect
        .poll(async () =>
          (await drawings(page))
            .filter((d) => d.progress !== 1)
            .map((d) => d.piece)
        )
        .toEqual([]);
    });
  }

  test("a page reached through the ClientRouter is live and draws", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page
      .getByRole("link", { name: "Polityka prywatności" })
      .first()
      .click();
    await expect(page).toHaveURL(LEGAL_PAGE);
    await expect(page.locator("html")).toHaveAttribute("data-bl-live", "");
    // The legal page's head (no <em>) is on the screen: its rule runs out
    // over the transparent border.
    const head = page.locator("#top .mb-section-head").first();
    await expect(head).toHaveAttribute("data-bl-drawn", "");
    await expect(head).toHaveCSS("border-top-color", NO_COLOR);
    await expect(head).toHaveCSS("background-size", "100% 1px");
    await scrollThrough(page);
    expect(await unmarked(page)).toEqual([]);
  });
});

test.describe("the drawing stands complete", () => {
  test.describe("under reduced motion", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("at once, on the components' own borders", async ({ page }) => {
      await page.setViewportSize({ height: 900, width: 1440 });
      await page.goto("/", { waitUntil: "networkidle" });
      await expectDrawnAtOnce(page);
    });
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("at once, with no live mark on the page", async ({ page }) => {
      await page.setViewportSize({ height: 900, width: 1440 });
      await page.goto("/");
      await expect(page.locator("html")).not.toHaveAttribute("data-bl-live");
      await expectDrawnAtOnce(page);
    });
  });
});
