import { defineMiddleware } from "astro:middleware";
import { bindLineBreaks } from "@/lib/line-breaks";

/* Every HTML page passes through bindLineBreaks, prerendered ones at build
 * time. Other responses (llms-full.txt, the OG image, /api/lead) go out as
 * they are, so the text files keep normal spaces and hyphens. */
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!response.headers.get("content-type")?.startsWith("text/html")) {
    return response;
  }
  return new Response(bindLineBreaks(await response.text()), response);
});
