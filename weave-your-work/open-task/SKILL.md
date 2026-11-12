---
name: open-task
description: "Write one task record: choose delivery or probe, write the action and its acceptance signal, and set the kind, reversibility, and whether a person is needed. Use when a layer is being split into tasks, or when a task has to be written outside a split."
family: track
invocation: model
---

# Open task

One task per run: the finest record of the tree, one action that ends at a result someone can hand over and someone else can check. The record's shape is the `task` skill's; this action writes it. It does not decide how many tasks a layer has or where they hang; the caller decided that before calling it.

## When it runs

- `split` decided a layer is tasks, and calls this action once per task.
- A person has one piece of work to record, and no split is involved.

A task is never a child of a task. The parent is a map; `split` sets it, or the run names it.

## Steps

1. **Read the part it comes from.** The map's `Target` and `Acceptance direction`, and the discussion that settled this piece. The action serves a part of the map's direction; if it serves something else, the map is wrong.
2. **Write the action.** The result in the first sentence, then the steps: prose when their order does not matter, a numbered list when it does. A step only a person can do starts with `Person:`. A hard constraint that shapes the work — a date, a fixed budget — goes in that first sentence.
3. **Write the acceptance signal.** The evidence that shows the result is there, written before the work starts, as something a reader who did not do the work can check. It names the observable result, not a feeling about it.
4. **Set the fields.** `task_kind` (see below), `reversibility` by the effect on the world rather than by whether the record can be corrected, and `needs_human` written explicitly, never left absent.
5. **Add the sections the kind requires**: `Failure recovery` for a `one_way` delivery, `Next step` for a probe, `Boundaries` when the work could be mistaken for more than it is.
6. **Create the record.** `waymark create --category task --title "<the result>" --owner <name> --field task_kind=… --field reversibility=… --field needs_human=… --body-file <body> --dry-run`, then again without the flag.

## Delivery or probe

A `delivery` commits to an output that can be named before the work starts; its failure is an incident someone must recover. A `probe` commits to an answer the map does not have yet; its failure is a normal result, recorded as a finding, and it trades the smallest reversible action for information.

Ask what the task commits to. A `delivery` can name its output now; a `probe` cannot, because the answer depends on what reality turns out to be.

## The size rule

A task ends at a result that can be handed over whole and checked on its own; the action may cross several stages to reach it. A slice — one stage finished before anything downstream can use it — needs a sibling to mean anything, and that need is the sign it belongs inside the task that delivers the result.

## Transformation

```
before: a settled piece of work with no task record
after:
- one task exists, with Action and Acceptance signal
- task_kind is delivery or probe, and it matches what the task commits to
- reversibility is one_way or two_way, judged by the effect on the world
- needs_human is true or false, written explicitly
- the section the kind requires is there
- the task carries no dependency edge and no child
```

## What this skill does not do

- Decide how many tasks a layer has. `split` does.
- Advance the task, or judge it.
- Set the parent from a split: `split` hangs the task it asked for.
