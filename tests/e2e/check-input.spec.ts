import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import ts from "typescript";

// `astro check` checks the root file names of tsconfig.json, parsed with
// .astro as an extra extension (AstroCheck in @astrojs/language-server). An
// e2e run writes folders into the tree that hold minified JS: the HTML report
// with its bundled trace viewer (CI, after a retry), test output, the build
// without case studies. Read by check, each one floods it with diagnostics.

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const GENERATED = ["playwright-report", "test-results", "dist-no-case-studies"];

const checkedFiles = (): string[] => {
  const configPath = join(ROOT, "tsconfig.json");
  const config = ts.parseJsonSourceFileConfigFileContent(
    ts.readJsonConfigFile(configPath, ts.sys.readFile),
    ts.sys,
    ROOT,
    undefined,
    configPath,
    undefined,
    [
      {
        extension: ".astro",
        isMixedContent: true,
        scriptKind: ts.ScriptKind.Deferred,
      },
    ]
  );
  return config.fileNames;
};

test("astro check reads none of the folders an e2e run writes", () => {
  const probeDirs = GENERATED.map((folder) =>
    join(ROOT, folder, `check-input-probe-${process.pid}`)
  );
  try {
    for (const dir of probeDirs) {
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, "probe.ts"), "export const n: number = '';\n");
    }
    const files = checkedFiles();

    // The project's own files stay in, so a path format the list does not
    // hold cannot pass the check below.
    expect(files).toContain(join(ROOT, "src/lib/seo.ts"));
    expect(files).toContain(join(ROOT, "src/layouts/base-layout.astro"));
    expect(files).toContain(join(ROOT, "playwright.config.ts"));

    const generated = files.filter((file) =>
      probeDirs.some((dir) => file.startsWith(dir))
    );
    expect(generated).toEqual([]);
  } finally {
    for (const dir of probeDirs) {
      rmSync(dir, { force: true, recursive: true });
    }
  }
});
