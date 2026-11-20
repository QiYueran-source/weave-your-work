---
schema: 1
id: wm-czxqvb14syme
title: Split the glossary tool into store, CLI, and MCP server
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T07:06:45Z
updated_at: 2026-11-17T07:07:45Z
closed_at: 2026-11-17T07:07:45Z
parent: wm-w8p1a8by9ang
---
## Action

Move the glossary's logic into a store file, leave the command line as a shell over it, and point the MCP server at the store. Split the way the ADR tool is split, so a reader looking for the store finds the store and a reader looking for argument parsing finds parsing.

The store holds the project root resolver, the operator reader, the source-file reader, the merge, the write, and the view builder. The command line holds argument parsing and dispatch. The server holds tool definitions. The shared project root resolver stays where it is.

No command's name, arguments, or output change.

## Acceptance signal

Three checks, each observable from outside the code:

- The suite under `tests/` passes: twelve tests, zero failures.
- Running `list`, `write`, and `merge` through the command line against a temporary project produces the output it produced before the split.
- The MCP server registers the tools it is expected to register.

## Result

Done. `glossary-core.js` was added, and `glossary.js` was cut down to a shell that parses arguments and calls the store. `server.js` requires the store. The store exports `FIELDS`, `DEFAULT_GROUP`, `now`, `projectRoot`, `operator`, `glossaryDir`, `sourceFiles`, `readSource`, `merged`, `writeTerm`, and `merge`.

The suite changed in two places, neither of which altered an assertion. It imports the store rather than the command line, and the `type=module` test copies the store beside the command line it already copied.

Twelve tests pass.
