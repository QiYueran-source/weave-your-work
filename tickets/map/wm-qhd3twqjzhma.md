---
schema: 1
id: wm-qhd3twqjzhma
title: 'Execution skills: map, task, and glossary'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T09:24:09Z
updated_at: 2026-11-06T12:45:31Z
parent: wm-wjwa9081hse1
custom_fields:
  phase: exploring
---
## Target

Design the three execution-category skills: map, task, and glossary. The chain runs from target maps to task advancement to acceptance, with waymark as the single tracker and clear ownership (one owner per item, the owner advances and accepts).
Why: this category answers whether work is advancing, who is accountable, and where it is stuck; the other categories route to it or support it.

## Acceptance direction

The three skill maps are accepted (each skill's own children are done and no further child is needed), and the category's cross-skill questions below are settled or ruled out.

## Children

- [Map skill](tickets/map/wm-0b59r7xfhk73.md): the node that answers "what I want"
- [Task skill](tickets/map/wm-87pgn0b75yy5.md): the leaf that answers "what I will do"
- [Glossary skill](tickets/map/wm-rq3exm0m5563.md): one vocabulary, per-person JSONL sources, one generated view

## Decisions so far

- Semantic model: the target tree refines layer by layer; every node is a target and parent-child is refinement, not sequence; ordering is expressed by dependency edges, not node chains. The tree carries structure, edges carry order. A leaf (task) is the end of the refinement chain: refined from the root to the point of execution; leaves are parallel refinement branches, not a progression order; ordering comes only from dependency edges (user confirmed, recorded in GLOSSARY).
- Unified naming: the goal term is dropped; every target node is called a map. map answers "what I want", the root map is the overall goal, and a map's children are more refined targets; task is the finest level, declaring an action and its verifiable result (user confirmed, recorded in GLOSSARY).
- Nesting criterion: a map may hang child maps; depth is decided by "can a concrete action and verifiable result be written", and keep it as small as possible; a child map must have an owner and an acceptance direction (user confirmed direction).
- Ownership model: one owner per item, owner advances and accepts; no executor field (user confirmed).
- Task types: delivery (failure is an incident) and probe (failure is a normal result), with a reversibility marker; details reference skills-ref later (user confirmed).
- Acceptance: judged by a non-executor against signals agreed in advance, distinguishing done/not done/cannot judge; a map is accepted when all its child maps and tasks are complete and no further children are needed (user confirmed; details to follow).
- map template: six sections, fixed. Target states the goal in one line plus Why in one or two lines; the target does not name a solution. Acceptance direction gives the observable state when writable and otherwise falls back to "all children done and no further children needed" plus a review point. Children is a human-readable mirror of waymark's parent relation; waymark is the source of truth and the body list is updated whenever a child is added or removed. Decisions so far holds one line per decision with its source; major decisions become ADRs linked from the list. Not yet specified holds fog that graduates into a child or is cleared. Out of scope holds every "not doing" item with a one-line reason; the boundaries of the goal live there too, so there is only one place for exclusions (user confirmed).
- map frontmatter: no extra custom fields beyond phase. title, category, status, owner, creator, parent and dependency cover the rest; target, acceptance direction, children, decisions, fog and exclusions are body text because they are long-form (user confirmed direction).
- Skill layer: the category's children are skill maps, not tasks. Each skill is a target with several function details still in fog, so it gets a map layer of its own; function details become tasks under that skill map when they can be written as an action plus a verifiable result (user confirmed).

## Not yet specified

- Phase split: whether exploring/planned/delivering/reviewing stays.
- Who may advance: the boundary of owner advancement, who may read, agent proxy rules.
- Claim: without an executor field, whether claiming equals start (open to in_progress).
- Concurrency and handover: how non-owners participate, replacement rules.
- The exact rules for the task_kind field and the reversibility marker; task frontmatter will need a reversibility value (one_way/two_way), set when the task template is designed.
- Acceptance rules in detail (how independent source, rehearsal, small batches, third-party review land).
- Git collaboration: branches, sync, conflict handling, when a claim becomes visible.
- Whether the local comment category stays.
- The full rules for delivery and probe tasks (reference skills-ref).
- Glossary same-name conflict rules (deferred by the user).

## Out of scope

- Software-specific workflows (TDD, code review, and so on).
- GitHub/Gitee issue triage (communication category).
