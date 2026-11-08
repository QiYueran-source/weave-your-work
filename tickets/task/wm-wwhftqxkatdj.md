---
schema: 1
id: wm-wwhftqxkatdj
title: Write the submap reference
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T10:46:06Z
updated_at: 2026-11-08T10:48:06Z
closed_at: 2026-11-08T10:48:06Z
parent: wm-nnjk0yb5wbd9
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/split/submap.md`, the reference for splitting a map into child maps.

1. Write the decision test for a child map: the part cannot be written as one action with one auditable standard, or it has several independent directions that need their own owner.
2. Write the minimal child body: `Target` required; `Not yet specified` when the part still has fog; `Acceptance direction` defaulting to the standard clause; the rest optional. Point at `body.md` for the shape and restate none of it.
3. State where a child's content comes from: the parent's settled decisions and clarified `Target`, with no one-to-one mapping between decisions and children. A written child must not conflict with its parent or its siblings; a conflict is merged, adjusted, or asked back before the child is written.
4. State what a child never carries: the parent's `Decisions so far` and `Out of scope` are not copied. A parent decision the child needs is linked, not restated.
5. Write the creation as commands: `waymark create --category map --title ... --owner <parent owner> --parent <map>` for each child, with `--field split_as=submap` written on the parent map at the first split, then `waymark tree --root <map>` to read the shape back. Say that nothing is written on the parent's body.
6. Cover the one-child case: a single child that is a pure refinement is a valid split when grill has clarified it.

## Acceptance signal

`weave-your-work/split/submap.md` exists. A reader holding a settled layer can decide that it splits into child maps, decide how many, and write each child body from this file plus `body.md`, without asking its author. The file restates no rule of `body.md`.

## Result

`weave-your-work/split/submap.md` is written, 73 lines. It covers the decision test for a child map, the minimal child body, where the content comes from, what a child never inherits from its parent, the create commands including the `split_as` write on the parent, the one-child case, and the two situations that send a part back to grill. It names `body.md` for the body shape rather than restating it.

What it has not done: no real map has been split through it. The sample split its acceptance originally named is part of the one batch the root map defers, so the file is written and unexercised.

## Review

passed

- Goal: the reference exists; the decision test, the minimal body, the source of a child's content, the create commands, the one-child case, and the return-to-grill rule are all stated; `body.md` is named and not restated. Read against the acceptance signal line by line.
- Convention: only `weave-your-work/split/submap.md` was written by this task; the ticket edits were the run's own `Result`, `Review`, and status.

## Boundaries

- No task reference. That is `task.md`.
- No criterion or routing. Those are in `SKILL.md`.
- No fog clearing. That is fog-explore.
