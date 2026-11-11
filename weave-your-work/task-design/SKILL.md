---
name: task-design
description: >-
  Write a task ticket, the finest node of a target tree: choose delivery or
  probe, state the action and its acceptance signal, set reversibility and
  needs_human, and mark the steps a person must do.
---

# Task design

A task is the finest node of the target tree: one action that ends at a result someone can check. Use this skill when you are writing a task ticket, or when you need to know what a task must contain before it can be worked on.

A task cannot have children, and it hangs under exactly one map. That map is the thing the task refines; this skill takes the map as given.

## What a task must settle

- Which kind it is: `delivery` or `probe`.
- What the action is, and what result it hands over.
- What evidence shows the result is there.
- How reversible the work is.
- Whether a person is needed.

## The size rule

A task ends at a result that can be handed over whole and checked on its own. The action may cross several stages to reach it: cleaning a dataset and then analysing it is one task when the analysis is what gets handed over.

The shape to avoid is a slice, one stage of a result finished before anything can be used. A slice needs a sibling, and that need is the sign it belongs inside the task that delivers the result.

Length is not the test. A task may run for days while it waits on a person or on data.

## What a task never carries

- No child tasks.
- No dependency edges. Why, and what to do instead when two pieces must run in order, is in `placement.md`.
- No dates as fields. A hard date that shapes the work goes in the opening sentence of Action.

Order is carried by dependency edges between maps, never by a link. A link records a relationship worth following and nothing more, and it may point at any item, including a sibling in the same map.

## Where each answer lives

- `body.md`: the sections a body may hold, the order they appear in, and a whole ticket as waymark stores it.
- `kind.md`: how to choose between a delivery and a probe task, which kind suits which stage, and what failure means for each.
- `placement.md`: where a task hangs, what it may link to, and what it never carries.
- The waymark skill's `fields.md`: every field a task carries, who writes it, and how a write lands.

## What this skill does not do

Splitting a map into tasks belongs to the split skill, which decides whether a piece of work becomes a task and how many tasks a layer gets; it then writes the ticket according to these references.

Advancing a task, claiming it, notifying a person, and closing it belong to the task execution skill.
