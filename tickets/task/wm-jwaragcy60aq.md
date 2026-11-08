---
schema: 1
id: wm-jwaragcy60aq
title: Write the how-to-grill reference
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T12:56:36Z
updated_at: 2026-11-08T12:57:13Z
closed_at: 2026-11-08T12:57:13Z
parent: wm-7zvr8cnts3rs
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/grill/how-to-grill.md`, the method for a grill.

1. Define the question tree: nodes are open questions; a child refines its parent; siblings are parallel. It is not the target tree.
2. Define the askable set: questions whose prerequisites are settled; ask the whole set in one round; number and recommend; wait for answers; recompute.
3. Write the fact rule: a fact the agent can check is the agent's; a fact only a person knows is asked; a fact nobody knows becomes an assumption or a probe. The person may not be the decider; "ask X" is a wait.
4. Write the recommendation rule: give a basis, or say what you need to know.
5. Write the hand-off rule: work leaves the testimony with a `work:` line; the caller creates the item; the grill does not create work items.
6. Write the finish: the askable set is empty; branches are settled, deferred, handed off, or out of scope; the user confirms.
7. Add a short general-work example with two rounds.

## Acceptance signal

`weave-your-work/grill/how-to-grill.md` exists. A reader given a subject can build the question tree, compute the askable set, run a round, handle a fact/person/unknown, hand off work, and know when to stop. It uses `refine`, `hand off`, and `split` with the glossary's meanings, and its example is general work, not software.

## Result

`weave-your-work/grill/how-to-grill.md` is in place. It defines the question tree, the askable set, the round, the fact/person/unknown rule, the recommendation basis, the work hand-off, the finish, and a two-round general-work example. It uses `refine`, `hand off`, and `split` with the glossary's meanings.

## Review

passed

- Goal: the `Acceptance signal` asks for a method a reader can run from a subject. The file covers each step, and the example walks two rounds.
- Convention: no `Boundaries` line was crossed; the run wrote the method and this task's `Result` and `Review` only.

## Boundaries

- No testimony format; that is `testimony.md`.
- No target-tree split rules; the split skill owns them.
- No glossary, ADR, or review rules.
