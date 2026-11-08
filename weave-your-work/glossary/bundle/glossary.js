#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const FIELDS = ["term", "definition", "avoid", "group", "created_at", "updated_at"];

function now() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

function projectRoot(value) {
  if (value) return path.resolve(value);
  let dir = process.cwd();
  for (;;) {
    if (fs.existsSync(path.join(dir, ".waymark", "config.toml"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return process.cwd();
    dir = parent;
  }
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

function sourceFiles(root) {
  const dir = path.join(root, "glossary");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".jsonl"))
    .sort()
    .map((name) => path.join(dir, name));
}

function readSource(file) {
  const terms = [];
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    let term;
    try {
      term = JSON.parse(line);
    } catch (error) {
      throw new Error(`${file}:${index + 1}: ${error.message}`);
    }
    const missing = FIELDS.filter((field) => !(field in term));
    if (missing.length) {
      throw new Error(`${file}:${index + 1}: missing ${missing.join(", ")}`);
    }
    terms.push(term);
  });
  return terms;
}

function merged(root) {
  const terms = new Map();
  const order = [];
  for (const file of sourceFiles(root)) {
    for (const term of readSource(file)) {
      const key = term.term;
      const record = { ...term, _source: path.basename(file) };
      if (!terms.has(key)) {
        order.push(key);
        terms.set(key, record);
      } else if (record.updated_at >= terms.get(key).updated_at) {
        terms.set(key, record);
      }
    }
  }
  return order.map((key) => terms.get(key));
}

function find(root, query) {
  const terms = merged(root);
  for (const term of terms) if (term.term === query) return term;
  for (const term of terms) if (term.term.split(" (")[0] === query) return term;
  return null;
}

function writeTerm(root, term, definition, avoid, group) {
  if (!term.trim()) throw new Error("term is empty");
  if (!definition.trim()) throw new Error("definition is empty");
  const dir = path.join(root, "glossary");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${operator(root)}.jsonl`);
  const stamp = now();
  const record = {
    term: term.trim(),
    definition: definition.trim(),
    avoid: avoid || [],
    group: (group || "").trim(),
    created_at: stamp,
    updated_at: stamp,
  };
  fs.appendFileSync(file, `${JSON.stringify(record)}\n`, "utf8");
  return record;
}

function merge(root) {
  const terms = merged(root);
  const headerPath = path.join(root, "glossary", "_header.md");
  const header = fs.existsSync(headerPath)
    ? fs.readFileSync(headerPath, "utf8").trimEnd()
    : "# Glossary\n\nThis file is generated from `glossary/*.jsonl`. Do not edit it by hand.";

  const groups = new Map();
  for (const term of terms) {
    const group = term.group || "Language";
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(term);
  }

  const lines = [header, ""];
  for (const [group, items] of groups) {
    lines.push(`## ${group}`, "");
    for (const term of items) {
      lines.push(`**${term.term}**:`, term.definition);
      if (term.avoid && term.avoid.length) {
        lines.push(`_Avoid_: ${term.avoid.join(", ")}`);
      }
      lines.push(`_Source_: ${term._source}`, "");
    }
  }

  const view = path.join(root, "GLOSSARY.md");
  fs.writeFileSync(view, `${lines.join("\n").trimEnd()}\n`, "utf8");
  return view;
}

function usage() {
  console.log("usage: glossary.js [--project DIR] <list|lookup TERM|write|merge>");
  console.log("  write --term T --definition D [--avoid A]... [--group G]");
}

function main(argv) {
  const flags = { avoid: [] };
  const positional = [];
  let project = null;
  let command = null;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--project") project = argv[++index];
    else if (arg === "--term") flags.term = argv[++index];
    else if (arg === "--definition") flags.definition = argv[++index];
    else if (arg === "--avoid") flags.avoid.push(argv[++index]);
    else if (arg === "--group") flags.group = argv[++index];
    else if (arg === "--help" || arg === "-h") {
      usage();
      return 0;
    } else if (!command) command = arg;
    else positional.push(arg);
  }

  const root = projectRoot(project);

  if (command === "list") {
    for (const term of merged(root)) console.log(JSON.stringify(term));
    return 0;
  }

  if (command === "lookup") {
    const term = find(root, positional[0] || "");
    if (!term) {
      console.error(`not found: ${positional[0] || ""}`);
      return 1;
    }
    console.log(JSON.stringify(term, null, 2));
    return 0;
  }

  if (command === "write") {
    const record = writeTerm(root, flags.term || "", flags.definition || "", flags.avoid, flags.group);
    console.log(JSON.stringify(record));
    return 0;
  }

  if (command === "merge") {
    console.log(merge(root));
    return 0;
  }

  usage();
  return 2;
}

module.exports = { merged, find, writeTerm, merge, operator, projectRoot };

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
