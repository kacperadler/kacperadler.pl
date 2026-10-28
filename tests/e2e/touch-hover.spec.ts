import { expect, type Locator, type Page, test } from "@playwright/test";

// A touch screen applies :hover on a tap and keeps it until the next tap
// elsewhere (KA0110): a cell would stay selected, a button face lifted.
// Every hover style sits under the query below, which a touch screen does
// not match, and the tap answers with the press states (:active) instead.
// The /ui catalogue forces the same paint with [data-state="hover"], which
// stays outside the query.
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const DEV_URL = `http://localhost:${process.env.E2E_DEV_PORT}`;

// Production pages with every component the build ships: the home
// sections, the legal prose, the case study list and pages, the 404 and
// the pagination fixture (E2E_FIXTURES=1).
const PAGES = [
  "/",
  "/polityka-prywatnosci/",
  "/regulamin/",
  "/realizacje/",
  "/lista/",
  "/this-route-does-not-exist",
];

// Hover paint with no forced twin on /ui: the catalogue shows these
// elements idle only.
const REAL_HOVER_ONLY = [
  ".mb-contact-form",
  ".mb-page-jump-input",
  ".mb-prose",
];

interface Rule {
  css: string;
  media: string[];
  selector: string;
}

const SPACES = /\s+/g;

// Every style rule of the page's stylesheets with the media queries it
// sits in, outermost first. Declarations keep their source line breaks
// on the dev server, so their runs of white space become one space.
const styleRules = async (page: Page): Promise<Rule[]> =>
  (
    await page.evaluate(() => {
      const rules: Rule[] = [];
      const walk = (list: CSSRuleList, media: string[]) => {
        for (const rule of list) {
          if (rule instanceof CSSMediaRule) {
            walk(rule.cssRules, [...media, rule.media.mediaText]);
          } else if (rule instanceof CSSStyleRule) {
            rules.push({
              css: rule.style.cssText,
              media,
              selector: rule.selectorText,
            });
          } else if (rule instanceof CSSGroupingRule) {
            walk(rule.cssRules, media);
          }
        }
      };
      for (const sheet of document.styleSheets) {
        walk(sheet.cssRules, []);
      }
      return rules;
    })
  ).map((rule) => ({ ...rule, css: rule.css.replace(SPACES, " ") }));

// The selectors of a list, split on its top-level commas.
const selectorItems = (selector: string): string[] => {
  const items: string[] = [];
  let depth = 0;
  let start = 0;
  for (const [i, char] of [...selector].entries()) {
    if (char === "(") {
      depth += 1;
    } else if (char === ")") {
      depth -= 1;
    } else if (char === "," && depth === 0) {
      items.push(selector.slice(start, i).trim());
      start = i + 1;
    }
  }
  items.push(selector.slice(start).trim());
  return items;
};

const HOVER = ":hover";
const FORCED = '[data-state="hover"]';
// `:is(...)` holding the forced state among others (`.active`, `:active`,
// `:focus-visible`), which matches the forced state alone too.
const IS_WITH_FORCED = /:is\([^()]*\[data-state="hover"\][^()]*\)/g;

// What breaks the rule on a page, as "selector @ media { declarations }":
// a hover rule outside the query, and a guarded hover selector with no
// twin that has [data-state="hover"] in its place, in the same other media
// and with the same declarations - the twin makes a forced hover on /ui
// the real paint on any screen.
const hoverFaults = (rules: Rule[]) => {
  const unguarded = rules
    .filter(
      (rule) =>
        rule.selector.includes(HOVER) && !rule.media.includes(HOVER_QUERY)
    )
    .map((rule) => `${rule.selector} @ ${rule.media.join(" > ")}`);
  const forced = rules
    .filter((rule) => !rule.selector.includes(HOVER))
    .flatMap((rule) =>
      selectorItems(rule.selector).map(
        (item) =>
          `${item.replace(IS_WITH_FORCED, FORCED)} @ ${rule.media.join(" > ")} { ${rule.css} }`
      )
    );
  const twinless = rules
    .filter((rule) => rule.media.includes(HOVER_QUERY))
    .flatMap((rule) =>
      selectorItems(rule.selector)
        .filter(
          (item) =>
            item.includes(HOVER) &&
            !REAL_HOVER_ONLY.some((name) => item.startsWith(name))
        )
        .map(
          (item) =>
            `${item.replaceAll(HOVER, FORCED)} @ ${rule.media
              .filter((media) => media !== HOVER_QUERY)
              .join(" > ")} { ${rule.css} }`
        )
    )
    .filter((twin) => !forced.includes(twin));
  return { twinless, unguarded };
};

