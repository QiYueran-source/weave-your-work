# Map bundle setup

## What this installs

The map work-record rule at `.agents/rules/rules-map.md`. It asks agents to keep project design attached to a map and points to the map and update skills for the lifecycle.

## Tools

No additional tools are required.

## Rules

Copy `bundle/rules/rules-map.md` into `.agents/rules/rules-map.md`.

Unix, from the project root:

```sh
mkdir -p .agents/rules
if [ ! -e .agents/rules/rules-map.md ]; then
  cp <map-skill>/bundle/rules/rules-map.md .agents/rules/rules-map.md
elif cmp -s <map-skill>/bundle/rules/rules-map.md .agents/rules/rules-map.md; then
  printf '%s\n' 'Already installed: .agents/rules/rules-map.md'
else
  printf '%s\n' 'Conflict: .agents/rules/rules-map.md differs. Ask the person; do not overwrite.' >&2
  exit 1
fi
```

Windows PowerShell, from the project root:

```powershell
New-Item -ItemType Directory .agents/rules -Force | Out-Null
$source = '<map-skill>\bundle\rules\rules-map.md'
$target = '.agents\rules\rules-map.md'
if (-not (Test-Path $target)) {
  Copy-Item $source $target
} elseif ((Get-FileHash $source).Hash -eq (Get-FileHash $target).Hash) {
  Write-Output "Already installed: $target"
} else {
  throw "Conflict: $target differs. Ask the person; do not overwrite."
}
```

Replace `<map-skill>` with the installed map skill directory. If the target differs, stop and ask the person whether to keep it, reconcile it, or replace it. Do not remove the target before the person decides.

## External steps

None.

## Verify

Check that `.agents/rules/rules-map.md` exists and matches `bundle/rules/rules-map.md`. Confirm that the project's `AGENTS.md` tells agents to read `.agents/rules/`.
