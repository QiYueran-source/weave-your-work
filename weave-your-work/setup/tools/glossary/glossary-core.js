#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { resolveProjectRoot } = require("./project-root.cjs");

const FIELDS = ["term", "definition", "avoid", "group", "created_at", "updated_at"];
const DEFAULT_GROUP = "Language";

function now() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

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

function glossaryDir(root) {
  const dir = path.join(root, ".work-weave", "glossary");
  let stat;
  try {
    stat = fs.statSync(dir);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(
        `Glossary directory not found: ${dir}. Run the glossary setup for this project.`,
        { cause: error }
      );
    }
    throw new Error(`Cannot read glossary directory ${dir}: ${error.message}`, { cause: error });
  }
  if (!stat.isDirectory()) {
    throw new Error(`Glossary path is not a directory: ${dir}`);
  }
  return dir;
}

function sourceFiles(root) {
  const dir = glossaryDir(root);
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
    const missing = FIELDS.filter((field) => field !== "group" && !(field in term));
    if (missing.length) {
      throw new Error(`${file}:${index + 1}: missing ${missing.join(", ")}`);
    }
    if ("group" in term && typeof term.group !== "string") {
      throw new Error(`${file}:${index + 1}: group must be a string`);
    }
    term.group = term.group ?? "";
    terms.push(term);
  });
  return terms;
}

function merged(root) {
  const files = sourceFiles(root);
  if (files.length === 0) {
    throw new Error(`No glossary sources in ${glossaryDir(root)}; expected <operator>.jsonl.`);
  }
  const terms = new Map();
  const order = [];
  for (const file of files) {
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
  if (terms.size === 0) {
    throw new Error(`No glossary terms in ${glossaryDir(root)}; refusing to report an empty glossary.`);
  }
  return order.map((key) => terms.get(key));
}

function writeTerm(root, term, definition, avoid, group) {
  if (!term.trim()) throw new Error("term is empty");
  if (!definition.trim()) throw new Error("definition is empty");
  const dir = glossaryDir(root);
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
  const headerPath = path.join(glossaryDir(root), "_header.md");
  const header = fs.existsSync(headerPath)
    ? fs.readFileSync(headerPath, "utf8").trimEnd()
    : "# Glossary\n\nThis file is generated from `.work-weave/glossary/*.jsonl`. Do not edit it by hand.";

  const groups = new Map();
  for (const term of terms) {
    const group = term.group || DEFAULT_GROUP;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(term);
  }

  const lines = [header, ""];
  for (const [group, items] of groups) {
    items.sort((left, right) => (left.updated_at < right.updated_at ? 1 : -1));
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

module.exports = {
  FIELDS,
  DEFAULT_GROUP,
  now,
  projectRoot,
  operator,
  glossaryDir,
  sourceFiles,
  readSource,
  merged,
  writeTerm,
  merge,
};
