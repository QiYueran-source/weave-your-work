---
schema: 1
id: wm-v5hnrd4nh1wg
title: Rewrite the testimony reference
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T12:56:36Z
updated_at: 2026-11-08T12:57:13Z
closed_at: 2026-11-08T12:57:13Z
parent: wm-31f6a2c9d840
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Rewrite `weave-your-work/grill/testimony.md`, the record of a grill, as a waymark record item.

1. State the item: category `testimony` at `testimony/`; title is the topic; owner is the person the grill is for; creator is the operator or agent; status open while the grill runs, closed when it ends. No date or operator prefix.
2. State the body: `Question tree` with checkboxes and notes, rewritten at the end of each round; `Discussion` appended at the end of each round. One body write per round.
3. State the hand-off: work leaves with a `work:` line; the caller creates the item; the testimony does not create or track work.
4. State the links: soft link to the discussion's work item and to hand-offs; tickets cite with a relative link after close.
5. State what it does not hold: research, run history, ticket conclusions, a summary written after the fact.

## Acceptance signal

`weave-your-work/grill/testimony.md` exists and is pointed at by `grill/SKILL.md`. A reader can create the testimony item, write the tree and the discussion once per round, mark work with `work:`, link it, and cite it after close. The reference does not tell the reader to create a ticket per question or to use a date/operator file name.

## Result

`weave-your-work/grill/testimony.md` is rewritten as the record item: category, topic title, owner, creator, open/closed status, soft links; a two-section body written once per round; a `work:` hand-off line; the citation rule. The grill `SKILL.md` points at it.

## Review

passed

- Goal: the `Acceptance signal` asks for a reader who can create the item, write the tree and the discussion per round, mark work, link it, and cite it after close. The reference holds each rule.
- Convention: no `Boundaries` line was crossed; the run wrote the reference and this task's `Result` and `Review` only.

## Boundaries

- No method; that is `how-to-grill.md`.
- No glossary, ADR, or split rules.
- No work-item tracking.
