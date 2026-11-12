---
name: open-task
description: "Write one task record: choose delivery or probe, write the action and its acceptance signal, and set the kind, reversibility, and whether a person is needed. Use when a layer is being split into tasks, or when a task has to be written outside a split."
family: track
invocation: model
---

# Open task

One task per run: the finest record of the tree, one action that ends at a result someone can hand over and someone else can check. This action writes the record and nothing else: it does not decide how many tasks there are or where they hang. What the record holds is the `task` skill's; which part of the map each serves, and the parent it hangs under, came in with the call.

## When it runs

- `split` decided a layer is tasks, and calls this action once per task, with the action, the acceptance signal, the kind, the part it serves, and the parent map.
- A person has one piece of work to record, and no split is involved; the parent map is named with it.

A task is never a child of a task. The parent is a map, written with `--parent` on the create command.

## Steps

1. **Read the part it comes from.** The parent map's `Target` and `Acceptance direction`, and the decision the caller says this task serves. The action serves a part of the map's direction; if it serves something else, the map is wrong.
2. **Write the body** as `task/res/body.md` requires: `Action` with its result first, `Acceptance signal`, the sections the kind requires, and `Boundaries` when the work could be mistaken for more than it is.
3. **Set the fields** the `task` skill defines: `task_kind`, `reversibility`, and `needs_human`. `waymark/res/fields.md` says when each is written and which values it takes.
4. **Create the record**, hung under the map given with the call. `waymark create --category task --title "<the result>" --owner <name> --parent <map> --field task_kind=… --field reversibility=… --field needs_human=… --body-file <body> --dry-run`, then again without the flag.

If the part turns out to need a child map instead, write nothing and report it: the layer's type is `split`'s decision, and a layer is all one type.

The task exists, and `task/res/body.md` says what it holds.

## Hands off

The task exists, and this action writes nothing after it. `split` started the map on its first split; the task is advanced by `advance-task` when the person asks for it.

## What this skill does not do

- Decide how many parts the layer has; `split` does.
