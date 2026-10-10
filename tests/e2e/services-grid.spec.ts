import { expect, type Page, test } from "@playwright/test";

interface Box {
  height: number;
  width: number;
  x: number;
  y: number;
}

// Sub-pixel rounding of percentage widths; anything larger is a real shift.
const TOLERANCE = 2;

async function gridAndCards(page: Page) {
  const grid = await page.locator(".services-grid").boundingBox();
  const cards = await page
    .locator(".services-grid .service-panel")
    .evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      })
    );
  if (!grid) {
    throw new Error("services grid is not rendered");
  }
  return { grid, cards };
}

test.describe("services grid", () => {
  test("desktop: every row, including a lone last card, is centred in the grid", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const { grid, cards } = await gridAndCards(page);
    expect(cards.length).toBeGreaterThan(0);

    const rows = new Map<number, Box[]>();
    for (const card of cards) {
      const key = Math.round(card.y);
      rows.set(key, [...(rows.get(key) ?? []), card]);
    }

    const columnWidth = Math.min(...cards.map((c) => c.width));
    for (const row of rows.values()) {
      expect(row.length).toBeLessThanOrEqual(2);
      const left = Math.min(...row.map((c) => c.x));
      const right = Math.max(...row.map((c) => c.x + c.width));
      // Equal gutters on both sides: a lone card left-hugging the grid
      // (the odd-count case) fails here.
      expect(
        Math.abs(left - grid.x - (grid.x + grid.width - right))
      ).toBeLessThanOrEqual(TOLERANCE);
      for (const card of row) {
        expect(Math.abs(card.width - columnWidth)).toBeLessThanOrEqual(
          TOLERANCE
        );
      }
    }
  });

  test("mobile: cards stack in a single full-width column", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const { grid, cards } = await gridAndCards(page);
    expect(cards.length).toBeGreaterThan(0);

    let previous: Box | undefined;
    for (const card of cards) {
      expect(Math.abs(card.width - grid.width)).toBeLessThanOrEqual(TOLERANCE);
      if (previous) {
        expect(card.y).toBeGreaterThan(
          previous.y + previous.height - TOLERANCE
        );
      }
      previous = card;
    }
  });
});
