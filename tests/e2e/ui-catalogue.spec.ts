import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";
import { sendALead } from "./send-a-lead";

// The catalogue (/ui) exists only on `astro dev`; playwright.config.ts starts
// one for this tree and passes its port in E2E_DEV_PORT.
const DEV_URL = `http://localhost:${process.env.E2E_DEV_PORT}`;

const FLAT_SHADOW = /0px 0px 0px/;
const RAISED_VARIANTS = ["Default", "Secondary", "Outline", "Destructive"];
const SHADOW_X = /\)\s+(-?[\d.]+)px/;
const FOLLOWED_CRUMB = /\/realizacje\/#2025$/;
const UI_UNPAGED = /\/ui$/;
const UI_PAGE_7 = /\/ui\?strona=7#mb-pagination$/;

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
  "Nagłówek sekcji",
  "Rama strony",
  "Typografia",
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

// The x offset of the first box-shadow, 0 when there is none.
const shadowX = (boxShadow: string) =>
  boxShadow === "none"
    ? 0
    : Number(boxShadow.match(SHADOW_X)?.[1] ?? Number.NaN);

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

  test("does not scroll sideways at 360px", async ({ page }) => {
    await page.setViewportSize({ height: 800, width: 360 });
    const { client, scroll } = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(scroll).toBeLessThanOrEqual(client);
  });

  test("a forced button hover paints like a real one", async ({ page }) => {
    const props = ["background-color", "box-shadow", "color", "transform"];
    const forced = sample(page, "mb-button", "hover")
      .first()
      .locator(".mb-btn");
    const idle = sample(page, "mb-button", "idle").first().locator(".mb-btn");

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
      const props = ["background-color", "box-shadow", "transform"];
      const idle = await paint(buttonIn(page, variant, "idle"), props);
      const hover = await paint(buttonIn(page, variant, "hover"), props);
      const pressed = await paint(buttonIn(page, variant, "pressed"), props);

      expect(idle.transform).toBe("none");
      expect(hover.transform).toBe("none");
      expect(pressed.transform).toBe("none");
      expect(hover["box-shadow"]).toBe(idle["box-shadow"]);
      expect(pressed["box-shadow"]).toMatch(FLAT_SHADOW);
      expect(pressed["background-color"]).not.toBe(idle["background-color"]);
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
    test(`${variant}: the face lifts on hover and goes down on press over a layer that stays put`, async ({
      page,
    }) => {
      const props = ["background-color", "box-shadow", "transform"];
      const hover = await paint(buttonIn(page, variant, "hover"), props);
      const pressed = await paint(buttonIn(page, variant, "pressed"), props);
      expect(hover.transform).toBe("matrix(1, 0, 0, 1, -2, -2)");
      expect(pressed.transform).toBe("matrix(1, 0, 0, 1, 4, 4)");
      expect(pressed["box-shadow"]).toMatch(FLAT_SHADOW);

      // The layer's left edge on screen: the face (transform included)
      // plus the shadow's offset.
      const button = buttonIn(page, variant, "idle");
      const layerX = async () => {
        const { left, shadow } = await button.evaluate((el) => ({
          left: el.getBoundingClientRect().left,
          shadow: getComputedStyle(el).boxShadow,
        }));
        return left + shadowX(shadow);
      };
      const rest = await button.boundingBox();
      if (!rest) {
        throw new Error(`${variant} idle button is not rendered`);
      }
      const restLayer = await layerX();
      expect(restLayer).toBeCloseTo(rest.x + 4, 1);

      // The pointer 1px inside the resting box's bottom-right corner, which
      // the lifted face leaves: hover holds instead of flickering.
      await page.mouse.move(rest.x + rest.width - 1, rest.y + rest.height - 1);
      const lifting = await button.evaluate(async (el) => {
        const frames: { left: number; shadow: string }[] = [];
        for (const _ of Array.from({ length: 8 })) {
          frames.push({
            left: el.getBoundingClientRect().left,
            shadow: getComputedStyle(el).boxShadow,
          });
          const { promise, resolve } = Promise.withResolvers<number>();
          requestAnimationFrame(resolve);
          // biome-ignore lint/performance/noAwaitInLoops: one sample per frame
          await promise;
        }
        return frames;
      });
      for (const { left, shadow } of lifting) {
        expect(left + shadowX(shadow)).toBeCloseTo(restLayer, 1);
      }
      await expect.poll(() => paint(button, props)).toEqual(hover);
      await page.waitForTimeout(300);
      expect(await paint(button, props)).toEqual(hover);
      expect(await layerX()).toBeCloseTo(restLayer, 1);

      // Pressed, the face covers the layer; its hit area still covers the
      // resting box's top-left corner, which the face has left.
      await page.mouse.down();
      await expect.poll(() => paint(button, props)).toEqual(pressed);
      expect(await layerX()).toBeCloseTo(restLayer, 1);
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
});
