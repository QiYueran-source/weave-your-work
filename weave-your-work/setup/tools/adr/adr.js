#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { resolveProjectRoot } = require("./project-root.cjs");

const FIELDS = ["id", "title", "decision", "status", "supersedes", "record", "created_at"];
const STATUSES = ["proposed", "accepted", "deprecated", "superseded"];

function projectRoot(value) {
  if (value === undefined || value === null) return resolveProjectRoot({});
  return resolveProjectRoot({ project: value });
}

function operator(root) {
  const user = path.join(root, ".waymark", "user.toml");
  if (fs.existsSync(user)) {
    const match = fs.readFileSync(user, "utf8").match(/^\s*operator\s*=\s*"([^"]+)"/m);
    if (match) return match[1];
  }
  try {
    const name = execFileSync("git", ["config", "user.name"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (name) return name;
  } catch {
    // fall through to the environment
  }
  return process.env.USER || "operator";
}

function adrDir(root) {
  return path.join(root, ".work-weave", "adr");
}

function sourceFiles(root) {
  const dir = adrDir(root);
  let names;
  try {
    names = fs.readdirSync(dir);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw new Error(`Cannot read ADR directory ${dir}: ${error.message}`, { cause: error });
  }
  return names
    .filter((name) => name.endsWith(".jsonl"))
    .sort()
    .map((name) => path.join(dir, name));
}

function readSource(file) {
  const entries = [];
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    let entry;
    try {
      entry = JSON.parse(line);
    } catch (error) {
      throw new Error(`${file}:${index + 1}: ${error.message}`);
    }
    const missing = FIELDS.filter((field) => !(field in entry));
    if (missing.length) {
      throw new Error(`${file}:${index + 1}: missing ${missing.join(", ")}`);
    }
    if (!STATUSES.includes(entry.status)) {
      throw new Error(`${file}:${index + 1}: status must be one of ${STATUSES.join(", ")}`);
    }
    entry._source = path.basename(file);
    entries.push(entry);
  });
  return entries;
}

function entries(root) {
  const found = [];
  for (const file of sourceFiles(root)) found.push(...readSource(file));
  return found;
}

function find(root, id) {
  for (const entry of entries(root)) if (entry.id === id) return entry;
  return null;
}

function safeOperator(root) {
  return operator(root).replace(/[^A-Za-z0-9_-]/g, "_");
}

