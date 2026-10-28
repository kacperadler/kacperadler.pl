import { defineMiddleware } from "astro:middleware";
import { bindOneLetterWords } from "@/lib/one-letter-words";

/* Every HTML page passes through bindOneLetterWords, prerendered ones at
 * build time. Other responses (llms-full.txt, the OG image, /api/lead) go
 * out as they are, so the text files keep normal spaces. */
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!response.headers.get("content-type")?.startsWith("text/html")) {
    return response;
  }
  return new Response(bindOneLetterWords(await response.text()), response);
});
