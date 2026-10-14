import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";
import { sendALead } from "./send-a-lead";

// The catalogue (/ui) exists only on `astro dev`; playwright.config.ts starts
// one for this tree and passes its port in E2E_DEV_PORT.
const DEV_URL = `http://localhost:${process.env.E2E_DEV_PORT}`;

const RAISED_VARIANTS = ["Default", "Secondary", "Outline", "Destructive"];
// A computed colour with alpha below 1 (Chrome writes opaque ones as rgb()).
const TRANSLUCENT = /rgba\(|\/ /;
const FOLLOWED_CRUMB = /\/realizacje\/#2025$/;
const UI_UNPAGED = /\/ui$/;
const UI_PAGE_7 = /\/ui\?strona=7#mb-pagination$/;
const DIRECTION = /^Kierunek$/;

const SECTIONS = [
  "Przycisk",
  "Spinner",
  "Badge",
  "Alert",
  "Avatar",
  "Separator",
  "Etykieta",
  "Pole wyboru",
  "Radio",
  "Pola formularza",
  "Akordeon",
  "Okruszki",
  "Paginacja",
  "Link",
  "Karta i siatka",
  "Znacznik etapu",
  "Nagłówek sekcji",
  "Rama strony",
  "Typografia",
  "Link kontaktowy",
  "Formularz kontaktowy",
];

// Computed paint of an element for the given properties - what a forced
// state has to match.
const paint = (locator: Locator, props: string[]) =>
  locator.evaluate((el, names) => {
    const style = getComputedStyle(el);
    return Object.fromEntries(
      names.map((name) => [name, style.getPropertyValue(name)])
    );
  }, props);

const sample = (page: Page, sectionId: string, caption: string) =>
  page.locator(`section[aria-labelledby="${sectionId}"] .mb-ui-sample`).filter({
    has: page.locator(".mb-ui-caption", {
      hasText: new RegExp(`^${caption}$`),
    }),
  });

// The rail of a column of step markers (each marker's ::before, joined)
// starts inside the first mark, runs unbroken and stops where the last
// mark begins.
const expectRailFromFirstMarkToLast = async (markers: Locator) => {
  const rail = await markers.evaluateAll((els) => {
    const rails = els.map((el) => {
      const before = getComputedStyle(el, "::before");
      const top =
        el.getBoundingClientRect().top + Number.parseFloat(before.top);
      return { bottom: top + Number.parseFloat(before.height), top };
    });
    const mark = (el: Element) => {
      const box = (
        el.querySelector(".mb-step-dot") as Element
      ).getBoundingClientRect();
      return { bottom: box.bottom, top: box.top };
    };
    return {
      bottom: rails.at(-1)?.bottom ?? 0,
      first: mark(els[0] as Element),
      gaps: rails
        .slice(1)
        .filter((r, i) => r.top > (rails[i]?.bottom ?? 0) + 0.5).length,
      last: mark(els.at(-1) as Element),
      top: rails[0]?.top ?? 0,
    };
  });
  expect(rail.gaps).toBe(0);
  expect(rail.top).toBeGreaterThanOrEqual(rail.first.top);
  expect(rail.top).toBeLessThan(rail.first.bottom);
  expect(rail.bottom).toBeGreaterThanOrEqual(rail.last.top);
  expect(rail.bottom).toBeLessThan(rail.last.bottom);
};

// The rendered height of `target` just before a click on its `act` child,
// then on each of the next `frames` animation frames - a transition shows
// up as heights between the first and the last.
const heightsAfter = (
  target: Locator,
  act: string,
  frames = 20
): Promise<number[]> =>
  target.evaluate(
    async (el, { selector, count }) => {
      const heights = [Math.round(el.getBoundingClientRect().height)];
      (el.querySelector(selector) as HTMLElement).click();
      for (const _ of Array.from({ length: count })) {
        heights.push(Math.round(el.getBoundingClientRect().height));
        const { promise, resolve } = Promise.withResolvers<number>();
        requestAnimationFrame(resolve);
        // biome-ignore lint/performance/noAwaitInLoops: one sample per frame
        await promise;
      }
      return heights;
    },
    { count: frames, selector: act }
  );

const between = (heights: number[]) => {
  const [first, last] = [heights[0] ?? 0, heights.at(-1) ?? 0];
  return heights.filter(
    (h) => h > Math.min(first, last) && h < Math.max(first, last)
  );
};

// CSS transitions running on the element or inside it. Under reduced
// motion global.css shortens every transition to 0.01ms - a snap, which a
// slow machine can still catch running - so only those of 1ms or more
// count as motion.
const runningTransitions = (locator: Locator) =>
  locator.evaluate((el) =>
    el
      .getAnimations({ subtree: true })
      .filter(
        (a) =>
          a instanceof CSSTransition &&
          a.playState === "running" &&
          Number(a.effect?.getTiming().duration) >= 1
      )
      .map((a) => (a as CSSTransition).transitionProperty)
  );

// A rendered box, and the layer's and the face's boxes in one frame.
interface Box {
  height: number;
  width: number;
  x: number;
  y: number;
}
interface BoxFrame {
  face: Box;
  layer: Box;
}

// A button of one variant row in the catalogue, by its state caption.
const buttonIn = (page: Page, variant: string, caption: string) =>
  page
    .locator('section[aria-labelledby="mb-button"] .mb-ui-row')
    .filter({
      has: page.locator(".mb-ui-row-label", {
        hasText: new RegExp(`^${variant}$`),
      }),
    })
    .locator(".mb-ui-sample")
    .filter({
      has: page.locator(".mb-ui-caption", {
        hasText: new RegExp(`^${caption}$`),
      }),
    })
    .locator(".mb-btn");

test.describe("component catalogue (astro dev)", () => {
  test.use({
    baseURL: DEV_URL,
    contextOptions: { reducedMotion: "reduce" },
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/ui", { waitUntil: "networkidle" });
  });

  test("lists every component under its own heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Katalog komponentów" })
    ).toBeVisible();
    await Promise.all(
      SECTIONS.map((name) =>
        expect(
          page.getByRole("heading", { exact: true, level: 2, name })
        ).toBeVisible()
      )
    );
  });

  for (const viewport of [
    { height: 900, width: 1440 },
    { height: 800, width: 360 },
  ]) {
    test(`has no detectable WCAG 2.1 AA violations at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .exclude("astro-dev-toolbar")
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }

  // The page loads wide, so the resize to 360px restyles it, and under
  // reduced motion global.css turns every restyle into a 0.01ms
  // transition: the first frame after the resize lays out with the wide
  // values. Paused animations hold that frame, so it is measured every run,
  // not only when the measure lands before the next frame; then the
  // settled page.
  test("does not scroll sideways at 360px", async ({ page }) => {
    const widths = () =>
      page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Animation.enable");
    await cdp.send("Animation.setPlaybackRate", { playbackRate: 0 });
    await page.setViewportSize({ height: 800, width: 360 });
    const first = await widths();
    expect(first.scroll).toBeLessThanOrEqual(first.client);

    await cdp.send("Animation.setPlaybackRate", { playbackRate: 1 });
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .filter((a) => a instanceof CSSTransition)
          .map((a) => a.finished)
      )
    );
    const settled = await widths();
    expect(settled.scroll).toBeLessThanOrEqual(settled.client);
  });

  test("a forced button hover paints like a real one", async ({ page }) => {
    const props = ["background-color", "border-color", "color", "transform"];
    const forced = sample(page, "mb-button", "hover")
      .first()
      .locator(".mb-btn-face");
    const idle = sample(page, "mb-button", "idle")
      .first()
      .locator(".mb-btn-face");

    const forcedPaint = await paint(forced, props);
    expect(forcedPaint).not.toEqual(await paint(idle, props));
    await idle.hover();
    expect(await paint(idle, props)).toEqual(forcedPaint);
  });

  // Under reduced motion the face never moves: hover keeps the layer and
  // only fills, press hides the layer and takes the press fill.
  for (const variant of RAISED_VARIANTS) {
    test(`${variant}: under reduced motion hover and press only repaint`, async ({
      page,
    }) => {
      const look = (caption: string) =>
        buttonIn(page, variant, caption).evaluate((el) => {
          const face = getComputedStyle(
            el.querySelector(".mb-btn-face") as Element
          );
          const layer = getComputedStyle(
            el.querySelector(".mb-btn-layer") as Element
          );
          return {
            fill: face.backgroundColor,
            layer: layer.visibility,
            transform: face.transform,
          };
        });
      const idle = await look("idle");
      const hover = await look("hover");
      const pressed = await look("pressed");

      expect([idle, hover, pressed].map((s) => s.transform)).toEqual([
        "none",
        "none",
        "none",
      ]);
      expect([idle, hover, pressed].map((s) => s.layer)).toEqual([
        "visible",
        "visible",
        "hidden",
      ]);
      expect(pressed.fill).not.toBe(idle.fill);
    });
  }

  test("the end arrow stays put on hover", async ({ page }) => {
    const button = sample(page, "mb-button", "iconEnd").locator(".mb-btn");
    await button.hover();
    await expect(button.locator(".mb-btn-icon-end")).toHaveCSS(
      "transform",
      "none"
    );
  });

  test("a forced step hover fills the marker like a real one", async ({
    page,
  }) => {
    const props = ["background-color", "border-color", "color"];
    const forced = sample(page, "mb-step-marker", "hover").locator(
      ".mb-step-dot"
    );
    const idle = sample(page, "mb-step-marker", "idle");
    const idleDot = idle.locator(".mb-step-dot");

    const forcedPaint = await paint(forced, props);
    expect(forcedPaint["background-color"]).toBe("rgb(142, 174, 216)");
    expect(forcedPaint).not.toEqual(await paint(idleDot, props));
    await idle.locator(".mb-card").hover();
    expect(await paint(idleDot, props)).toEqual(forcedPaint);
  });

  for (const width of [1440, 360]) {
    test(`the step rail runs from the first mark to the last at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ height: 900, width });
      await expectRailFromFirstMarkToLast(
        sample(page, "mb-step-marker", "3 etapy").locator(".mb-step-marker")
      );
    });
  }

  // Wide, the value sits on the label's line; in a narrow cell it goes
  // under it and breaks rather than leave the cell.
  test("a narrow contact link wraps its value inside the cell", async ({
    page,
  }) => {
    const layout = (caption: string) =>
      sample(page, "mb-contact-link", caption)
        .locator(".mb-card")
        .first()
        .evaluate((card) => {
          const label = (
            card.querySelector(".mb-contact-label") as Element
          ).getBoundingClientRect();
          const value = (
            card.querySelector(".mb-contact-value") as Element
          ).getBoundingClientRect();
          return {
            inside: value.right <= card.getBoundingClientRect().right,
            overflows: card.scrollWidth > card.clientWidth,
            under: value.top >= label.bottom,
          };
        });

    expect(await layout("idle")).toEqual({
      inside: true,
      overflows: false,
      under: false,
    });
    expect(await layout("wąska komórka")).toEqual({
      inside: true,
      overflows: false,
      under: true,
    });
  });

  test("the default radio is round, the choice chip square", async ({
    page,
  }) => {
    await expect(
      page.locator(".mb-radio-default .mb-radio-input").first()
    ).toHaveCSS("border-radius", "50%");
    await expect(
      page.locator(".mb-radio-choice .mb-radio-label").first()
    ).toHaveCSS("border-radius", "0px");
  });

  test("a forced card hover lights the card and its fillOnCellHover badge", async ({
    page,
  }) => {
    const forced = sample(page, "mb-card", "hover").locator(".mb-card");
    const idle = sample(page, "mb-card", "idle").locator(".mb-card");
    const card = ["background-color"];
    const badge = ["background-color", "border-color", "color"];
    // The 3px blue top rule is the card's ::before, drawn by scaleX. It
    // grows from the left (origin x 0) and, unhovered, gathers at the right
    // edge (origin x the card's width), so it leaves to the right.
    const rule = (locator: Locator) =>
      locator.evaluate((el) => getComputedStyle(el, "::before").transform);
    const originX = (locator: Locator) =>
      locator.evaluate((el) =>
        Number.parseFloat(getComputedStyle(el, "::before").transformOrigin)
      );
    // The rule spans the padding box: the card less its two 1px rules.
    const restingOriginX = await idle.evaluate(
      (el) => el.getBoundingClientRect().width - 2
    );

    const forcedCard = await paint(forced, card);
    const forcedBadge = await paint(forced.locator(".mb-badge"), badge);
    expect(forcedCard).not.toEqual(await paint(idle, card));
    expect(await rule(forced)).toBe("matrix(1, 0, 0, 1, 0, 0)");
    expect(await rule(idle)).toBe("matrix(0, 0, 0, 1, 0, 0)");
    expect(await originX(forced)).toBe(0);
    expect(await originX(idle)).toBeCloseTo(restingOriginX, 1);
    expect(forcedBadge).not.toEqual(
      await paint(idle.locator(".mb-badge"), badge)
    );

    await idle.hover();
    expect(await paint(idle, card)).toEqual(forcedCard);
    expect(await rule(idle)).toBe("matrix(1, 0, 0, 1, 0, 0)");
    expect(await originX(idle)).toBe(0);
    expect(await paint(idle.locator(".mb-badge"), badge)).toEqual(forcedBadge);

    await page.mouse.move(0, 0);
    expect(await originX(idle)).toBeCloseTo(restingOriginX, 1);
  });

  test("a secondary button keeps its idle frame on hover", async ({ page }) => {
    const frame = ["border-color", "border-width"];
    const face = (caption: string) =>
      buttonIn(page, "Secondary", caption).locator(".mb-btn-face");
    const idle = await paint(face("idle"), frame);

    expect(await paint(face("hover"), frame)).toEqual(idle);
    await face("idle").hover();
    expect(await paint(face("idle"), frame)).toEqual(idle);
  });

  test("the required asterisk takes the danger colour", async ({ page }) => {
    const danger = await page.evaluate(() => {
      const probe = document.createElement("span");
      probe.style.color = "var(--error)";
      document.body.append(probe);
      const { color } = getComputedStyle(probe);
      probe.remove();
      return color;
    });
    await expect(
      sample(page, "mb-form", "required").first().locator(".mb-field-required")
    ).toHaveCSS("color", danger);
  });

  test("the required asterisk sits right after the label text", async ({
    page,
  }) => {
    const marker = sample(page, "mb-form", "required")
      .first()
      .locator(".mb-field-required");
    // From the right edge of the label's last glyph to the left edge of
    // the "*" glyph, both measured on their text, not their boxes.
    const gap = await marker.evaluate((star) => {
      const glyphs = (node: Node, side: "first" | "last") => {
        const text = node.textContent ?? "";
        const at =
          side === "last"
            ? text.trimEnd().length - 1
            : text.length - text.trimStart().length;
        const range = document.createRange();
        range.setStart(node, at);
        range.setEnd(node, at + 1);
        return range.getBoundingClientRect();
      };
      const label = star.previousSibling;
      const starText = star.firstChild;
      if (!(label && starText)) {
        throw new Error("the label text or the marker text is missing");
      }
      return glyphs(starText, "first").left - glyphs(label, "last").right;
    });
    expect(gap).toBeGreaterThanOrEqual(0);
    expect(gap).toBeLessThanOrEqual(4);
  });

  test("a pressed nav link turns blue like its forced press", async ({
    page,
  }) => {
    const nav = (caption: string) =>
      sample(page, "mb-link", caption).locator(".mb-link-nav");
    const forced = await paint(nav("pressed"), ["color"]);
    expect(forced).not.toEqual(await paint(nav("idle"), ["color"]));

    await nav("idle").hover();
    await page.mouse.down();
    expect(await paint(nav("idle"), ["color"])).toEqual(forced);
    await page.mouse.up();
  });

  test("an unchecked checkbox shows its check faintly on hover, as the forced hover does", async ({
    page,
  }) => {
    const mark = (caption: string) =>
      sample(page, "mb-checkbox", caption).locator(".mb-checkbox-mark");
    const faint = Number(
      await mark("hover").evaluate((el) => getComputedStyle(el).opacity)
    );
    expect(faint).toBeGreaterThan(0);
    expect(faint).toBeLessThan(1);

    await expect(mark("unchecked")).toHaveCSS("opacity", "0");
    await sample(page, "mb-checkbox", "unchecked")
      .locator(".mb-checkbox")
      .hover();
    await expect(mark("unchecked")).toHaveCSS("opacity", String(faint));
    await expect(mark("checked")).toHaveCSS("opacity", "1");
  });

  test("checking a choice chip moves nothing", async ({ page }) => {
    // Across every sample state (checked, hover, focus, disabled, invalid)
    // the chips keep one frame width and one type weight.
    const chips = page.locator(".mb-radio-choice .mb-radio-label");
    const looks = await chips.evaluateAll((labels) => [
      ...new Set(
        labels.map((label) => {
          const style = getComputedStyle(label);
          return `${style.borderTopWidth} ${style.borderLeftWidth} ${style.fontWeight}`;
        })
      ),
    ]);
    expect(looks).toEqual(["1px 1px 500"]);

    const group = page.getByRole("radiogroup", {
      name: "Typ projektu (choice, checked)",
    });
    const chip = group.locator(".mb-radio-label", { hasText: "Landing page" });
    await chip.scrollIntoViewIfNeeded();
    const before = await chip.boundingBox();
    await chip.click();
    await expect(
      group.getByRole("radio", { name: "Landing page" })
    ).toBeChecked();
    expect(await chip.boundingBox()).toEqual(before);
  });

  test("focusing a field lights only the field, never the form sheet", async ({
    page,
  }) => {
    const props = ["border-color", "box-shadow"];
    const forced = sample(page, "mb-form", "focus").locator(".mb-input");
    const idle = sample(page, "mb-form", "default")
      .first()
      .locator(".mb-input");

    const forcedPaint = await paint(forced, props);
    expect(forcedPaint).not.toEqual(await paint(idle, props));
    await idle.focus();
    expect(await paint(idle, props)).toEqual(forcedPaint);

    const sheet = ["background-color", "box-shadow"];
    const forcedForm = page.locator(
      '[data-form-sample="focus"] [data-contact-wrap]'
    );
    const idleForm = page.locator(
      '[data-form-sample="idle"] [data-contact-wrap]'
    );
    await page.mouse.move(0, 0);
    const rest = await paint(idleForm, sheet);
    expect(rest["box-shadow"]).toBe("none");
    expect(await paint(forcedForm, sheet)).toEqual(rest);
    await expect(forcedForm.locator('input[type="email"]')).not.toHaveCSS(
      "box-shadow",
      "none"
    );

    for (const field of ['input[type="email"]', "textarea"]) {
      // biome-ignore lint/performance/noAwaitInLoops: one focus at a time
      await idleForm.locator(field).focus();
      await expect(idleForm.locator(field)).not.toHaveCSS("box-shadow", "none");
      expect(await paint(idleForm, sheet), field).toEqual(rest);
    }
  });

  test("the invalid field shows its message and the error border", async ({
    page,
  }) => {
    const invalid = sample(page, "mb-form", "invalid").first();
    await expect(invalid.locator(".mb-field-error")).toBeVisible();
    await expect(invalid.locator(".mb-input")).toHaveCSS(
      "border-color",
      "rgb(224, 122, 112)"
    );
    await expect(
      sample(page, "mb-form", "default").first().locator(".mb-field-error")
    ).toBeHidden();
  });

  test("a single accordion keeps one item open, a multiple one keeps both", async ({
    page,
  }) => {
    const single = page.locator("#mb-accordion-single details");
    await expect(single.nth(0)).toHaveAttribute("open", "");
    await single.nth(1).locator("summary").click();
    await expect(single.nth(1)).toHaveAttribute("open", "");
    await expect(single.nth(0)).not.toHaveAttribute("open");

    const multiple = page.locator("#mb-accordion-multiple details");
    await multiple.nth(0).locator("summary").click();
    await multiple.nth(1).locator("summary").click();
    await expect(multiple.nth(0)).toHaveAttribute("open", "");
    await expect(multiple.nth(1)).toHaveAttribute("open", "");
  });

  test("the disabled accordion item cannot be focused or opened", async ({
    page,
  }) => {
    const disabled = page
      .locator("#mb-accordion-single .mb-accordion-item")
      .nth(2);
    await expect(disabled.locator("[aria-disabled='true']")).toBeVisible();
    await expect(disabled.locator("summary, [tabindex]")).toHaveCount(0);
  });

  test("breadcrumb and pagination mark the current page", async ({ page }) => {
    const breadcrumb = sample(page, "mb-breadcrumb", "chevron").getByRole(
      "navigation",
      { name: "Okruszki" }
    );
    await expect(breadcrumb.locator("[aria-current='page']")).toHaveText(
      "Panel dla zespołu sprzedaży"
    );
    await expect(breadcrumb.getByRole("link")).toHaveCount(2);

    const pagination = sample(
      page,
      "mb-pagination",
      "numbers, 5 z 12, jump"
    ).getByRole("navigation", { name: "Paginacja" });
    await expect(pagination.locator("[aria-current='page']")).toHaveText("5");
    await expect(
      pagination.getByRole("link", { exact: true, name: "Strona 12" })
    ).toBeVisible();
    await expect(
      pagination.getByRole("link", { exact: true, name: "Strona 2" })
    ).toHaveCount(0);
  });

  test("the collapsed breadcrumb opens its hidden pages as a menu", async ({
    page,
  }) => {
    const crumbs = sample(page, "mb-breadcrumb", "collapse");
    const trigger = crumbs.getByRole("button", {
      name: "Pokaż pominięte strony",
    });
    const menu = crumbs.locator("[popover]");
    await expect(menu).toBeHidden();

    // Keyboard: Enter opens, Tab walks into the links, Esc closes and
    // gives focus back.
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link")).toHaveText(["Realizacje", "2025"]);
    await page.keyboard.press("Tab");
    await expect(menu.getByRole("link", { name: "Realizacje" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();

    // A click outside closes it.
    await trigger.click();
    await expect(menu).toBeVisible();
    await page.getByRole("heading", { name: "Katalog komponentów" }).click();
    await expect(menu).toBeHidden();

    // Following an item leaves the page for it.
    await trigger.click();
    await menu.getByRole("link", { name: "2025" }).click();
    await expect(page).toHaveURL(FOLLOWED_CRUMB);
  });

  test("the collapsed breadcrumb menu passes axe while open", async ({
    page,
  }) => {
    await sample(page, "mb-breadcrumb", "collapse")
      .getByRole("button", { name: "Pokaż pominięte strony" })
      .click();
    const results = await new AxeBuilder({ page })
      .include('section[aria-labelledby="mb-breadcrumb"]')
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("the menu opens the mobile sheet as a modal and Escape closes it", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 800, width: 360 });
    const trigger = page.locator("[data-menu-open]");
    const sheet = page.getByRole("dialog", { name: "Menu mobilne" });
    await expect(sheet).toBeHidden();

    await trigger.click();
    await expect(sheet).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("[data-menu-close]")).toBeFocused();
    expect(
      await page
        .locator(".mb-frame")
        .evaluate((el) => (el as HTMLElement).inert)
    ).toBe(true);

    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("a form on /ui sends nothing to the lead store", async ({ page }) => {
    const form = page.locator('[data-form-sample="idle"] [data-contact-form]');
    expect(await sendALead(page, form)).toBe(0);
  });

  test("/ui/mb and the minimal-brutalism proposal are gone", async ({
    request,
  }) => {
    const statuses = await Promise.all(
      ["/ui/mb", "/ui/proposal/minimal-brutalism"].map(async (path) =>
        (await request.get(path)).status()
      )
    );
    expect(statuses).toEqual([404, 404]);
  });
});

test.describe("pagination jump without JavaScript (astro dev)", () => {
  test.use({ baseURL: DEV_URL, javaScriptEnabled: false });

  test("the page field sends a GET for that page, and refuses one out of range", async ({
    page,
  }) => {
    await page.goto("/ui");
    const sampleNav = () =>
      sample(page, "mb-pagination", "numbers, 5 z 12, jump").getByRole(
        "navigation",
        { name: "Paginacja" }
      );

    await sampleNav().getByRole("spinbutton", { name: "Strona" }).fill("13");
    await sampleNav().getByRole("button", { name: "Idź" }).click();
    await expect(page).toHaveURL(UI_UNPAGED);

    await sampleNav().getByRole("spinbutton", { name: "Strona" }).fill("7");
    await sampleNav().getByRole("button", { name: "Idź" }).click();
    await expect(page).toHaveURL(UI_PAGE_7);
    await expect(sampleNav().locator("[aria-current='page']")).toHaveText("7");
  });
});

test.describe("motion (astro dev)", () => {
  test.use({ baseURL: DEV_URL });

  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`the accordion ${reducedMotion === "reduce" ? "snaps" : "animates"} open and closed under ${reducedMotion}`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion });
      await page.goto("/ui", { waitUntil: "networkidle" });
      const item = page.locator("#mb-accordion-multiple details").first();

      const opening = await heightsAfter(item, "summary");
      await expect(item).toHaveAttribute("open", "");
      await expect
        .poll(() => item.evaluate((el) => el.getAnimations().length))
        .toBe(0);
      const closing = await heightsAfter(item, "summary");
      await expect(item).not.toHaveAttribute("open");

      expect((opening.at(-1) ?? 0) > (opening[0] ?? 0)).toBe(true);
      expect((closing.at(-1) ?? 0) < (closing[0] ?? 0)).toBe(true);
      if (reducedMotion === "reduce") {
        expect(between(opening)).toEqual([]);
        expect(between(closing)).toEqual([]);
      } else {
        expect(between(opening).length).toBeGreaterThan(0);
        expect(between(closing).length).toBeGreaterThan(0);
      }
    });

    test(`hover, press and focus ${reducedMotion === "reduce" ? "do not move" : "move"} under ${reducedMotion}`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion });
      await page.goto("/ui", { waitUntil: "networkidle" });
      const idle = (section: string, selector: string) =>
        sample(page, section, "idle").locator(selector).first();
      const expectMotion = async (locator: Locator, what: string) => {
        const running = await runningTransitions(locator);
        if (reducedMotion === "reduce") {
          expect(running, what).toEqual([]);
        } else {
          expect(running.length, what).toBeGreaterThan(0);
        }
      };

      const button = idle("mb-button", ".mb-btn");
      await button.hover();
      await expectMotion(button, "button hover: the face lifts off its layer");
      await page.mouse.down();
      await expectMotion(button, "button press: the face goes onto its layer");
      await page.mouse.up();

      const nav = idle("mb-link", ".mb-link-nav");
      await nav.hover();
      await expectMotion(nav, "nav hover: the bar draws in");

      const caseLink = idle("mb-link", ".mb-link-case");
      await caseLink.hover();
      await page.mouse.down();
      await expectMotion(caseLink, "case press: the arrow nudges further");
      await page.mouse.up();

      const card = idle("mb-card", ".mb-card");
      await card.hover();
      await expectMotion(card, "card hover: the top rule draws in");

      const badge = sample(page, "mb-badge", "href, idle").locator(".mb-badge");
      await badge.hover();
      await page.mouse.down();
      await expectMotion(badge, "badge link press: the ink block");
      await page.mouse.up();

      const input = sample(page, "mb-form", "default").first().locator("input");
      await input.focus();
      await expectMotion(input, "input focus: the shadow shifts out");

      // The focus ring grows out of the edge: reach the button by keyboard.
      await page.mouse.click(1, 1);
      await button.focus();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Tab");
      await expect(button).toBeFocused();
      expect(await button.evaluate((el) => el.matches(":focus-visible"))).toBe(
        true
      );
      await expectMotion(button, "button focus: the ring grows out");
    });
  }
});