function identifier(root, taken) {
  const stamp = new Date().toISOString();
  // 2026-11-17T05:52:59.123Z -> 20261117T055259.123
  const base = `${safeOperator(root)}-${stamp.replace(/-/g, "").replace(/:/g, "").replace(/Z$/, "")}`;
  const used = new Set((taken || entries(root)).map((entry) => entry.id));
  if (!used.has(base)) return base;
  let suffix = 1;
  while (used.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

function writeEntry(root, fields, taken) {
  const title = (fields.title || "").trim();
  const decision = (fields.decision || "").trim();
  if (!title) throw new Error("title is empty");
  if (!decision) throw new Error("decision is empty");

  const status = fields.status || "accepted";
  if (!STATUSES.includes(status)) {
    throw new Error(`status must be one of ${STATUSES.join(", ")}`);
  }

  const supersedes = fields.supersedes || null;
  if (supersedes) {
    const known = (taken || entries(root)).find((entry) => entry.id === supersedes);
    if (!known) throw new Error(`supersedes names no known ADR: ${supersedes}`);
  }

  const entry = {
    id: identifier(root, taken),
    title,
    decision,
    status,
    supersedes,
    record: fields.record || null,
    created_at: new Date().toISOString(),
  };

  const dir = adrDir(root);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${operator(root)}.jsonl`);
  fs.appendFileSync(file, `${JSON.stringify(entry)}\n`, "utf8");
  return { entry, file };
}

function view(root, all) {
  const replacedBy = new Map();
  for (const entry of all) {
    if (entry.supersedes) replacedBy.set(entry.supersedes, entry.id);
  }

  const resolved = all.map((entry) => {
    const winner = replacedBy.get(entry.id);
    const state = winner ? "superseded" : entry.status;
    return { ...entry, state, superseded_by: winner || null };
  });

  const newestFirst = (left, right) => (left.created_at < right.created_at ? 1 : -1);
  const open = resolved
    .filter((entry) => entry.state !== "superseded")
    .sort(newestFirst);
  const replaced = resolved
    .filter((entry) => entry.state === "superseded")
    .sort(newestFirst);
  return { open, replaced };
}

function merge(root) {
  const all = entries(root);
  if (all.length === 0) {
    throw new Error(
      `No ADR sources in ${adrDir(root)}; refusing to write an empty ADR.md. Expected <operator>.jsonl.`
    );
  }

  const headerPath = path.join(adrDir(root), "_header.md");
  const header = fs.existsSync(headerPath)
    ? fs.readFileSync(headerPath, "utf8").trimEnd()
    : "# ADR\n\nThis file is generated from `.work-weave/adr/*.jsonl`. Do not edit it by hand.";

  const { open, replaced } = view(root, all);
  const lines = [header, ""];

  const section = (title, items) => {
    if (items.length === 0) return;
    lines.push(`## ${title}`, "");
    for (const entry of items) {
      lines.push(`### ${entry.title}`, "", entry.decision, "");
      const facts = [`_Source_: ${entry._source}`];
      if (entry.state === "superseded") {
        facts.push(`_Superseded by_: ${entry.superseded_by}`);
      } else if (entry.status !== "accepted") {
        facts.push(`_Status_: ${entry.status}`);
      }
      if (entry.supersedes) facts.push(`_Supersedes_: ${entry.supersedes}`);
      if (entry.record) facts.push(`_Record_: ${entry.record}`);
      facts.push(`_Decided_: ${entry.created_at}`);
      lines.push(facts.join(" · "), "");
    }
  };

  section("Accepted", open);
  section("Superseded", replaced);

  const out = path.join(root, "ADR.md");
  fs.writeFileSync(out, `${lines.join("\n").trimEnd()}\n`, "utf8");
  return out;
}

function main(argv) {
  const flags = {};
  const positional = [];
  let project = null;
  let command = null;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--project") {
      const value = argv[++index];
      if (value === undefined || value.startsWith("--")) {
        throw new Error("--project requires a directory");
      }
      project = value;
    } else if (arg === "--title") flags.title = argv[++index];
    else if (arg === "--decision") flags.decision = argv[++index];
    else if (arg === "--status") flags.status = argv[++index];
    else if (arg === "--supersedes") flags.supersedes = argv[++index];
    else if (arg === "--record") flags.record = argv[++index];
    else if (arg === "--help" || arg === "-h") {
      usage();
      return 0;
    } else if (!command) command = arg;
    else positional.push(arg);
  }

  const root = projectRoot(project);

  if (command === "list") {
    for (const entry of entries(root)) {
      const view = { ...entry };
      delete view._source;
      console.log(JSON.stringify(view));
    }
    return 0;
  }

  if (command === "show") {
    const id = positional[0] || "";
    const entry = find(root, id);
    if (!entry) {
      console.error(`not found: ${id}`);
      return 1;
    }
    const view = { ...entry };
    delete view._source;
    console.log(JSON.stringify(view, null, 2));
    return 0;
  }

  if (command === "write") {
    const { entry } = writeEntry(root, flags);
    const view = { ...entry };
    delete view._source;
    console.log(JSON.stringify(view));
    return 0;
  }

  if (command === "merge") {
    console.log(merge(root));
    return 0;
  }

  usage();
  return 2;
}

module.exports = {
  merge,
  view,
  entries,
  find,
  writeEntry,
  adrDir,
  operator,
  projectRoot,
  FIELDS,
  STATUSES,
};

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
