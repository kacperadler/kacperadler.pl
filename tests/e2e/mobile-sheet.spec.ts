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

    await page.click("[data-menu-close]");

    await expect(sheet).toBeHidden();
    await expect(sheet).toHaveJSProperty("open", false);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("the sheet fades in, and fades out on top of the page", async ({
    page,
  }) => {
    await page.goto("/");

    // Read in the task of the click: the transitions it starts, sorted.
    const fadeOf = (selector: string) =>
      page.evaluate((hook) => {
        document.querySelector<HTMLElement>(hook)?.click();
        return (
          document
            .querySelector("#mobile-sheet")
            ?.getAnimations()
            .map((a) =>
              a instanceof CSSTransition ? a.transitionProperty : ""
            )
            .sort() ?? []
        );
      }, selector);

    expect(await fadeOf("[data-menu-open]")).toContain("opacity");
    await expect(page.locator("#mobile-sheet")).toBeVisible();
    // Closing keeps it shown and in the top layer until the fade ends.
    expect(await fadeOf("[data-menu-close]")).toEqual([
      "display",
      "opacity",
      "overlay",
    ]);
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
    await trigger.dispatchEvent("click");
    await expect(sheet).toBeVisible();

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

  test("the page behind does not scroll while the sheet is open", async ({
    page,
  }) => {
    await page.goto("/");

    await page.locator("[data-menu-open]").click();
    await expect(page.locator("#mobile-sheet")).toBeVisible();

    await page.mouse.move(187, 600);
    await page.mouse.wheel(0, 600);
    // Give a wheel that did get through the time to scroll the page.
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);

    await page.click("[data-menu-close]");
    await page.mouse.wheel(0, 600);
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
    await page.mouse.move(187, 600);
    await page.mouse.wheel(0, 300);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(before);

    await trigger.click();
    await expect(sheet).toBeVisible();
    await expect(page.locator("[data-menu-close]")).toBeFocused();
  });

  test.describe("on a phone held sideways", () => {
    test.use({ viewport: { height: 390, width: 844 } });

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
