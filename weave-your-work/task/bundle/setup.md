# Task bundle setup

## What this installs

The task work-record rule at `.agents/rules/rules-task.md`. It asks agents to record work before advancing it and points to task-design and update for the ticket lifecycle.

## Tools

No additional tools are required.

## Rules

Copy `bundle/rules/rules-task.md` into `.agents/rules/rules-task.md`.

Unix, from the project root:

```sh
mkdir -p .agents/rules
if [ ! -e .agents/rules/rules-task.md ]; then
  cp <task-skill>/bundle/rules/rules-task.md .agents/rules/rules-task.md
elif cmp -s <task-skill>/bundle/rules/rules-task.md .agents/rules/rules-task.md; then
  printf '%s\n' 'Already installed: .agents/rules/rules-task.md'
else
  printf '%s\n' 'Conflict: .agents/rules/rules-task.md differs. Ask the person; do not overwrite.' >&2
  exit 1
fi
```

Windows PowerShell, from the project root:

```powershell
New-Item -ItemType Directory .agents/rules -Force | Out-Null
$source = '<task-skill>\bundle\rules\rules-task.md'
$target = '.agents\rules\rules-task.md'
if (-not (Test-Path $target)) {
  Copy-Item $source $target
} elseif ((Get-FileHash $source).Hash -eq (Get-FileHash $target).Hash) {
  Write-Output "Already installed: $target"
} else {
  throw "Conflict: $target differs. Ask the person; do not overwrite."
}
```

Replace `<task-skill>` with the installed task skill directory. If the target differs, stop and ask the person whether to keep it, reconcile it, or replace it.

## External steps

None.

## Verify

Check that `.agents/rules/rules-task.md` exists and matches `bundle/rules/rules-task.md`. Confirm that the project's `AGENTS.md` tells agents to read `.agents/rules/`.
