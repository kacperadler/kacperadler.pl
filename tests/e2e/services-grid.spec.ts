import { expect, type Page, test } from "@playwright/test";

interface Box {
  height: number;
  width: number;
  x: number;
  y: number;
}

// Sub-pixel rounding of fractional widths plus the 1px rule two neighbouring
// cells share; anything larger is a real shift.
const TOLERANCE = 2;

async function gridAndCards(page: Page) {
  const grid = await page.locator("#services .mb-cell-grid").boundingBox();
  const cards = await page
    .locator("#services .mb-cell-grid > .mb-card")
    .evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { height: r.height, width: r.width, x: r.x, y: r.y };
      })
    );
  if (!grid) {
    throw new Error("services grid is not rendered");
  }
  return { cards, grid };
}

test.describe("services grid", () => {
  test("desktop: two cells a row, every row (a lone last cell too) spans the grid", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/");

    const { grid, cards } = await gridAndCards(page);
    expect(cards.length).toBeGreaterThan(0);

    const rows = new Map<number, Box[]>();
    for (const card of cards) {
      const key = Math.round(card.y);
      rows.set(key, [...(rows.get(key) ?? []), card]);
    }

    for (const row of rows.values()) {
      expect(row.length).toBeLessThanOrEqual(2);
      const left = Math.min(...row.map((c) => c.x));
      const right = Math.max(...row.map((c) => c.x + c.width));
      // A lone last cell left-hugging the grid (the odd-count case) fails
      // here: the row has to reach both edges of the table.
      expect(Math.abs(left - grid.x)).toBeLessThanOrEqual(TOLERANCE);
      expect(Math.abs(grid.x + grid.width - right)).toBeLessThanOrEqual(
        TOLERANCE
      );
      if (row.length === 2) {
        const [a, b] = row as [Box, Box];
        // Neighbours share one rule: no gap between the cells.
        expect(Math.abs(a.x + a.width - b.x)).toBeLessThanOrEqual(TOLERANCE);
        expect(Math.abs(a.width - b.width)).toBeLessThanOrEqual(TOLERANCE);
      }
    }
  });

  test("mobile: cards stack in a single full-width column", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 844, width: 390 });
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
