import { expect, test } from "@playwright/test";
import sharp from "sharp";

// The favicon is the brand mark of brand.astro (KA0073): a square `blue` block
// in a 1px `ink` rule with a heavy `k` in `base`, drawn on a 28-unit box like
// the 28px mark in the header.
const INK = [0xec, 0xe7, 0xdc];
const BLUE = [0x8e, 0xae, 0xd8];
const BASE = [0x0a, 0x0c, 0x10];

// Every RGB channel within 8 of the colour (the alpha is checked apart).
const near = (actual: number[], expected: number[]) =>
  expected.every((value, i) => Math.abs((actual[i] ?? 0) - value) <= 8);

// Square corners show as opaque pixels (a rounded mark leaves them clear),
// the block inside the rule is `blue` and the stem of the `k` is `base`.
const expectMark = async (png: Buffer, label: string) => {
  const { data, info } = await sharp(png)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const size = info.width;
  expect(info.height, label).toBe(size);
  const pixel = (x: number, y: number) => {
    const i = (y * size + x) * 4;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]].map(
      (value) => value ?? 0
    );
  };

  for (const [x, y] of [
    [0, 0],
    [size - 1, 0],
    [0, size - 1],
    [size - 1, size - 1],
  ] as const) {
    expect(pixel(x, y)[3], `${label} corner ${x},${y}`).toBe(255);
  }
  const inside = Math.round(size * 0.15);
  expect(near(pixel(inside, inside), BLUE), `${label} block`).toBe(true);
  const stem = pixel(Math.floor((size * 11) / 28), Math.floor(size / 2));
  expect(near(stem, BASE), `${label} k stem`).toBe(true);
  return pixel;
};

test("favicon.svg is the square brand mark", async ({ request }) => {
  const response = await request.get("/favicon.svg");
  expect(response.ok()).toBe(true);

  // Rendered at its own 28px the rule is exactly the outer pixel ring.
  const pixel = await expectMark(await response.body(), "svg");
  expect(pixel(0, 0).slice(0, 3)).toEqual(INK);
  expect(pixel(27, 14).slice(0, 3)).toEqual(INK);
  expect(pixel(1, 1).slice(0, 3)).toEqual(BLUE);
});

test("favicon.ico holds the square brand mark at every size", async ({
  request,
}) => {
  const response = await request.get("/favicon.ico");
  expect(response.ok()).toBe(true);
  const ico = await response.body();

  // ICONDIR: reserved 0, type 1, then one 16-byte entry per image whose
  // last two fields are the PNG's byte length and offset.
  expect(ico.readUInt16LE(2)).toBe(1);
  const pngs = Array.from({ length: ico.readUInt16LE(4) }, (_, i) => {
    const entry = 6 + 16 * i;
    const offset = ico.readUInt32LE(entry + 12);
    return ico.subarray(offset, offset + ico.readUInt32LE(entry + 8));
  });
  const sizes = await Promise.all(
    pngs.map(async (png) => {
      const { width } = await sharp(png).metadata();
      await expectMark(png, `ico ${width}px`);
      return width;
    })
  );
  expect(sizes).toEqual([16, 32, 48]);
});
