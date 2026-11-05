import { readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { stripVTControlCharacters } from "node:util";
import {
  expect,
  type Frame,
  type Page,
  test,
  type WebSocket,
} from "@playwright/test";

// playwright.config.ts starts `astro dev` for the /ui specs with
// E2E_DEV_NO_WATCH=1, passes its port in E2E_DEV_PORT and the file its stdout
// goes to in E2E_DEV_LOG.
const DEV_URL = `http://localhost:${process.env.E2E_DEV_PORT}`;
const DEV_LOG = process.env.E2E_DEV_LOG ?? "";

// A module of the open page that no commit or check owns: .astro/ is
// git-ignored, so writing it changes no tracked file. The page imports it, so
// a watching dev server answers a write to it as to any file the page is
// built from (a component a commit's lint-staged fix rewrites): with a full
// reload of the page, as the module accepts no hot update.
const PROBE_MODULE = `.astro/dev-reload-probe-${process.pid}.js`;

// Vite's HMR socket (ws://localhost:<port>/?token=...) and the reload the dev
// server sends on it at startup.
const HMR_SOCKET = /\/\?token=/;
const STARTUP_RELOAD = '{"type":"full-reload","path":"*"}';

// How long a page must stand without navigating to count as settled, and how
// many times it is opened before the spec gives up.
const SETTLE_MS = 2000;
const OPENS = 3;

// What the dev server wrote to stdout from byte `from` on, one line per entry
// (Astro writes JSON lines when stdout is a file): its reason for a reload
// ("[vite] optimized dependencies changed. reloading", "[watch] <file>").
const devLogSince = (from: number) =>
  stripVTControlCharacters(readFileSync(DEV_LOG).subarray(from).toString())
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      try {
        const { label, message } = JSON.parse(line);
        return `  ${label ? `[${label}] ` : ""}${message}`;
      } catch {
        return `  ${line}`;
      }
    })
    .join("\n");

// Opens the page and returns once it has stood SETTLE_MS without navigating.
// A dev server that writes its content store at startup (on a fresh .astro/,
// and in some e2e runs after the builds before it) gets from Astro a full
// reload while no page is open yet; Vite keeps it and sends it to the first
// page that connects, which reloads right after its load and destroys the
// document a spec is working on (KA0099). That reload is
// {"type":"full-reload","path":"*"} on the HMR socket with no line of its own
// on stdout. A page that navigates away is logged with the reload messages
// the dev server sent it and the lines it wrote to stdout meanwhile, and
// opened again, up to OPENS times. Resolves to what was logged, one entry per
// navigation away.
const openSettled = async (
  page: Page,
  open: () => Promise<unknown> = () => page.goto(`${DEV_URL}/ui`)
): Promise<string[]> => {
  const reasons: string[] = [];
  for (let attempt = 1; attempt <= OPENS; attempt += 1) {
    const from = statSync(DEV_LOG).size;
    let navigations = 0;
    const count = (frame: Frame) => {
      if (frame === page.mainFrame()) {
        navigations += 1;
      }
    };
    const sent: string[] = [];
    const listen = (socket: WebSocket) => {
      socket.on("framereceived", ({ payload }) => {
        if (String(payload).includes('"full-reload"')) {
          sent.push(`  ${payload}`);
        }
      });
    };
    page.on("framenavigated", count);
    page.on("websocket", listen);
    let failure: unknown;
    try {
      // biome-ignore lint/performance/noAwaitInLoops: one open at a time
      await open();
      await page.waitForTimeout(SETTLE_MS);
    } catch (error) {
      // A reload during the load interrupts the navigation of open().
      failure = error;
    } finally {
      page.off("framenavigated", count);
      page.off("websocket", listen);
    }
    // open() navigates the main frame once; any more is a navigation away.
    if (failure === undefined && navigations === 1) {
      return reasons;
    }
    const reason = `the dev server sent:\n${sent.join("\n") || "  no reload message"}\nand wrote to stdout:\n${devLogSince(from)}`;
    reasons.push(reason);
    console.log(
      `dev-no-reload: ${page.url()} navigated away right after it was opened (open ${attempt} of ${OPENS}${failure === undefined ? "" : `, ${String(failure).split("\n")[0]}`}); ${reason}`
    );
    if (attempt === OPENS) {
      throw new Error(
        `${page.url()} did not settle in ${OPENS} opens:\n${reasons.join("\n")}`
      );
    }
  }
  return reasons;
};

