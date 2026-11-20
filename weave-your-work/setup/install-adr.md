# ADR install

Install the ADR store, its CLI, and its MCP server, plus the hook that rebuilds
the view after a pull.

## What this installs

- `.work-weave/shared/adr/` holds the sources, one `<operator>.jsonl` per person.
  The sources are committed.
- `.work-weave/personal/adr/` holds the tool copy. Nothing installs under the
  skill directory.
- `.git/hooks/post-merge` rebuilds `ADR.md` after a pull when you install it.
- The root `.gitignore` keeps the generated `/ADR.md` out of the repository.

Three files make up the tool. `adr-core.js` holds every function and needs no
dependencies. `adr.js` is the command line and also needs none. `server.js` is
the MCP server and needs `@modelcontextprotocol/sdk` and `zod`, so only it relies
on the `npm ci` step. A failed install leaves the CLI working.

## Create the directories and ignore files

Unix:

```sh
mkdir -p .work-weave/shared/adr .work-weave/personal/adr
grep -qxF '/ADR.md' .gitignore 2>/dev/null || printf '%s\n' '/ADR.md' >> .gitignore
```

Windows PowerShell:

```powershell
New-Item -ItemType Directory .work-weave\shared\adr, .work-weave\personal\adr -Force | Out-Null
if (-not (Select-String -Path .gitignore -Pattern ([regex]::Escape('/ADR.md')) -Quiet -ErrorAction SilentlyContinue)) {
  Add-Content .gitignore '/ADR.md'
}
```

The appends are guarded, so a re-run adds nothing twice.

## Copy the tool and install the runtime

Unix:

```sh
cp <setup>/tools/adr/adr-core.js \
   <setup>/tools/adr/adr.js \
   <setup>/tools/adr/server.js \
   <setup>/tools/adr/project-root.cjs \
   <setup>/tools/adr/package.json \
   .work-weave/personal/adr/
(cd .work-weave/personal/adr && npm ci --omit=dev)
```

Windows PowerShell:

```powershell
Copy-Item <setup>\tools\adr\adr-core.js, <setup>\tools\adr\adr.js, <setup>\tools\adr\server.js, <setup>\tools\adr\project-root.cjs, <setup>\tools\adr\package.json .work-weave\personal\adr\
Push-Location .work-weave\personal\adr
npm ci --omit=dev
Pop-Location
```

Read the exit status of `npm ci --omit=dev` and stop on a non-zero one. A failed
install can still leave a partial `node_modules`, so the directory appearing
proves nothing. Do not run `npm install` in `<setup>/tools/adr/`: the runtime
under the project is the only install, and it stays out of the skill directory
and out of Git.

## Register the MCP server

In the harness's MCP config:

```json
{
  "mcpServers": {
    "adr": {
      "command": "node",
      "args": ["<root>/.work-weave/personal/adr/server.js", "--project", "<root>"]
    }
  }
}
```

Restart the harness. It should list `adr_list`, `adr_show`, `adr_write`, and
`adr_merge`. The config path is harness-specific; add the snippet where that
harness keeps MCP servers, beside the glossary entry.

## Install the post-merge hook

Recommended, not required: without it, run `merge` by hand after a pull.

The template carries `@ADR_RUNTIME@`, which the setup replaces with the absolute
path to `.work-weave/personal/adr`. The hook leaves a project with no
`.work-weave/shared/adr/` directory alone, so a clone without ADR sources pulls cleanly.

Unix, from the project root:

```sh
hook=$(git rev-parse --git-path hooks/post-merge)
if [ ! -e "$hook" ]; then
  runtime=$(cd .work-weave/personal/adr && pwd)
  sed "s#@ADR_RUNTIME@#$runtime#g" .work-weave/personal/adr/post-merge.sh > "$hook"
  chmod +x "$hook"
fi
```

Windows, from the project root in PowerShell:

```powershell
$hook = git rev-parse --git-path hooks/post-merge
if (-not (Test-Path $hook)) {
  $runtime = (Resolve-Path .work-weave\personal\adr).Path
  (Get-Content ".work-weave\personal\adr\post-merge.sh") -replace '@ADR_RUNTIME@', $runtime | Set-Content $hook
}
```

If the hook already exists, do not overwrite it: a project that installed the
glossary hook has one already. Append the ADR lines to it, or run `merge` by
hand.

## The two ways in

The MCP server exposes `adr_list`, `adr_show`, `adr_write`, and `adr_merge`. The
CLI does the same from a terminal and needs no dependencies:

```sh
node .work-weave/personal/adr/adr.js --project <root> list
node .work-weave/personal/adr/adr.js --project <root> show <id>
node .work-weave/personal/adr/adr.js --project <root> merge
node .work-weave/personal/adr/adr.js --project <root> write --title T --decision D
```

`write` also takes `--status`, `--supersedes <id>`, and `--record <waymark id>`.

When a tool call fails, run `list` from the CLI first: an empty output means the
source directory is missing, not that the server is broken.

## Verify

- `node .work-weave/personal/adr/adr.js --project <root> write --title "Test" --decision "A test."`
  then `list` prints the entry and the file holds one line.
- `merge` writes `ADR.md` at the project root.
- The harness lists `adr_list`, `adr_show`, `adr_write`, and `adr_merge`.
- `git status` shows `.work-weave/shared/adr/` as tracked and `ADR.md` as ignored.
- A project with no `.work-weave/shared/adr/` directory answers the install message
  rather than crashing when `merge` runs from the hook.
