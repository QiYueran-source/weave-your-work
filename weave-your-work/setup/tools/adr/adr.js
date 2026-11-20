#!/usr/bin/env node
"use strict";

const adr = require("./adr-core.js");

function usage() {
  console.log("usage: adr.js [--project DIR] <list|show ID|write|merge>");
  console.log("  write --title T --decision D [--status S] [--supersedes ID] [--record WMID]");
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

  const root = adr.projectRoot(project);

  if (command === "list") {
    for (const entry of adr.entries(root)) {
      const shown = { ...entry };
      delete shown._source;
      console.log(JSON.stringify(shown));
    }
    return 0;
  }

  if (command === "show") {
    const id = positional[0] || "";
    const entry = adr.find(root, id);
    if (!entry) {
      console.error(`not found: ${id}`);
      return 1;
    }
    const shown = { ...entry };
    delete shown._source;
    console.log(JSON.stringify(shown, null, 2));
    return 0;
  }

  if (command === "write") {
    const { entry } = adr.writeEntry(root, flags);
    const shown = { ...entry };
    delete shown._source;
    console.log(JSON.stringify(shown));
    return 0;
  }

  if (command === "merge") {
    console.log(adr.merge(root));
    return 0;
  }

  usage();
  return 2;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { main };
