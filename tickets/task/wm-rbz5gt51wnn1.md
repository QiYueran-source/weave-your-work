---
schema: 1
id: wm-rbz5gt51wnn1
title: Write the map skill entry
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-09T00:28:10Z
updated_at: 2026-11-09T00:28:13Z
closed_at: 2026-11-09T00:28:13Z
parent: wm-v4z2wbv8sz4z
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/map/SKILL.md`, the entry that tells a reader what a map is and which reference answers their question.

1. State what a map is in two sentences: a target, refined by children, accepted when its acceptance direction holds. Every target node is a map; the root has no parent.
2. Name the three references and the one question each answers, so a reader can pick without opening them.
3. Name the skills that run the steps — fog-explore, split, map-review, update — and grill as the discussion method. Describe none of them.
4. Say when to open this skill, and what it does not do.
5. State what a map is not: not a task, and not a plan.
6. Keep it short. Every rule lives in one of the three references.

## Acceptance signal

`weave-your-work/map/SKILL.md` exists. A reader can name the file that answers their question without opening the other two, and no rule from `body.md`, `frontmatter.md`, or `procedure.md` is repeated in it.

## Boundaries

- No body, field, or procedure rules.
- No description of the four step skills.

## Result

`weave-your-work/map/SKILL.md` is written. It states what a map is, gives the three references with the one question each answers, names the four step skills and grill in a single line each, and closes with what a map is not and what the entry does not do.

Two choices the ticket left open: the references are a table rather than prose, and the "a map is not a task" paragraph points at `task-design` instead of describing a task, because an entry that describes a task is a second copy of that skill.

## Review

passed

- Goal: the file exists; it names the three references and what each holds, names the four step skills without describing them, and states what a map is not. Read against the acceptance signal line by line: no rule from `body.md`, `frontmatter.md`, or `procedure.md` is repeated in it.
- Convention: only `weave-your-work/map/SKILL.md` was written by this task; the ticket edits were the run's own `Result`, `Review`, and status.

## Boundaries

- No body, field, or procedure rules.
- No description of the four step skills.
