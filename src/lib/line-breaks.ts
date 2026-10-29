/* Where a line of copy may not break. CSS has no rule for either, so the
 * middleware (src/middleware.ts) runs every rendered HTML page through this:
 * - Polish typesetting keeps a one-letter word (a, i, o, u, w, z) with the
 *   word after it: the space after it becomes a non-breaking one (&nbsp;).
 * - An abbreviation with a Polish ending ("CRM-y", "API-ach") stays whole:
 *   a word joiner (U+2060, &#8288;) after its hyphen. Not the non-breaking
 *   hyphen U+2011: Geist has no glyph for it, so the browser would draw a
 *   narrower hyphen from a fallback font.
 * Only text between tags changes: attributes, comments and the raw contents
 * of script, style, pre, code, textarea, svg and title stay as written. */

// One token of the page: a comment, an element whose content stays raw, a
// tag (quoted attribute values may hold ">"), a run of text, or a lone "<".
const TOKEN =
  /<!--[\s\S]*?-->|<(script|style|pre|code|textarea|svg|title)\b(?:"[^"]*"|'[^']*'|[^'">])*>[\s\S]*?<\/\1\s*>|<(?:"[^"]*"|'[^']*'|[^'">])*>|[^<]+|</gi;

// A one-letter word: at the start of the text or after a space, a
// non-breaking one, or an opening bracket or quote; followed by spaces and
// then more text.
const ONE_LETTER_WORD = /(?<=^|[\s([„"«]|&nbsp;)([aiouwz])\s+(?=\S)/gi;

// The hyphen between an abbreviation (two capitals or more) and its
// lowercase ending.
const ABBREVIATION_HYPHEN = /(?<=\p{Lu}{2})-(?=\p{Ll})/gu;

export function bindLineBreaks(html: string): string {
  return html.replace(TOKEN, (token) =>
    token.startsWith("<")
      ? token
      : token
          .replace(ONE_LETTER_WORD, "$1&nbsp;")
          .replace(ABBREVIATION_HYPHEN, "-&#8288;")
  );
}
