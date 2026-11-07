---
name: task-design
description: Write a task ticket for a target tree leaf: choose delivery or probe, state the action and its acceptance signal, set reversibility and needs_human, and handle human steps.
---

# Task design

A task is the finest level of the target tree: one action with a result someone can check. Use this skill when you are writing a task ticket, or when you need to know what a task must contain before it can be worked on.

A task cannot have child tasks. Work too large to finish in one go is a map, not a task.

## What a task must settle

- Which kind it is: `delivery` or `probe`.
- What the action is, and what it delivers or answers.
- What evidence shows it is done.
- How reversible the work is.

## Where each answer lives

- `body.md`: every section a task body may hold, with the format and an example for each.
- `kind.md`: how to choose between a delivery and a probe task, which kind suits which stage, and what failure means for each.
- `properties.md`: `task_kind`, `reversibility`, and `needs_human`, with accepted values and who writes each.

## What this skill does not do

Splitting a map into tasks is `split-to-task`. That skill decides whether a piece of work becomes a task and how many tasks a layer gets; it then writes the ticket according to these references.

Advancing a task, claiming it, notifying a person, and closing it belong to the task execution skill.
