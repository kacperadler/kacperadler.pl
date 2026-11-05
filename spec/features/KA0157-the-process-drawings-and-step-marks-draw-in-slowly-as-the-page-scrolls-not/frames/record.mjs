// A slow scroll through the home page's process section (#how) as a frame
// series (KA0157), so the owner sees how the lime drawings and step marks
// draw in. Two recordings, 40 frames each: a 1440x900 desktop and a 390x844
// phone, with motion on. Each opens the page, then scrolls from the first
// drawing's top at 90% of the viewport down to the button under the steps on
// the viewport's middle line, at a fixed step, a frame at each stop.
// frames.json lists every frame with its scroll position. `before-*` was
// recorded on 243ca22 (KA0157 planned), `after-*` on the branch. Run from
// the repository root against a served production build, with the label of
// the series (`before` or `after`):
//   bun run build
//   bun run preview -- --port 4400 --background
//   node spec/features/KA0157-*/frames/record.mjs after http://localhost:4400/
//   bunx astro preview stop
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const label = process.argv[2] ?? "after";
const url = process.argv[3] ?? "http://localhost:4400/";
const out = path.dirname(fileURLToPath(import.meta.url));

const FRAMES = 40;
const SETTLE_MS = 250;
const RUNS = [
  { height: 900, name: "d", width: 1440 },
  { height: 844, name: "m", width: 390 },
];

const manifestFile = path.join(out, "frames.json");
const manifest = fs.existsSync(manifestFile)
  ? JSON.parse(fs.readFileSync(manifestFile, "utf8")).filter(
      (entry) => entry.series !== label
    )
  : [];

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
    const file = `${label}-${run.name}-${String(i + 1).padStart(2, "0")}.png`;
    await page.screenshot({ path: path.join(out, file) });
    manifest.push({
      file,
      scrollY: await page.evaluate(() => Math.round(scrollY)),
      series: label,
      viewport: `${run.width}x${run.height}`,
    });
  }
  await context.close();
}
await browser.close();
manifest.sort((a, b) => a.file.localeCompare(b.file));
fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`${FRAMES * RUNS.length} ${label} frames in ${out}`);
