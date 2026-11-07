---
name: task-design
description: "Write a task ticket, the finest node of a target tree: choose delivery or probe, state the action and its acceptance signal, set reversibility and needs_human, handle human steps, and know that a task carries no dependencies."
---

# Task design

A task is the finest node of the target tree: one action that ends at a result someone can check. Use this skill when you are writing a task ticket, or when you need to know what a task must contain before it can be worked on.

A task cannot have child tasks, and it hangs under exactly one map.

## What a task must settle

- Which kind it is: `delivery` or `probe`.
- What the action is, and what result it hands over.
- What evidence shows the result is there.
- How reversible the work is.

## The size rule

A task ends at a result that can be handed over whole. The action may cross several stages to reach it: cleaning a dataset and then analysing it is one task when the analysis is what gets handed over. A slice that finishes one stage and waits on a sibling is a step, not a task.

Length is not the test. A task may run for days while it waits on a person or on data.

## What a task never carries

- No child tasks.
- No dependency edges. The tasks under one map are parallel; where two pieces of work must run in sequence, either they are one action with several steps, or the map splits into child maps that carry the edge.
- No dates. Starting is the claim, and a hard external date belongs in Action or Boundaries.

A task may link to items outside its map for provenance or a shared subject. A link never expresses order.

## Where each answer lives

- `body.md`: every section a task body may hold, with the format and an example for each.
- `kind.md`: how to choose between a delivery and a probe task, which kind suits which stage, and what failure means for each.
- `properties.md`: `task_kind`, `reversibility`, and `needs_human`, with accepted values and who writes each, plus the placement and link rules.

## What this skill does not do

Splitting a map into tasks belongs to the split skill (`weave-your-work/split/`), which decides whether a piece of work becomes a task and how many tasks a layer gets; it then writes the ticket according to these references.

Advancing a task, claiming it, notifying a person, and closing it belong to the task execution skill.
