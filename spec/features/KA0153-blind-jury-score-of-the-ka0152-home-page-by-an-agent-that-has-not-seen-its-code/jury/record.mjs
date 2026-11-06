// KA0153 motion evidence: a slow scroll of the whole page as a fixed-step frame series (40 frames),
// plus the first seconds after load, at 1440 and 390, with and without reduced motion.
// usage: node record.mjs <url> <outDir>   (run from a folder where `playwright` resolves)
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const req = createRequire(path.join(process.cwd(), "noop.js"));
const pw = await import(req.resolve("playwright"));
const chromium = pw.chromium || pw.default.chromium;
const [url, outRoot] = process.argv.slice(2);
const FRAMES = 40;
const LOAD_FRAMES = 24;

const runs = [
  {
    mobile: false,
    name: "d1440",
    reduced: false,
    viewport: { height: 900, width: 1440 },
  },
  {
    mobile: true,
    name: "m390",
    reduced: false,
    viewport: { height: 844, width: 390 },
  },
  {
    mobile: false,
    name: "d1440-reduced",
    reduced: true,
    viewport: { height: 900, width: 1440 },
  },
  {
    mobile: true,
    name: "m390-reduced",
    reduced: true,
    viewport: { height: 844, width: 390 },
  },
];

const browser = await chromium.launch();
const log = {};
for (const run of runs) {
  // biome-ignore lint/performance/noAwaitInLoops: the four runs share one browser, one after another
  const ctx = await browser.newContext({
    deviceScaleFactor: 1,
    hasTouch: run.mobile,
    isMobile: run.mobile,
    reducedMotion: run.reduced ? "reduce" : "no-preference",
    viewport: run.viewport,
  });
  const page = await ctx.newPage();
  const rec = {
    load: [],
    reducedMotion: run.reduced,
    scroll: [],
    viewport: run.viewport,
  };

  // 1. The first seconds after load, one frame as fast as screenshots allow.
  const loadDir = path.join(outRoot, `load-${run.name}`);
  fs.mkdirSync(loadDir, { recursive: true });
  const t0 = Date.now();
  await page.goto(url, { waitUntil: "commit" });
  await page.waitForSelector("h1", { state: "attached" });
  for (let i = 0; i < LOAD_FRAMES; i += 1) {
    const file = `f-${String(i).padStart(2, "0")}.png`;
    const ms = Date.now() - t0;
    // biome-ignore lint/performance/noAwaitInLoops: frames are a time series, taken in order
    await page.screenshot({ path: path.join(loadDir, file) });
    rec.load.push({ file, ms });
    await page.waitForTimeout(60);
  }
  await page.waitForLoadState("load");
  await page.waitForTimeout(1500);

  // 2. Slow scroll top to bottom in 24 px steps (~800 px/s); a frame at 40 evenly spaced stops.
  const scrollDir = path.join(outRoot, `scroll-${run.name}`);
  fs.mkdirSync(scrollDir, { recursive: true });
  const max = await page.evaluate(
    () => document.documentElement.scrollHeight - innerHeight
  );
  let y = 0;
  for (let i = 0; i < FRAMES; i += 1) {
    const target = Math.round((i * max) / (FRAMES - 1));
    while (y < target) {
      y = Math.min(target, y + 24);
      // biome-ignore lint/performance/noAwaitInLoops: the scroll is a sequence of small steps
      await page.evaluate(
        (top) => window.scrollTo({ behavior: "instant", top }),
        y
      );
      await page.waitForTimeout(30);
    }
    await page.waitForTimeout(250);
    const file = `f-${String(i).padStart(2, "0")}.png`;
    const at = await page.evaluate(() => Math.round(scrollY));
    await page.screenshot({ path: path.join(scrollDir, file) });
    rec.scroll.push({ file, scrollY: at });
  }
  rec.scrollMax = max;
  log[run.name] = rec;
  await ctx.close();
}
await browser.close();
fs.writeFileSync(
  path.join(outRoot, "motion.json"),
  `${JSON.stringify(log, null, 1)}\n`
);
console.log(
  JSON.stringify(
    Object.fromEntries(
      Object.entries(log).map(([k, v]) => [
        k,
        {
          lastScrollY: v.scroll.at(-1).scrollY,
          loadMs: v.load.map((f) => f.ms).join(","),
          scrollMax: v.scrollMax,
        },
      ])
    ),
    null,
    1
  )
);
