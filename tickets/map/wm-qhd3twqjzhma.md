---
schema: 1
id: wm-qhd3twqjzhma
title: 'Execution skills: map and task collaboration'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T09:24:09Z
updated_at: 2026-11-06T09:54:21Z
custom_fields:
  phase: exploring
---
## Destination

Design the map and task skills: the complete collaboration chain from target maps to task advancement to acceptance, with waymark as the single tracker and clear ownership (one owner per item, the owner advances and accepts). Suits any domain. This is the core category.

## Notes

- Category: execution. Answers "is the work advancing, who is accountable, where is it stuck".
- Delivery location: map/ and task/ skill directories under weave-your-work/ (to be created).
- Glossary: GLOSSARY.md (created; map/task/target tree/dependency edge/refinement/advance/claim/delivery task/probe task/reversibility/acceptance signal/frontier defined).
- Design notes: .inbox/work-methods/domain-and-conventions.md, general-methods.md, reference-skills-comparison.md.
- Key findings: name uncertainty explicitly, move judgment away from the executor, externalize conclusions into artifacts; the primitive is the question protocol; three gaps to close (irreversibility, decision authority placement, ungrillable questions need probes).

## Decisions so far

- Semantic model: the target tree refines layer by layer; every node is a target and parent-child is refinement, not sequence; ordering is expressed by dependency edges, not node chains. The tree carries structure, edges carry order. A leaf (task) is the end of the refinement chain: refined from the root to the point of execution; leaves are parallel refinement branches, not a progression order; ordering comes only from dependency edges (user confirmed, recorded in GLOSSARY).
- Unified naming: the goal term is dropped; every target node is called a map. map answers "what I want", the root map is the overall goal, and a map's children are more refined targets; task is the finest level, declaring an action and its verifiable result (user confirmed, recorded in GLOSSARY).
- Nesting criterion: a map may hang child maps; depth is decided by "can a concrete action and verifiable result be written", and keep it as small as possible; a child map must have an owner and an acceptance direction (user confirmed direction).
- map functional goal: map answers "what I want", stating the goal, why it is worth doing, boundaries, and acceptance direction, and hangs one or more tasks. task answers "what I will do", the finest level, declaring an action and its verifiable result (user confirmed).
- Ownership model: one owner per item, owner advances and accepts; no executor field (user confirmed).
- Task types: delivery (failure is an incident) and probe (failure is a normal result), with a reversibility marker; details reference skills-ref later (user confirmed).
- Acceptance: judged by a non-executor against signals agreed in advance, distinguishing done/not done/cannot judge; a map is accepted when all its child maps and tasks are complete and no further children are needed (user confirmed; details to follow).

## Not yet specified

- Phase split: whether exploring/planned/delivering/reviewing stays.
- Who may advance: the boundary of owner advancement, who may read, agent proxy rules.
- Claim: without an executor field, whether claiming equals start (open to in_progress).
- Concurrency and handover: how non-owners participate, replacement rules.
- The exact rules for the task_kind field and the reversibility marker.
- Acceptance rules in detail (how independent source, rehearsal, small batches, third-party review land).
- Git collaboration: branches, sync, conflict handling, when a claim becomes visible.
- Whether the local comment category stays.
- The full rules for delivery and probe tasks (reference skills-ref).

## Out of scope

- Software-specific workflows (TDD, code review, and so on).
- GitHub/Gitee issue triage (communication category).
