---
schema: 1
id: wm-64st47g6pcrj
title: 'Review skill: accept a map'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T16:31:11Z
updated_at: 2026-11-06T16:31:11Z
parent: wm-0b59r7xfhk73
---
## Target

Design the review skill: when a map reaches reviewing (all children complete), check the result against the acceptance direction agreed before, and decide passed (closed), failed (closed + outcome=failed), or return to delivering or planned.

Why: a map closes only when a non-executor confirms it met its acceptance direction.

## Acceptance direction

The skill exists under `weave-your-work/review/`: SKILL.md states who reviews, what signal is checked, and the three outcomes; a sample map is reviewed.

## Children

(none yet)

## Decisions so far

- Review owns reviewing to closed or return; the map skill owns delivering to reviewing (user confirmed).
- Acceptance is judged by a non-executor against signals agreed in advance (inherited from the execution map).

## Not yet specified

- Who reviews (owner, another person, or both).
- How the acceptance direction in the map body is checked.
- What the return path looks like.

## Out of scope

- Split and explore.
- Task-level acceptance (task skill).
