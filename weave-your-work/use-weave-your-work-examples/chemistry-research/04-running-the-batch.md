# Running the batch

`execute-all` is for a map whose tasks can run together. The screen map has three tasks, so the batch is the natural way to advance it. The walk did not start subagents; it checked the selection and claim rules against the ticket states the waymark commands report.

Two things came out of the walk: one real batch rule, and one split error that looked like a batch problem.

## Closed tasks are not filtered out

`execute-all` said: "Status does not filter: a task already `in_progress` is picked up again, because the operator owning it is what makes it theirs to advance."

The sentence did not exclude closed tasks, and `waymark start` moves a closed task back to `in_progress`:

```
$ waymark --project waymark start wm-wea2f4ywz4v1
set wm-wea2f4ywz4v1 closed -> in_progress
```

The protocol task was closed when the batch was considered. A run that selects by owner and follows "status does not filter" would claim it again and send it to a subagent. The rule now says only `open` and `in_progress` are candidates; a closed task is never claimed.

## The table/probe pair is a split error

The table's `Action` starts by reading the probe's six run records. The probe has `needs_human: true`; the table does not. The table is open and has no `waiting_on`, so the old batch would select it and send it out without the run log. The subagent would stop on the missing input.

The fault is not the batch filter. The table and the probe are siblings under one map, and a task that reads another task's output is not parallel with it. The task layer has no dependency edge. The correct shape is one task that runs the six experiments and compiles the table, or two child maps with a dependency edge. `waiting_on` is for a person, not for a task's output; putting the probe there would hide the split error and require a manual release every time.

This is now stated in the `split` skill: a part that reads another task's output is a split error.

## Why `waymark ready` is not a batch gate

A scratch branch in the same project made the point. A map named "Hold for safety review" waited on the pilot map, and a task sat under it. In that scratch copy, `waymark ready` reported the task as ready while `waymark blocked` reported the map:

```
$ waymark ready
wm-3we3220x1yvh  open  ready    Write the safety review checklist
...
$ waymark blocked
wm-hbhrt8m40ckz  open  blocked  Hold for safety review
    blocked by wm-gja61tb1k99p
```

`waymark ready` reads the item's own edges only; it does not walk `parent`. That is not a contradiction: the task has no edge, the map has one. The walk first considered a recursive `startable` check, then rejected it because it would re-block closed descendants when a distant ancestor later waits, and because waymark has no inherited state to read.

The rule now lives at execution time: the executor lists the task's inputs and the parent map's unfinished dependencies, and stops only when the task actually uses a blocker's output. A blocked map does not freeze its subtree. If the work is genuinely independent, it belongs under a sibling map, not under the blocked map.

## The batch rules now

- Only `open` and `in_progress` tasks are candidates; a closed task is never claimed.
- The run owner is the chosen map's owner; the local operator is not the owner.
- A task with a non-empty `waiting_on` is not selected. The owner clears it after handling the person's answer.
- A task with `needs_human: true` is never sent to a subagent; the owner runs it with `execute-one-task`.
- The collision list still covers tasks inside the batch. A task that reads another task's output is not a batch case; it is a split error, fixed before the batch starts.
