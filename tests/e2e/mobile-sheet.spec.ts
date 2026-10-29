import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";

const HASH_CONTACT = /#contact$/;

// Whether `control` takes focus when asked: a control of the page behind
// the open sheet must not.
const takesFocus = (control: Locator) =>
  control.evaluate((el) => {
    el.focus();
    return document.activeElement === el;
  });

// The page behind the sheet: its first link, in the header.
const pageLink = (page: Page) => page.locator(".mb-frame a[href]").first();

// Mobile sheet only renders the hamburger below 880px - run these tests
// at a phone-sized viewport to make the trigger interactive.
test.use({ viewport: { height: 812, width: 375 } });

test.describe("mobile sheet", () => {
  test("hamburger opens the sheet as a modal dialog, X closes it", async ({
    page,
  }) => {
    await page.goto("/");

    const sheet = page.locator("#mobile-sheet");
    const trigger = page.locator("[data-menu-open]");

    await expect(sheet).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();

    await expect(sheet).toBeVisible();
    expect(await sheet.evaluate((el) => el.matches(":modal"))).toBe(true);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    // It covers the whole screen edge to edge, with no frame of its own,
    // and stands its CTA on the bottom padding.
    expect(
      await sheet.evaluate((el) => {
        const { x, y, width, height } = el.getBoundingClientRect();
        const cta = el.querySelector(".mb-sheet-cta")?.getBoundingClientRect();
        return [x, y, width, height, el.clientLeft, el.clientTop, cta?.bottom];
      })
    ).toEqual([0, 0, 375, 812, 0, 0, 812 - 32]);

    await page.click("[data-menu-close]");

    await expect(sheet).toBeHidden();
    await expect(sheet).toHaveJSProperty("open", false);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("the sheet fades in, and fades out on top of the page", async ({
    browserName,
    page,
  }) => {
    await page.goto("/");
    // Down the page, where a sheet that lost its fixed box would slide off.
    await page.evaluate(() =>
      window.scrollTo({ behavior: "instant", top: 1000 })
    );

    // Read in the task of the click: the transitions it starts, sorted, and
    // where the sheet then stands.
    const fadeOf = (selector: string) =>
      page.evaluate((hook) => {
        document.querySelector<HTMLElement>(hook)?.click();
        const sheet = document.querySelector("#mobile-sheet");
        const box = sheet?.getBoundingClientRect();
        return {
          box: [box?.x, box?.y, box?.width, box?.height],
          fades:
            sheet
              ?.getAnimations()
              .map((a) =>
                a instanceof CSSTransition ? a.transitionProperty : ""
              )
              .sort() ?? [],
        };
      }, selector);

    expect((await fadeOf("[data-menu-open]")).fades).toContain("opacity");
    const sheet = page.locator("#mobile-sheet");
    await expect(sheet).toBeVisible();
    await sheet.evaluate((el) =>
      Promise.all(el.getAnimations().map((a) => a.finished))
    );
    // While it fades, the page shows through it as it is, not dimmed.
    expect(
      await sheet.evaluate(
        (el) => getComputedStyle(el, "::backdrop").backgroundColor
      )
    ).toBe("rgba(0, 0, 0, 0)");
    // Closing keeps it shown over the whole screen and in the top layer
    // until the fade ends. WebKit starts no transition on a closing dialog
    // (KA0134 run): it hides at once, never as a sheet slid off the screen.
    // When WebKit fades it, the box must hold there too.
    expect(await fadeOf("[data-menu-close]")).toEqual(
      browserName === "webkit"
        ? { box: [0, 0, 0, 0], fades: [] }
        : { box: [0, 0, 375, 812], fades: ["display", "opacity", "overlay"] }
    );
  });

  test("another dialog closing leaves focus where it is", async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => {
      const other = document.createElement("dialog");
      other.innerHTML = "<button>OK</button>";
      document.body.append(other);
      other.showModal();
      other.close();
      document.querySelector<HTMLElement>(".mb-frame a[href]")?.focus();
    });

    // Its close event comes a task later; give it the time to arrive.
    await page.waitForTimeout(100);
    await expect(pageLink(page)).toBeFocused();
  });

  test("open sheet takes focus, keeps Tab inside, and X returns it to the trigger", async ({
    page,
  }) => {
    await page.goto("/");

    const sheet = page.locator("#mobile-sheet");
    const trigger = page.locator("[data-menu-open]");
    const close = page.locator("[data-menu-close]");

    await trigger.click();

    await expect(close).toBeFocused();
    // The page behind is inert: its links refuse focus.
    expect(await takesFocus(pageLink(page))).toBe(false);
    await expect(close).toBeFocused();

    // One full lap forward: each press moves to the next control of the
    // sheet in DOM order, and the press after the last one wraps back to
    // the close button instead of leaving for the page.
    const controls = await sheet.locator("a[href], button").all();
    for (const control of [...controls.slice(1), close]) {
      // biome-ignore lint/performance/noAwaitInLoops: key presses must run in order
      await page.keyboard.press("Tab");
      await expect(control).toBeFocused();
    }

    // Shift+Tab from the first control wraps to the last one, not the page.
    await page.keyboard.press("Shift+Tab");
    await expect(sheet.locator(".mb-sheet-cta a")).toBeFocused();

    await close.click();

    await expect(trigger).toBeFocused();
    expect(await takesFocus(pageLink(page))).toBe(true);
  });

  test.describe("under reduced motion", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("the open sheet still takes focus on its close button", async ({
      page,
    }) => {
      await page.goto("/");

      await page.locator("[data-menu-open]").click();

      await expect(page.locator("[data-menu-close]")).toBeFocused();
    });
  });

  test("Escape closes the sheet and returns focus to trigger", async ({
    page,
  }) => {
    await page.goto("/");

    const sheet = page.locator("#mobile-sheet");
    const trigger = page.locator("[data-menu-open]");

    // A click that leaves focus where it was, as in Safari, which does not
    // focus a clicked button: the dialog would hand focus back to the page.
    // Simulated in WebKit too: Playwright's Linux WebKit focuses a clicked
    // button (KA0134 run), so a real click there hides the gap.
    await trigger.dispatchEvent("click");
    await expect(sheet).toBeVisible();
    // From any control: Shift+Tab wraps to the last one, the CTA.
    await page.keyboard.press("Shift+Tab");
    await expect(sheet.locator(".mb-sheet-cta a")).toBeFocused();

    await page.keyboard.press("Escape");

    await expect(sheet).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("clicking a sheet link auto-closes the sheet", async ({ page }) => {
    await page.goto("/");

    const sheet = page.locator("#mobile-sheet");
    const trigger = page.locator("[data-menu-open]");

    await trigger.click();
    await expect(sheet).toBeVisible();

    await page.click('[data-sheet-link][href="/#services"]');

    await expect(sheet).toBeHidden();
    await expect(trigger).toBeFocused();
    expect(await takesFocus(pageLink(page))).toBe(true);
  });

  test("the page behind is locked while the sheet is open", async ({
    page,
  }) => {
    await page.goto("/");
    // No browser scrolls the page under the contained modal by wheel or
    // key; iOS Safari does under a finger, which Playwright cannot drive in
    // WebKit, so the root itself must not scroll while the sheet is up.
    const rootOverflow = () =>
      page.evaluate(() => getComputedStyle(document.documentElement).overflowY);
    expect(await rootOverflow()).toBe("visible");

    await page.locator("[data-menu-open]").click();
    await expect(page.locator("#mobile-sheet")).toBeVisible();
    expect(await rootOverflow()).toBe("hidden");

    await page.click("[data-menu-close]");
    expect(await rootOverflow()).toBe("visible");
    await page.keyboard.press("PageDown");
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(0);
  });

  test("a ClientRouter swap with the sheet open leaves a closed sheet and a free page", async ({
    page,
  }) => {
    await page.goto("/regulamin/");
    // A full reload would drop this; a ClientRouter swap keeps it.
    await page.evaluate(() => Object.assign(window, { notReloaded: true }));
    // The brand link takes the ClientRouter to the home page.
    await page.locator('.mb-frame a[href="/#top"]').first().click();
    await expect(page).toHaveURL("/#top");

    const trigger = page.locator("[data-menu-open]");
    await trigger.click();
    await expect(page.locator("#mobile-sheet")).toBeVisible();

    // Back swaps the body under the open sheet.
    await page.goBack();
    await expect(page).toHaveURL("/regulamin/");
    expect(await page.evaluate(() => "notReloaded" in window)).toBe(true);

    const sheet = page.locator("#mobile-sheet");
    await expect(sheet).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(await takesFocus(pageLink(page))).toBe(true);
    const before = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("PageDown");
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(before);

    await trigger.click();
    await expect(sheet).toBeVisible();
    await expect(page.locator("[data-menu-close]")).toBeFocused();
  });

  test.describe("on a phone held sideways", () => {
    // Scrolled by a wheel: mobile WebKit has none, and Playwright drives no
    // finger pan there, so WebKit runs these as a desktop with a mouse.
    test.use({
      hasTouch: false,
      isMobile: false,
      viewport: { height: 390, width: 844 },
    });

    test("the sheet scrolls its own overflow to FAQ and the CTA", async ({
      page,
    }) => {
      await page.goto("/");

      const sheet = page.locator("#mobile-sheet");
      const cta = sheet.locator(".mb-sheet-cta a");
      await page.locator("[data-menu-open]").click();
      await expect(sheet).toBeVisible();
      await expect(cta).not.toBeInViewport();

      await page.mouse.move(422, 195);
      await page.mouse.wheel(0, 600);

      await expect(
        sheet.locator('[data-sheet-link][href="/#faq"]')
      ).toBeInViewport();
      await expect(cta).toBeInViewport();
      // The page behind stays where it was: the wheel never reached it.
      expect(await page.evaluate(() => window.scrollY)).toBe(0);

      await cta.click();
      await expect(sheet).toBeHidden();
      await expect(page).toHaveURL(HASH_CONTACT);
    });

    // Chromium keeps a closing dialog in the top layer through `overlay`;
    // a browser that fades `display` with no `overlay` takes it out at
    // once, so the sheet's own fixed box must hold. WebKit has no
    // `overlay` but does not fade a closing dialog at all (the test above),
    // so only Chromium, with `overlay` left out, can show the hold.
    test("where the fade out leaves the top layer (no `overlay`), the sheet holds its box and scroll", async ({
      browserName,
      page,
    }) => {
      test.skip(browserName === "webkit", "WebKit fades no closing dialog");
      await page.goto("/");
      // Down the page, where a sheet that lost its fixed box would slide off.
      await page.evaluate(() =>
        window.scrollTo({ behavior: "instant", top: 1000 })
      );

      const sheet = page.locator("#mobile-sheet");
      await page.locator("[data-menu-open]").click();
      await expect(sheet).toBeVisible();
      await page.mouse.move(422, 195);
      await page.mouse.wheel(0, 600);
      await expect(sheet.locator(".mb-sheet-cta a")).toBeInViewport();

      // Read in the task of the click, as the fade out begins.
      const closing = await sheet.evaluate((el) => {
        el.style.transition =
          "opacity 0.12s linear, display 0.12s linear allow-discrete";
        const scrolled = el.scrollTop;
        el.querySelector<HTMLElement>("[data-menu-close]")?.click();
        const { x, y, width, height } = el.getBoundingClientRect();
        return {
          box: [x, y, width, height],
          keepsScroll: scrolled > 0 && el.scrollTop === scrolled,
        };
      });
      expect(closing).toEqual({ box: [0, 0, 844, 390], keepsScroll: true });
    });
  });

  test("open sheet is a dialog named 'Menu mobilne' with no axe violations", async ({
    page,
  }) => {
    await page.goto("/");

    await page.locator("[data-menu-open]").click();

    const dialog = page.getByRole("dialog", { name: "Menu mobilne" });
    await expect(dialog).toBeVisible();
    // Let the open transition finish so axe measures contrast on the final
    // paint: wait until the sheet has no running animation, not for a value.
    await dialog.evaluate((sheet) =>
      Promise.all(sheet.getAnimations().map((animation) => animation.finished))
    );

    const results = await new AxeBuilder({ page })
      .include("#mobile-sheet")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
