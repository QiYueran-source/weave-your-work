#!/usr/bin/env node
"use strict";

const glossary = require("./glossary-core.js");

function usage() {
  console.log("usage: glossary.js [--project DIR] <list|write|merge>");
  console.log("  write --term T --definition D [--avoid A]... [--group G]");
}

function main(argv) {
  const flags = { avoid: [] };
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
    } else if (arg === "--term") flags.term = argv[++index];
    else if (arg === "--definition") flags.definition = argv[++index];
    else if (arg === "--avoid") flags.avoid.push(argv[++index]);
    else if (arg === "--group") flags.group = argv[++index];
    else if (arg === "--help" || arg === "-h") {
      usage();
      return 0;
    } else if (!command) command = arg;
    else positional.push(arg);
  }

  const root = glossary.projectRoot(project);

  if (command === "list") {
    for (const term of glossary.merged(root)) console.log(JSON.stringify(term));
    return 0;
  }

  if (command === "write") {
    const record = glossary.writeTerm(
      root,
      flags.term || "",
      flags.definition || "",
      flags.avoid,
      flags.group
    );
    console.log(JSON.stringify(record));
    return 0;
  }

  if (command === "merge") {
    console.log(glossary.merge(root));
    return 0;
  }

  usage();
  return 2;
}

module.exports = { main };

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
