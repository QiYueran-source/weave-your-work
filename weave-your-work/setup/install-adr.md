# ADR install

Install the ADR tool and the hook that rebuilds the view after a pull. There is
no server and no MCP registration: an ADR is written once and read from
`ADR.md`, so a CLI and the merge are all the project needs.

## What this installs

- `.work-weave/adr/` holds the sources, one `<operator>.jsonl` per person.
- `.work-weave/runtime/adr/` holds the tool copy. Nothing installs under the
  skill directory.
- `.git/hooks/post-merge` rebuilds `ADR.md` after a pull when you install it.
- The root `.gitignore` keeps the generated `/ADR.md` out of the repository.

The tool has no dependencies, so there is no `npm ci` step.

## Create the directories and ignore files

Unix:

```sh
mkdir -p .work-weave/adr .work-weave/runtime/adr
grep -qxF '/ADR.md' .gitignore 2>/dev/null || printf '%s\n' '/ADR.md' >> .gitignore
```

Windows PowerShell:

```powershell
New-Item -ItemType Directory .work-weave\adr, .work-weave\runtime\adr -Force | Out-Null
if (-not (Select-String -Path .gitignore -Pattern ([regex]::Escape('/ADR.md')) -Quiet -ErrorAction SilentlyContinue)) {
  Add-Content .gitignore '/ADR.md'
}
```

The appends are guarded, so a re-run adds nothing twice.

## Copy the tool

Unix:

```sh
cp <setup>/tools/adr/adr.js \
   <setup>/tools/adr/project-root.cjs \
   .work-weave/runtime/adr/
```

Windows PowerShell:

```powershell
Copy-Item <setup>\tools\adr\adr.js, <setup>\tools\adr\project-root.cjs .work-weave\runtime\adr\
```

The runtime copy is the only install. Do not run the tool from the skill
directory, and never commit `.work-weave/runtime/`.

## Install the post-merge hook

Recommended, not required: without it, run `merge` by hand after a pull.

The template carries `@ADR_RUNTIME@`, which the setup replaces with the absolute
path to `.work-weave/runtime/adr`. The hook leaves a project with no
`.work-weave/adr/` directory alone, so a clone without ADR sources pulls cleanly.

Unix, from the project root:

```sh
hook=$(git rev-parse --git-path hooks/post-merge)
if [ ! -e "$hook" ]; then
  runtime=$(cd .work-weave/runtime/adr && pwd)
  sed "s#@ADR_RUNTIME@#$runtime#g" .work-weave/runtime/adr/post-merge.sh > "$hook"
  chmod +x "$hook"
fi
```

Windows, from the project root in PowerShell:

```powershell
$hook = git rev-parse --git-path hooks/post-merge
if (-not (Test-Path $hook)) {
  $runtime = (Resolve-Path .work-weave\runtime\adr).Path
  (Get-Content ".work-weave\runtime\adr\post-merge.sh") -replace '@ADR_RUNTIME@', $runtime | Set-Content $hook
}
```

If the hook already exists, do not overwrite it: a project that installed the
glossary hook has one already. Append the ADR lines to it, or run `merge` by
hand.

## The commands

```sh
node .work-weave/runtime/adr/adr.js --project <root> list
node .work-weave/runtime/adr/adr.js --project <root> show <id>
node .work-weave/runtime/adr/adr.js --project <root> merge
node .work-weave/runtime/adr/adr.js --project <root> write --title T --decision D
```

`write` also takes `--status`, `--supersedes <id>`, and `--record <waymark id>`.

Run from the project root and `--project` can be left out; the tool resolves the
root the way the other tools do.

## Verify

- `node .work-weave/runtime/adr/adr.js --project <root> write --title "Test" --decision "A test."`
  then `list` prints the entry and the file holds one line.
- `merge` writes `ADR.md` at the project root.
- `git status` shows `.work-weave/adr/` as tracked and `ADR.md` as ignored.
- A project with no `.work-weave/adr/` directory answers the install message
  rather than crashing when `merge` runs from the hook.
