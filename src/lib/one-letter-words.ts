/* Polish typesetting keeps a one-letter word (a, i, o, u, w, z) with the word
 * after it: none may end a line. CSS has no rule for it, so the middleware
 * (src/middleware.ts) runs every rendered HTML page through this and the
 * space after such a word becomes a non-breaking one (&nbsp;). Only text
 * between tags changes: attributes, comments and the raw contents of
 * script, style, pre, code, textarea, svg and title stay as written. */

// One token of the page: a comment, an element whose content stays raw, a
// tag (quoted attribute values may hold ">"), a run of text, or a lone "<".
const TOKEN =
  /<!--[\s\S]*?-->|<(script|style|pre|code|textarea|svg|title)\b(?:"[^"]*"|'[^']*'|[^'">])*>[\s\S]*?<\/\1\s*>|<(?:"[^"]*"|'[^']*'|[^'">])*>|[^<]+|</gi;

// A one-letter word: at the start of the text or after a space, a
// non-breaking one, or an opening bracket or quote; followed by spaces and
// then more text.
const ONE_LETTER_WORD = /(?<=^|[\s([„"«]|&nbsp;)([aiouwz])\s+(?=\S)/gi;

export function bindOneLetterWords(html: string): string {
  return html.replace(TOKEN, (token) =>
    token.startsWith("<") ? token : token.replace(ONE_LETTER_WORD, "$1&nbsp;")
  );
}
