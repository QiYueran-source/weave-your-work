---
schema: 1
id: wm-af0w4tnv5sga
title: Write the grill skill entry
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T11:24:43Z
updated_at: 2026-11-08T13:25:11Z
closed_at: 2026-11-08T11:26:53Z
parent: wm-eq3r9xrb7w2j
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/grill/SKILL.md`, the entry for the discussion skill.

1. State the trigger: a plan, decision, or idea is still fuzzy; explore, split, or review reaches a decision it cannot settle alone. Grill is model-invoked.
2. Write the protocol: one round covers the whole frontier; number each question and give a recommended answer; use the harness's choice feature when options are selectable; facts are the run's job, decisions the user's; wait for answers, recompute the frontier, stop when it is empty and the user confirms shared understanding.
3. Say what the run writes: the testimony (open it before the first question; edit it as the discussion moves), a settled term through the glossary skill, and a decision through the ADR skill when it passes the three gates.
4. Say what it does not write: map decisions, split results, and task creation go back to the caller; a standalone grill returns its conclusions to the user with the ticket each one belongs to.
5. State the output contract: the clear conclusions, the testimony path, and the path of every term and ADR written.
6. End with what it does not do: clear fog, split, review, write tickets, or design an issue.

## Acceptance signal

`weave-your-work/grill/SKILL.md` exists and installs with `npx skills add`. A reader given a plan and a user can run one round, know where the testimony is, and know which skill owns each artifact; the file names `grill/testimony.md`, the glossary skill, and the ADR skill, and restates no landing rule that belongs to a branch.

## Result

`weave-your-work/grill/SKILL.md` is in place. It states the trigger, the round protocol, the three artifact writes, the output contract, and its boundaries. `npx skills add ./grill --list` parsed the front matter and found 1 skill; a temp install copied it with no skip.

## Review

passed

- Goal: the `Acceptance signal` asks for an installed entry that lets a reader run one round and name where each artifact lands. The file does that, names `grill/testimony.md`, the glossary skill, and the ADR skill, and restates none of their landing rules.
- Convention: no `Boundaries` line was crossed; the run wrote the skill file and this task's `Result` and `Review` only.

## Boundaries

- No fog resolution, splitting, review, or ticket writing.
- No glossary, testimony, or ADR file format; those live in their branches.