test("a file written in the tree during the run does not reload a page of the e2e dev server", async ({
  page,
}) => {
  await openSettled(page);
  const html = page.locator("html");
  await html.evaluate((el) => {
    el.dataset.devReloadProbe = "";
  });
  const from = statSync(DEV_LOG).size;
  writeFileSync(PROBE_MODULE, "export default 1;\n");

  try {
    // The import puts the module into the page's module graph.
    await page.evaluate(async (url) => {
      await import(url);
    }, `/${PROBE_MODULE}`);
    writeFileSync(PROBE_MODULE, "export default 2;\n");
    // A watching server reloads the page within a few hundred milliseconds.
    await page.waitForTimeout(2000);
  } finally {
    rmSync(PROBE_MODULE, { force: true });
  }

  // A reload would have replaced the document that holds the probe.
  await expect(
    html,
    `the page reloaded; the dev server wrote meanwhile:\n${devLogSince(from)}`
  ).toHaveAttribute("data-dev-reload-probe", "");
});

// A probe on the document survives a second of waiting: the page stays.
const expectPageStays = async (page: Page) => {
  const html = page.locator("html");
  await html.evaluate((el) => {
    el.dataset.devReloadProbe = "";
  });
  await page.waitForTimeout(1000);
  await expect(html).toHaveAttribute("data-dev-reload-probe", "");
};

test("a page of the dev server that reloads right after its first load is opened again before the spec works on it", async ({
  page,
}) => {
  // The HMR socket of the page passes through, and its first connection gets
  // the message the dev server's startup reload is; Vite's client in the page
  // reloads on it. The route hands it to the page itself, so it is not a frame
  // the dev server sent and the log has no reload message for it.
  let reloadSent = false;
  await page.routeWebSocket(HMR_SOCKET, (socket) => {
    const server = socket.connectToServer();
    server.onMessage((message) => {
      socket.send(message);
      if (!reloadSent && String(message).includes('"connected"')) {
        reloadSent = true;
        socket.send(STARTUP_RELOAD);
      }
    });
    socket.onMessage((message) => server.send(message));
  });
  let opens = 0;
  const reasons = await openSettled(page, async () => {
    opens += 1;
    await page.goto(`${DEV_URL}/ui`);
  });
  expect(opens).toBe(2);
  // The navigation away is logged with what the dev server wrote meanwhile:
  // here the request of the first open.
  expect(reasons).toHaveLength(1);
  expect(reasons[0]).toContain("[200] /ui");
  await expectPageStays(page);
});

test("a page of the dev server whose first load is interrupted is opened again before the spec works on it", async ({
  page,
}) => {
  // A reload before the load event interrupts the navigation, and page.goto
  // throws; the first open throws as it would.
  let opens = 0;
  const reasons = await openSettled(page, async () => {
    opens += 1;
    await page.goto(`${DEV_URL}/ui`);
    if (opens === 1) {
      throw new Error(
        "page.goto: navigation interrupted by another navigation"
      );
    }
  });
  expect(opens).toBe(2);
  expect(reasons).toHaveLength(1);
  expect(reasons[0]).toContain("[200] /ui");
  await expectPageStays(page);
});

test("a page of the dev server that never settles fails the spec with what the dev server wrote", async ({
  page,
}) => {
  let opens = 0;
  const opening = openSettled(page, async () => {
    opens += 1;
    await page.goto(`${DEV_URL}/ui`);
    throw new Error("page.goto: navigation interrupted by another navigation");
  });
  await expect(opening).rejects.toThrow(
    `${DEV_URL}/ui did not settle in 3 opens`
  );
  await expect(opening).rejects.toThrow("[200] /ui");
  expect(opens).toBe(3);
});
