---
schema: 1
id: wm-a1s6s639yy3h
title: Rewrite the grill skill entry
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

Rewrite `weave-your-work/grill/SKILL.md` as the entry and contract, with the method in `how-to-grill.md` and the record in `testimony.md`.

1. Keep the trigger: a plan, decision, or idea is still fuzzy; `fog-explore`, `split`, or `review` reaches a decision it cannot settle alone. Grill is model-invoked.
2. Before the first question: name the subject in one sentence, create the testimony item, link it to the discussion's work item, and read `how-to-grill.md`.
3. Point at the method for the rounds; do not restate the question tree, askable set, fact rule, or hand-off rule.
4. State what the run writes: the testimony (one update per round), terms through the glossary skill, ADRs through the ADR skill, and work handed off with a `work:` line.
5. State the output contract and the boundaries.

## Acceptance signal

`weave-your-work/grill/SKILL.md` exists and installs with `npx skills add`. A reader can start a grill from it: name the subject, create the testimony, and follow `how-to-grill.md` for the rounds. The entry points at `how-to-grill.md` and `testimony.md`, names the glossary and ADR skills, and restates none of their rules.

## Result

`weave-your-work/grill/SKILL.md` is rewritten as the entry and contract. It names the trigger, the testimony item, the method pointer, the three artifact writes, the work hand-off, the output contract, and the boundaries. `npx skills add ./grill --list` found 1 skill and printed no skip.

## Review

passed

- Goal: the `Acceptance signal` asks for an entry a reader can start a grill from, pointing at the method and the record and restating neither. The file does that.
- Convention: no `Boundaries` line was crossed; the run wrote the entry and this task's `Result` and `Review` only.

## Boundaries

- No method detail; that is `how-to-grill.md`.
- No record format; that is `testimony.md`.
- No glossary, ADR, split, review, or ticket rules.
