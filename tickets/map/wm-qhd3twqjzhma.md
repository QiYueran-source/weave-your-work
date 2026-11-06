---
schema: 1
id: wm-qhd3twqjzhma
title: 'Execution skills: map, task, glossary, and explore'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T09:24:09Z
updated_at: 2026-11-06T16:48:19Z
parent: wm-wjwa9081hse1
---
## Destination

Design the map, task, glossary and explore skills: the complete collaboration chain from target maps to task advancement to acceptance, with waymark as the single tracker and clear ownership (one owner per item, the owner advances and accepts). Suits any domain. This is the core category.

## Notes

- Category: execution. Answers "is the work advancing, who is accountable, where is it stuck".
- Delivery location: map/, task/, explore/ and glossary/ skill directories under weave-your-work/ (to be created).
- Glossary: GLOSSARY.md (created; ticket/issue/comment/map/task/target tree/dependency edge/refinement/arrive/advance/claim/delivery task/probe task/reversibility/acceptance signal/frontier defined).
- Design notes: .inbox/work-methods/domain-and-conventions.md, general-methods.md, reference-skills-comparison.md.
- Key findings: name uncertainty explicitly, move judgment away from the executor, externalize conclusions into artifacts; the primitive is the question protocol; three gaps to close (irreversibility, decision authority placement, ungrillable questions need probes).
- Reference degree: take domain-neutral methods only. Product-specific tools such as A/B tests, fake-door tests, prototypes, and Wizard of Oz stay out of the general skill; abstract them to "smallest reversible action" and "measure behavior, not opinions".

## Children

- [Map skill](tickets/map/wm-0b59r7xfhk73.md): the node that answers "what I want"; six-section body, children, acceptance.
- [Task skill](tickets/map/wm-87pgn0b75yy5.md): the leaf that becomes claimable and verifiable.
- [Glossary skill](tickets/map/wm-rq3exm0m5563.md): one vocabulary with per-person sources and a generated view.
- [Grill skill: discuss and clarify](tickets/map/wm-7zvr8cnts3rs.md): discusses an idea and lands the outcomes.

## Decisions so far

- Semantic model: the target tree refines layer by layer; every node is a target and parent-child is refinement, not sequence; ordering is expressed by dependency edges, not node chains. The tree carries structure, edges carry order. A leaf (task) is the end of the refinement chain: refined from the root to the point of execution; leaves are parallel refinement branches, not a progression order; ordering comes only from dependency edges (user confirmed, recorded in GLOSSARY).
- Unified naming: the goal term is dropped; every target node is called a map. map answers "what I want", the root map is the overall goal, and a map's children are more refined targets; task is the finest level, declaring an action and its verifiable result (user confirmed, recorded in GLOSSARY).
- Nesting criterion: a map may hang child maps; depth is decided by "can a concrete action and verifiable result be written", and keep it as small as possible; a child map must have an owner and an acceptance direction (user confirmed direction).
- Split criterion: a fog item or a target arrives as a task when one action and one verifiable result can be written and one person can finish and verify it in one go; otherwise it becomes a child map. Prefer a task over a child map; a child map is used only when the item still has several independent directions, needs its own owner, or needs its own phase (user confirmed, recorded in GLOSSARY as arrive).
- map functional goal: map answers "what I want", stating the goal, why it is worth doing, and acceptance direction, and hangs one or more tasks. task answers "what I will do", the finest level, declaring an action and its verifiable result (user confirmed).
- Ownership model: one owner per item, owner advances and accepts; no executor field (user confirmed).
- Task types: delivery (failure is an incident) and probe (failure is a normal result), with a reversibility marker; details reference skills-ref later (user confirmed).
- Acceptance: judged by a non-executor against signals agreed in advance, distinguishing done/not done/cannot judge; a map is accepted when all its child maps and tasks are complete and no further children are needed (user confirmed; details to follow).
- map template: six sections, fixed. Target states the goal in one line plus Why in one or two lines; the target does not name a solution. Acceptance direction gives the observable state when writable and otherwise falls back to "all children done and no further children needed" plus a review point. Children is a human-readable mirror of waymark's parent relation; waymark is the source of truth and the body list is updated whenever a child is added or removed. Decisions so far holds one line per decision with its source; major decisions become ADRs linked from the list. Not yet specified holds fog that arrives as a child or is cleared. Out of scope holds every "not doing" item with a one-line reason; the boundaries of the goal live there too, so there is only one place for exclusions (user confirmed).
- map frontmatter: `split_as` (submap / task, written at split time). title, category, status, owner, creator, parent and dependency cover the rest; target, acceptance direction, children, decisions, fog and exclusions are body text because they are long-form (user confirmed direction).
- Node outcomes: a node ends in one of three states. completed closes it as achieved. failed keeps the record: status closed plus the outcome field set to failed, and a replacement node opened as a sibling with a soft link between them. archived retires a node that was never done or whose direction proved wrong (user confirmed; outcome field declared).
- Fog exploration: before choosing a route, turn each fog item into a testable assumption and rank assumptions by impact times risk; test high-impact, high-risk ones first. Then route by where the answer lives: in someone's head, use conversation; in reality, use a probe task. Conversation asks about past behaviour and specific examples, not opinions; a probe uses the smallest reversible action and measures behaviour, not opinions. Methods stay domain-neutral: no A/B tests or other product-specific tools (user confirmed direction).
- Terminology sync: issue means a GitHub or Gitee issue; ticket means the local waymark document (map or task); comment means a record synced back from an issue, using waymark's comment category for now (user confirmed, recorded in GLOSSARY).
- explore boundary: ask-me handles entry routing and the generic question protocol; explore handles fog triage, the routes, and landing; map and task reference explore. The explore skill gets its own child map (user confirmed).

## Not yet specified

- Phase split: whether exploring/planned/delivering/reviewing stays.
- Who may advance: the boundary of owner advancement, who may read, agent proxy rules.
- Claim: without an executor field, whether claiming equals start (open to in_progress).
- Concurrency and handover: how non-owners participate, replacement rules.
- The exact rules for the task_kind field and the reversibility marker; task frontmatter will need a reversibility value (one_way/two_way), set when the task template is designed.
- Probe acceptance: whether a probe is accepted when its question is answered regardless of the answer.
- Acceptance rules in detail (how independent source, rehearsal, small batches, third-party review land).
- Git collaboration: branches, sync, conflict handling, when a claim becomes visible.
- Whether the local comment category stays (it is now the default home for synced issue records).
- The full rules for delivery and probe tasks (reference skills-ref).
- Which issues to sync back is decided in the communication category, not here.

## Out of scope

- Software-specific workflows (TDD, code review, and so on).
- Product-specific validation tools (A/B tests, fake-door tests, prototypes, Wizard of Oz).
- GitHub/Gitee issue triage (communication category).
