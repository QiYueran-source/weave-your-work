---
name: task
description: "Start here for task work: write a task ticket, advance one task, run a batch under a map, or review a finished one, and open the skill that owns the question."
disable-model-invocation: true
---

# Task

A task is the finest node of the target tree: one action that ends at a result someone can check. This file is the entry to the task skills. It routes; it does not define the task body, the execution steps, or the review.

## Which skill

- Writing a task ticket: `task-design` holds the sections, the two kinds, and the fields.
- Advancing one task: `execute-one-task` holds the run, its stops, and what it writes.
- Advancing every task under a map: `execute-all` holds the batch, the dispatch, and the reports.
- Judging a finished task: `task-review` holds the axes, the verdicts, and the close.

Two adjacent skills own what this entry does not:

- `update` changes a task that is already closed, or a map that has already split.
- `split` decides whether a piece of work is a task or a child map.

## What this entry does not do

- It does not write the ticket. That is `task-design`.
- It does not advance the work. That is `execute-one-task` or `execute-all`.
- It does not judge the result. That is `task-review`.
- It does not decide that the work is a task. That is `split`.
