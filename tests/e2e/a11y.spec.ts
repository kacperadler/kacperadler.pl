import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// Reduced motion: the first screen stands in place from the first frame and
// nothing moves, so axe reads the final paint instead of a state halfway
// through the entrance.
test.use({ contextOptions: { reducedMotion: "reduce" } });

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
const VIEWPORTS = [
  { height: 900, width: 1440 },
  { height: 800, width: 360 },
];
const PAGES = ["/", "/polityka-prywatnosci/", "/regulamin/", "/realizacje/"];

// The case study pages the build has (the e2e build reads the fixture while
// src/content/case-studies is empty), as linked from their list.
async function caseStudyPaths(page: Page): Promise<string[]> {
  await page.goto("/realizacje/");
  return page
    .locator("#top a[href^='/realizacje/']")
    .evaluateAll((links) =>
      links.map((link) => link.getAttribute("href") ?? "")
    );
}

test.describe("axe-core a11y", () => {
  for (const viewport of VIEWPORTS) {
    test(`home, legal, case study pages and 404 have no WCAG 2.1 AA violations at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      const cases = await caseStudyPaths(page);
      expect(cases.length).toBeGreaterThan(0);

      for (const path of [...PAGES, ...cases, "/this-route-does-not-exist"]) {
        // biome-ignore lint/performance/noAwaitInLoops: one page at a time
        await page.goto(path, { waitUntil: "domcontentloaded" });
        const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
        expect(results.violations, path).toEqual([]);
      }
    });

    for (const fonts of ["Geist", "a fallback font"]) {
      test(`no page scrolls sideways at ${viewport.width}px with ${fonts}`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        const cases = await caseStudyPaths(page);
        // The fallback is what a visitor sees until Geist has loaded (or
        // when it fails): a wider face the heavy headlines and the header
        // must survive too.
        if (fonts !== "Geist") {
          await page.route("**/*.woff2", (route) => route.abort());
        }
        for (const path of [...PAGES, ...cases, "/this-route-does-not-exist"]) {
          // biome-ignore lint/performance/noAwaitInLoops: one page at a time
          await page.goto(path);
          await page.evaluate(() => document.fonts.ready);
          const { client, scroll } = await page.evaluate(() => ({
            client: document.documentElement.clientWidth,
            scroll: document.documentElement.scrollWidth,
          }));
          expect(scroll, path).toBeLessThanOrEqual(client);
        }
      });
    }
  }

  test("contact form error states have no detectable WCAG 2.1 AA violations", async ({
    page,
  }) => {
    // Colour fades run under reduced motion too: axe reads the colours once
    // the blur's and the pointer's fades are over.
    const axe = async () => {
      await page.evaluate(() => (document.activeElement as HTMLElement).blur());
      await page.mouse.move(0, 0);
      await page.evaluate(() =>
        Promise.all(document.getAnimations().map((a) => a.finished))
      );
      return new AxeBuilder({ page })
        .include("[data-contact-wrap]")
        .withTags(WCAG)
        .analyze();
    };
    await page.route("**/api/lead", (route) =>
      route.fulfill({ json: { error: "store" }, status: 500 })
    );
    await page.goto("/#contact");
    await page.waitForLoadState("networkidle");
    const wrap = page.locator("[data-contact-wrap]");

    // Empty submit: every field invalid, error lines and coral frames shown.
    await page.click("[data-contact-form] [data-submit]");
    await expect(wrap).toHaveAttribute("data-state", "error-validation");
    expect((await axe()).violations).toEqual([]);

    // WCAG AA: error text 4.5:1, invalid frame 3:1, on the form surface.
    const ratios = await page.evaluate(() => {
      const luminance = (color: string) => {
        const [r = 0, g = 0, b = 0] = (color.match(/\d+(\.\d+)?/g) ?? []).map(
          (c) => {
            const s = Number(c) / 255;
            return s <= 0.040_45 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
          }
        );
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const contrast = (a: string, b: string) => {
        const la = luminance(a);
        const lb = luminance(b);
        return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
      };
      const css = (selector: string) =>
        getComputedStyle(document.querySelector(selector) as Element);
      // The first opaque background behind the form.
      let el: Element | null = document.querySelector("[data-contact-form]");
      let surface = "rgba(0, 0, 0, 0)";
      while (el && surface === "rgba(0, 0, 0, 0)") {
        surface = getComputedStyle(el).backgroundColor;
        el = el.parentElement;
      }
      return {
        border: contrast(
          css("[data-contact-form] .mb-input").borderTopColor,
          surface
        ),
        text: contrast(
          css("[data-contact-form] .mb-field-error").color,
          surface
        ),
      };
    });
    expect(ratios.text).toBeGreaterThanOrEqual(4.5);
    expect(ratios.border).toBeGreaterThanOrEqual(3);

    // Valid submit the server refuses: the send-error banner.
    await page.fill('[data-contact-form] input[name="email"]', "a@example.com");
    await page.locator("[data-contact-form] label.mb-choice").first().click();
    await page.fill('[data-contact-form] textarea[name="message"]', "Treść");
    await page.click("[data-contact-form] [data-submit]");
    await expect(wrap).toHaveAttribute("data-state", "error-submit");
    expect((await axe()).violations).toEqual([]);
  });
});

// The text fields: the contact form's and the pagination "go to page" field
// (/lista/, the e2e fixture).
const FIELDS = [
  { path: "/", selector: '[data-contact-form] input[name="email"]' },
  { path: "/", selector: '[data-contact-form] input[name="company"]' },
  { path: "/", selector: '[data-contact-form] textarea[name="message"]' },
  { path: "/lista/", selector: ".mb-page-jump-input" },
];

const outline = (page: Page, selector: string) =>
  page.locator(selector).evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      color: style.outlineColor,
      style: style.outlineStyle,
      width: Number.parseFloat(style.outlineWidth),
    };
  });

// Windows high contrast (forced colors) drops box-shadow, so the blue hard
// shadow of a focused field is gone there. The field's focus rule keeps a
// transparent outline, which forced colors paint in a system color: the one
// ring that marks the field the visitor types in.
test.describe("forced colors", () => {
  test.use({ forcedColors: "active" });

  for (const { path, selector } of FIELDS) {
    test(`${selector} on ${path} shows a ring only while focused`, async ({
      page,
    }) => {
      await page.goto(path);
      expect((await outline(page, selector)).style).toBe("none");

      await page.locator(selector).focus();
      const focused = await outline(page, selector);
      expect(focused.style).toBe("solid");
      expect(focused.width).toBeGreaterThanOrEqual(2);
      expect(focused.color).not.toBe("rgba(0, 0, 0, 0)");
    });
  }
});

// In normal colors the same outline stays transparent: a focused field shows
// the ink frame and the blue shadow, never the global focus ring.
for (const { path, selector } of FIELDS) {
  test(`${selector} on ${path} shows no ring while focused in normal colors`, async ({
    page,
  }) => {
    await page.goto(path);
    await page.locator(selector).focus();
    const ring = await outline(page, selector);
    expect(
      ring.style === "none" || ring.color === "rgba(0, 0, 0, 0)",
      `outline ${ring.style} ${ring.color}`
    ).toBe(true);
  });
}
