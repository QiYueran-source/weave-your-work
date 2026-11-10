---
schema: 1
id: wm-2h2z3cvs6a7r
title: Write the first-time initialization SOP
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T00:47:51Z
updated_at: 2026-11-10T01:13:48Z
parent: wm-ygnttse5hd5k
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/setup/start-a-project.md`, the SOP that takes an empty directory to a configured project.

1. Open with what it assumes: the skill set is installed and nothing else exists — no git repository, no waymark configuration, no remote.
2. Write the steps in this order: confirm the five skill directories; run setup's own `bundle/setup.md` so its rules exist; walk the tools (git, waymark 0.1.2 or newer, node 22.20 or newer with npm, gh signed in), installing what can be installed and stopping for what a person must do; `git init` when the directory is not a repository, and set the git identity when it is missing; run `waymark init` with storage root `tickets` and one category; add the other two categories and the six custom fields; ask the operator once and set it; write `.gitignore`; run the four bundle setups in the order map, task, glossary, issue; write the AGENTS.md section; run the check.
3. Each step states the action and names the check that proves it, without repeating the check's command; the commands live in `.agents/rules/rules-checklist.md`.
4. End with the result table and the changed files; commit nothing and create no remote.
5. Give Unix and Windows commands where they differ.

## The `.gitignore` step

It sits after `waymark init` and before the four bundle setups, and the order is load-bearing: two of those bundles run `npm install`, and a `node_modules` that was already staged is not removed by a `.gitignore` written afterwards. Verified on 2026-11-10: `git add -A` followed by adding `node_modules/` to `.gitignore` leaves both files in the index.

Nobody else writes these lines for a new project:

- `waymark init` writes `.waymark/.gitignore` itself, covering `write.lock` and `user.toml`. The step must not touch that file.
- The glossary bundle appends `GLOSSARY.md` with a `grep -qxF` guard, so re-running it does not duplicate.
- The issue bundle appends `pending/` with no guard, so re-running it duplicates the block. The step does not depend on it and must not copy its shape.
- No bundle covers `node_modules/`. In this repository the root `.gitignore` already had it, which is why nothing surfaced; a new project has no root `.gitignore` at all.

The step writes three lines when they are absent, each guarded the way the glossary bundle guards its own, and creates the file when it does not exist. An unguarded append is the defect this step exists to avoid.

## Verified command shapes

Run on 2026-11-10 against waymark 0.1.2. The document must use these, not the shapes sketched earlier.

- `waymark init --storage-root tickets --category map --operator <name>` then `waymark config add category task tickets/task`, `waymark config add category testimony testimony`. A second `--category` is a usage error, so init takes one and `config add` takes the rest.
- `waymark config add field <key> <type>` for each of the six. It exits 3 when the key already exists, so a re-run reads `waymark config show` first, or treats exit 3 as already done.
- `waymark init` again without `--force` reuses the existing configuration and exits 0. With `--force` it rewrites the file, dropping every custom field; the step must say never to use `--force`.
- `waymark config set operator <name>` sets the operator in `.waymark/user.toml`, defaulting from `git config user.name`.
- Node floor is 22.20, not 20.18: the `skills` package that installs the set declares `engines: node >=22.20.0`. The bundle tools alone accept 20.18.
- Waymark's own generation after a fresh init is 1.8; this repository carries 1.9 because its config grew. The document must not pin the generation.
- Waymark ships prebuilt archives for linux-x86_64, macos-aarch64, macos-x86_64, and windows-x86_64; no Rust toolchain is needed. linux-aarch64 has no archive, so that platform needs `cargo install waymark-cli`.
- `npx skills add <repo>/weave-your-work -a codex` writes only `.agents/skills/`; without `-a` it also writes `.claude/skills`, `.kiro/skills`, and `.trae/skills`.
- `git check-ignore` answers for paths that do not exist yet, so the ignore check runs before any `npm install`.

## Acceptance signal

Every step names the check that proves it. Every command runs as written on this machine. The document creates no remote and no commit. The only files it points at are `bundle/setup.md`, the four bundle setups, and `.agents/rules/rules-checklist.md`. The `.gitignore` step precedes every `npm install` and appends nothing twice when re-run.

## Boundaries

- No join flow, no bundle files, no rule content.
- No new tools or scripts.
- No fix of the issue bundle's unguarded append; report it, do not edit that bundle.
