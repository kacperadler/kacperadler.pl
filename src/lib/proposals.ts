import { z } from "astro/zod";

/* Design proposals - one folder each in src/styles/proposals/<id>/:
 *   - proposal.css: overrides scoped under [data-proposal="<id>"] (the
 *     attribute sits on <html> of the proposal page), fonts next to it as
 *     self-hosted woff2 with their license, linked by relative url()
 *   - meta.json: name, one-line description, references
 * The folder name is the id and the URL: /ui/proposal/<id>. Only the dev
 * pages under src/pages/_ui/proposal/ load proposals, so none reaches the
 * production build. */

const metaSchema = z.strictObject({
  description: z
    .string()
    .trim()
    .min(1)
    .regex(/^[^\n]+$/, "the description is one line"),
  name: z.string().trim().min(1),
  references: z.array(
    z.strictObject({
      label: z.string().trim().min(1),
      url: z.url({ protocol: /^https?$/ }),
    })
  ),
});

export type ProposalMeta = z.infer<typeof metaSchema>;

export interface Proposal extends ProposalMeta {
  /** The proposal's CSS with its url()s resolved, ready to inline. */
  css: string;
  id: string;
}

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FILE =
  /^\/src\/styles\/proposals\/([^/]+)\/(?:meta\.json|proposal\.css)$/;

const idOf = (path: string): string => {
  const id = FILE.exec(path)?.[1];
  if (id === undefined) {
    throw new Error(`Proposal file "${path}" is not in its own folder.`);
  }
  if (!ID.test(id)) {
    throw new Error(
      `Proposal folder "${id}" has to be a lowercase slug (a-z, 0-9, -): it is the URL and the [data-proposal] scope.`
    );
  }
  return id;
};

/* Pairs each folder's meta.json with its proposal.css, both keyed by the
 * file path the glob returns. A folder missing one of the two, or a
 * meta.json off the schema, fails the dev page with the folder named. */
export function parseProposals(
  metas: Record<string, unknown>,
  styles: Record<string, string>
): Proposal[] {
  const css = new Map(
    Object.entries(styles).map(([path, text]) => [idOf(path), text])
  );
  const proposals = Object.entries(metas).map(([path, raw]) => {
    const id = idOf(path);
    const text = css.get(id);
    if (text === undefined) {
      throw new Error(`Proposal "${id}" has no proposal.css.`);
    }
    css.delete(id);
    const meta = metaSchema.safeParse(raw);
    if (!meta.success) {
      throw new Error(
        `Proposal "${id}" has an invalid meta.json: ${z.prettifyError(meta.error)}`
      );
    }
    return { ...meta.data, css: text, id };
  });
  const orphan = css.keys().next();
  if (!orphan.done) {
    throw new Error(`Proposal "${orphan.value}" has no meta.json.`);
  }
  return proposals.sort((a, b) => a.id.localeCompare(b.id));
}

/* Every proposal folder, sorted by id. The globs only run where this is
 * called (the dev pages); ?inline gives the CSS as a string with its url()s
 * rewritten to files Vite serves. */
export const loadProposals = (): Proposal[] =>
  parseProposals(
    import.meta.glob("/src/styles/proposals/*/meta.json", {
      eager: true,
      import: "default",
    }),
    import.meta.glob<string>("/src/styles/proposals/*/proposal.css", {
      eager: true,
      import: "default",
      query: "?inline",
    })
  );
