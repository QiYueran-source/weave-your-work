#!/usr/bin/env node
"use strict";

const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");
const adr = require("./adr-core.js");

const argv = process.argv.slice(2);
const projectFlag = argv.indexOf("--project");
let project = process.env.ADR_PROJECT;
if (projectFlag >= 0) {
  project = argv[projectFlag + 1];
  if (project === undefined || project.startsWith("--")) {
    console.error("--project requires a directory");
    process.exit(1);
  }
}

let root;
try {
  root = adr.projectRoot(project);
  adr.adrDir(root);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const server = new McpServer({ name: "adr", version: "1.0.0" });

function text(value) {
  return {
    content: [
      {
        type: "text",
        text: typeof value === "string" ? value : JSON.stringify(value, null, 2),
      },
    ],
  };
}

function published(entry) {
  const shown = { ...entry };
  delete shown._source;
  return shown;
}

server.registerTool(
  "adr_list",
  {
    description: "List every ADR across every operator's source.",
    inputSchema: {},
  },
  async () => text(adr.entries(root).map(published))
);

server.registerTool(
  "adr_show",
  {
    description: "Read one ADR by its id.",
    inputSchema: {
      id: z.string().describe("The ADR id, for example frank-20261117T055259.123."),
    },
  },
  async ({ id }) => {
    const entry = adr.find(root, id);
    if (!entry) {
      return { content: [{ type: "text", text: `not found: ${id}` }], isError: true };
    }
    return text(published(entry));
  }
);

server.registerTool(
  "adr_write",
  {
    description: "Append one ADR to the current operator's own source file.",
    inputSchema: {
      title: z.string().describe("One line naming the decision."),
      decision: z.string().describe("What was decided and why."),
      status: z
        .enum(["proposed", "accepted", "deprecated", "superseded"])
        .optional()
        .describe("Defaults to accepted."),
      supersedes: z
        .string()
        .optional()
        .describe("The id of the ADR this one replaces."),
      record: z
        .string()
        .optional()
        .describe("The waymark id of the record that owns the decision."),
    },
  },
  async ({ title, decision, status, supersedes, record }) =>
    text(published(adr.writeEntry(root, { title, decision, status, supersedes, record }).entry))
);

server.registerTool(
  "adr_merge",
  {
    description: "Regenerate ADR.md from every ADR source.",
    inputSchema: {},
  },
  async () => text(adr.merge(root))
);

server
  .connect(new StdioServerTransport())
  .then(() => console.error(`adr MCP server ready at ${root}`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