// One frame of a card's top rule (its ::before) while it is partly drawn:
// the x it grows from or gathers to, as a fraction of its width (0 the left
// edge, 1 the right), and whether the card is hovered - the rule grows
// while it is, and shrinks while it is not.
interface RuleFrame {
  hovered: boolean;
  origin: number;
}

// Records the top rule of each of `cards` on every frame until the
// returned function is awaited; that lets the last slide finish and gives,
// per card, the origins seen while its rule grew and while it shrank.
const recordRules = async (cards: Locator) => {
  await cards.evaluateAll((els) => {
    const store = window as unknown as {
      ruleFrames: RuleFrame[][];
      ruleStop: boolean;
    };
    store.ruleFrames = els.map(() => []);
    store.ruleStop = false;
    const tick = () => {
      for (const [i, el] of els.entries()) {
        const rule = getComputedStyle(el, "::before");
        const scale = new DOMMatrix(rule.transform).a;
        if (scale > 0 && scale < 1) {
          const origin =
            Number.parseFloat(rule.transformOrigin) / el.clientWidth;
          store.ruleFrames[i]?.push({
            hovered: el.matches(":hover"),
            origin: Math.round(origin * 100) / 100,
          });
        }
      }
      if (!store.ruleStop) {
        requestAnimationFrame(tick);
      }
    };
    tick();
  });
  return async () => {
    await cards.page().waitForTimeout(600);
    const frames = await cards.page().evaluate(() => {
      const store = window as unknown as {
        ruleFrames: RuleFrame[][];
        ruleStop: boolean;
      };
      store.ruleStop = true;
      return store.ruleFrames;
    });
    return frames.map((rule) => ({
      grew: [...new Set(rule.filter((f) => f.hovered).map((f) => f.origin))],
      shrank: [...new Set(rule.filter((f) => !f.hovered).map((f) => f.origin))],
    }));
  };
};

