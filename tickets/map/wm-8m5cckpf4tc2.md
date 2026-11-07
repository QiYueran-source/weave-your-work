---
schema: 1
id: wm-8m5cckpf4tc2
title: 'Explore skills: fog exploration'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T12:57:36Z
updated_at: 2026-11-07T12:29:00Z
parent: wm-0b59r7xfhk73
archived_at: 2026-11-07T04:35:07Z
archive_reason: 'Design restarted: explore''s only job is to clear fog; old design archived, new ticket opened'
---
## Target

Design the explore skill: clear the fog of a map. Its one responsibility is to take the map's Not yet specified items and resolve them until the section is empty.

Why: without explore, a map can carry fog forever and never move; with it, every fog item either becomes a decision, a child, an out-of-scope item, or is dropped.

## Acceptance direction

All children are complete and no further children are needed: the SKILL.md exists under `weave-your-work/explore/`, and a sample map with fog can be cleared end to end, with each fog item resolved or dropped and the Not yet specified section empty.

## Children

- [Define the exploration skill](tickets/task/wm-dxz6qcg4aamx.md): write the explore SKILL.md and walk one fog of each class through the steps.

## Decisions so far

(none yet; the design restarts here)

## Not yet specified

- The fog classes and how explore classifies an item.
- The routes explore uses to resolve each class.
- How a resolved item lands: decision, child, out-of-scope, glossary, or drop.
- The interface and trigger for explore.
- The relationship between explore and the other map-child skills (split, review, map body format).

## Out of scope

- Product-specific validation toolkits (A/B tests, fake-door tests, prototypes).
- Issue triage rules (communication category).
- Probe design and acceptance (task skill).

## Weave log

The earlier explore design (fog classes, routes, landing rules, interface with ask-me) was replaced on 2026-11-07 after the user asked to restart the explore skill from a clean slate: explore's only responsibility is to clear fog. The old discussion and decisions are archived at `weave-logs/2026-11-07_frank_explore-redesign.md`.
