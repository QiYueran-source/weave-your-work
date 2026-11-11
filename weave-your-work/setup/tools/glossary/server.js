#!/usr/bin/env node
"use strict";

const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");
const glossary = require("./glossary.js");

const argv = process.argv.slice(2);
const projectFlag = argv.indexOf("--project");
let project = process.env.GLOSSARY_PROJECT;
if (projectFlag >= 0) {
  project = argv[projectFlag + 1];
  if (project === undefined || project.startsWith("--")) {
    console.error("--project requires a directory");
    process.exit(1);
  }
}
let root;
try {
  root = glossary.projectRoot(project);
  glossary.glossaryDir(root);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const server = new McpServer({ name: "glossary", version: "1.0.0" });

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

server.registerTool(
  "glossary_lookup",
  {
    description: "Look up one term in the project glossary.",
    inputSchema: {
      term: z.string().describe("The term, or the part before a parenthetical note."),
    },
  },
  async ({ term }) => {
    const found = glossary.find(root, term);
    if (!found) {
      return { content: [{ type: "text", text: `not found: ${term}` }], isError: true };
    }
    return text(found);
  }
);

server.registerTool(
  "glossary_list",
  {
    description: "List every merged term in the project glossary.",
    inputSchema: {},
  },
  async () => text(glossary.merged(root))
);

server.registerTool(
  "glossary_write",
  {
    description: "Append one term to the current operator's glossary source.",
    inputSchema: {
      term: z.string(),
      definition: z.string(),
      avoid: z.array(z.string()).optional().describe("Words to avoid for this term."),
      group: z.string().optional(),
    },
  },
  async ({ term, definition, avoid, group }) =>
    text(glossary.writeTerm(root, term, definition, avoid || [], group || ""))
);

server.registerTool(
  "glossary_merge",
  {
    description: "Regenerate GLOSSARY.md from every glossary source.",
    inputSchema: {},
  },
  async () => text(glossary.merge(root))
);

server
  .connect(new StdioServerTransport())
  .then(() => console.error(`glossary MCP server ready at ${root}`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
