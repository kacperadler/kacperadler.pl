import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, type Page, test } from "@playwright/test";

// nginx.conf sends HSTS and a Content-Security-Policy with every response,
// and sends each directory page's second address (<dir>/index.html,
// <dir>/index) to its directory URL (KA0167).
//
// The policy is checked twice. On the preview, in every run, the CSP is read
// from nginx.conf and put on each page the browser loads, so an edit to an
// inline script of base-head.astro that leaves its old hash in nginx.conf
// fails here with the violation named. In Docker, the production nginx image
// serves the e2e build with nginx.conf, which answers the headers and the
// redirects itself.

declare global {
  interface Window {
    reportCspViolation: (violation: string) => void;
    sameDocument?: boolean;
    settledScripts: string[];
  }
}

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const NGINX_CONF = readFileSync(`${ROOT}nginx.conf`, "utf8");
const CSP =
  /^\s*add_header\s+Content-Security-Policy\s+"([^"]+)"\s+always;$/m.exec(
    NGINX_CONF
  )?.[1];
const UMAMI = "https://analytics.kacperadler.pl";
const SCRIPT = `${UMAMI}/script.js`;
const ACTIVE = /\bactive\b/;
const TERMS_TITLE = /^Regulamin/;
const PRIVACY_TITLE = /^Polityka prywatności/;

// Every CSP violation of the page, as "<directive> <blocked URI>", collected
// across full loads (a binding on the Node side) and ClientRouter swaps.
const watchViolations = async (page: Page): Promise<string[]> => {
  const violations: string[] = [];
  await page.exposeFunction("reportCspViolation", (violation: string) => {
    violations.push(violation);
  });
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      window.reportCspViolation(
        `${event.effectiveDirective} ${event.blockedURI}`
      );
    });
  });
  return violations;
};

test.describe("the CSP of nginx.conf on the preview", () => {
  test.beforeEach(async ({ page }) => {
    if (!CSP) {
      throw new Error(
        'no `add_header Content-Security-Policy "..." always;` in nginx.conf'
      );
    }
    // Only the pages: the policy a document gets is the one it loaded with,
    // and ClientRouter's fetch of the next page does not change it.
    await page.route("**/*", async (route) => {
      if (route.request().resourceType() !== "document") {
        await route.fallback();
        return;
      }
      const response = await route.fetch();
      await route.fulfill({
        headers: { ...response.headers(), "content-security-policy": CSP },
        response,
      });
    });
  });

  test("the home page runs its scripts, the entrance and the analytics loader with no violation", async ({
    page,
  }) => {
    const violations = await watchViolations(page);
    await page.addInitScript(() => {
      // A blocked script fires `error` like a failed one; both settle it.
      window.settledScripts = [];
      for (const type of ["load", "error"]) {
        document.addEventListener(
          type,
          (event) => {
            if (event.target instanceof HTMLScriptElement) {
              window.settledScripts.push(event.target.src);
            }
          },
          true
        );
      }
    });

    const response = await page.goto("/");
    expect(response?.headers()["content-security-policy"]).toBe(CSP);

    // The inline script of base-head.astro marks the page live and plays the
    // entrance; the module script of base-layout.astro runs nav-active.ts.
    const root = page.locator("html");
    await expect(root).toHaveAttribute("data-bl-live", "");
    await expect(root).toHaveAttribute("data-bl-enter", "go");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(page.locator("[data-nav-cta]")).toHaveClass(ACTIVE);

    // The Umami loader (the second inline script) injects script.js, which
    // the e2e browser cannot resolve: it settles with an error either way,
    // and only a CSP block reports a violation.
    await expect
      .poll(() => page.evaluate(() => window.settledScripts))
      .toContain(SCRIPT);

    // Umami's tracker posts its pageview to <host>/api/send.
    await page.route(`${UMAMI}/api/send`, (route) =>
      route.fulfill({ json: { beep: "boop" } })
    );
    const sent = await page.evaluate(
      (url) =>
        fetch(url, { body: "{}", method: "POST" }).then(
          (answer) => answer.status,
          (error: Error) => error.message
        ),
      `${UMAMI}/api/send`
    );
    expect(sent).toBe(200);

    expect(violations).toEqual([]);
  });

  test("the client router moves between the home page and the legal pages with no violation", async ({
    page,
  }) => {
    const violations = await watchViolations(page);
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-bl-enter", "go");
    await page.evaluate(() => {
      window.sameDocument = true;
    });

    const footer = page.locator("footer");
    await footer.getByRole("link", { name: "Regulamin" }).click();
    await expect(page).toHaveURL("/regulamin/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      TERMS_TITLE
    );
    await footer.getByRole("link", { name: "Polityka prywatności" }).click();
    await expect(page).toHaveURL("/polityka-prywatnosci/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      PRIVACY_TITLE
    );

    // A swap, not a load: the window the home page opened is still there.
    expect(await page.evaluate(() => window.sameDocument)).toBe(true);
    await expect(page.locator("html")).toHaveAttribute("data-bl-live", "");
    expect(violations).toEqual([]);
  });

  for (const path of [
    "/regulamin/",
    "/polityka-prywatnosci/",
    "/nie-ma-takiej-strony/",
    "/realizacje/",
    "/realizacje/przyklad/",
  ]) {
    test(`${path} loads with no violation`, async ({ page }) => {
      const violations = await watchViolations(page);
      const response = await page.goto(path);
      expect(response?.headers()["content-security-policy"]).toBe(CSP);
      await expect(page.locator("html")).toHaveAttribute("data-bl-enter", "go");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(violations).toEqual([]);
    });
  }
});

