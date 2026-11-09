---
schema: 1
id: wm-hfs0qa6h35yx
title: Map and task work-record rules
category: map
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-09T01:38:28Z
updated_at: 2026-11-09T01:39:08Z
parent: wm-qhd3twqjzhma
custom_fields:
  split_as: task
---
## Target

Make map and task work records discoverable as project rules, so a team records design decisions and work as it advances.

Why: a skill loaded only on demand cannot ensure the target and the work remain recorded throughout a session.

## Acceptance direction

The map and task skills each supply an installable rule and setup instructions; the rules cover discussion, advancement, changes and recovery when a record was missed. The grill hand-off and map procedure agree with those rules. The future total setup has a recorded requirement to include both bundles. All children are complete and no further children are needed.

Review point: read the rules and hand-offs against the decisions below, and check both setup guides for safe copying and verification.

## Decisions so far

- Create two bundle rules, one owned by map and one by task. Grill and update do not need separate bundle rules. Source: user confirmation.
- Feature design uses a map; before project-design grill, find or create its map. Pure consultation, ordinary conversation and read-only investigation do not require work tickets. Source: user confirmation.
- Before advancing concrete work, find or create its task and update the ticket first. A small result still needs a task, which can cover multiple actions contributing to that result. Source: user confirmation.
- During grill, record the discussion in testimony and promptly land settled decisions and changes in the owning map or task. Do not create one task per question. Source: user confirmation.
- If work advanced without a ticket, record what actually happened afterward without presenting it as a prior plan or inventing a passed review. Source: user confirmation.
- Use update for any split map and for closed maps and tasks; an open unsplit map can be edited directly. The update skill decides whether a verdict still holds and whether to reopen or replace. Source: user confirmation.
- Each bundle setup copies its rule into `.agents/rules/`, skips an identical file and asks the person before replacing a different file. The total setup explicitly lists map and task once implemented. Source: user confirmation.

## Not yet specified

(none for the agreed scope)

## Out of scope

- Implementing the total setup skill.
- Separate grill or update bundle rules.
- Worked examples and whole-set end-to-end testing; the root map owns their batch.