// The three cells of the card section's direction row, scrolled to the
// middle of the viewport (clear of the sticky header; instant, as html
// scrolls smoothly), with their boxes and the row's middle line.
const directionRow = async (page: Page) => {
  const cards = page
    .locator('section[aria-labelledby="mb-card"] .mb-ui-row')
    .filter({ has: page.locator(".mb-ui-row-label", { hasText: DIRECTION }) })
    .locator(".mb-card");
  await cards
    .first()
    .evaluate((el) =>
      el.scrollIntoView({ behavior: "instant", block: "center" })
    );
  const boxes = await cards.evaluateAll((els) =>
    els.map((el) => {
      const { bottom, left, right, top } = el.getBoundingClientRect();
      return { bottom, centre: (left + right) / 2, left, right, top };
    })
  );
  const [first, middle, last] = boxes;
  if (!(first && middle && last)) {
    throw new Error("the direction row has fewer than three cards");
  }
  return {
    boxes,
    cards,
    first,
    last,
    middle,
    y: (first.top + first.bottom) / 2,
  };
};

// Moves the mouse through `points` a few steps at a time, letting each
// slide (`--mb-slide`, 0.3s) run before the next move.
const sweep = async (page: Page, points: [number, number][]) => {
  for (const [x, y] of points) {
    // biome-ignore lint/performance/noAwaitInLoops: one move at a time
    await page.mouse.move(x, y, { steps: 4 });
    await page.waitForTimeout(400);
  }
};

