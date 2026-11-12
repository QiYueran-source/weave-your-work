---
schema: 1
id: wm-gs5me4bksghq
title: Describe what changed for a user in both READMEs and the conformance document
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-12T07:42:19Z
updated_at: 2026-11-12T07:42:11Z
parent: wm-4n3skak99g1c
custom_fields:
  needs_human: false
  reversibility: one_way
  task_kind: delivery
---
## Action

The branch adds `whole-review` and changes what the reviews demand, and neither README mentions either, so a user installs a set whose front page does not describe it. Both READMEs and the conformance document are brought in line.

1. Read `weave-your-work/ask-me/SKILL.md` and `weave-your-work/MAINLINE.md` and list every skill and action a person can reach.
2. Add to `README.md` and `README.zh-CN.md` what changed for a user: the reviews now give a verdict per axis, `whole-review` runs before `map-review`, and a record's decisions, review, and exclusions are added or struck rather than rewritten.
3. In `docs/v2-conformance.md`, strike the rows the branch made false, including the claim that no action links into another action's folder.
4. Run the three checks and record their output in `Result`.

## Acceptance signal

Every action named in `ask-me` appears in both READMEs, and the three checks' output is quoted in `Result`. The struck rows in `docs/v2-conformance.md` each name what replaced them.

## Boundaries

- The READMEs keep their length and tone; this adds what changed, not a catalogue.

## Failure recovery

Only documentation changes; a wrong sentence is reverted with `git revert`.
