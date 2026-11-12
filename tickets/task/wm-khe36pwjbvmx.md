---
schema: 1
id: wm-khe36pwjbvmx
title: Rebuild the set as records and actions, and check it
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-11T16:06:25Z
updated_at: 2026-11-11T16:06:42Z
closed_at: 2026-11-11T16:06:42Z
parent: wm-m43cgx3m5b8c
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Produce the v2 skill set under `weave-your-work/`: each record defined once under the owning skill's `res/`, five mainline actions, auxiliary actions, all installable parts under `setup/`, and every rule stated as an assertion with its check.

1. Move the bundle rules and tools under `weave-your-work/setup/`, and update every path that named them.
2. Write `waymark/res/` for what every record shares, and one `res/` per record kind: map, task, testimony, ADR, glossary entry, issue, handoff, patrol report.
3. Write the five mainline actions and the twelve auxiliary actions, each with its transformation.
4. Write `MAINLINE.md`, `ASSERTIONS.md`, and the router `ask-me/SKILL.md`.
5. Write `scripts/check-records.mjs` with a baseline for records that predate the assertions, and `scripts/check-references.mjs`.
6. Wire both checks into CI, and run every check.

## Acceptance signal

Four commands, run from the project root, with these results:

- `npm test` passes every test;
- `node scripts/check-references.mjs .` reports 0 findings;
- `node scripts/check-records.mjs . --baseline scripts/check-records-baseline.json` reports 0 new findings;
- `node weave-your-work/setup/tools/check-setup.mjs --all` reports no failed check;
- an install of the set from a clean checkout lists 22 skills, all with valid front matter.

## Boundaries

- The tracker's fields and categories are unchanged.
- No v1 skill file is kept alongside its v2 replacement.
- The worked examples' inner ticket stores are not migrated.

## Result

The set is rebuilt on commit `e13d218` of branch `v2-resources-and-actions`.

- **Records**: `waymark/res/` holds what every record shares (fields, relations, categories, change dispositions); `map/res/`, `task/res/`, `grill/res/`, `adr/res/`, `glossary/res/`, `issue/res/`, `handoff/res/`, and `stop-and-wait/res/` each hold one record kind. Every resource is 60 lines or fewer, holds no step procedure, and states its rules as assertions tagged with the check that decides them.
- **Actions**: the five mainline actions are `split`, `fog-explore`, `advance-task`, `task-review`, `map-review`, named once in `MAINLINE.md`. The seventeen other actions are auxiliary and add no step to the line.
- **Installs**: `weave-your-work/setup/rules/` (eight rules), `setup/tools/` (setup check, root resolver, glossary and issue runtimes), and `setup/install.md`, `install-glossary.md`, `install-issue.md`. No skill outside `setup` carries a `bundle/`.
- **Setup**: `configure-project.md` explores, presents, confirms, then writes; `join-project.md` fills what a clone cannot carry; `check-project.md` reports and repairs nothing.
- **Checks**: `scripts/check-records.mjs` (147 records before this task, 152 known legacy findings in `scripts/check-records-baseline.json`) and `scripts/check-references.mjs` (22 skills). Both run in `verify.yml`.

Evidence, run from the project root:

```
$ npm test            # 85 pass, 0 fail
$ node scripts/check-references.mjs .
0 findings across 22 skills
$ node scripts/check-records.mjs . --baseline scripts/check-records-baseline.json
0 new findings across 149 records, 152 known
$ node weave-your-work/setup/tools/check-setup.mjs --all
17 checks: 17 ok, 0 not applicable, 0 unverified, 0 failed
$ npx skills add . -g -y -a codex   # in a clean checkout, 22 installed
Checked 22 skills: all installed, front matter valid.
```

The work was done before this task was written: the branch carries the commits, and the task records what they produced, as the project rules require.

## Review

passed
- Goal: all five acceptance commands were run after the last change, and their output is in `Result`. The install was checked from a clean copy of the tree, not from the working directory with its local `.agents/skills` copies, so the count reflects what a stranger gets.
- Convention: the task's boundaries hold — the tracker's configuration is unchanged (`waymark validate` is healthy, 6 fields, 3 categories), no v1 skill survives beside its replacement, and no example store was migrated. The change is one commit plus this record, and the field writes went through waymark.
