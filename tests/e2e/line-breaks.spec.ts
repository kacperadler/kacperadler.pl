import { expect, type Page, test } from "@playwright/test";
import { bindLineBreaks } from "../../src/lib/line-breaks";

// src/middleware.ts runs every HTML page through lib/line-breaks.ts. Polish
// typesetting keeps a one-letter word (a, i, o, u, w, z) with the word after
// it (KA0114), so the space after such a word is non-breaking. An
// abbreviation with a Polish ending ("CRM-y") stays whole (KA0125): a word
// joiner (U+2060) follows its hyphen. llms-full.txt is no HTML page and
// keeps normal spaces and hyphens.

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

// In the page: every hyphen between two capitals and a lowercase letter in
// the visible copy, with what follows it and whether that letter stays on
// the hyphen's line.
const abbreviationEndings = (page: Page) =>
  page.evaluate(() => {
    const found: { before: string; joiner: boolean; sameLine: boolean }[] = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node.parentElement?.closest("script, style, code, pre, textarea")) {
        continue;
      }
      const text = node.textContent ?? "";
      for (const match of text.matchAll(/(?<=\p{Lu}{2})-(\u2060?)\p{Ll}/gu)) {
        const hyphen = document.createRange();
        hyphen.setStart(node, match.index);
        hyphen.setEnd(node, match.index + 1);
        const next = document.createRange();
        const start = match.index + match[0].length - 1;
        next.setStart(node, start);
        next.setEnd(node, start + 1);
        found.push({
          before: text.slice(Math.max(0, match.index - 20), start + 12),
          joiner: match[1] === "\u2060",
          sameLine:
            Math.abs(
              hyphen.getBoundingClientRect().top -
                next.getBoundingClientRect().top
            ) < 4,
        });
      }
    }
    return found;
  });

test.describe("line breaks", () => {
  test("one-letter words bind to the next word in text and nowhere else", () => {
    // A run of them, capitals, after brackets and quotes, across a newline.
    expect(bindLineBreaks("<p>Dane i w domu, a\n  potem</p>")).toBe(
      "<p>Dane i&nbsp;w&nbsp;domu, a&nbsp;potem</p>"
    );
    expect(bindLineBreaks("<h3>W liczbach (z AI) „o tym” u nas</h3>")).toBe(
      "<h3>W&nbsp;liczbach (z&nbsp;AI) „o&nbsp;tym” u&nbsp;nas</h3>"
    );
    expect(bindLineBreaks('<p>[w tym] "a to" «i tak»</p>')).toBe(
      '<p>[w&nbsp;tym] "a&nbsp;to" «i&nbsp;tak»</p>'
    );
    // After a non-breaking space already in the copy.
    expect(bindLineBreaks("<p>2&nbsp;z 3</p>")).toBe("<p>2&nbsp;z&nbsp;3</p>");
    // The last letter of a longer word, other letters, a word at the end.
    expect(bindLineBreaks("<p>Kasia ma x b i</p>")).toBe(
      "<p>Kasia ma x b i</p>"
    );
    // A word that ends its text node keeps its space: an sr-only " i ".
    expect(bindLineBreaks('<span class="sr-only"> i </span>')).toBe(
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
      expect(bindLineBreaks(`${html}<p>i w</p>`)).toBe(
        `${html}<p>i&nbsp;w</p>`
      );
    }
  });

  test("one-letter words never end a line on any page, on a phone and on the desktop", async ({
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

  test("abbreviations keep their ending in text and nowhere else", () => {
    // Endings of any length, after a Polish capital, next to a one-letter
    // word.
    expect(bindLineBreaks("<p>CRM-y i API-ach, ŁŻ-ów</p>")).toBe(
      "<p>CRM-&#8288;y i&nbsp;API-&#8288;ach, ŁŻ-&#8288;ów</p>"
    );
    // One capital, a capital or digit after the hyphen, a plain word, a
    // spaced dash.
    const unchanged = "<p>e-mail, X-ray, B2B-owy, AI-B, CRM-2, AI - tak</p>";
    expect(bindLineBreaks(unchanged)).toBe(unchanged);
    // Attributes, comments and raw elements stay.
    const untouched = [
      '<img alt="CRM-y">',
      "<!-- CRM-y -->",
      '<script type="application/ld+json">{"a":"CRM-y"}</script>',
      "<code>CRM-y</code>",
      "<title>CRM-y</title>",
    ];
    for (const html of untouched) {
      expect(bindLineBreaks(`${html}<p>CRM-y</p>`)).toBe(
        `${html}<p>CRM-&#8288;y</p>`
      );
    }
  });

  test("abbreviations never split at their hyphen on any page", async ({
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
      const words = await abbreviationEndings(page);
      total += words.length;
      for (const word of words) {
        expect(word.joiner, `${path} @${width}: ${word.before}`).toBe(true);
        expect(word.sameLine, `${path} @${width}: ${word.before}`).toBe(true);
      }
    }
    // "CRM-y" in "Aplikacje szyte na miarę" on the home page, at least.
    expect(total).toBeGreaterThan(0);
  });

  test("llms-full.txt keeps normal spaces and hyphens", async ({ request }) => {
    const text = await (await request.get("/llms-full.txt")).text();
    expect(text).toContain("maile i zapytania");
    expect(text).toContain("CRM-y i panele");
    expect(text).not.toContain("\u00a0");
    expect(text).not.toContain("&nbsp;");
    expect(text).not.toContain("\u2060");
    expect(text).not.toContain("&#8288;");
  });
});
