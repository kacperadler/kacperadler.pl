// Motion frames of the home page for a jury that scores Animations/Transitions
// from stills (KA0152). Four recordings: a 1440x900 desktop and a 390x844
// phone, each with motion and with prefers-reduced-motion: reduce. Each one
// opens the page, takes frames through the first-screen entrance at a fixed
// time step, then scrolls the whole page down at a fixed step and takes a
// frame at each stop. frames.json lists every frame with its time and scroll
// position. Run from the repository root against a served production build:
//   bun run build
//   node <skills>/jury/scripts/serve.mjs dist/client --port 4400 &
//   node spec/features/KA0152-*/jury/record.mjs http://127.0.0.1:4400/
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://127.0.0.1:4400/";
const out = path.dirname(fileURLToPath(import.meta.url));

// Entrance: a frame every ENTRANCE_STEP_MS from navigation; then the scroll
// frames, the first at the top and the last at the foot of the page.
const ENTRANCE_STEP_MS = 250;
const SETTLE_MS = 300;
const RUNS = [
  { entrance: 8, name: "d-motion", reduced: false, scroll: 32, width: 1440 },
  { entrance: 2, name: "d-reduced", reduced: true, scroll: 18, width: 1440 },
  { entrance: 8, name: "m-motion", reduced: false, scroll: 32, width: 390 },
  { entrance: 2, name: "m-reduced", reduced: true, scroll: 18, width: 390 },
];

const browser = await chromium.launch();
const manifest = [];
for (const run of RUNS) {
  const phone = run.width < 800;
  // biome-ignore lint/performance/noAwaitInLoops: one recording at a time
  const context = await browser.newContext({
    hasTouch: phone,
    isMobile: phone,
    reducedMotion: run.reduced ? "reduce" : "no-preference",
    viewport: { height: phone ? 844 : 900, width: run.width },
  });
  const page = await context.newPage();
  let n = 0;
  const frame = async (phase) => {
    n += 1;
    const file = `${run.name}-${String(n).padStart(2, "0")}.png`;
    const at = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      ms: Math.round(performance.now()),
      scrollY: Math.round(scrollY),
    }));
    await page.screenshot({ path: path.join(out, file) });
    manifest.push({ file, phase, run: run.name, ...at });
  };

  await page.goto(url, { waitUntil: "commit" });
  for (let i = 0; i < run.entrance; i += 1) {
    // biome-ignore lint/performance/noAwaitInLoops: frames in time order
    await page.waitForFunction(
      (ms) => performance.now() >= ms,
      (i + 1) * ENTRANCE_STEP_MS
    );
    await frame("entrance");
  }
  await page.waitForLoadState("load");
  await page.waitForTimeout(1500);

  const room = await page.evaluate(
    () => document.documentElement.scrollHeight - innerHeight
  );
  for (let i = 0; i < run.scroll; i += 1) {
    const top = Math.round((room * i) / (run.scroll - 1));
    // biome-ignore lint/performance/noAwaitInLoops: frames in scroll order
    await page.evaluate((y) => scrollTo({ behavior: "instant", top: y }), top);
    await page.waitForTimeout(SETTLE_MS);
    await frame("scroll");
  }
  await context.close();
}
await browser.close();
fs.writeFileSync(
  path.join(out, "frames.json"),
  `${JSON.stringify(manifest, null, 2)}\n`
);
console.log(`${manifest.length} frames in ${out}`);
