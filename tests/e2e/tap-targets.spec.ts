import { expect, test } from "@playwright/test";

// The header's call button and menu button are 36px and the footer links
// 22px high (KA0111); an empty ::after around each takes the taps just past
// the drawn edge, 44px each way. The footer's lists space their links far
// enough apart that those areas never overlap: a tap between two links
// lands on the nearer one or on nothing, never on the far one. A link in
// running text gets no such area (KA0135): WCAG 2.5.8 exempts it, every one
// is far wider than 44px, and an area above or below it would take the taps
// meant for the lines around it. Reduced motion keeps the header's entrance
// from moving it, and a scroll from gliding, while the points are read.
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

  for (const [path, links] of [
    ["/", ".mb-faq .mb-link-inline"],
    ["/regulamin/", ".mb-prose a"],
    ["/polityka-prywatnosci/", ".mb-prose a"],
  ] as const) {
    test(`a link in running text on ${path} takes no tap meant for the line above or below it`, async ({
      page,
    }) => {
      await page.goto(path);
      const results = await page.locator(links).evaluateAll((els) =>
        els.map((link) => {
          link.scrollIntoView({ behavior: "instant", block: "center" });
          const name = link.textContent?.trim();
          const box = link.getBoundingClientRect();
          const block = link.parentElement?.getBoundingClientRect();
          const lineHeight = Number.parseFloat(
            getComputedStyle(link).lineHeight
          );
          if (!block || Number.isNaN(lineHeight)) {
            return { faults: [`${name}: no line height`], neighbours: 0 };
          }
          const faults: string[] = [];
          const centre = document.elementFromPoint(
            box.left + box.width / 2,
            box.top + box.height / 2
          );
          if (!link.contains(centre)) {
            faults.push(`${name}: a tap on its centre misses it`);
          }
          // The line the link sits on, and points just into and in the
          // middle of the lines around it, inside its own text block.
          const lineTop = box.top - (lineHeight - box.height) / 2;
          const lineBottom = lineTop + lineHeight;
          const ys = [
            lineTop - 0.5,
            lineTop - lineHeight / 2,
            lineBottom + 0.5,
            lineBottom + lineHeight / 2,
          ].filter((y) => y > block.top && y < block.bottom);
          for (const y of ys) {
            for (const x of [
              box.left + 2,
              box.left + box.width / 2,
              box.right - 2,
            ]) {
              if (link.contains(document.elementFromPoint(x, y))) {
                faults.push(
                  `${name}: a tap on the line ${y < lineTop ? "above" : "below"} (${(y - lineTop).toFixed(1)}px from its line) opens it`
                );
              }
            }
          }
          return { faults, neighbours: ys.length };
        })
      );
      expect(results.flatMap(({ faults }) => faults)).toEqual([]);
      // At least one of the links has a line next to it to tap.
      expect(
        results.some(({ neighbours }) => neighbours > 0),
        "no link with a line above or below it"
      ).toBe(true);
    });
  }
});
