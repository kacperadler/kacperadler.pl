import { readdirSync, readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { parseProposals } from "../../src/lib/proposals";

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
  "Link",
  "Badge i tag",
  "Status pill",
  "Karta",
  "Pola formularza",
  "Nagłówek sekcji",
  "Typografia",
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
  name: "Minimal",
  references: [{ label: "Sentry", url: "https://sentry.io/" }],
};

test.describe("proposal loader", () => {
  test("pairs each folder's meta.json with its CSS, sorted by id", () => {
    const parsed = parseProposals(
      { [meta("minimal")]: validMeta, [meta("brutal")]: validMeta },
      { [style("minimal")]: "a{}", [style("brutal")]: "b{}" }
    );
    expect(parsed.map(({ id, css }) => [id, css])).toEqual([
      ["brutal", "b{}"],
      ["minimal", "a{}"],
    ]);
    expect(parsed[0]).toMatchObject(validMeta);
  });

  test("refuses a folder without proposal.css or without meta.json", () => {
    expect(() => parseProposals({ [meta("minimal")]: validMeta }, {})).toThrow(
      'Proposal "minimal" has no proposal.css.'
    );
    expect(() => parseProposals({}, { [style("minimal")]: "a{}" })).toThrow(
      'Proposal "minimal" has no meta.json.'
    );
  });

  test("refuses a meta.json off the schema", () => {
    const parse = (raw: unknown) => () =>
      parseProposals({ [meta("minimal")]: raw }, { [style("minimal")]: "" });
    for (const raw of [
      { ...validMeta, description: "Dwie\nlinie." },
      { ...validMeta, name: undefined },
      {
        ...validMeta,
        references: [{ label: "x", url: "javascript:alert(1)" }],
      },
      { ...validMeta, extra: true },
    ]) {
      expect(parse(raw)).toThrow('Proposal "minimal" has an invalid meta.json');
    }
  });

  test("refuses a folder name that is not a lowercase slug", () => {
    expect(() =>
      parseProposals(
        { [meta("Minimal")]: validMeta },
        { [style("Minimal")]: "" }
      )
    ).toThrow('Proposal folder "Minimal" has to be a lowercase slug');
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
    const button = page.locator(".btn").first();
    const card = page.locator(".v2-card").first();
    await expect(button).not.toHaveCSS("border-top-left-radius", "3px");
    await expect(card).not.toHaveCSS("border-top-left-radius", "5px");

    // Rules in the form proposal.css documents: a token on html[...] and a
    // component class under the scope, at the scoped component's
    // specificity.
    await page.locator("style[data-proposal-css]").evaluate((el) => {
      el.textContent += `
        html[data-proposal="baseline"] { --v2-radius-md: 5px; }
        [data-proposal="baseline"] .btn { border-radius: 3px; }`;
    });
    await expect(button).toHaveCSS("border-top-left-radius", "3px");
    await expect(card).toHaveCSS("border-top-left-radius", "5px");
  });

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
    await switcher(page).getByRole("link").click();
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
