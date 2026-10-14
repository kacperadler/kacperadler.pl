import { expect, test } from "@playwright/test";
import sharp from "sharp";

// The share image is drawn in the site's minimal brutalism (KA0073): a solid
// `base` substrate, the photo in a square 1px `ink` frame, a square brand mark.
const BASE = [0x0a, 0x0c, 0x10];
const INK = [0xec, 0xe7, 0xdc];
const BLUE = [0x8e, 0xae, 0xd8];

// The sheet sits 45px in from every edge; the brand mark is a 36px square at
// the top left of the text cell, which starts 40px right of the photo.
const INSET = 45;
const SHEET = { bottom: 584, left: INSET, right: 1154, top: INSET };
const MARK = { bottom: 120, left: 625, right: 660, top: 85 };

test("the OG image is a ruled sheet on a solid substrate", async ({
  request,
}) => {
  const response = await request.get("/og-default.png");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toBe("image/png");

  const { data, info } = await sharp(await response.body())
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  expect([info.width, info.height]).toEqual([1200, 630]);

  const pixel = (x: number, y: number) => {
    const i = (y * info.width + x) * info.channels;
    return [data[i], data[i + 1], data[i + 2]];
  };

  // Solid substrate: no dot grid, no gradient in the margin around the sheet.
  const stray: string[] = [];
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const inSheet =
        x >= SHEET.left &&
        x <= SHEET.right &&
        y >= SHEET.top &&
        y <= SHEET.bottom;
      if (!inSheet && pixel(x, y).join() !== BASE.join()) {
        stray.push(`${x},${y}`);
      }
    }
  }
  expect(stray.slice(0, 10)).toEqual([]);

  // Square corners: the 1px ink rule runs into each corner of the photo's
  // frame and of the brand mark, where a rounded shape leaves the ground.
  for (const box of [SHEET, MARK]) {
    for (const [x, y] of [
      [box.left, box.top],
      [box.right, box.top],
      [box.left, box.bottom],
      [box.right, box.bottom],
    ] as const) {
      expect(pixel(x, y), `corner ${x},${y}`).toEqual(INK);
    }
  }
  expect(pixel(MARK.left + 1, MARK.top + 1)).toEqual(BLUE);
  expect(pixel(MARK.right - 1, MARK.bottom - 1)).toEqual(BLUE);
});
