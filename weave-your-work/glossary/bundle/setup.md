# Glossary setup

Install the glossary's project directory, its writing rule, and its tools. The post-merge hook is recommended.

## What this installs

- The project's `glossary/` directory and the root `GLOSSARY.md` ignore entry.
- The Node tools in `bundle/tools/`: `glossary.js` (the CLI), `server.js` (the MCP server), and `post-merge.sh` (the hook template).
- The writing rule from `bundle/rules/rules-glossary.md` into `.agents/rules/rules-glossary.md`.
- The post-merge hook in `.git/hooks/post-merge` when you install it; the hook rebuilds `GLOSSARY.md` after a pull.

## Tools

The tools live in `bundle/tools/` and need Node 18 or newer.

Create `glossary/` and add `GLOSSARY.md` to `.gitignore` when it is not already there:

- Unix:

  ```bash
  mkdir -p glossary
  grep -qxF 'GLOSSARY.md' .gitignore 2>/dev/null || printf '\nGLOSSARY.md\n' >> .gitignore
  ```

- Windows PowerShell:

  ```powershell
  New-Item -ItemType Directory glossary -Force
  if (-not (Select-String -Path .gitignore -Pattern '^GLOSSARY.md$' -Quiet -ErrorAction SilentlyContinue)) { Add-Content .gitignore "`nGLOSSARY.md" }
  ```

Install the tools:

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

Copy `bundle/rules/rules-glossary.md` into `.agents/rules/` only when the file is absent. If it exists and is identical, do nothing; if it exists and differs, stop and ask the person; never overwrite.

Unix:

```bash
mkdir -p .agents/rules
if [ ! -e .agents/rules/rules-glossary.md ]; then
  cp <skill>/bundle/rules/rules-glossary.md .agents/rules/rules-glossary.md
fi
```

Windows PowerShell:

```powershell
New-Item -ItemType Directory .agents/rules -Force
if (-not (Test-Path .agents\rules\rules-glossary.md)) {
  Copy-Item <skill>\bundle\rules\rules-glossary.md .agents\rules\rules-glossary.md
}
```

The installed copy in this repository is `.agents/rules/rules-glossary.md`.

## External steps

1. **Register the MCP server (required).** In the harness's MCP config:

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

   Restart the harness. The four tools should be listed. The config path is harness-specific; add the snippet where that harness keeps MCP servers.

2. **Install the post-merge hook (recommended).** The hook rebuilds `GLOSSARY.md` after a pull. If you skip it, run the merge command after a pull instead.

   The template carries `@GLOSSARY_SKILL@`, which the setup replaces with the absolute skill path. If the hook already exists, do not overwrite it; merge the template by hand or skip the hook.

   Unix, from the project root:

   ```bash
   hook=$(git rev-parse --git-path hooks/post-merge)
   if [ ! -e "$hook" ]; then
     sed "s#@GLOSSARY_SKILL@#<skill>#g" <skill>/bundle/tools/post-merge.sh > "$hook"
     chmod +x "$hook"
   fi
   ```

   Windows, from the project root in PowerShell:

   ```powershell
   $hook = git rev-parse --git-path hooks/post-merge
   if (-not (Test-Path $hook)) {
     (Get-Content <skill>\bundle\tools\post-merge.sh) -replace '@GLOSSARY_SKILL@', '<skill>' | Set-Content $hook
   }
   ```

   Git for Windows runs hooks with its bundled `sh`, so the shell hook works there; a Git distribution without that shell needs WSL or Git Bash. The hook exits when the project has no `glossary/` directory.

3. **Read `usage.md`** for the CLI commands, the tool arguments, and troubleshooting.

## Verify

- `node <skill>/bundle/tools/glossary.js --project <root> list` prints the merged terms, one JSON object per line.
- The harness lists `glossary_lookup`, `glossary_list`, `glossary_write`, and `glossary_merge`.
- `glossary_write` then `glossary_merge` adds a term to `GLOSSARY.md` with a `_Source_` line.
- If you installed the hook, change one `glossary/*.jsonl` line in a clone, pull it, and check that `GLOSSARY.md` has the new definition.
