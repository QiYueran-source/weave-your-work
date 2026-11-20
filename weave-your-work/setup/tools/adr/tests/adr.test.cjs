"use strict";

const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");

const toolsDir = path.join(__dirname, "..");
const cli = path.join(toolsDir, "adr.js");
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

function project(t, operatorName) {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), "weave-adr-"));
  t.after(() => fs.rmSync(parent, { recursive: true, force: true }));
  const root = path.join(parent, "project");
  fs.mkdirSync(path.join(root, ".waymark"), { recursive: true });
  fs.mkdirSync(path.join(root, ".work-weave"), { recursive: true });
  fs.writeFileSync(path.join(root, ".waymark", "config.toml"), 'version = "1.0"\nstorage_root = "tickets"\n');
  fs.writeFileSync(
    path.join(root, ".waymark", "user.toml"),
    `operator = "${operatorName}"\ntimezone = "Asia/Shanghai"\n`
  );
  git(root, "init", "-q", ".");
  return root;
}

function run(cwd, ...args) {
  return execFileSync(process.execPath, [cli, "--project", cwd, ...args], {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function runFails(cwd, ...args) {
  try {
    run(cwd, ...args);
  } catch (error) {
    return error.stderr || "";
  }
  throw new Error(`expected a failure from: ${args.join(" ")}`);
}

function lines(root, name) {
  const file = path.join(root, ".work-weave", "shared", "adr", `${name}.jsonl`);
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line));
}

function view(root) {
  return fs.readFileSync(path.join(root, "ADR.md"), "utf8");
}

test("a write lands in the operator's own source file and nowhere else", (t) => {
  const root = project(t, "frank");
  run(root, "write", "--title", "Supplier A", "--decision", "A has failover.");

  const [entry] = lines(root, "frank");
  assert.equal(entry.title, "Supplier A");
  assert.equal(entry.decision, "A has failover.");
  assert.equal(entry.status, "accepted");
  assert.equal(entry.supersedes, null);
  assert.equal(entry.record, null);

  const sources = fs.readdirSync(path.join(root, ".work-weave", "shared", "adr"));
  assert.deepEqual(sources, ["frank.jsonl"]);
});

test("the id carries the operator and a millisecond timestamp", (t) => {
  const root = project(t, "frank");
  run(root, "write", "--title", "T", "--decision", "D.");

  const [entry] = lines(root, "frank");
  assert.match(entry.id, /^frank-\d{8}T\d{6}\.\d{3}$/);
  assert.match(entry.created_at, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
});

test("two writes in the same second get two identifiers", (t) => {
  const root = project(t, "frank");
  run(root, "write", "--title", "First", "--decision", "One.");
  run(root, "write", "--title", "Second", "--decision", "Two.");

  const entries = lines(root, "frank");
  assert.equal(entries.length, 2);
  assert.notEqual(entries[0].id, entries[1].id);
});

test("two operators writing at the same moment get two identifiers", (t) => {
  const root = project(t, "frank");
  run(root, "write", "--title", "First", "--decision", "One.");

  const other = project(t, "bob");
  run(other, "write", "--title", "Second", "--decision", "Two.");

  const [frankEntry] = lines(root, "frank");
  const [bobEntry] = lines(other, "bob");
  assert.notEqual(frankEntry.id, bobEntry.id);
  assert.match(frankEntry.id, /^frank-/);
  assert.match(bobEntry.id, /^bob-/);
});

test("a write refuses an empty title or decision", (t) => {
  const root = project(t, "frank");
  assert.match(runFails(root, "write", "--title", "", "--decision", "D."), /title is empty/);
  assert.match(runFails(root, "write", "--title", "T", "--decision", ""), /decision is empty/);
});

test("list and show read every source", (t) => {
  const root = project(t, "frank");
  run(root, "write", "--title", "Mine", "--decision", "One.");
  fs.writeFileSync(
    path.join(root, ".work-weave", "shared", "adr", "bob.jsonl"),
    `${JSON.stringify({
      id: "bob-20260101T000000000",
      title: "Theirs",
      decision: "Two.",
      status: "accepted",
      supersedes: null,
      record: null,
      created_at: "2026-01-01T00:00:00.000Z",
    })}\n`
  );

  const listed = run(root, "list")
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line));
  assert.deepEqual(
    listed.map((entry) => entry.title).sort(),
    ["Mine", "Theirs"]
  );

  const shown = JSON.parse(run(root, "show", "bob-20260101T000000000"));
  assert.equal(shown.title, "Theirs");
  assert.equal(shown._source, undefined);
});

