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

  for (const width of [1440, 360]) {
    test(`blueprint: a hovered cell's tag sits inside its box at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ height: 900, width });
      await page.goto("/ui/proposal/blueprint", { waitUntil: "networkidle" });

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