const SERVE_IMAGE = /^FROM\s+(nginx:\S+)\s+AS\s+serve$/m.exec(
  readFileSync(`${ROOT}Dockerfile`, "utf8")
)?.[1];
const WEB_ROOT = /^\s*root\s+(\S+);$/m.exec(NGINX_CONF)?.[1];
const CONTAINER = `kacperadler-security-headers-${process.pid}`;

let origin = "";

const docker = (...args: string[]) =>
  execFileSync("docker", args, { encoding: "utf8" }).trim();

// An Arthur job's sandbox has no Unix stream socket, so it never reaches the
// Docker daemon: skip there, and run wherever `docker version` answers.
const dockerAnswers = (): boolean => {
  try {
    execFileSync("docker", ["version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

const get = (path: string) =>
  fetch(`${origin}${path}`, {
    headers: { Host: "kacperadler.pl" },
    redirect: "manual",
  });

test.describe("headers and redirects of nginx.conf in Docker", () => {
  test.skip(
    !dockerAnswers(),
    "Docker is unreachable here (an Arthur job's sandbox, or no Docker): this spec runs in CI and where Docker runs"
  );
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    // The first run pulls the image (CI starts without it).
    test.setTimeout(120_000);
    if (!SERVE_IMAGE) {
      throw new Error("no `FROM nginx:<tag> AS serve` stage in the Dockerfile");
    }
    if (!WEB_ROOT) {
      throw new Error("no `root <path>;` in nginx.conf");
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
      `${ROOT}dist/client:${WEB_ROOT}:ro`,
      SERVE_IMAGE
    );
    // "127.0.0.1:49153"
    origin = `http://${docker("port", CONTAINER, "80/tcp")}`;
    await expect
      .poll(
        async () => {
          try {
            return (await get("/")).status;
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

  test("every answer carries HSTS for a year, without subdomains or preload, and the CSP", async () => {
    // A page, the 404, a redirect and an asset.
    const answers = await Promise.all(
      [
        "/",
        "/regulamin/",
        "/nie-ma-takiej-strony/",
        "/index.html",
        "/favicon.svg",
      ].map(async (path) => {
        const response = await get(path);
        return {
          csp: response.headers.get("content-security-policy"),
          hsts: response.headers.get("strict-transport-security"),
          path,
          status: response.status,
        };
      })
    );
    expect(answers).toEqual(
      [
        ["/", 200],
        ["/regulamin/", 200],
        ["/nie-ma-takiej-strony/", 404],
        ["/index.html", 301],
        ["/favicon.svg", 200],
      ].map(([path, status]) => ({
        csp: CSP,
        hsts: "max-age=31536000",
        path,
        status,
      }))
    );
  });

  test("a directory page's second address goes 301 to its directory URL, the query kept", async () => {
    const redirects = {
      "/index": "/",
      "/index.html": "/",
      "/index.html?utm_source=audit": "/?utm_source=audit",
      "/lista/3/index": "/lista/3/",
      "/polityka-prywatnosci/index.html": "/polityka-prywatnosci/",
      "/realizacje/przyklad/index.html": "/realizacje/przyklad/",
      "/regulamin/index.html": "/regulamin/",
    };
    const answers = await Promise.all(
      Object.keys(redirects).map(async (path) => {
        const response = await get(path);
        return [path, `${response.status} ${response.headers.get("location")}`];
      })
    );
    expect(Object.fromEntries(answers)).toEqual(
      Object.fromEntries(
        Object.entries(redirects).map(([path, to]) => [path, `301 ${to}`])
      )
    );
    // The directory URLs themselves answer, so nothing loops.
    const directories = ["/", "/regulamin/", "/lista/3/"];
    expect(
      await Promise.all(
        directories.map(async (path) => (await get(path)).status)
      )
    ).toEqual(directories.map(() => 200));
  });

  test("no internal link of a page answers with a redirect", async () => {
    const pages = await Promise.all(
      [
        "/",
        "/regulamin/",
        "/polityka-prywatnosci/",
        "/nie-ma-takiej-strony/",
        "/realizacje/",
        "/realizacje/przyklad/",
      ].map(async (path) => (await get(path)).text())
    );
    const links = [
      ...new Set(
        pages.flatMap((html) =>
          [...html.matchAll(/<a\b[^>]*\shref="(\/[^"#]*)/g)].map(
            ([, href]) => href ?? ""
          )
        )
      ),
    ];
    expect(links).toContain("/regulamin/");
    expect(links).toContain("/polityka-prywatnosci/");
    const answers = await Promise.all(
      links.map(async (link) => [link, (await get(link)).status])
    );
    expect(Object.fromEntries(answers)).toEqual(
      Object.fromEntries(links.map((link) => [link, 200]))
    );
  });
});
