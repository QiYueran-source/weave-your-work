---
schema: 1
id: wm-wjwa9081hse1
title: 'Work-weave: general team collaboration skill set'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T09:12:59Z
updated_at: 2026-11-06T09:53:58Z
custom_fields:
  phase: exploring
---
## Destination

Form an installable skill set for general team collaboration under weave-your-work, using waymark as the single tracker and carrying goal, task, claim, and acceptance through one chain. Ownership is clear: one owner per item, the owner advances and accepts. It suits any domain and is not limited to software development.

## Notes

- Category split (decided): entry (ask-me), environment (setup), execution (map, task), communication (issue). Each category can hold several skills; this round opens one map per category.
- One map per category, listed under "Sub-maps". Design decisions live in each sub-map; this map is an index only and does not restate them.
- Reference sources: matt skill set (.inbox/skills), reference skills (.inbox/skills-ref), design notes (.inbox/work-methods/).
- Key findings (general-methods.md): name uncertainty explicitly, move judgment away from the executor, externalize conclusions into artifacts others can read; the primitive is the question protocol; three gaps to close (irreversibility, decision authority placement, ungrillable questions need probes).

## Sub-maps

- [Entry skills: ask-me routing and questioning](tickets/map/wm-8wzzh4hp5evp.md)
- [Environment skills: setup initialization and checks](tickets/map/wm-a08fwanmy5q6.md)
- [Execution skills: map and task collaboration](tickets/map/wm-qhd3twqjzhma.md)
- [Communication skills: issue remote exchange](tickets/map/wm-25b3q7mg88c7.md)

## Decisions so far

- Delivery shape: a skill set under weave-your-work, one map per category (user confirmed).
- Category split: entry/environment/execution/communication, one map per category (user confirmed).
- Ownership model: one owner per item, owner advances and accepts; no executor field (user confirmed).
- Task types: delivery and probe, with a reversibility marker; details reference skills-ref later (user confirmed).
- Acceptance: judged by a non-executor against signals agreed in advance, distinguishing done/not done/cannot judge; details later (user confirmed direction).
- ask-me is one whole skill, covering the question protocol, decision records, and glossary (user confirmed).

## Not yet specified (cross-category coordination)

- Dependencies between skills: how ask-me routes to execution and communication skills.
- Which map maintains the shared glossary, and which file it lives in.
- Installation and distribution: reference matt's skill configuration mechanism, optional.
- Number of acceptance scenarios and eval prompts, and how passing is judged.
- Whether the local comment category stays.
- Skills that may join each category later (retro, handoff, and so on); not this round.

## Out of scope

- Software-specific workflows (TDD, code review, and so on).
- The full issue triage state machine (if ever, a communication-category later design).
- External connectors and automatic sync.
