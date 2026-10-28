import { expect, type Page, test } from "@playwright/test";
import { bindOneLetterWords } from "../../src/lib/one-letter-words";

// Polish typesetting keeps a one-letter word (a, i, o, u, w, z) with the word
// after it (KA0114): src/middleware.ts runs every HTML page through
// lib/one-letter-words.ts, so the space after such a word is non-breaking.
// llms-full.txt is no HTML page and keeps normal spaces.

// Every page the build has, the e2e fixtures included, and the 404.
const PAGES = [
  "/",
  "/realizacje/",
  "/realizacje/przyklad/",
  "/regulamin/",
  "/polityka-prywatnosci/",
  "/lista/",
  "/nie-ma-takiej-strony/",
];

// In the page: every one-letter word of the visible copy followed by a
// space in the same text node, with that space and the word after it.
const oneLetterWords = (page: Page) =>
  page.evaluate(() => {
    const found: { before: string; space: string; sameLine: boolean }[] = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node.parentElement?.closest("script, style, code, pre, textarea")) {
        continue;
      }
      const text = node.textContent ?? "";
      for (const match of text.matchAll(
        /(?<=^|[\s([„"«])[aiouwz](\s+)(?=\S)/gi
      )) {
        const letter = document.createRange();
        letter.setStart(node, match.index);
        letter.setEnd(node, match.index + 1);
        const next = document.createRange();
        const start = match.index + match[0].length;
        next.setStart(node, start);
        next.setEnd(node, start + 1);
        found.push({
          before: text.slice(Math.max(0, match.index - 20), start + 12),
          sameLine:
            Math.abs(
              letter.getBoundingClientRect().top -
                next.getBoundingClientRect().top
            ) < 4,
          space: match[1] ?? "",
        });
      }
    }
    return found;
  });

test.describe("one-letter words", () => {
  test("bind to the next word in text and nowhere else", () => {
    // A run of them, capitals, after brackets and quotes, across a newline.
    expect(bindOneLetterWords("<p>Dane i w domu, a\n  potem</p>")).toBe(
      "<p>Dane i&nbsp;w&nbsp;domu, a&nbsp;potem</p>"
    );
    expect(bindOneLetterWords("<h3>W liczbach (z AI) „o tym” u nas</h3>")).toBe(
      "<h3>W&nbsp;liczbach (z&nbsp;AI) „o&nbsp;tym” u&nbsp;nas</h3>"
    );
    expect(bindOneLetterWords('<p>[w tym] "a to" «i tak»</p>')).toBe(
      '<p>[w&nbsp;tym] "a&nbsp;to" «i&nbsp;tak»</p>'
    );
    // After a non-breaking space already in the copy.
    expect(bindOneLetterWords("<p>2&nbsp;z 3</p>")).toBe(
      "<p>2&nbsp;z&nbsp;3</p>"
    );
    // The last letter of a longer word, other letters, a word at the end.
    expect(bindOneLetterWords("<p>Kasia ma x b i</p>")).toBe(
      "<p>Kasia ma x b i</p>"
    );
    // A word that ends its text node keeps its space: an sr-only " i ".
    expect(bindOneLetterWords('<span class="sr-only"> i </span>')).toBe(
      '<span class="sr-only"> i </span>'
    );
    // Attributes (a ">" in one included), comments and raw elements stay.
    const untouched = [
      '<img alt="a b" data-x="w > z o x">',
      "<!-- x > i w -->",
      '<script type="application/ld+json">{"a":"i w domu"}</script>',
      "<style>.a i {}</style>",
      "<code>a b</code>",
      "<pre>i w</pre>",
      "<textarea>a b</textarea>",
      "<svg><text>i w</text></svg>",
      "<title>AI i automatyzacje</title>",
    ];
    for (const html of untouched) {
      expect(bindOneLetterWords(`${html}<p>i w</p>`)).toBe(
        `${html}<p>i&nbsp;w</p>`
      );
    }
  });

  test("never end a line on any page, on a phone and on the desktop", async ({
    page,
  }) => {
    const cases = [390, 1440].flatMap((width) =>
      PAGES.map((path) => ({ path, width }))
    );
    let total = 0;
    for (const { path, width } of cases) {
      // biome-ignore lint/performance/noAwaitInLoops: one page at a time
      await page.setViewportSize({ height: 900, width });
      await page.goto(path);
      const words = await oneLetterWords(page);
      total += words.length;
      for (const word of words) {
        expect(word.space, `${path} @${width}: ${word.before}`).toBe("\u00a0");
        expect(word.sameLine, `${path} @${width}: ${word.before}`).toBe(true);
      }
    }
    expect(total).toBeGreaterThan(0);
  });

  test("llms-full.txt keeps normal spaces", async ({ request }) => {
    const text = await (await request.get("/llms-full.txt")).text();
    expect(text).toContain("maile i zapytania");
    expect(text).not.toContain("\u00a0");
    expect(text).not.toContain("&nbsp;");
  });
});
