# Glossary install

Install the glossary's project directories, its writing rule, and its project runtime. The post-merge hook is recommended.

## What this installs

- `.work-weave/glossary/` holds the sources (`<operator>.jsonl`) and the view header (`_header.md`).
- `.work-weave/runtime/glossary/` holds the tool copies and their dependencies. Nothing installs under the skill directory.
- `.work-weave/.gitignore` keeps `pending/`, `runtime/`, and `local/` out of the repository. The root `.gitignore` keeps the generated `/GLOSSARY.md` out.
- `.agents/rules/rules-glossary.md` carries the writing rule.
- `.git/hooks/post-merge` rebuilds the root `GLOSSARY.md` after a pull when you install it.

## Tools

The tools need Node 20.18 or newer and npm.

Run every command from the project root. Resolve it as setup does: show the current directory and ask the person to confirm it, or take the explicit path they name. The root holds `.git`, `.waymark/config.toml`, and `.work-weave/` directly; do not substitute an enclosing Git root. `<skill>` is the installed glossary skill directory, either `<root>/.agents/skills/glossary` or `~/.agents/skills/glossary`.

### Create the directories and ignore files

Unix:

```sh
mkdir -p .work-weave/glossary .work-weave/runtime/glossary
for line in 'pending/' 'runtime/' 'local/'; do
  grep -qxF "$line" .work-weave/.gitignore 2>/dev/null || printf '%s\n' "$line" >> .work-weave/.gitignore
done
grep -qxF '/GLOSSARY.md' .gitignore 2>/dev/null || printf '%s\n' '/GLOSSARY.md' >> .gitignore
```

Windows PowerShell:

```powershell
New-Item -ItemType Directory .work-weave\glossary, .work-weave\runtime\glossary -Force | Out-Null
foreach ($line in 'pending/', 'runtime/', 'local/') {
  if (-not (Select-String -Path .work-weave\.gitignore -Pattern ([regex]::Escape($line)) -Quiet -ErrorAction SilentlyContinue)) {
    Add-Content .work-weave\.gitignore $line
  }
}
if (-not (Select-String -Path .gitignore -Pattern ([regex]::Escape('/GLOSSARY.md')) -Quiet -ErrorAction SilentlyContinue)) {
  Add-Content .gitignore '/GLOSSARY.md'
}
```

The appends are guarded, so a re-run adds nothing twice.

### Copy the tools and install the runtime

Unix:

```sh
cp <setup>/tools/glossary/glossary.js \
   <setup>/tools/glossary/server.js \
   <setup>/tools/glossary/post-merge.sh \
   <setup>/tools/glossary/project-root.cjs \
   <setup>/tools/glossary/package.json \
   <setup>/tools/glossary/package-lock.json \
   .work-weave/runtime/glossary/
(cd .work-weave/runtime/glossary && npm ci --omit=dev)
```

Windows PowerShell:

```powershell
Copy-Item <setup>\tools\glossary\glossary.js, <setup>\tools\glossary\server.js, <setup>\tools\glossary\post-merge.sh, <setup>\tools\glossary\project-root.cjs, <setup>\tools\glossary\package.json, <setup>\tools\glossary\package-lock.json .work-weave\runtime\glossary\
Push-Location .work-weave\runtime\glossary
npm ci --omit=dev
Pop-Location
```

Read the exit status of `npm ci --omit=dev` and stop on a non-zero one. A failed install can still leave a partial `node_modules`, so the directory appearing proves nothing. Do not run `npm install` in `<setup>/tools/glossary/`: the runtime under the project is the only install, and it stays out of the skill directory and out of Git.

The CLI:

```bash
node <root>/.work-weave/runtime/glossary/glossary.js --project <root> list
```

The MCP server:

```bash
node <root>/.work-weave/runtime/glossary/server.js --project <root>
```

The CLI needs no dependencies; the MCP server does.

### Migrating an old root `glossary/`

A project set up before this layout keeps its sources in `<root>/glossary/`. Copy them first; do not move or delete them yet.

Unix:

```sh
mkdir -p .work-weave/glossary
cp glossary/*.jsonl .work-weave/glossary/
if [ -e glossary/_header.md ]; then cp glossary/_header.md .work-weave/glossary/; fi
before=$(cat glossary/*.jsonl | grep -c .)
node .work-weave/runtime/glossary/glossary.js --project <root> merge
after=$(grep -c '^_Source_: ' GLOSSARY.md)
printf '%s\n' "old source terms: $before, regenerated view terms: $after"
```

Windows PowerShell:

