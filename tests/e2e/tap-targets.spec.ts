import { expect, test } from "@playwright/test";

// The header's call button and menu button are 36px and the footer links
// 22px high (KA0111); an empty ::after around each takes the taps just past
// the drawn edge, 44px each way. The footer's lists space their links far
// enough apart that those areas never overlap: a tap between two links
// lands on the nearer one or on nothing, never on the far one. Reduced
// motion keeps the header's entrance from moving it while the points are
// read.
test.use({
  contextOptions: { reducedMotion: "reduce" },
  hasTouch: true,
  isMobile: true,
  viewport: { height: 844, width: 390 },
});

test.describe("tap targets on a phone", () => {
  test("the header's call and menu buttons take a tap 44px across, past their drawn edge", async ({
    page,
  }) => {
    await page.goto("/");
    // Per button: its drawn height, and whether a tap presses it at the
    // points 21.5px from its centre (just inside a 44px area), or 0.5px
    // inside the edge where it is wider than that.
    const buttons = await page
      .locator("[data-nav-cta], [data-menu-open]")
      .evaluateAll((els) =>
        els.map((el) => {
          const box = el.getBoundingClientRect();
          const x = box.left + box.width / 2;
          const y = box.top + box.height / 2;
          const across = Math.max(21.5, box.width / 2 - 0.5);
          const points: [number, number][] = [
            [x, y - 21.5],
            [x, y + 21.5],
            [x - across, y],
            [x + across, y],
          ];
          return {
            drawnHeight: box.height,
            name: el.getAttribute("aria-label") ?? el.textContent?.trim(),
            pressed: points.map(([px, py]) =>
              el.contains(document.elementFromPoint(px, py))
            ),
          };
        })
      );
    expect(buttons).toHaveLength(2);
    for (const { drawnHeight, name, pressed } of buttons) {
      expect(drawnHeight, name).toBeLessThan(44);
      expect(pressed, name).toEqual([true, true, true, true]);
    }

    // A real tap 3px above the drawn menu button opens the sheet.
    const menu = await page.locator("[data-menu-open]").boundingBox();
    if (!menu) {
      throw new Error("no menu button");
    }
    await page.touchscreen.tap(menu.x + menu.width / 2, menu.y - 3);
    await expect(page.locator("#mobile-sheet")).toHaveJSProperty("open", true);
  });

  test("a footer link takes a tap 44px high, and a tap between two links lands on the nearer one or none", async ({
    page,
  }) => {
    await page.goto("/");
    const lists = page.locator(".mb-footer ul");
    await lists.first().scrollIntoViewIfNeeded();
    const faults = await lists.evaluateAll((uls) =>
      uls.flatMap((ul) => {
        const links = [...ul.querySelectorAll("a")];
        const found: string[] = [];
        for (const [i, link] of links.entries()) {
          const box = link.getBoundingClientRect();
          const x = box.left + Math.min(10, box.width / 2);
          const name = link.textContent?.trim();
          if (box.height >= 44) {
            found.push(`${name}: drawn ${box.height}px high, no area needed`);
          }
          // 21.5px above and below the centre: just inside a 44px area.
          const centre = box.top + box.height / 2;
          for (const y of [centre - 21.5, centre + 21.5]) {
            if (!link.contains(document.elementFromPoint(x, y))) {
              found.push(
                `${name}: a tap ${(y - centre).toFixed(1)}px from its centre misses it`
              );
            }
          }
          const next = links[i + 1];
          if (!next) {
            continue;
          }
          const below = next.getBoundingClientRect();
          for (let y = Math.ceil(box.bottom); y < below.top; y += 1) {
            // The footer link a tap there would open, if any.
            const hit = links.find((a) =>
              a.contains(document.elementFromPoint(x, y))
            );
            const nearer = y - box.bottom < below.top - y ? link : next;
            if (hit && hit !== nearer) {
              found.push(
                `${name}: a tap ${(y - box.bottom).toFixed(1)}px under it opens ${hit.textContent?.trim()}`
              );
            }
          }
        }
        return found;
      })
    );
    expect(faults).toEqual([]);
  });
});
