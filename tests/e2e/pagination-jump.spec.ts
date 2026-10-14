import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, type Page, test } from "@playwright/test";

// A prerendered page never sees its query, so on the static build the
// pagination "go to page" form (<list>/?strona=<n>) only reaches page n
// through the redirect in nginx.conf. These specs serve the e2e build
// (dist/, with the /lista/ fixture of 12 pages, see astro.config.mjs) from
// the production nginx image and config, in Docker.

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SERVE_IMAGE = /^FROM\s+(nginx:\S+)\s+AS\s+serve$/m.exec(
  readFileSync(`${ROOT}Dockerfile`, "utf8")
)?.[1];
const CONTAINER = `kacperadler-pagination-jump-${process.pid}`;

let origin = "";

const docker = (...args: string[]) =>
  execFileSync("docker", args, { encoding: "utf8" }).trim();

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
  // The first run pulls the image (CI starts without it).
  test.setTimeout(120_000);
  if (!SERVE_IMAGE) {
    throw new Error("no `FROM nginx:<tag> AS serve` stage in the Dockerfile");
  }
  docker(
    "run",
    "--detach",
    "--rm",
    "--name",
    CONTAINER,
    "--publish",
    "127.0.0.1::80",
    "--volume",
    `${ROOT}nginx.conf:/etc/nginx/conf.d/default.conf:ro`,
    "--volume",
    `${ROOT}dist:/usr/share/nginx/html:ro`,
    SERVE_IMAGE
  );
  // "127.0.0.1:49153"
  origin = `http://${docker("port", CONTAINER, "80/tcp")}`;
  await expect
    .poll(
      async () => {
        try {
          return (await fetch(`${origin}/lista/`)).status;
        } catch {
          return 0;
        }
      },
      { timeout: 15_000 }
    )
    .toBe(200);
});

test.afterAll(() => {
  docker("rm", "--force", CONTAINER);
});

const jumpTo = async (page: Page, from: string, to: string) => {
  await page.goto(`${origin}${from}`);
  const nav = page.getByRole("navigation", { name: "Paginacja" });
  await nav.getByRole("spinbutton", { name: "Strona" }).fill(to);
  await nav.getByRole("button", { name: "Idź" }).click();
  return nav;
};

test.describe("pagination jump on the static build behind nginx", () => {
  test.use({ javaScriptEnabled: false });

  test("the page field lands on the page asked for", async ({ page }) => {
    const nav = await jumpTo(page, "/lista/5/", "9");
    await expect(page).toHaveURL(`${origin}/lista/9/`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Strona 9"
    );
    await expect(nav.locator("[aria-current='page']")).toHaveText("9");
  });

  test("page 1 lands on the list itself", async ({ page }) => {
    const nav = await jumpTo(page, "/lista/5/", "1");
    await expect(page).toHaveURL(`${origin}/lista/`);
    await expect(nav.locator("[aria-current='page']")).toHaveText("1");
  });

  test("the redirect carries a path, not the http origin behind the proxy", async ({
    request,
  }) => {
    const response = await request.get(`${origin}/lista/?strona=9`, {
      headers: { Host: "kacperadler.pl" },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(302);
    expect(response.headers().location).toBe("/lista/9/");
  });
});
