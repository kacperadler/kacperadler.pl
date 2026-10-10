import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";
import { sendALead } from "./send-a-lead";

// The catalogue (/ui) exists only on `astro dev`; playwright.config.ts starts
// one for this tree and passes its port in E2E_DEV_PORT.
const DEV_URL = `http://localhost:${process.env.E2E_DEV_PORT}`;

const FLAT_SHADOW = /0px 0px 0px/;
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

// The rendered height of `target` on each of the next `frames` animation
// frames after `act` runs in the page - a transition shows up as heights
// between the first and the last.
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

// CSS transitions running on the element or inside it.
const runningTransitions = (locator: Locator) =>
  locator.evaluate((el) =>
    el
      .getAnimations({ subtree: true })
      .filter((a) => a instanceof CSSTransition && a.playState === "running")
      .map((a) => (a as CSSTransition).transitionProperty)
  );

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
    const props = ["background-color", "box-shadow", "color"];
    const forced = sample(page, "mb-button", "hover")
      .first()
      .locator(".mb-btn");
    const idle = sample(page, "mb-button", "idle").first().locator(".mb-btn");

    const forcedPaint = await paint(forced, props);
    expect(forcedPaint).not.toEqual(await paint(idle, props));
    await idle.hover();
    expect(await paint(idle, props)).toEqual(forcedPaint);
  });

  test("a forced card hover lights the card and its fillOnCellHover badge", async ({
    page,
  }) => {
    const forced = sample(page, "mb-card", "hover").locator(".mb-card");
    const idle = sample(page, "mb-card", "idle").locator(".mb-card");
    const card = ["background-color"];
    const badge = ["background-color", "border-color", "color"];
    // The 3px blue top rule is the card's ::before, drawn by scaleX.
    const rule = (locator: Locator) =>
      locator.evaluate((el) => getComputedStyle(el, "::before").transform);

    const forcedCard = await paint(forced, card);
    const forcedBadge = await paint(forced.locator(".mb-badge"), badge);
    expect(forcedCard).not.toEqual(await paint(idle, card));
    expect(await rule(forced)).toBe("matrix(1, 0, 0, 1, 0, 0)");
    expect(await rule(idle)).toBe("matrix(0, 0, 0, 1, 0, 0)");
    expect(forcedBadge).not.toEqual(
      await paint(idle.locator(".mb-badge"), badge)
    );

    await idle.hover();
    expect(await paint(idle, card)).toEqual(forcedCard);
    expect(await rule(idle)).toBe("matrix(1, 0, 0, 1, 0, 0)");
    expect(await paint(idle.locator(".mb-badge"), badge)).toEqual(forcedBadge);
  });

  test("a forced press paints like a real one: the default button sinks into its shadow", async ({
    page,
  }) => {
    const props = ["background-color", "box-shadow", "transform"];
    const forced = sample(page, "mb-button", "pressed")
      .first()
      .locator(".mb-btn");
    const idle = sample(page, "mb-button", "idle").first().locator(".mb-btn");

    const forcedPaint = await paint(forced, props);
    expect(forcedPaint.transform).toBe("matrix(1, 0, 0, 1, 4, 4)");
    expect(forcedPaint["box-shadow"]).toMatch(FLAT_SHADOW);
    expect(forcedPaint).not.toEqual(await paint(idle, props));

    await idle.hover();
    await page.mouse.down();
    expect(await paint(idle, props)).toEqual(forcedPaint);
    await page.mouse.up();
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
    const chips = page.locator(".mb-radio-choice .mb-radio-label");
    const widths = await chips.evaluateAll((labels) => [
      ...new Set(labels.map((label) => getComputedStyle(label).borderTopWidth)),
    ]);
    expect(widths).toEqual(["1px"]);

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

  test("a forced input focus paints like a real one, the form sheet's shadow with it", async ({
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

    const forcedForm = page.locator(
      '[data-form-sample="focus"] [data-contact-wrap]'
    );
    const idleForm = page.locator(
      '[data-form-sample="idle"] [data-contact-wrap]'
    );
    const shadow = await paint(forcedForm, ["box-shadow"]);
    expect(shadow["box-shadow"]).not.toBe("none");
    expect(await paint(idleForm, ["box-shadow"])).not.toEqual(shadow);
    await idleForm.locator('input[type="email"]').focus();
    expect(await paint(idleForm, ["box-shadow"])).toEqual(shadow);
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
      await expectMotion(button, "button hover: the shadow reaches further");
      await page.mouse.down();
      await expectMotion(button, "button press: it sinks into its shadow");
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
});