test("show fails for an unknown id", (t) => {
  const root = project(t, "frank");
  run(root, "write", "--title", "T", "--decision", "D.");
  assert.match(runFails(root, "show", "nope"), /not found: nope/);
});

test("a merge renders every source entry once", (t) => {
  const root = project(t, "frank");
  run(root, "write", "--title", "First", "--decision", "One.");
  run(root, "write", "--title", "Second", "--decision", "Two.");

  run(root, "merge");
  const text = view(root);
  assert.equal((text.match(/### First/g) || []).length, 1);
  assert.equal((text.match(/### Second/g) || []).length, 1);
  assert.match(text, /_Source_: frank\.jsonl/);
});

test("the view lists accepted newest first, then superseded", (t) => {
  const root = project(t, "frank");
  run(root, "write", "--title", "Older", "--decision", "One.");
  const [older] = lines(root, "frank");
  run(root, "write", "--title", "Newer", "--decision", "Two.", "--supersedes", older.id);

  run(root, "merge");
  const text = view(root);
  const accepted = text.indexOf("## Accepted");
  const superseded = text.indexOf("## Superseded");
  assert.ok(accepted >= 0 && superseded > accepted);
  assert.ok(text.indexOf("### Newer") < text.indexOf("### Older"));
  assert.match(text, /_Superseded by_: frank-\d{8}T\d{6}\.\d{3}/);
});

test("superseding never edits the replaced operator's source", (t) => {
  const root = project(t, "frank");
  run(root, "write", "--title", "Original", "--decision", "One.");
  const before = fs.readFileSync(path.join(root, ".work-weave", "shared", "adr", "frank.jsonl"), "utf8");

  fs.writeFileSync(
    path.join(root, ".waymark", "user.toml"),
    'operator = "bob"\ntimezone = "Asia/Shanghai"\n'
  );
  const [original] = lines(root, "frank");
  run(root, "write", "--title", "Replacement", "--decision", "Two.", "--supersedes", original.id);

  const after = fs.readFileSync(path.join(root, ".work-weave", "shared", "adr", "frank.jsonl"), "utf8");
  assert.equal(after, before);

  run(root, "merge");
  assert.match(view(root), /_Superseded by_: bob-\d{8}T\d{6}\.\d{3}/);
});

test("a supersede whose target is unknown is refused", (t) => {
  const root = project(t, "frank");
  assert.match(
    runFails(root, "write", "--title", "T", "--decision", "D.", "--supersedes", "nope"),
    /supersedes names no known ADR/
  );
});

test("two entries describing the same decision both survive a merge", (t) => {
  const root = project(t, "frank");
  run(root, "write", "--title", "Pick supplier A", "--decision", "A is cheaper.");
  fs.writeFileSync(
    path.join(root, ".work-weave", "shared", "adr", "bob.jsonl"),
    `${JSON.stringify({
      id: "bob-20260101T000000000",
      title: "Choose supplier A",
      decision: "A is faster.",
      status: "accepted",
      supersedes: null,
      record: null,
      created_at: "2026-01-01T00:00:00.000Z",
    })}\n`
  );

  run(root, "merge");
  const text = view(root);
  assert.match(text, /### Pick supplier A/);
  assert.match(text, /### Choose supplier A/);
});

test("an empty source directory fails instead of writing an empty view", (t) => {
  const root = project(t, "frank");
  const message = runFails(root, "merge");
  assert.match(message, /No ADR sources/);
  assert.equal(fs.existsSync(path.join(root, "ADR.md")), false);
});

test("a hand edit to the view is overwritten by the next merge", (t) => {
  const root = project(t, "frank");
  run(root, "write", "--title", "Kept", "--decision", "One.");
  run(root, "merge");
  fs.appendFileSync(path.join(root, "ADR.md"), "\n### Hand written\n\nNot a decision.\n");

  run(root, "merge");
  assert.doesNotMatch(view(root), /Hand written/);
});

test("the view records the source file and the owning record", (t) => {
  const root = project(t, "frank");
  run(
    root,
    "write",
    "--title",
    "With a record",
    "--decision",
    "Because the spec asked.",
    "--record",
    "wm-ms5r0fftcva8"
  );

  run(root, "merge");
  assert.match(view(root), /_Record_: wm-ms5r0fftcva8/);
});
