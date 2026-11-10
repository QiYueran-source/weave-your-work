#!/usr/bin/env node
// Run every bundle test from one command. The file list is built here
// rather than by the shell so the same script works on Windows.
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const directories = [
  "weave-your-work/setup/bundle/tools",
  "weave-your-work/glossary/bundle/tools/tests",
  "weave-your-work/issue/bundle/tools/tests",
];

const files = [];
for (const directory of directories) {
  for (const name of readdirSync(join(root, directory))) {
    if (/\.test\.(?:cjs|mjs)$/.test(name) || /^test-.*\.mjs$/.test(name)) {
      files.push(join(root, directory, name));
    }
  }
}
files.sort();

const result = spawnSync(process.execPath, ["--test", ...files], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);
