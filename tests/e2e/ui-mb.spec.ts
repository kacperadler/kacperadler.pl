import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";

// /ui/mb exists only on `astro dev`; playwright.config.ts starts one for this
// tree and passes its port in E2E_DEV_PORT.
const DEV_URL = `http://localhost:${process.env.E2E_DEV_PORT}`;

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
  "Tag i status pill",
  "Karta i siatka",
  "Nagłówek sekcji",
  "Rama strony",
  "Typografia",
  "Formularz kontaktowy",
];

const HOME_SECTIONS = ["top", "services", "how", "experience", "contact"];

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

test.describe("minimal brutalism components (astro dev)", () => {
  test.use({
    baseURL: DEV_URL,
    contextOptions: { reducedMotion: "reduce" },
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/ui/mb", { waitUntil: "networkidle" });
  });

  test("shows the home sections, then every component under its own heading", async ({
    page,
  }) => {
    await Promise.all(
      HOME_SECTIONS.map((id) => expect(page.locator(`#${id}`)).toBeVisible())
    );
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
    const card = ["background-color", "box-shadow"];
    const badge = ["background-color", "border-color", "color"];

    const forcedCard = await paint(forced, card);
    const forcedBadge = await paint(forced.locator(".mb-badge"), badge);
    expect(forcedCard).not.toEqual(await paint(idle, card));
    expect(forcedBadge).not.toEqual(
      await paint(idle.locator(".mb-badge"), badge)
    );

    await idle.hover();
    expect(await paint(idle, card)).toEqual(forcedCard);
    expect(await paint(idle.locator(".mb-badge"), badge)).toEqual(forcedBadge);
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
      "numbers, 5 z 12"
    ).getByRole("navigation", { name: "Paginacja" });
    await expect(pagination.locator("[aria-current='page']")).toHaveText("5");
    await expect(
      pagination.getByRole("link", { exact: true, name: "Strona 12" })
    ).toBeVisible();
    await expect(
      pagination.getByRole("link", { exact: true, name: "Strona 2" })
    ).toHaveCount(0);
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

  test("/ui links to /ui/mb", async ({ page }) => {
    await page.goto("/ui", { waitUntil: "networkidle" });
    await page
      .getByRole("navigation", { name: "Propozycje designu" })
      .getByRole("link", { name: "Minimal brutalism" })
      .click();
    await expect(page).toHaveURL(`${DEV_URL}/ui/mb`);
    await expect(
      page.getByRole("heading", { exact: true, level: 2, name: "Przycisk" })
    ).toBeVisible();
  });
});

test.describe("production build", () => {
  test("has no /ui/mb page", async ({ request }) => {
    const statuses = await Promise.all(
      ["/ui/mb", "/ui/mb/"].map(async (path) =>
        (await request.get(path)).status()
      )
    );
    expect(statuses).toEqual([404, 404]);
  });
});
