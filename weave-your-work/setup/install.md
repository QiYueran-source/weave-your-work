# Install and configure

What the set installs into a project, and how. Two kinds of thing: rules that the agent reads, and tools that run. Everything installable lives under this setup skill; no other skill carries an install of its own.

A project is configured once. `configure-project.md` walks it, `join-project.md` fills in what a clone cannot carry, and `check-project.md` says whether it still holds.

## What gets installed

| Part | Lives in | Copies to |
|---|---|---|
| Rules | `rules/` in this skill | `.agents/rules/` |
| Setup check and root resolver | `tools/` | run in place |
| Glossary store and MCP server | `tools/glossary/` | `.work-weave/personal/glossary/` |
| ADR store and CLI | `tools/adr/` | `.work-weave/personal/adr/` |
| Issue listener and queue tools | `tools/issue/` | `.work-weave/personal/issue/` |

The project's data stays in the project: `.work-weave/` for the queue, the glossary sources, the runtime copies, and the checkout settings; `tickets/` for the records. Inside it, `shared/` is committed and `personal/` is ignored. Nothing installs under the skill directory, and `node_modules` is never committed.

## Rules

Eight files, copied by name. For each one: absent, write it; identical, skip it; different, stop and ask the person, never overwrite.

```
rules-git.md                      rules-map.md
rules-checklist.md                rules-task.md
rules-install.md                  rules-glossary.md
rules-structure.md                rules-pending-communications.md
```

Unix, from the project root:

```sh
mkdir -p .agents/rules
SETUP_SKILL_DIR='/path/to/installed/setup'
for name in rules-git.md rules-checklist.md rules-install.md rules-structure.md rules-map.md rules-task.md rules-glossary.md rules-pending-communications.md; do
  src="$SETUP_SKILL_DIR/rules/$name"
  dst=".agents/rules/$name"
  if [ ! -e "$dst" ]; then cp "$src" "$dst" && printf '%s\n' "Installed: $dst"
  elif cmp -s "$src" "$dst"; then printf '%s\n' "Already installed: $dst"
  else printf '%s\n' "Conflict: $dst differs. Ask the person; do not overwrite." >&2; exit 1
  fi
done
```

Windows PowerShell, from the project root:

```powershell
New-Item -ItemType Directory .agents/rules -Force | Out-Null
$skillDir = '<setup-skill>'
foreach ($name in 'rules-git.md','rules-checklist.md','rules-install.md','rules-structure.md','rules-map.md','rules-task.md','rules-glossary.md','rules-pending-communications.md') {
  $source = Join-Path $skillDir "rules\$name"
  $target = ".agents\rules\$name"
  if (-not (Test-Path $target)) { Copy-Item $source $target; Write-Output "Installed: $target" }
  elseif ((Get-FileHash $source).Hash -eq (Get-FileHash $target).Hash) { Write-Output "Already installed: $target" }
  else { throw "Conflict: $target differs. Ask the person; do not overwrite." }
}
```

`SETUP_SKILL_DIR` is the installed setup skill: `<project>/.agents/skills/setup` after a project install, `~/.agents/skills/setup` after a global one. The rules go into the project either way, because the project is what they govern.

## Tools

Run in place; nothing to copy for these two.

- `node <setup>/tools/project-root-cli.cjs [--project <dir>]` prints the physical project root, or fails.
- `node <setup>/tools/check-setup.mjs --starred` runs the checks in `rules-checklist.md` and exits 1 on a failure. Use `--all` when a feature you expect to work does not; the checklist says which checks are starred.

Node callers can import `resolveProjectRoot({ cwd?, project? })` from `tools/project-root.cjs`.

## Move a checkout to the new layout

A checkout written before the layout split keeps its files under `config/`, `issue/`, `glossary/`, `adr/`, `runtime/`, `local/`, and `pending/`. `node <setup>/tools/migrate-layout.cjs [<project-root>]` moves them into `.work-weave/shared/` and `.work-weave/personal/` and rewrites `.work-weave/.gitignore` to name `personal/` and nothing else. It prints every path it moved. It checks all destinations first and stops with both paths named if one already exists, moving nothing; run it on a checkout already in the new shape and it prints that there is nothing to do. Running it twice is safe.

The glossary and issue tools each carry a byte-identical copy of `project-root.cjs`. The setup install has no test that runs that comparison; the copies are kept equal by hand.

## Install the three runtimes

The glossary runtime is `install-glossary.md`, the ADR runtime is `install-adr.md`, and the issue runtime is `install-issue.md`. Run each only when the project uses it: a project without a shared vocabulary needs no glossary server, a project that records no decisions needs no ADR tool, and a project without a remote needs no listener.

The ADR tool has no dependencies and registers no MCP server. Copy its two files into `.work-weave/personal/adr/` and install the post-merge hook; there is no `npm ci` step.

Both copy their tools into `.work-weave/personal/<name>/` and run `npm ci --omit=dev` there. Read the exit status: a failed install can leave a partial `node_modules`, so the directory appearing proves nothing.

## Verify

1. Every rule named above is in `.agents/rules/` and matches its source byte for byte; check 13 of `rules-checklist.md` is that verification.
2. `node <setup>/tools/check-setup.mjs --all` reports `ok` or `not applicable` for every check, with no `fail` and no `unverified`.
3. A tool the project uses answers: `node .work-weave/personal/glossary/glossary.js --project <root> list`, or the listener's own status command.

## What this does not do

- Install the skills themselves. `npx skills add` does that first.
- Create a remote, or commit anything. Setup ends with the list of files it changed, and the person commits.
- Repair a failing check on its own. It reports the check and its repair.
