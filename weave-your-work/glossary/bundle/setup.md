# Glossary setup

Install the glossary's tools, its writing rule, and the hook that rebuilds the view.

## What this installs

- The Node tools in `bundle/tools/`: `glossary.js` (the CLI), `server.js` (the MCP server), and `post-merge.sh` (the hook template).
- The writing rule from `bundle/rules/rules-glossary.md` into `.agents/rules/rules-glossary.md`.
- The post-merge hook in `.git/hooks/post-merge`, which rebuilds `GLOSSARY.md` after a pull.

## Tools

The tools live in `bundle/tools/` and need Node 18 or newer.

```bash
cd <skill>/bundle/tools
npm install
```

The CLI:

```bash
node <skill>/bundle/tools/glossary.js --project <root> list
```

The MCP server:

```bash
node <skill>/bundle/tools/server.js --project <root>
```

The CLI needs no dependencies; the MCP server does.

## Rules

Copy `bundle/rules/rules-glossary.md` into `.agents/rules/`:

- absent: copy it;
- identical: no-op;
- different: a conflict, and the person decides; no overwrite.

The installed copy in this repository is `.agents/rules/rules-glossary.md`.

## External steps

1. **Install the post-merge hook.** The template carries `@GLOSSARY_SKILL@`, which the setup replaces with the absolute skill path:

   ```bash
   hook=$(git rev-parse --git-path hooks/post-merge)
   sed "s#@GLOSSARY_SKILL@#<skill>#g" <skill>/bundle/tools/post-merge.sh > "$hook"
   chmod +x "$hook"
   ```

   The hook exits when the project has no `glossary/` directory.

2. **Register the MCP server.** In the harness's MCP config:

   ```json
   {
     "mcpServers": {
       "glossary": {
         "command": "node",
         "args": ["<skill>/bundle/tools/server.js", "--project", "<root>"]
       }
     }
   }
   ```

   Restart the harness. The four tools should be listed.

3. **Read `usage.md`** for the CLI commands, the tool arguments, and troubleshooting.

## Verify

- `node <skill>/bundle/tools/glossary.js --project <root> list` prints the merged terms, one JSON object per line.
- The harness lists `glossary_lookup`, `glossary_list`, `glossary_write`, and `glossary_merge`.
- `glossary_write` then `glossary_merge` adds a term to `GLOSSARY.md` with a `_Source_` line; the hook does the same after a merge.
