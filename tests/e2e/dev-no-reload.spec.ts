import { utimesSync } from "node:fs";
import { expect, test } from "@playwright/test";

// playwright.config.ts starts `astro dev` for the /ui specs with
// E2E_DEV_NO_WATCH=1 and passes its port in E2E_DEV_PORT.
const DEV_URL = `http://localhost:${process.env.E2E_DEV_PORT}`;

// Files the catalogue page is rendered from. A watching dev server answers a
// write to any of them with a full reload of every open page; a commit
// during the run writes them (lint-staged fixes the staged files).
const RENDERED_FROM = [
  "src/components/mb/button.astro",
  "src/pages/_ui/catalogue.astro",
];

test("a file written in the tree during the run does not reload a page of the e2e dev server", async ({
  page,
}) => {
  await page.goto(`${DEV_URL}/ui`);
  const html = page.locator("html");
  await html.evaluate((el) => {
    el.dataset.devReloadProbe = "";
  });

  // A new modification time is what a write looks like to the watcher; the
  // content stays as it is.
  const now = new Date();
  for (const file of RENDERED_FROM) {
    utimesSync(file, now, now);
  }
  // A watching server reloads the page within a few hundred milliseconds.
  await page.waitForTimeout(2000);

  // A reload would have replaced the document that holds the probe.
  await expect(html).toHaveAttribute("data-dev-reload-probe", "");
});
