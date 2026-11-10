"use strict";

const assert = require("node:assert/strict");
const { execFileSync, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");
const glossary = require("../glossary.js");

const toolsDir = path.join(__dirname, "..");
const cli = path.join(toolsDir, "glossary.js");
const gitEnv = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => !key.toUpperCase().startsWith("GIT_"))
);

function git(cwd, ...args) {
  return execFileSync("git", args, {
    cwd,
    env: gitEnv,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function temporaryRoot(t) {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), "weave-glossary-"));
  t.after(() => fs.rmSync(parent, { recursive: true, force: true }));
  return path.join(parent, "project");
}

function project(t, { operator = "tester", glossary: withGlossary = false } = {}) {
  const root = temporaryRoot(t);
  fs.mkdirSync(root, { recursive: true });
  git(root, "init", "-q");
  fs.mkdirSync(path.join(root, ".work-weave"));
  fs.mkdirSync(path.join(root, ".waymark"));
  fs.writeFileSync(path.join(root, ".waymark", "config.toml"), "");
  fs.writeFileSync(path.join(root, ".waymark", "user.toml"), `operator = "${operator}"\n`);
  if (withGlossary) fs.mkdirSync(path.join(root, ".work-weave", "glossary"));
  return root;
}

function record(name, definition = `${name} definition.`) {
  return {
    term: name,
    definition,
    avoid: [],
    group: "",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  };
}

function sourcePath(root, operator) {
  return path.join(root, ".work-weave", "glossary", `${operator}.jsonl`);
}

function writeSource(root, operator, records) {
  fs.mkdirSync(path.join(root, ".work-weave", "glossary"), { recursive: true });
  fs.writeFileSync(
    sourcePath(root, operator),
    records.map((item) => JSON.stringify(item)).join("\n") + "\n",
    "utf8"
  );
}

function runCli(cwd, ...args) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd,
    env: gitEnv,
    encoding: "utf8",
  });
}

test("two roots keep separate vocabularies and views", (t) => {
  const first = project(t, { operator: "alice", glossary: true });
  const second = project(t, { operator: "bob", glossary: true });
  writeSource(first, "alice", [record("alpha", "The first project's word.")]);
  writeSource(second, "bob", [record("beta", "The second project's word.")]);

  assert.deepEqual(glossary.merged(first).map((item) => item.term), ["alpha"]);
  assert.deepEqual(glossary.merged(second).map((item) => item.term), ["beta"]);

  const firstList = runCli(first, "--project", first, "list");
  assert.equal(firstList.status, 0, firstList.stderr);
  assert.match(firstList.stdout, /"alpha"/);
  assert.doesNotMatch(firstList.stdout, /"beta"/);

  const secondList = runCli(second, "--project", second, "list");
  assert.equal(secondList.status, 0, secondList.stderr);
  assert.match(secondList.stdout, /"beta"/);
  assert.doesNotMatch(secondList.stdout, /"alpha"/);

  const firstView = runCli(first, "--project", first, "merge");
  assert.equal(firstView.status, 0, firstView.stderr);
  const secondView = runCli(second, "--project", second, "merge");
  assert.equal(secondView.status, 0, secondView.stderr);

  const firstText = fs.readFileSync(path.join(first, "GLOSSARY.md"), "utf8");
  const secondText = fs.readFileSync(path.join(second, "GLOSSARY.md"), "utf8");
  assert.match(firstText, /\*\*alpha\*\*/);
  assert.doesNotMatch(firstText, /\*\*beta\*\*/);
  assert.match(secondText, /\*\*beta\*\*/);
  assert.doesNotMatch(secondText, /\*\*alpha\*\*/);
});

test("a write in one root does not appear in another", (t) => {
  const first = project(t, { operator: "alice", glossary: true });
  const second = project(t, { operator: "bob", glossary: true });
  writeSource(first, "alice", [record("alpha")]);
  writeSource(second, "bob", [record("beta")]);

  glossary.writeTerm(first, "gamma", "Only the first project has this.");
  const lines = fs
    .readFileSync(sourcePath(first, "alice"), "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
  assert.equal(lines.at(-1).term, "gamma");

  const written = runCli(first, "--project", first, "write", "--term", "delta", "--definition", "A delta.");
  assert.equal(written.status, 0, written.stderr);
  assert.match(written.stdout, /"term":"delta"/);

  assert.ok(!fs.existsSync(sourcePath(second, "alice")));
  assert.deepEqual(glossary.merged(second).map((item) => item.term), ["beta"]);
  assert.ok(!fs.existsSync(path.join(first, "glossary")));
  assert.equal(glossary.merge(first), path.join(first, "GLOSSARY.md"));
  assert.match(fs.readFileSync(path.join(first, "GLOSSARY.md"), "utf8"), /\*\*delta\*\*/);
});

test("resolves an explicit root and discovers the nearest one from a subdirectory", (t) => {
  const first = project(t, { operator: "alice", glossary: true });
  const second = project(t, { operator: "bob", glossary: true });
  writeSource(first, "alice", [record("alpha")]);
  writeSource(second, "bob", [record("beta")]);
  const nested = path.join(first, "nested", "deeper");
  fs.mkdirSync(nested, { recursive: true });

  assert.equal(glossary.projectRoot(first), fs.realpathSync(first));

  const discovered = runCli(nested, "list");
  assert.equal(discovered.status, 0, discovered.stderr);
  assert.match(discovered.stdout, /"alpha"/);
  assert.doesNotMatch(discovered.stdout, /"beta"/);

  const explicit = runCli(nested, "--project", second, "list");
  assert.equal(explicit.status, 0, explicit.stderr);
  assert.match(explicit.stdout, /"beta"/);
  assert.doesNotMatch(explicit.stdout, /"alpha"/);

  const nestedAsProject = runCli(first, "--project", nested, "list");
  assert.notEqual(nestedAsProject.status, 0);
  assert.match(nestedAsProject.stderr, /\.work-weave/);
});

test("--project without a directory fails instead of discovering", (t) => {
  const root = project(t, { operator: "alice", glossary: true });
  const result = runCli(root, "--project");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--project requires a directory/);
});