```powershell
New-Item -ItemType Directory .work-weave\glossary -Force | Out-Null
Copy-Item glossary\*.jsonl .work-weave\glossary\
if (Test-Path glossary\_header.md) { Copy-Item glossary\_header.md .work-weave\glossary\ }
$before = (Get-ChildItem glossary\*.jsonl | Get-Content | Where-Object { $_.Trim() }).Count
node .work-weave\runtime\glossary\glossary.js --project <root> merge
$after = (Select-String -Path GLOSSARY.md -Pattern '^_Source_: ').Count
Write-Output "old source terms: $before, regenerated view terms: $after"
```

Compare the two numbers, then read the regenerated `GLOSSARY.md` against the terms you know were there. A term defined in two operators' files appears once in the view, so a lower view count is acceptable only when you can name each duplicate; otherwise the number must match. Only when the counts and the terms agree, remove the old directory:

Unix:

```sh
rm -rf glossary
```

Windows PowerShell:

```powershell
Remove-Item -Recurse -Force glossary
```

When either check fails, keep the old directory and both sets of sources. A merge that reports a missing directory or no terms is a failed migration, not an empty glossary; do not delete anything. Remove nothing else.

### The generated view

`merge` writes `<root>/GLOSSARY.md`. It reads `.work-weave/glossary/*.jsonl` and the optional `.work-weave/glossary/_header.md`; when the header is absent it writes a default one. Never edit `GLOSSARY.md` by hand; the next merge overwrites it.

## Rules

Copy `rules/rules-glossary.md` into `.agents/rules/` only when the file is absent. If it exists and is identical, do nothing; if it exists and differs, stop and ask the person; never overwrite. The installed copy may still name the old root `glossary/` path; that is a conflict for the person to settle, not a file to replace silently.

Unix:

```sh
mkdir -p .agents/rules
if [ ! -e .agents/rules/rules-glossary.md ]; then
  cp <setup>/rules/rules-glossary.md .agents/rules/rules-glossary.md
fi
```

Windows PowerShell:

```powershell
New-Item -ItemType Directory .agents/rules -Force | Out-Null
if (-not (Test-Path .agents\rules\rules-glossary.md)) {
  Copy-Item <setup>\rules\rules-glossary.md .agents\rules\rules-glossary.md
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
         "args": ["<root>/.work-weave/runtime/glossary/server.js", "--project", "<root>"]
       }
     }
   }
   ```

   Restart the harness. The four tools should be listed. The config path is harness-specific; add the snippet where that harness keeps MCP servers.

2. **Install the post-merge hook (recommended).** The template now lives in the project runtime at `<root>/.work-weave/runtime/glossary/post-merge.sh`. It carries `@GLOSSARY_RUNTIME@`, which the setup replaces with the absolute path to `<root>/.work-weave/runtime/glossary`. The installed hook checks `<root>/.work-weave/glossary`, exits cleanly when that directory is absent, and otherwise runs `glossary.js --project "$root" merge`; it never creates an empty view.

   If the hook already exists, do not overwrite it; merge the template by hand or skip the hook. When you skip it, run the merge command after a pull instead.

   Unix, from the project root:

   ```sh
   hook=$(git rev-parse --git-path hooks/post-merge)
   if [ ! -e "$hook" ]; then
     runtime=$(cd .work-weave/runtime/glossary && pwd)
     sed "s#@GLOSSARY_RUNTIME@#$runtime#g" "$runtime/post-merge.sh" > "$hook"
     chmod +x "$hook"
   fi
   ```

   Windows, from the project root in PowerShell:

   ```powershell
   $hook = git rev-parse --git-path hooks/post-merge
   if (-not (Test-Path $hook)) {
     $runtime = (Resolve-Path .work-weave\runtime\glossary).Path
     (Get-Content "$runtime\post-merge.sh") -replace '@GLOSSARY_RUNTIME@', $runtime | Set-Content $hook
   }
   ```

   Git for Windows runs hooks with its bundled `sh`, so the shell hook works there; a Git distribution without that shell needs WSL or Git Bash. A project with no `.work-weave/glossary/` directory is left alone by the hook, so a clone without glossary sources pulls cleanly.

3. **Read `usage.md`** for the CLI commands, the tool arguments, and troubleshooting.

## Verify

- `node <root>/.work-weave/runtime/glossary/glossary.js --project <root> list` prints the merged terms, one JSON object per line.
- The harness lists `glossary_lookup`, `glossary_list`, `glossary_write`, and `glossary_merge`.
- `glossary_write` then `glossary_merge` adds a term to `<root>/GLOSSARY.md` with a `_Source_` line.
- `<root>/.work-weave/runtime/glossary/node_modules` exists and `<setup>/tools/glossary/` has no `node_modules` from this install.
- If you installed the hook, change one `.work-weave/glossary/*.jsonl` line in a clone, pull it, and check that `GLOSSARY.md` has the new definition.
- A project migrated from the old layout has `.work-weave/glossary/` sources and no `<root>/glossary/` directory.
