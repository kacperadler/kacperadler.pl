import { readdirSync, readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";
import { parseProposals } from "../../src/lib/proposals";
import { sendALead } from "./send-a-lead";

// The proposal pages exist only on `astro dev`; playwright.config.ts starts
// one for this tree and passes its port in E2E_DEV_PORT.
const DEV_URL = `http://localhost:${process.env.E2E_DEV_PORT}`;

// Every folder in src/styles/proposals/, as the pages should list it.
const PROPOSALS_DIR = "src/styles/proposals";
const proposals = readdirSync(PROPOSALS_DIR)
  .sort()
  .map((id) => ({
    id,
    ...(JSON.parse(
      readFileSync(`${PROPOSALS_DIR}/${id}/meta.json`, "utf8")
    ) as { description: string; name: string }),
  }));

const CATALOGUE_SECTIONS = [
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

const switcher = (page: Page) =>
  page.getByRole("navigation", { name: "Propozycje designu" });

const sectionIds = (page: Page) =>
  page
    .locator("main section[id]")
    .evaluateAll((sections) => sections.map((s) => s.id));

const meta = (id: string) => `/src/styles/proposals/${id}/meta.json`;
const style = (id: string) => `/src/styles/proposals/${id}/proposal.css`;
const validMeta = {
  description: "Jedna linia.",
  name: "Alpha",
  references: [{ label: "Sentry", url: "https://sentry.io/" }],
};

interface BlueprintTag {
  background: string;
  /** The background's (border) box; global.css sizes ::before border-box. */
  boxHeight: number;
  boxWidth: number;
  color: string;
  content: string;
  padLeft: number;
  padTop: number;
  textHeight: number;
  textWidth: number;
}

// The blueprint item tag (a cell's ::before) as it renders: its background
// box, and the box its text needs - the same pseudo-element with no size
// and no padding of its own. The text starts at the box's padding corner.
const blueprintTag = (card: Locator): Promise<BlueprintTag> =>
  card.evaluate((el) => {
    const read = () => {
      const s = getComputedStyle(el, "::before");
      return {
        background: s.backgroundColor,
        color: s.color,
        content: s.content,
        height: Number.parseFloat(s.height),
        padLeft: Number.parseFloat(s.paddingLeft),
        padTop: Number.parseFloat(s.paddingTop),
        width: Number.parseFloat(s.width),
      };
    };
    const { height, width, ...box } = read();
    const probe = document.createElement("style");
    probe.textContent = `[data-bp-probe]::before {
      width: auto !important; height: auto !important;
      right: auto !important; bottom: auto !important;
      padding: 0 !important;
    }`;
    document.head.append(probe);
    el.setAttribute("data-bp-probe", "");
    const text = read();
    el.removeAttribute("data-bp-probe");
    probe.remove();
    return {
      ...box,
      boxHeight: height,
      boxWidth: width,
      textHeight: text.height,
      textWidth: text.width,
    };
  });

const OPAQUE = /^rgb\(/;
const CHANNELS = /[\d.]+/g;

// WCAG 2.1 relative luminance of an rgb() color.
const luminance = (color: string) => {
  const [r = 0, g = 0, b = 0] = (color.match(CHANNELS) ?? []).map((c) => {
    const v = Number(c) / 255;
    return v <= 0.039_28 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (fg: string, bg: string) => {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
};

const expectReadable = (tag: BlueprintTag) => {
  const where = `${tag.content} at ${tag.boxWidth}x${tag.boxHeight}`;
  expect(tag.padLeft + tag.textWidth, where).toBeLessThanOrEqual(
    tag.boxWidth + 0.5
  );
  expect(tag.padTop + tag.textHeight, where).toBeLessThanOrEqual(
    tag.boxHeight + 0.5
  );
  expect(tag.background, where).toMatch(OPAQUE);
  expect(contrast(tag.color, tag.background), where).toBeGreaterThanOrEqual(
    4.5
  );
};

// blueprint-live paints its rules over borders it makes transparent.
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

// How far each part of a blueprint-live section head is drawn, 0 to 1 (to
// three places), read from what the browser paints: the rule's background
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

interface Drawing {
  durationMs: number;
  iterations: number;
  onScroll: boolean;
  piece: string;
  progress: number;
}

// Every piece blueprint-live animates, named "<keyframes> <tag.classes>
// <pseudo>" ("bl-draw article.mb-card.mb-card-default ::before"), with its
// timeline and its --bl-p.
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

// blueprint-live with nothing animated: the whole drawing stands at once,
// down to a section and cells far below the fold, on their own borders.
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
    [".mb-hero-status", "#experience .mb-card", ".mb-ui-section"].map(
      (selector) =>
        expect(page.locator(selector).first()).not.toHaveCSS(
          "border-top-color",
          NO_COLOR
        )
    )
  );
};

test.describe("proposal loader", () => {
  test("pairs each folder's meta.json with its CSS, sorted by id", () => {
    const parsed = parseProposals(
      { [meta("beta")]: validMeta, [meta("alpha")]: validMeta },
      { [style("beta")]: "a{}", [style("alpha")]: "b{}" }
    );
    expect(parsed.map(({ id, css }) => [id, css])).toEqual([
      ["alpha", "b{}"],
      ["beta", "a{}"],
    ]);
    expect(parsed[0]).toMatchObject(validMeta);
  });

  test("refuses a folder without proposal.css or without meta.json", () => {
    expect(() => parseProposals({ [meta("alpha")]: validMeta }, {})).toThrow(
      'Proposal "alpha" has no proposal.css.'
    );
    expect(() => parseProposals({}, { [style("alpha")]: "a{}" })).toThrow(
      'Proposal "alpha" has no meta.json.'
    );
  });

  test("refuses a meta.json off the schema", () => {
    const parse = (raw: unknown) => () =>
      parseProposals({ [meta("alpha")]: raw }, { [style("alpha")]: "" });
    for (const raw of [
      { ...validMeta, description: "Dwie\nlinie." },
      { ...validMeta, name: undefined },
      {
        ...validMeta,
        references: [{ label: "x", url: "javascript:alert(1)" }],
      },
      { ...validMeta, extra: true },
    ]) {
      expect(parse(raw)).toThrow('Proposal "alpha" has an invalid meta.json');
    }
  });

  test("refuses a folder name that is not a lowercase slug", () => {
    expect(() =>
      parseProposals({ [meta("Alpha")]: validMeta }, { [style("Alpha")]: "" })
    ).toThrow('Proposal folder "Alpha" has to be a lowercase slug');
  });
});

test.describe("design proposals (astro dev)", () => {
  test.use({
    baseURL: DEV_URL,
    contextOptions: { reducedMotion: "reduce" },
  });

  test("the list links every proposal with its description", async ({
    page,
  }) => {
    await page.goto("/ui/proposal");
    await expect(
      page.getByRole("heading", { level: 1, name: "Propozycje designu" })
    ).toBeVisible();
    await Promise.all(
      proposals.map(async (proposal) => {
        const item = page.getByRole("listitem").filter({
          has: page.getByRole("heading", { exact: true, name: proposal.name }),
        });
        await expect(
          item.getByRole("link", { exact: true, name: proposal.name })
        ).toHaveAttribute("href", `/ui/proposal/${proposal.id}`);
        await expect(item).toContainText(proposal.description);
      })
    );
  });

  test("a proposal page shows the home page and the catalogue under its scope", async ({
    page,
  }) => {
    await page.goto("/");
    const homeSections = await sectionIds(page);
    expect(homeSections.length).toBeGreaterThan(0);

    await page.goto("/ui/proposal/baseline", { waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveAttribute(
      "data-proposal",
      "baseline"
    );
    expect(await sectionIds(page)).toEqual(homeSections);
    await Promise.all(
      CATALOGUE_SECTIONS.map((name) =>
        expect(
          page.getByRole("heading", { exact: true, level: 2, name })
        ).toBeVisible()
      )
    );
  });

  test("the proposal's CSS outranks the tokens and the component styles", async ({
    page,
  }) => {
    await page.goto("/ui/proposal/baseline", { waitUntil: "networkidle" });
    const button = page.locator(".mb-btn").first();
    const card = page.locator(".mb-card").first();
    await expect(button).not.toHaveCSS("border-top-left-radius", "3px");
    await expect(card).not.toHaveCSS("border-top-color", "rgb(255, 0, 0)");

    // Rules in the form proposal.css documents: a token on html[...] and a
    // component class under the scope, at the scoped component's
    // specificity.
    await page.locator("style[data-proposal-css]").evaluate((el) => {
      el.textContent += `
        html[data-proposal="baseline"] { --mb-rule: rgb(255, 0, 0); }
        [data-proposal="baseline"] .mb-btn { border-radius: 3px; }`;
    });
    await expect(button).toHaveCSS("border-top-left-radius", "3px");
    await expect(card).toHaveCSS("border-top-color", "rgb(255, 0, 0)");
  });

  for (const { id } of proposals) {
    test(`a form on /ui/proposal/${id} sends nothing to the lead store`, async ({
      page,
    }) => {
      await page.goto(`/ui/proposal/${id}`, { waitUntil: "networkidle" });
      expect(
        await sendALead(page, page.locator("#contact [data-contact-form]"))
      ).toBe(0);
    });
  }

  for (const { id } of proposals) {
    test(`/ui/proposal/${id} has no detectable WCAG 2.1 AA violations`, async ({
      page,
    }) => {
      await page.goto(`/ui/proposal/${id}`, { waitUntil: "networkidle" });
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .exclude("astro-dev-toolbar")
        .analyze();

      expect(results.violations).toEqual([]);
    });
  }

  for (const id of ["blueprint", "blueprint-live"]) {
    for (const width of [1440, 360]) {
      test(`${id}: a hovered cell's tag sits inside its box at ${width}px`, async ({
        page,
      }) => {
        await page.setViewportSize({ height: 900, width });
        await page.goto(`/ui/proposal/${id}`, { waitUntil: "networkidle" });

        // Under the cursor: the tag reads the cell's width, on a blue box.
        const card = page.locator("#services .mb-card").first();
        await card.hover();
        const hovered = await blueprintTag(card);
        expectReadable(hovered);
        expect(hovered.content).toContain("↔");

        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .exclude("astro-dev-toolbar")
          .analyze();
        expect(results.violations).toEqual([]);

        // Forced hover on every cell of the page and the catalogue; the
        // process steps carry no tag.
        await page.mouse.move(0, 0);
        const cards = page.locator(".mb-card");
        await cards.evaluateAll((all) => {
          for (const el of all) {
            el.setAttribute("data-state", "hover");
          }
        });
        const tags = (
          await Promise.all((await cards.all()).map(blueprintTag))
        ).filter((tag) => tag.content !== "none");
        expect(tags.length).toBeGreaterThan(0);
        for (const tag of tags) {
          expectReadable(tag);
        }
      });
    }
  }

  test("blueprint-live stands drawn at once under reduced motion", async ({
    page,
  }) => {
    await page.goto("/ui/proposal/blueprint-live", {
      waitUntil: "networkidle",
    });
    await expectDrawnAtOnce(page);
  });

  test("the switcher moves between the proposals and the current design", async ({
    page,
  }) => {
    await page.goto("/ui/proposal/baseline", { waitUntil: "networkidle" });
    const nav = switcher(page);
    await Promise.all(
      proposals.map((proposal) =>
        expect(
          nav.getByRole("link", { exact: true, name: proposal.name })
        ).toHaveAttribute("href", `/ui/proposal/${proposal.id}`)
      )
    );
    await expect(nav.getByRole("link", { name: "Baseline" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    await expect(
      nav.getByRole("link", { name: "Obecny design: strona" })
    ).toHaveAttribute("href", "/");
    await expect(
      nav.getByRole("link", { name: "Wszystkie propozycje" })
    ).toHaveAttribute("href", "/ui/proposal");

    // Back to the current design: the scope and the proposal's CSS go.
    await nav.getByRole("link", { name: "Obecny design: katalog" }).click();
    await expect(page).toHaveURL(`${DEV_URL}/ui`);
    await expect(page.locator("html")).not.toHaveAttribute("data-proposal");
    await expect(page.locator("style[data-proposal-css]")).toHaveCount(0);

    // And into the proposals again from /ui.
    await switcher(page)
      .getByRole("link", { name: "Propozycje designu" })
      .click();
    await expect(page).toHaveURL(`${DEV_URL}/ui/proposal`);
    await page.getByRole("link", { exact: true, name: "Baseline" }).click();
    await expect(page).toHaveURL(`${DEV_URL}/ui/proposal/baseline`);
    await expect(page.locator("html")).toHaveAttribute(
      "data-proposal",
      "baseline"
    );
    await expect(page.locator("style[data-proposal-css]")).toHaveCount(1);
  });
});

test.describe("blueprint-live: the drawing as you scroll (astro dev)", () => {
  test.use({
    baseURL: DEV_URL,
    contextOptions: { reducedMotion: "no-preference" },
  });

  const undrawn = {
    border: NO_COLOR,
    brace: 0,
    callout: 0,
    dimension: 0,
    label: 0,
    rule: 0,
    ticks: 0,
  };

  for (const width of [1440, 360]) {
    test(`a section draws in order as it comes up and undraws on the way back at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ height: 900, width });
      await page.goto("/ui/proposal/blueprint-live", {
        waitUntil: "networkidle",
      });
      const head = page.locator("#contact .mb-section-head");

      // Below the fold: nothing of it, its border included.
      await expect.poll(() => headDrawing(head)).toEqual(undrawn);

      // 100px up (of the 360 it draws over): only the rule, running out.
      await raise(head, 100);
      await expect
        .poll(async () => (await headDrawing(head)).rule)
        .toBeCloseTo(100 / 360 / 0.6, 1);
      expect(await headDrawing(head)).toMatchObject({
        brace: 0,
        callout: 0,
        dimension: 0,
        label: 0,
        ticks: 0,
      });

      // 300px up: rule and ticks drawn; the dimension, the label and the
      // brace being written together; the callout not yet.
      await raise(head, 300);
      await expect
        .poll(async () => (await headDrawing(head)).label)
        .toBeCloseTo((300 / 360 - 0.7) * 5, 1);
      const writing = await headDrawing(head);
      expect(writing).toMatchObject({ callout: 0, rule: 1, ticks: 1 });
      expect(writing.dimension).toBeCloseTo(writing.label, 3);
      expect(writing.brace).toBeCloseTo(writing.label, 3);

      // Half drawn, the page still breaks no WCAG rule.
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .exclude("astro-dev-toolbar")
        .analyze();
      expect(results.violations).toEqual([]);

      // Up the screen: all of it, on the painted rule.
      await raise(head, 600);
      await expect
        .poll(() => headDrawing(head))
        .toEqual({
          border: NO_COLOR,
          brace: 1,
          callout: 1,
          dimension: 1,
          label: 1,
          rule: 1,
          ticks: 1,
        });

      // Back to the top: undrawn again.
      await page.evaluate(() =>
        window.scrollTo({ behavior: "instant", top: 0 })
      );
      await expect.poll(() => headDrawing(head)).toEqual(undrawn);
    });

    test(`at the end of the page every piece is drawn, and nothing scrolls sideways, at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ height: 900, width });
      await page.goto("/ui/proposal/blueprint-live", {
        waitUntil: "networkidle",
      });
      const sideways = () =>
        page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth
        );
      expect(await sideways()).toBe(0);
      await page.evaluate(() =>
        window.scrollTo({
          behavior: "instant",
          top: document.documentElement.scrollHeight / 2,
        })
      );
      expect(await sideways()).toBe(0);
      await page.evaluate(() =>
        window.scrollTo({
          behavior: "instant",
          top: document.documentElement.scrollHeight,
        })
      );
      expect(await sideways()).toBe(0);

      const pieces = (await drawings(page)).filter((d) =>
        d.piece.startsWith("bl-draw ")
      );
      for (const [part, pseudo] of [
        ["mb-section-head", "::before"],
        ["mb-card", "::before"],
        ["mb-step-marker", "::before"],
        ["mb-ui-h2", "::after"],
        ["mb-footer-bottom", "::after"],
      ] as const) {
        expect(
          pieces.some(
            (d) => d.piece.includes(`.${part}`) && d.piece.endsWith(pseudo)
          ),
          `${part}${pseudo}`
        ).toBe(true);
      }
      await expect
        .poll(async () =>
          (await drawings(page))
            .filter((d) => d.piece.startsWith("bl-draw ") && d.progress !== 1)
            .map((d) => d.piece)
        )
        .toEqual([]);
    });

    test(`the hero draws once on load and nothing runs on a clock after, at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ height: 900, width });
      await page.goto("/ui/proposal/blueprint-live", {
        waitUntil: "networkidle",
      });
      const all = await drawings(page);
      for (const d of all) {
        expect(d.iterations, d.piece).toBe(1);
        if (!d.onScroll) {
          expect(d.durationMs, d.piece).toBe(1000);
        }
      }
      const onLoad = all.filter((d) => !d.onScroll).map((d) => d.piece);
      expect(
        onLoad.some(
          (piece) =>
            piece.includes(".mb-hero-grid") && piece.endsWith("::before")
        )
      ).toBe(true);
      // Side by side the title block is on the screen and draws on load; in
      // one column it is under the fold and draws as it comes in.
      expect(onLoad.some((piece) => piece.includes(".mb-hero-status"))).toBe(
        width > 880
      );

      // The catalogue's spinner turns on a clock of its own; wait for ours.
      await page.evaluate(() =>
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
      expect(
        (await drawings(page))
          .filter((d) => !d.onScroll)
          .map((d) => [d.piece, d.progress])
      ).toEqual(onLoad.map((piece) => [piece, 1]));
    });
  }

  test("a cell under the cursor is selected whole while it is still drawing", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/ui/proposal/blueprint-live", {
      waitUntil: "networkidle",
    });
    const card = page.locator("#experience .mb-card").first();
    const height = (await card.boundingBox())?.height ?? 0;
    await raise(card, height / 2);
    await expect
      .poll(() =>
        card.evaluate((el) =>
          Number(getComputedStyle(el).getPropertyValue("--bl-p"))
        )
      )
      .toBeCloseTo(0.5, 1);
    await expect(card).toHaveCSS("border-top-color", NO_COLOR);

    const box = await card.boundingBox();
    await page.mouse.move(
      (box?.x ?? 0) + (box?.width ?? 0) / 2,
      900 - height / 4
    );
    await expect(card).not.toHaveCSS("border-top-color", NO_COLOR);
    const tag = await blueprintTag(card);
    expectReadable(tag);
    expect(tag.content).toContain("↔");
    expect(
      await card.evaluate((el) =>
        getComputedStyle(el, "::before").getPropertyValue("--bl-p")
      )
    ).toBe("1");
  });

  test("the rulers' ticks travel with the sheet", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/ui/proposal/blueprint-live", {
      waitUntil: "networkidle",
    });
    const ruler = () =>
      page.evaluate(() => [
        window.scrollY,
        getComputedStyle(
          document.querySelector(".mb-frame") as Element,
          "::before"
        ).maskPosition,
      ]);
    expect(await ruler()).toEqual([0, "0px 0px"]);
    await page.evaluate(() =>
      window.scrollTo({ behavior: "instant", top: 1234 })
    );
    await expect.poll(ruler).toEqual([1234, "0px -1234px"]);
  });

  test("a browser without scroll-driven animations gets the whole drawing at once", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/ui/proposal/blueprint-live", {
      waitUntil: "networkidle",
    });
    expect((await drawings(page)).length).toBeGreaterThan(0);

    // The motion is gated on support: as such a browser, fail the gate.
    const gate = "@supports (animation-timeline: view())";
    const css = page.locator("style[data-proposal-css]");
    expect(await css.textContent()).toContain(gate);
    await css.evaluate((el, from) => {
      el.textContent = (el.textContent ?? "").replace(
        from,
        "@supports (animation-timeline: no-such-timeline())"
      );
    }, gate);
    await expectDrawnAtOnce(page);
  });
});

test.describe("production build", () => {
  test("has no proposal pages", async ({ request }) => {
    const statuses = await Promise.all(
      ["/ui/proposal", "/ui/proposal/", "/ui/proposal/baseline"].map(
        async (path) => (await request.get(path)).status()
      )
    );
    expect(statuses).toEqual([404, 404, 404]);
  });
});
