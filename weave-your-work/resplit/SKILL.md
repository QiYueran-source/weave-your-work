---
name: resplit
description: "Recut a map that already split into tasks, when one task turns out to need another's output: gather the independent tasks under one child map and the waiting one under another, add the dependency edge between those maps, and re-hang the tasks. Use when a task cannot start because a sibling task has not finished."
family: track
invocation: model
---

# Resplit

A map that split into tasks said its tasks were parallel. One of them now waits for another's output, which means the layer was cut wrong: a task is one action that can be finished on its own, and a task that reads another task's result is not one. This skill recuts that layer into child maps, so the wait becomes a dependency edge between maps, which is where this set keeps order.

## When it runs

A task under a map that split into tasks cannot start because its input is another sibling's output. `advance-task` reports this as needing a clearer split, and the report names the task that waits and the task it waits on.

This is not `split`'s case: `split` cuts a layer that has no children yet, and this one has them. It is not `update`'s either: `update` changes a record's content, and here the records stay as they are and only their parent changes.

## Steps

1. **Read the layer.** Every child task of the map, each one's `Action` and `Acceptance signal`, and which of them reads another's output. `waymark tree --root <map>` gives the children; the waiting task's `Progress` names what it waits on.
2. **Cut the layer into two groups.** One child map holds every task that can run now, on its own; the other holds every task that waits on the first group's output. A task that waits on another task inside its own group joins the waiting group; a group of one is still a group.
3. **Name both child maps and write their targets.** Each map's `Target` is the output its group delivers, and its `Acceptance direction` says how that output is checked; `Source:` names the parent map's decision the group comes from. Call `open-map` once per group, with `--parent <map>`, then `adr` if a decision behind the cut passes the three gates.
4. **Add the edge.** `waymark dependency add <waiting-map> <delivering-map>`: the map that waits depends on the map that delivers.
5. **Re-hang the tasks.** `waymark parent set <task> <group-map>` for every task, in the group it was cut into. Content, status, owner, and review stay as they are; only `parent` changes.
6. **Record the recut on the parent map.** One line in its `Decisions so far`: what the flawed cut was, which two maps replaced it, and the date. The parent's `split_as` stays `submap`, which is what it now is.

Two child maps exist with an edge between them, and every former task hangs under one of them, unchanged otherwise.

## Hands off

- `advance-task` for the tasks that can now run.
- `split` when a group is still too coarse and needs its own layer cut.
- `whole-review` is not sent from here: a recut can leave the parent without one, and whether to read its children as a set is still the person's call.

## What this skill does not do

- Decide that the layer was cut wrong; `advance-task` reaches that.