test.describe("hover only where the pointer hovers", () => {
  test("every production page keeps its hover styles under the hover query, each forced outside it", async ({
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
      const rules = await styleRules(page);
      expect(
        rules.some((rule) => rule.selector.includes(HOVER)),
        path
      ).toBe(true);
      expect(hoverFaults(rules), path).toEqual({
        twinless: [],
        unguarded: [],
      });
    }
  });

  test.describe("component catalogue (astro dev)", () => {
    test.use({ baseURL: DEV_URL });

    test("every component keeps its hover styles under the hover query, each forced outside it", async ({
      page,
    }) => {
      await page.goto("/ui");
      const rules = await styleRules(page);
      expect(rules.some((rule) => rule.selector.includes(HOVER))).toBe(true);
      expect(hoverFaults(rules)).toEqual({ twinless: [], unguarded: [] });
    });
  });
});

// What a hover would change on a cell and on a raised button, read once
// every transition is over.
const look = (card: Locator, button: Locator) =>
  Promise.all([
    card.evaluate((el) => {
      for (const animation of el.getAnimations({ subtree: true })) {
        if (animation instanceof CSSTransition) {
          animation.finish();
        }
      }
      return {
        background: getComputedStyle(el).backgroundColor,
        grips: getComputedStyle(el, "::after").visibility,
        hovered: el.matches(":hover"),
        number: getComputedStyle(el, "::before").backgroundColor,
      };
    }),
    button.evaluate((el) => {
      for (const animation of el.getAnimations({ subtree: true })) {
        if (animation instanceof CSSTransition) {
          animation.finish();
        }
      }
      const face = el.querySelector(".mb-btn-face") as HTMLElement;
      return {
        fill: getComputedStyle(face).backgroundColor,
        hovered: el.matches(":hover"),
        lift: getComputedStyle(face).transform,
      };
    }),
  ]);

const hoverBoth = async (page: Page) => {
  await page.goto("/");
  const card = page.locator("#services .mb-card").first();
  const button = page.locator(".mb-btn-default.mb-btn-raised").first();
  const [idleCard, idleButton] = await look(card, button);
  await card.hover();
  const [hoveredCard] = await look(card, button);
  await button.hover();
  const [, hoveredButton] = await look(card, button);
  return { hoveredButton, hoveredCard, idleButton, idleCard };
};

test.describe("touch screen", () => {
  test.use({
    hasTouch: true,
    isMobile: true,
    viewport: { height: 915, width: 412 },
  });

  test("a pointer resting on a cell or a button leaves them idle", async ({
    page,
  }) => {
    expect(await page.evaluate((q) => matchMedia(q).matches, HOVER_QUERY)).toBe(
      false
    );
    const { hoveredButton, hoveredCard, idleButton, idleCard } =
      await hoverBoth(page);
    expect(hoveredCard).toEqual({ ...idleCard, hovered: true });
    expect(hoveredButton).toEqual({ ...idleButton, hovered: true });
  });

  test("a tap flashes no highlight, and nothing pressable double-tap zooms", async ({
    page,
  }) => {
    await page.goto("/");
    const transparent = "rgba(0, 0, 0, 0)";
    const tap = await page.evaluate(() => {
      const probe = document.createElement("div");
      probe.setAttribute("role", "button");
      document.body.append(probe);
      const read = (el: Element) => ({
        highlight: getComputedStyle(el).getPropertyValue(
          "-webkit-tap-highlight-color"
        ),
        touch: getComputedStyle(el).touchAction,
      });
      return {
        card: getComputedStyle(
          document.querySelector("#services .mb-card") as Element
        ).getPropertyValue("-webkit-tap-highlight-color"),
        link: read(document.querySelector("a.mb-btn") as Element),
        menu: read(document.querySelector("button") as Element),
        role: read(probe),
      };
    });
    expect(tap).toEqual({
      card: transparent,
      link: { highlight: transparent, touch: "manipulation" },
      menu: { highlight: transparent, touch: "manipulation" },
      role: { highlight: transparent, touch: "manipulation" },
    });
  });
});

test.describe("mouse", () => {
  test("a pointer resting on a cell selects it and lifts a button", async ({
    page,
  }) => {
    expect(await page.evaluate((q) => matchMedia(q).matches, HOVER_QUERY)).toBe(
      true
    );
    const { hoveredButton, hoveredCard, idleButton, idleCard } =
      await hoverBoth(page);
    expect(hoveredCard.hovered).toBe(true);
    expect(hoveredCard.background).not.toBe(idleCard.background);
    expect(hoveredCard.grips).toBe("visible");
    expect(hoveredCard.number).not.toBe(idleCard.number);
    expect(hoveredButton.hovered).toBe(true);
    expect(hoveredButton.fill).not.toBe(idleButton.fill);
    expect(hoveredButton.lift).not.toBe(idleButton.lift);
  });
});
