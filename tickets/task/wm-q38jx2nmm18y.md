---
schema: 1
id: wm-q38jx2nmm18y
title: Write setup's rule bundle
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T00:47:55Z
updated_at: 2026-11-10T00:47:55Z
parent: wm-ygnttse5hd5k
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write setup's bundle: `bundle/setup.md`, `bundle/rules/rules-git.md`, and `bundle/rules/rules-checklist.md`.

1. `bundle/setup.md` carries the five sections: What this installs (the two rule files into `.agents/rules/`), Tools (none), Rules (the copy command for Unix and PowerShell, with absent, identical, and different handling), External steps (none), Verify (the installed files match the bundle's copies).
2. `rules-git.md` states: the default branch is protected and changes reach it through pull requests; never commit or push to the default branch directly; do the work on your own branch; one commit per logical change, with a subject saying what changed and a body saying why.
3. `rules-checklist.md` carries the fifteen checks, one per line, each with its command and expected result, starred where the session-start run covers them. It states the two triggers: session start runs the starred checks; a feature that turns out to be unavailable runs all fifteen. It is read-only: report the failing check and the command that fixes it, fix nothing.
4. The rule files carry no front matter and their names start with `rules`.

## Acceptance signal

Copying `bundle/rules/*.md` into `.agents/rules/` reproduces both files byte for byte, and `bundle/setup.md`'s Verify section says how to check that. `npx skills add ./weave-your-work --list` still lists `setup`. The checklist rule carries all fifteen checks, and no rule file points at a file outside `.agents/rules/`.

## Boundaries

- No flow documents.
- No language rule and no tool scripts.
