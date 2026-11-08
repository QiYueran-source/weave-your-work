---
schema: 1
id: wm-scn1x5hk7ps3
title: Write the fog-explore skill
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T10:48:20Z
updated_at: 2026-11-08T10:49:02Z
closed_at: 2026-11-08T10:49:02Z
parent: wm-3084re0f48z3
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/fog-explore/SKILL.md`, the skill whose only job is to empty a map's `Not yet specified` section.

1. State the one responsibility and the trigger: the section is not empty. Explore resolves the entries; it never creates children and never splits.
2. Write the common skeleton every type follows: judge how concrete the entry is, act when it is not, land it when it is, strike it through.
3. Write one flow per built-in type:
   - Assumption: research for support first. Confirmation usually cannot come from a fact, so support, a probe, or accepting it as reasonable are the three outcomes. Supported lands in `Decisions so far` with its evidence. Refuted updates `Target`, `Acceptance direction`, or `Out of scope`, and records the counter-evidence.
   - Fact to establish: research locally and online, with a source. When neither yields a reliable answer, ask the owner through grill; when the owner does not know, an issue asks someone who does.
   - Decision to make: when the owner cannot decide because information is missing, do not force it. Turn it into an assumption entry or a probe task. A landed decision goes to `Decisions so far`.
   - Goal to clarify: discuss with the owner, then update `Target`, and `Acceptance direction` with it when the bar moves.
4. State where each landing goes and that explore only marks an item as splittable: creating the child is split's job.
5. Name grill for the discussion and the testimony records for what a discussion leaves behind, without restating either.
6. Keep the file to the clearing flows: the trigger, the completion check, and the hand-off to split belong to the map operating procedure.

## Acceptance signal

`weave-your-work/fog-explore/SKILL.md` exists. It states one responsibility, the common skeleton, and a flow for each of the four built-in fog types with where each one lands. It says explore never creates children. It names grill and the testimony records rather than restating them. A reader holding a map with fog can clear it from this file.

## Result

`weave-your-work/fog-explore/SKILL.md` is written. It states one responsibility and one trigger, the four-step skeleton, a flow for each of the four built-in fog types with what each one lands, a table for where the landings go, and five things explore never does. It names grill and the testimony records instead of describing the discussion itself.

What it has not done: no map's fog has been cleared with it. The sample clearing its map's acceptance originally named is the worked example the root map defers to one batch.

## Review

passed

- Goal: the file exists; one responsibility, the skeleton, four flows with their landings, the landing table, and the never-does list are all present; grill and the testimony records are named, not restated; explore never creates a child. Read against the acceptance signal line by line.
- Convention: only `weave-your-work/fog-explore/SKILL.md` was written by this task; the ticket edits were the run's own `Result`, `Review`, and status, plus the acceptance strike this review records.

## Boundaries

- No splitting and no child creation. Those are the split skill.
- No fog entry formats. Those are `body.md` in the map skill.
- No grill technique. That is the grill skill.
- No trigger, completion check, or hand-off. Those are the operating procedure.
