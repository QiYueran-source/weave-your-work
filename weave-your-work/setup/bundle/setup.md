# Setup bundle setup

## What this installs

Two rules into `.agents/rules/`:

- `rules-git.md` keeps the default branch protected and the work on your own branch.
- `rules-checklist.md` holds the seventeen checks that say whether the project is still configured.

## Tools

No additional tools are required.

## Rules

Copy `bundle/rules/rules-git.md` and `bundle/rules/rules-checklist.md` into `.agents/rules/`, keeping the file names. Run the same case for each file: absent, write it; identical, skip it; different, ask the person and do not overwrite.

Unix, from the project root:

```sh
mkdir -p .agents/rules
SETUP_SKILL_DIR='/path/to/installed/setup-skill'
for name in rules-git.md rules-checklist.md; do
  src="$SETUP_SKILL_DIR/bundle/rules/$name"
  dst=".agents/rules/$name"
  if [ ! -e "$dst" ]; then
    cp "$src" "$dst"
    printf '%s\n' "Installed: $dst"
  elif cmp -s "$src" "$dst"; then
    printf '%s\n' "Already installed: $dst"
  else
    printf '%s\n' "Conflict: $dst differs. Ask the person; do not overwrite." >&2
    exit 1
  fi
done
```

Windows PowerShell, from the project root:

```powershell
New-Item -ItemType Directory .agents/rules -Force | Out-Null
$skillDir = '<setup-skill>'
foreach ($name in 'rules-git.md', 'rules-checklist.md') {
  $source = Join-Path $skillDir "bundle\rules\$name"
  $target = ".agents\rules\$name"
  if (-not (Test-Path $target)) {
    Copy-Item $source $target
    Write-Output "Installed: $target"
  } elseif ((Get-FileHash $source).Hash -eq (Get-FileHash $target).Hash) {
    Write-Output "Already installed: $target"
  } else {
    throw "Conflict: $target differs. Ask the person; do not overwrite."
  }
}
```

Set `SETUP_SKILL_DIR`, or `<setup-skill>` in PowerShell, to the installed setup skill directory before running. If a target differs, stop and ask the person whether to keep it, reconcile it, or replace it. Do not remove the target before the person decides. The `exit 1` stops the Unix loop at the first conflict, so the second file is not silently written after one is refused.

## External steps

None.

## Verify

Both files must match the bundle's copies byte for byte:

```sh
for name in rules-git.md rules-checklist.md; do
  cmp -s "$SETUP_SKILL_DIR/bundle/rules/$name" ".agents/rules/$name" \
    && printf '%s\n' "ok: $name" \
    || printf '%s\n' "differs: $name"
done
```

Two `ok` lines pass. The deeper check is check 13 of `rules-checklist.md`, which walks every installed bundle rather than these two names; run that one after any install.