// What a card's rule looks like with no mouse on it: its direction
// attributes and where the rule rests (origin) and how far it is drawn.
const ruleAtRest = (cards: Locator) =>
  cards.evaluateAll((els) =>
    els.map((el) => {
      const rule = getComputedStyle(el, "::before");
      return {
        barIn: el.getAttribute("data-bar-in"),
        barOut: el.getAttribute("data-bar-out"),
        origin:
          Math.round(
            (Number.parseFloat(rule.transformOrigin) / el.clientWidth) * 100
          ) / 100,
        scale: new DOMMatrix(rule.transform).a,
      };
    })
  );

const DEFAULT_REST = { barIn: null, barOut: null, origin: 1, scale: 0 };

test.describe("card rule direction (astro dev)", () => {
  test.use({
    baseURL: DEV_URL,
    contextOptions: { reducedMotion: "no-preference" },
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/ui", { waitUntil: "networkidle" });
  });

  test("a mouse sweeping right to left draws each rule in from the right and out to the left", async ({
    page,
  }) => {
    const { boxes, cards, first, last, y } = await directionRow(page);
    await page.mouse.move(last.right + 24, y);
    const collect = await recordRules(cards);
    await sweep(page, [
      ...boxes.toReversed().map((b): [number, number] => [b.centre, y]),
      [first.left - 24, y],
    ]);

    const slid = { grew: [1], shrank: [0] };
    expect(await collect()).toEqual([slid, slid, slid]);
    // Once the rule is out, the card is as no mouse left it.
    expect(await ruleAtRest(cards)).toEqual([
      DEFAULT_REST,
      DEFAULT_REST,
      DEFAULT_REST,
    ]);
  });

  test("a mouse sweeping left to right draws each rule in from the left and out to the right", async ({
    page,
  }) => {
    const { boxes, cards, first, last, y } = await directionRow(page);
    await page.mouse.move(first.left - 24, y);
    const collect = await recordRules(cards);
    await sweep(page, [
      ...boxes.map((b): [number, number] => [b.centre, y]),
      [last.right + 24, y],
    ]);

    const slid = { grew: [0], shrank: [1] };
    expect(await collect()).toEqual([slid, slid, slid]);
  });

  test("through the top or the bottom, the nearer side edge counts", async ({
    page,
  }) => {
    const { cards, middle } = await directionRow(page);
    const quarter = (middle.right - middle.left) / 4;
    const centreY = (middle.top + middle.bottom) / 2;
    // In through the top in the right half, out through the bottom in the
    // left half: in from the right, out to the left.
    await page.mouse.move(middle.right - quarter, middle.top - 24);
    const collect = await recordRules(cards);
    await sweep(page, [
      [middle.right - quarter, centreY],
      [middle.left + quarter, centreY],
      [middle.left + quarter, middle.bottom + 24],
    ]);

    expect((await collect())[1]).toEqual({ grew: [1], shrank: [0] });
  });

  test("keyboard focus after a right-to-left pass meets the rule at rest on the right", async ({
    page,
  }) => {
    const link = sample(page, "mb-card", "jako link").locator(".mb-card");
    await link.evaluate((el) =>
      el.scrollIntoView({ behavior: "instant", block: "center" })
    );
    const box = await link.boundingBox();
    if (!box) {
      throw new Error("the link card is not rendered");
    }
    const y = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width + 24, y);
    await sweep(page, [
      [box.x + box.width / 2, y],
      [box.x - 24, y],
    ]);
    await page.waitForTimeout(400);

    await sample(page, "mb-card", "default, wszystkie części")
      .getByRole("link", { name: "Wszystkie" })
      .focus();
    await page.keyboard.press("Tab");
    await expect(link).toBeFocused();
    expect(await ruleAtRest(link)).toEqual([DEFAULT_REST]);
  });

  test.describe("on a touch screen", () => {
    test.use({ hasTouch: true });

    test("taps draw the rule in from the left and out to the right, wherever they land", async ({
      page,
    }) => {
      const { cards, first, last, y } = await directionRow(page);
      const collect = await recordRules(cards);
      // On the left edge of the first card, then on the right edge of the
      // last, which takes the hover from the first.
      await page.touchscreen.tap(first.left + 8, y);
      await page.waitForTimeout(400);
      await page.touchscreen.tap(last.right - 8, y);

      // Chrome's tap can drop :hover for a frame before it settles, so a
      // rule may start out once - to the right, as the default has it.
      const [left, , right] = await collect();
      expect(left?.grew).toEqual([0]);
      expect(left?.shrank).toContain(1);
      expect(left?.shrank.filter((origin) => origin !== 1)).toEqual([]);
      expect(right?.grew).toEqual([0]);
      expect(right?.shrank.filter((origin) => origin !== 1)).toEqual([]);
    });
  });
});

