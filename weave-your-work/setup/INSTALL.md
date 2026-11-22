# Install

What this skill installs into a project, and where each part goes. It is an
index: the steps for each part live in the file named under it, and this file
does not restate them.

The reader has already decided which parts to install. This file does not help
choose.

## What gets installed

The issue tracker is waymark, from `QiYueran-source/waymark`. It is installed
before setup runs, not by it; check 2 of `work-weave-rules-checklist.md` is that
it is there and recent enough.

| Part | Source | Destination | Steps |
|---|---|---|---|
| Rules | `rules/` | `<project>/.agents/rules/` | below |
| Setup check | `tools/utils/check-setup.mjs` | runs in place | nothing to install |
| Project-root resolver | `tools/utils/project-root.cjs` | runs in place | nothing to install |
| Glossary | `tools/glossary/` | `.work-weave/personal/glossary/` | `tools/glossary/INSTALL.md` |
| ADR | `tools/adr/` | `.work-weave/personal/adr/` | `tools/adr/INSTALL.md` |
| Issue listener | `tools/issue/` | `.work-weave/personal/issue/` | `tools/issue/INSTALL.md` |

Two tools run in place and copy nothing: `tools/utils/check-setup.mjs` reads the
project's state, and `tools/utils/project-root.cjs` answers which project a command
belongs to.

## Resolving `<setup>`

Several steps name `<setup>`: the installed setup skill directory.

| Install | `<setup>` |
|---|---|
| Project | `<project>/.agents/skills/setup` |
| Global, Unix | `~/.agents/skills/setup` |
| Global, Windows | `%USERPROFILE%\.agents\skills\setup` |

A globally installed skill still writes into the project, never into its own
directory: the rules and the runtime copies belong to the project they serve.

## Rules

Six files, copied by name. For each one: absent, write it; identical, skip it;
different, stop and ask the person, never overwrite.

```
work-weave-rules-git.md
work-weave-rules-checklist.md
work-weave-rules-install.md
work-weave-rules-owner.md
work-weave-rules-pending-communications.md
work-weave-rules-record.md
```

Unix, from the project root:

```sh
mkdir -p .agents/rules
SETUP_SKILL_DIR='/path/to/installed/setup'
for name in work-weave-rules-git.md work-weave-rules-checklist.md work-weave-rules-install.md work-weave-rules-owner.md work-weave-rules-pending-communications.md work-weave-rules-record.md; do
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
$skillDir = '<setup>'
foreach ($name in 'work-weave-rules-git.md','work-weave-rules-checklist.md','work-weave-rules-install.md','work-weave-rules-owner.md','work-weave-rules-pending-communications.md','work-weave-rules-record.md') {
  $source = Join-Path $skillDir "rules\$name"
  $target = ".agents\rules\$name"
  if (-not (Test-Path $target)) { Copy-Item $source $target; Write-Output "Installed: $target" }
  elseif ((Get-FileHash $source).Hash -eq (Get-FileHash $target).Hash) { Write-Output "Already installed: $target" }
  else { throw "Conflict: $target differs. Ask the person; do not overwrite." }
}
```

## Order

Rules first, then the runtime the person chose. Create `.work-weave/shared/` and
`.work-weave/personal/` before any runtime: each one copies into the second.

## The runtimes

Three parts, each installed on its own. A project takes only the ones it chose.

**Glossary.** `tools/glossary/INSTALL.md`. A shared vocabulary in
`.work-weave/shared/glossary/`, its tool in `.work-weave/personal/glossary/`, and
an optional post-merge hook that rebuilds `GLOSSARY.md`.

**ADR.** `tools/adr/INSTALL.md`. Decision records in `.work-weave/shared/adr/`,
their tool in `.work-weave/personal/adr/`, and an optional post-merge hook that
rebuilds `ADR.md`.

**Issue listener.** `tools/issue/INSTALL.md`. The listener and queue in
`.work-weave/personal/issue/`, the roster at
`.work-weave/shared/handles.toml`, and a generated service unit. It is the only
part with a platform-specific step; that file says which.

## What this does not cover

- Which parts to install, and when. That is `START-A-PROJECT.md`.
- Committing. Setup ends with the list of files it changed, and the person
  commits.
