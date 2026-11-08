# Running the batch

`execute-all` is for a map whose tasks can run together. The screen map has three tasks, so the batch is the natural way to advance it. The walk did not start subagents; it checked the selection and claim rules against the ticket states the waymark commands report. Three of those rules do not hold.

## Closed tasks are not filtered out

`execute-all` says: "Status does not filter: a task already `in_progress` is picked up again, because the operator owning it is what makes it theirs to advance."

The sentence is meant to say that `open` and `in_progress` are both eligible. It does not exclude closed tasks, and `waymark start` moves a closed task back to `in_progress`:

```
$ waymark --project waymark start wm-wea2f4ywz4v1
set wm-wea2f4ywz4v1 closed -> in_progress
```

The protocol task was already closed when the batch was considered. A run that chooses tasks by owner and follows "status does not filter" would claim it again, then send it to a subagent. The task would be worked a second time, and the first result would be overwritten or the subagent would stop because the work is already done.

The batch needs a positive rule: only `open` and `in_progress` tasks are chosen; a closed task is never claimed. The scenario's screen map has two closed tasks and one open task at the point a batch would start, so this is not a corner case.

## A task whose input is produced by an excluded task

The table reads the probe's run log. The probe has `needs_human: true`, so `execute-all` excludes it. The table has no `waiting_on` value: nobody set one, because the task was written before the batch and the field is for a run that has started waiting. The table is owned by the operator, is open, and has no `waiting_on`, so the batch selects it.

`dispatch.md`'s collision list covers "work another task in the batch produces, when this task reads it". The probe is not in the batch, so the collision list does not see it. The table goes out without its input. `execute-one-task` then stops on the missing input, writes `Progress` and `waiting_on`, and the slot is wasted. The run recovers on the next pass, but the batch had no way to know before dispatch.

A realistic lab map has this shape often: one human-run experiment feeds several desk tasks. The current filter has no field that says "this task's input is not here yet" unless someone wrote `waiting_on` by hand. The skills do not say to do that before a batch.

## A task under a blocked map

A scratch branch in the same project made the point. A map named "Hold for safety review" waited on the pilot map, and a task sat under it. In that scratch copy, `waymark ready` reported the task as ready while `waymark blocked` reported the map it belongs to:

```
$ waymark ready
wm-3we3220x1yvh  open  ready    Write the safety review checklist
...
$ waymark blocked
wm-hbhrt8m40ckz  open  blocked  Hold for safety review
    blocked by wm-gja61tb1k99p
```

Waymark's `ready` reads dependency edges only and ignores `parent`. The map was `blocked`; its child task was `ready`. `waymark start` on the task would have succeeded.

That branch was a check, not part of the committed fixture, so its ids are not in the ticket tree under `waymark/`.

`execute-all` chooses tasks under the chosen map and never reads the map's own dependency state. `execute-one-task` reads the map's `Target` and `Acceptance direction` but does not check whether the map is ready. A run that starts the pilot task while the screen is open breaks the order the map layer was built to carry. The glossary says a task is ready when the map above it is ready, but the command does not report that, and neither skill adds the check.

## What the batch page means for the skill

The batch has three gaps, and they compound:

- it can reopen closed work;
- it can send a task whose input an excluded task holds;
- it can start a task under a blocked map.

None of them is caught by `waymark validate`. The first is a status rule; the second is a data rule the tickets do not carry; the third is a tree rule the task skills leave to the map layer but never read.