// Where the label and the spinner of `button` sit (their translateX), how
// wide the button is, and which of the two are sliding, on each of the next
// `frames` animation frames once `start` has run in the page; `startedAt`
// and `at` are page clock times of the call and of `start` done.
const slideFrames = (button: Locator, start: "click" | "settle", frames = 12) =>
  button.evaluate(
    async (el, { count, how }) => {
      const label = el.querySelector(".mb-btn-label") as Element;
      const spinner = el.querySelector(".mb-btn-spinner") as Element;
      const startedAt = Date.now();
      if (how === "click") {
        (el as HTMLElement).click();
      } else {
        // Wait for the demo to clear aria-busy by itself.
        const { promise, resolve } = Promise.withResolvers<void>();
        const observer = new MutationObserver(() => {
          if (!el.hasAttribute("aria-busy")) {
            observer.disconnect();
            resolve();
          }
        });
        observer.observe(el, { attributes: true });
        await promise;
      }
      const at = Date.now();
      const samples: {
        label: number;
        sliding: string[];
        spinner: number;
        width: number;
      }[] = [];
      for (const _ of Array.from({ length: count })) {
        const sliding = el
          .getAnimations({ subtree: true })
          .filter(
            (a) =>
              a instanceof CSSTransition &&
              a.transitionProperty === "transform" &&
              a.playState === "running"
          )
          .map((a) => (a.effect as KeyframeEffect).target);
        samples.push({
          label: new DOMMatrix(getComputedStyle(label).transform).m41,
          sliding: [
            ...(sliding.includes(label) ? ["label"] : []),
            ...(sliding.includes(spinner) ? ["spinner"] : []),
          ],
          spinner: new DOMMatrix(getComputedStyle(spinner).transform).m41,
          width: el.getBoundingClientRect().width,
        });
        const { promise, resolve } = Promise.withResolvers<number>();
        requestAnimationFrame(resolve);
        // biome-ignore lint/performance/noAwaitInLoops: one sample per frame
        await promise;
      }
      return { at, samples, startedAt };
    },
    { count: frames, how: start }
  );