test("a missing .work-weave marker fails without creating a view", (t) => {
  const root = project(t, { operator: "alice" });
  fs.rmSync(path.join(root, ".work-weave"), { recursive: true });

  assert.throws(() => glossary.projectRoot(root), /\.work-weave/);

  const result = runCli(root, "--project", root, "merge");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /\.work-weave/);
  assert.ok(!fs.existsSync(path.join(root, "GLOSSARY.md")));
});

test("a missing glossary directory fails and never creates or overwrites the view", (t) => {
  const root = project(t, { operator: "alice" });
  assert.throws(() => glossary.merged(root), /glossary/i);
  assert.throws(() => glossary.writeTerm(root, "alpha", "A term."), /glossary/i);
  assert.ok(!fs.existsSync(path.join(root, ".work-weave", "glossary")));

  for (const command of ["list", "merge"]) {
    const result = runCli(root, "--project", root, command);
    assert.notEqual(result.status, 0, command);
    assert.match(result.stderr, /glossary/i);
  }
  const write = runCli(root, "--project", root, "write", "--term", "alpha", "--definition", "A term.");
  assert.notEqual(write.status, 0);
  assert.match(write.stderr, /glossary/i);
  assert.ok(!fs.existsSync(path.join(root, ".work-weave", "glossary")));
  assert.ok(!fs.existsSync(path.join(root, "GLOSSARY.md")));

  const view = path.join(root, "GLOSSARY.md");
  fs.writeFileSync(view, "handwritten view\n", "utf8");
  const again = runCli(root, "--project", root, "merge");
  assert.notEqual(again.status, 0);
  assert.equal(fs.readFileSync(view, "utf8"), "handwritten view\n");

  fs.writeFileSync(path.join(root, ".work-weave", "glossary"), "not a directory\n", "utf8");
  const invalid = runCli(root, "--project", root, "list");
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stderr, /glossary/i);
  assert.equal(fs.readFileSync(view, "utf8"), "handwritten view\n");
});

test("reads the header from .work-weave/glossary and ignores the old root glossary", (t) => {
  const root = project(t, { operator: "alice", glossary: true });
  writeSource(root, "alice", [record("alpha", "A term from the project sources.")]);
  fs.writeFileSync(
    path.join(root, ".work-weave", "glossary", "_header.md"),
    "# Project header\n\nGenerated from the project's own sources.\n",
    "utf8"
  );
  fs.mkdirSync(path.join(root, "glossary"));
  fs.writeFileSync(path.join(root, "glossary", "_header.md"), "# Old header\n", "utf8");
  fs.writeFileSync(
    path.join(root, "glossary", "old.jsonl"),
    JSON.stringify(record("obsolete")) + "\n",
    "utf8"
  );

  const view = glossary.merge(root);
  const text = fs.readFileSync(view, "utf8");
  assert.match(text, /# Project header/);
  assert.match(text, /Generated from the project's own sources\./);
  assert.doesNotMatch(text, /Old header/);
  assert.doesNotMatch(text, /obsolete/);
  assert.match(text, /\*\*alpha\*\*/);
});

test("writes the generated view only at the project root", (t) => {
  const root = project(t, { operator: "alice", glossary: true });
  writeSource(root, "alice", [record("alpha")]);

  const view = glossary.merge(root);
  assert.equal(view, path.join(root, "GLOSSARY.md"));
  assert.ok(fs.statSync(view).isFile());
  assert.ok(!fs.existsSync(path.join(root, ".work-weave", "glossary", "GLOSSARY.md")));
  assert.ok(!fs.existsSync(path.join(root, ".work-weave", "GLOSSARY.md")));
  assert.ok(!fs.existsSync(path.join(root, "glossary")));
});

test("refuses to report an empty glossary as success", (t) => {
  const root = project(t, { operator: "alice", glossary: true });

  for (const command of ["list", "merge"]) {
    const result = runCli(root, "--project", root, command);
    assert.notEqual(result.status, 0, command);
    assert.match(result.stderr, /no glossary/i);
  }
  assert.ok(!fs.existsSync(path.join(root, "GLOSSARY.md")));

  fs.writeFileSync(sourcePath(root, "alice"), "\n", "utf8");
  const emptySource = runCli(root, "--project", root, "merge");
  assert.notEqual(emptySource.status, 0);
  assert.match(emptySource.stderr, /no glossary terms/i);
  assert.ok(!fs.existsSync(path.join(root, "GLOSSARY.md")));
});

test("runs from a type=module project runtime", (t) => {
  const root = project(t, { operator: "alice", glossary: true });
  writeSource(root, "alice", [record("alpha")]);
  fs.writeFileSync(path.join(root, "package.json"), '{"type":"module"}\n', "utf8");

  const runtime = path.join(root, ".work-weave", "runtime", "glossary");
  fs.mkdirSync(runtime, { recursive: true });
  for (const file of ["glossary.js", "project-root.cjs", "package.json"]) {
    fs.copyFileSync(path.join(toolsDir, file), path.join(runtime, file));
  }

  const result = spawnSync(process.execPath, [path.join(runtime, "glossary.js"), "--project", root, "merge"], {
    cwd: root,
    env: gitEnv,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.ok(fs.existsSync(path.join(root, "GLOSSARY.md")));
});
