# Setup bundle setup

## What this installs

Three rules into `.agents/rules/`:

- `rules-git.md` keeps the default branch protected and the work on your own branch.
- `rules-checklist.md` holds the seventeen checks that say whether the project is still configured.
- `rules-install.md` keeps the skill set installable outside the project while its dependencies and rules stay inside it.

## Tools

The bundle includes `tools/project-root.cjs` and `tools/project-root-cli.cjs`. They require Node and Git, but no npm install. Run `node <setup-skill>/bundle/tools/project-root-cli.cjs` to find and validate the nearest project, or add `--project <directory>` to validate that exact directory. The command prints the physical root on success and reports an error on failure. It validates initialized projects; first-time root confirmation and creation belong to the setup flow.

Node callers can import `resolveProjectRoot({ cwd?, project? })` from `tools/project-root.cjs`; it returns the physical root or throws. A relative `project` is resolved from `cwd`, which defaults to the current working directory. Run `node --test` in `bundle/tools/` to check the resolver.

The issue and glossary tools each carry their own byte-identical copy of `project-root.cjs`. The setup integration checks that the copies still match.

## Rules

Copy `bundle/rules/rules-git.md`, `bundle/rules/rules-checklist.md`, and `bundle/rules/rules-install.md` into `.agents/rules/`, keeping the file names. Run the same case for each file: absent, write it; identical, skip it; different, ask the person and do not overwrite.

Unix, from the project root:

```sh
mkdir -p .agents/rules
SETUP_SKILL_DIR='/path/to/installed/setup-skill'
for name in rules-git.md rules-checklist.md rules-install.md; do
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
foreach ($name in 'rules-git.md', 'rules-checklist.md', 'rules-install.md') {
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

Set `SETUP_SKILL_DIR`, or `<setup-skill>` in PowerShell, to the installed setup skill directory before running. It is wherever the skill set was installed: `<project>/.agents/skills/setup` after a project install, `~/.agents/skills/setup` after a global one. The rules are copied into the project either way; `rules-install.md` says why. If a target differs, stop and ask the person whether to keep it, reconcile it, or replace it. Do not remove the target before the person decides. The `exit 1` stops the Unix loop at the first conflict, so the remaining files are not silently written after one is refused.

## External steps

None.

## Verify

All three files must match the bundle's copies byte for byte:

```sh
for name in rules-git.md rules-checklist.md rules-install.md; do
  cmp -s "$SETUP_SKILL_DIR/bundle/rules/$name" ".agents/rules/$name" \
    && printf '%s\n' "ok: $name" \
    || printf '%s\n' "differs: $name"
done
```

Three `ok` lines pass. The deeper check is check 13 of `rules-checklist.md`, which walks every installed bundle rather than these three names; run that one after any install.