// The label's and the spinner's translateX in `button`, now.
const slidePositions = (button: Locator) =>
  button.evaluate((el) => {
    const at = (part: string) =>
      new DOMMatrix(
        getComputedStyle(el.querySelector(part) as Element).transform
      ).m41;
    return [at(".mb-btn-label"), at(".mb-btn-spinner")] as [number, number];
  });

test.describe("button layer and loading (astro dev)", () => {
  test.use({
    baseURL: DEV_URL,
    contextOptions: { reducedMotion: "no-preference" },
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/ui", { waitUntil: "networkidle" });
  });

  for (const variant of RAISED_VARIANTS) {
    test(`${variant}: the face lifts on hover and goes down on press over a layer box that never moves, always above it`, async ({
      page,
    }) => {
      const faceTransform = (caption: string) =>
        buttonIn(page, variant, caption)
          .locator(".mb-btn-face")
          .evaluate((el) => getComputedStyle(el).transform);
      expect(await faceTransform("hover")).toBe("matrix(1, 0, 0, 1, -1, -1)");
      expect(await faceTransform("pressed")).toBe("matrix(1, 0, 0, 1, 2, 2)");

      // The face is solid in every state, so the layer never shows through.
      for (const caption of ["idle", "hover", "pressed", "focus-visible"]) {
        // biome-ignore lint/performance/noAwaitInLoops: one state at a time
        const fill = await buttonIn(page, variant, caption)
          .locator(".mb-btn-face")
          .evaluate((el) => getComputedStyle(el).backgroundColor);
        expect(fill, caption).not.toMatch(TRANSLUCENT);
      }

      const button = buttonIn(page, variant, "idle");
      // Mid-viewport, clear of the sticky header, so the pointer reaches it;
      // instant, as html scrolls smoothly.
      await button.evaluate((el) =>
        el.scrollIntoView({ behavior: "instant", block: "center" })
      );
      const rest = await button.boundingBox();
      if (!rest) {
        throw new Error(`${variant} idle button is not rendered`);
      }

      // Records the layer's and the face's boxes on every frame from now
      // until `collect` reads them, so a transition is caught as it runs.
      const record = () =>
        button.evaluate((el) => {
          const box = (selector: string): Box => {
            const { x, y, width, height } = (
              el.querySelector(selector) as Element
            ).getBoundingClientRect();
            return { height, width, x, y };
          };
          const frames: BoxFrame[] = [];
          (el as unknown as { frames: BoxFrame[] }).frames = frames;
          const tick = () => {
            frames.push({
              face: box(".mb-btn-face"),
              layer: box(".mb-btn-layer"),
            });
            if (frames.length < 40) {
              requestAnimationFrame(tick);
            }
          };
          tick();
        });
      const collect = async () => {
        await page.waitForTimeout(800);
        return button.evaluate(
          (el) => (el as unknown as { frames: BoxFrame[] }).frames
        );
      };
      // What the pointer would hit where the face and the layer overlap,
      // with the layer made hittable: the face, never the layer.
      const faceOnTop = () =>
        button.evaluate((el) => {
          const layer = el.querySelector(".mb-btn-layer") as HTMLElement;
          const face = el.querySelector(".mb-btn-face") as HTMLElement;
          const { right, bottom } = face.getBoundingClientRect();
          layer.style.pointerEvents = "auto";
          const hit = document.elementFromPoint(right - 1, bottom - 1);
          layer.style.pointerEvents = "";
          return face.contains(hit);
        });

      // At rest: the layer is the resting box moved 2px down and right,
      // under the face.
      await record();
      const resting = await collect();
      const layer = resting[0]?.layer;
      expect(layer).toEqual({
        height: rest.height,
        width: rest.width,
        x: rest.x + 2,
        y: rest.y + 2,
      });
      expect(await faceOnTop()).toBe(true);

      // Hover, with the pointer 1px inside the resting box's bottom-right
      // corner, which the lifted face leaves: hover holds instead of
      // flickering, and the layer box stays the same on every frame.
      await record();
      await page.mouse.move(rest.x + rest.width - 1, rest.y + rest.height - 1);
      const lifting = await collect();
      const lifted = lifting.filter(
        (f) => f.face.x < rest.x && f.face.x > rest.x - 1
      );
      expect(lifted.length).toBeGreaterThanOrEqual(2);
      for (const frame of lifting) {
        expect(frame.layer).toEqual(layer);
      }
      expect(lifting.at(-1)?.face).toMatchObject({
        x: rest.x - 1,
        y: rest.y - 1,
      });
      expect(await faceOnTop()).toBe(true);

      // Press: the face goes down onto the layer and covers it exactly; the
      // layer box again never moves, and the resting box's top-left corner,
      // which the face has left, is still the button's.
      await record();
      await page.mouse.down();
      const pressing = await collect();
      const sinking = pressing.filter(
        (f) => f.face.x > rest.x - 1 && f.face.x < rest.x + 2
      );
      expect(sinking.length).toBeGreaterThanOrEqual(2);
      for (const frame of pressing) {
        expect(frame.layer).toEqual(layer);
      }
      expect(pressing.at(-1)?.face).toEqual(layer);
      expect(await faceOnTop()).toBe(true);
      expect(
        await button.evaluate(
          (el, { x, y }) => el.contains(document.elementFromPoint(x, y)),
          { x: rest.x + 1, y: rest.y + 1 }
        )
      ).toBe(true);
      await page.mouse.up();
    });
  }

  test("the live loading sample slides its label out for the spinner and back by itself", async ({
    page,
  }) => {
    const demo = page.locator("[data-loading-demo]");
    await demo.scrollIntoViewIfNeeded();
    const width = await demo.evaluate((el) => el.getBoundingClientRect().width);
    const [idleLabel, idleSpinner] = await slidePositions(demo);
    expect(idleLabel).toBe(0);
    // Waiting past the right edge of the label.
    expect(idleSpinner).toBeGreaterThan(width / 2);
    const midSlide = (s: { label: number; spinner: number }) =>
      s.label < 0 &&
      s.label > -width &&
      s.spinner > 0 &&
      s.spinner < idleSpinner;

    // Loading starts: the label leaves to the left while the spinner comes
    // in from the right, both at once, and the button keeps its width.
    const enter = await slideFrames(demo, "click");
    expect(
      enter.samples.some((s) => s.sliding.join() === "label,spinner")
    ).toBe(true);
    expect(enter.samples.some(midSlide)).toBe(true);
    for (const [i, s] of enter.samples.entries()) {
      expect(s.width).toBe(width);
      expect(s.label).toBeLessThanOrEqual(enter.samples[i - 1]?.label ?? 0);
      expect(s.spinner).toBeLessThanOrEqual(
        enter.samples[i - 1]?.spinner ?? idleSpinner
      );
    }

    await expect(demo).toHaveAttribute("aria-busy", "true");
    await expect(demo).toBeDisabled();
    await expect.poll(async () => (await slidePositions(demo))[1]).toBe(0);
    const [loadingLabel] = await slidePositions(demo);
    expect(loadingLabel).toBeLessThan(-width / 2);

    // Loading ends by itself 3-5 s after the click: the spinner leaves to
    // the right while the label comes back from the left.
    const exit = await slideFrames(demo, "settle");
    expect(exit.at - enter.startedAt).toBeGreaterThanOrEqual(3000);
    expect(exit.at - enter.startedAt).toBeLessThanOrEqual(5000);
    expect(exit.samples.some((s) => s.sliding.join() === "label,spinner")).toBe(
      true
    );
    expect(exit.samples.some(midSlide)).toBe(true);
    for (const [i, s] of exit.samples.entries()) {
      expect(s.width).toBe(width);
      expect(s.label).toBeGreaterThanOrEqual(
        exit.samples[i - 1]?.label ?? loadingLabel
      );
      expect(s.spinner).toBeGreaterThanOrEqual(
        exit.samples[i - 1]?.spinner ?? 0
      );
    }

    await expect(demo).not.toHaveAttribute("aria-busy");
    await expect(demo).toBeEnabled();
    await expect.poll(() => slidePositions(demo)).toEqual([0, idleSpinner]);
  });
});

