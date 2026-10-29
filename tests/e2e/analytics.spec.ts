import { expect, test } from "@playwright/test";

// The preview is a PROD build, so every page a spec opens runs the Umami
// loader from base-head.astro (KA0131). Two guards keep a test run out of the
// production statistics: the e2e browser cannot reach the analytics host
// (playwright.config.ts: Chromium cannot resolve it, `--host-resolver-rules`;
// WebKit sends every request but the preview's to a proxy where nothing
// listens), and the tracker is told to count only the production hosts
// (`data-domains`), which also covers a local `bun run preview` or the Docker
// image opened by hand.

const UMAMI = "https://analytics.kacperadler.pl";
const SCRIPT = `${UMAMI}/script.js`;
const BLOCKED: Record<string, string> = {
  chromium: "net::ERR_NAME_NOT_RESOLVED",
  webkit: "Could not connect to proxy server 127.0.0.1: Connection refused",
};

test.describe("analytics on the preview", () => {
  test("the browser cannot reach the analytics host, so the run sends Umami no pageview", async ({
    browserName,
    page,
  }) => {
    const toUmami: string[] = [];
    page.on("request", (request) => {
      if (new URL(request.url()).origin === UMAMI) {
        toUmami.push(`${request.method()} ${request.url()}`);
      }
    });
    // Settles on whichever comes first, so a script that does load fails the
    // test at once instead of at the test timeout.
    const script = new Promise<string>((resolve) => {
      page.on("requestfailed", (request) => {
        if (request.url() === SCRIPT) {
          resolve(request.failure()?.errorText ?? "failed");
        }
      });
      page.on("requestfinished", (request) => {
        if (request.url() === SCRIPT) {
          resolve("loaded");
        }
      });
    });

    await page.goto("/");

    expect(await script).toBe(BLOCKED[browserName]);
    expect(await page.evaluate(() => "umami" in window)).toBe(false);
    expect(toUmami).toEqual([`GET ${SCRIPT}`]);
  });

  // www.kacperadler.pl serves the site too (200, no redirect to the apex), so
  // both hosts count; localhost, where the preview runs, does not.
  test("the tracker counts pageviews only on the production hosts", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.locator(`script[src="${SCRIPT}"]`)).toHaveAttribute(
      "data-domains",
      "kacperadler.pl,www.kacperadler.pl"
    );
  });
});
