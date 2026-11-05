// A slow scroll through the home page's process section (#how) as a frame
// series (KA0158), so the owner sees the marks, the rail and the drawings
// play in order. The same recording as KA0157's (its frames/record.mjs):
// a 1440x900 desktop and a 390x844 phone, motion on, 40 frames each from
// the first drawing's top at 90% of the viewport down to the button under
// the steps on the viewport's middle line, at a fixed step; the layout is
// unchanged, so frame N here and KA0157's `after-*-N` (the state before
// KA0158) stand at the same scroll position. frames.json lists every frame
// with its scroll position. With `compare`, it also writes
// `compare-d-14.png`: KA0157's `after-d-14.png` (before) beside this
// series' `after-d-14.png`. Run from the repository root against a served
// production build:
//   bun run build
//   bun run preview -- --port 4400 --background
//   node spec/features/KA0158-*/frames/record.mjs http://localhost:4400/ compare
//   bunx astro preview stop
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const url = process.argv[2] ?? "http://localhost:4400/";
const compare = process.argv[3] === "compare";
const out = path.dirname(fileURLToPath(import.meta.url));
const before = path.join(
  out,
  "../../KA0157-the-process-drawings-and-step-marks-draw-in-slowly-as-the-page-scrolls-not/frames"
);

const FRAMES = 40;
const SETTLE_MS = 250;
const RUNS = [
  { height: 900, name: "d", width: 1440 },
  { height: 844, name: "m", width: 390 },
];

const manifest = [];
const browser = await chromium.launch();
for (const run of RUNS) {
  const phone = run.width < 800;
  // biome-ignore lint/performance/noAwaitInLoops: one recording at a time
  const context = await browser.newContext({
    hasTouch: phone,
    isMobile: phone,
    reducedMotion: "no-preference",
    viewport: { height: run.height, width: run.width },
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(2000);
  const { from, to } = await page.evaluate(() => {
    const top = (selector) =>
      document.querySelector(selector).getBoundingClientRect().top + scrollY;
    return {
      from: Math.round(top("#how .mb-figure") - innerHeight * 0.9),
      to: Math.round(top("#how .mb-how-cta") - innerHeight / 2),
    };
  });
  for (let i = 0; i < FRAMES; i += 1) {
    const y = Math.round(from + ((to - from) * i) / (FRAMES - 1));
    // biome-ignore lint/performance/noAwaitInLoops: frames in scroll order
    await page.evaluate((top) => scrollTo({ behavior: "instant", top }), y);
    await page.waitForTimeout(SETTLE_MS);
    const file = `after-${run.name}-${String(i + 1).padStart(2, "0")}.png`;
    await page.screenshot({ path: path.join(out, file) });
    manifest.push({
      file,
      scrollY: await page.evaluate(() => Math.round(scrollY)),
      series: "after",
      viewport: `${run.width}x${run.height}`,
    });
  }
  await context.close();
}
await browser.close();
fs.writeFileSync(
  path.join(out, "frames.json"),
  `${JSON.stringify(manifest, null, 2)}\n`
);
console.log(`${FRAMES * RUNS.length} frames in ${out}`);

if (compare) {
  // Before | after at the same scroll position, 16px apart on the page's
  // ink.
  const left = path.join(before, "after-d-14.png");
  const right = path.join(out, "after-d-14.png");
  const { height, width } = await sharp(left).metadata();
  await sharp({
    create: {
      background: "#0b1220",
      channels: 3,
      height,
      width: width * 2 + 16,
    },
  })
    .composite([
      { input: left, left: 0, top: 0 },
      { input: right, left: width + 16, top: 0 },
    ])
    .png()
    .toFile(path.join(out, "compare-d-14.png"));
  console.log("compare-d-14.png: before (KA0157 after-d-14) | after");
}