test.describe("production build", () => {
  test("has no /ui page", async ({ request }) => {
    const statuses = await Promise.all(
      ["/ui", "/ui/"].map(async (path) => (await request.get(path)).status())
    );
    expect(statuses).toEqual([404, 404]);
  });

  test("neither the sitemap nor the home page points to /ui", async ({
    page,
    request,
  }) => {
    const sitemap = await (await request.get("/sitemap-0.xml")).text();
    expect(sitemap).toContain("<loc>");
    expect(sitemap).not.toContain("/ui");

    await page.goto("/");
    await expect(page.locator('a[href^="/ui"]')).toHaveCount(0);
  });

  // The control for the dev pages' "sends nothing": the same lead on the
  // home page, which loads contact-form.ts, does reach the (stubbed) store.
  test("the home page form sends a lead", async ({ page }) => {
    await page.goto("/#contact");
    expect(
      await sendALead(page, page.locator("#contact [data-contact-form]"))
    ).toBe(1);
  });

  // Tag and status pill are badge variants now: the service tags keep their
  // own case in the muted frame, the availability keeps its blue frame and
  // square dot.
  test("service tags and the availability are badge variants", async ({
    page,
  }) => {
    await page.goto("/");
    const tags = page.locator("#services .mb-service-tags li > .mb-badge-tag");
    expect(await tags.count()).toBeGreaterThan(0);
    await expect(tags.first()).toHaveCSS("text-transform", "none");
    await expect(tags.first()).toHaveCSS("border-color", "rgb(157, 156, 149)");

    const status = page.locator(".mb-hero-status .mb-badge-status");
    await expect(status).toHaveText("Otwarty na nowe współprace");
    await expect(status).toHaveCSS("border-color", "rgb(142, 174, 216)");
    expect(
      await status.evaluate((el) => {
        const dot = getComputedStyle(el, "::before");
        return `${dot.width} ${dot.height} ${dot.backgroundColor}`;
      })
    ).toBe("7px 7px rgb(142, 174, 216)");
    await expect(page.locator(".mb-tag, .mb-status-pill")).toHaveCount(0);
  });

  // The process steps and the contact links are the catalogue's step
  // marker and contact link: one rail through the marks, a mark that fills
  // with its step, and LinkedIn in a new tab while email stays put.
  test("process steps and contact links behave as on /ui", async ({ page }) => {
    await page.goto("/");
    const markers = page.locator("#how .mb-step > .mb-step-marker");
    await expect(markers).toHaveCount(5);
    await expectRailFromFirstMarkToLast(markers);

    const step = page.locator("#how .mb-step").nth(2);
    await step.locator(".mb-card").hover();
    await expect(step.locator(".mb-step-dot")).toHaveCSS(
      "background-color",
      "rgb(142, 174, 216)"
    );
    await expect(
      page.locator("#how .mb-step").nth(1).locator(".mb-step-dot")
    ).toHaveCSS("background-color", "rgb(10, 12, 16)");

    const email = page.locator("#contact a.mb-card", { hasText: "Email" });
    const linkedin = page.locator("#contact a.mb-card", {
      hasText: "LinkedIn",
    });
    await expect(email).toHaveAttribute(
      "href",
      "mailto:kontakt@kacperadler.pl"
    );
    await expect(email).not.toHaveAttribute("target");
    await expect(email.locator(".mb-contact-value")).toHaveText(
      "kontakt@kacperadler.pl"
    );
    await expect(linkedin).toHaveAttribute("target", "_blank");
    await expect(linkedin).toHaveAttribute("rel", "noopener");
    await expect(linkedin.locator(".mb-contact-value")).toHaveText(
      "/in/kacperadler"
    );
  });
});
