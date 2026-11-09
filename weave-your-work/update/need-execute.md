# Need execution

A change sometimes needs more than new text on the ticket: a new skill, a new reference, a section that does not exist. Apply the two tests to each affected node. For a map that needs new work, hand the work to the execution skills rather than writing the delivered file in the update run. A task takes no child; the next section covers that case.

`SKILL.md` carries the two tests and the three dispositions. This file is the case where a change needs new work, not only new words.

## When the node is a task

A task takes no child. If the change is to a task and its verdict fails, reopen the task, update `Action` and `Acceptance signal` only if the confirmed promise changes, then execute and review it again. A gap already covered by the signal does not by itself change that signal. A change that needs a different task is a retire-and-replace under the task's map, not a child hang.

## A gap found in map review

If the gap was already required by a task's acceptance signal, use the two tests on that task to decide whether to reopen, fix, and re-review it. Do not assume a new task is needed.

If the task met its signal but the parent omitted a new requirement, discuss the target or structure before deciding the work. Do not automatically create a task dependent on a sibling's output. Any resulting split must respect the frozen child type; invoke the `map` skill for dependency rules. If it is unavailable, stop and ask the owner to install it.

The rest of this file is about a map that needs a child after that decision.

## The shape

Read the parent map's `split_as` before creating anything. It is the type the parent's children must have, and one update does not change it.

| `split_as` | One task | More than one task, or order/grouping needed |
|---|---|---|
| `task` | Add the task under the parent. | Several parallel tasks are still children of the parent. If they need order or a group, stop: this layer cannot take a child map, and the work may need a sibling map. |
| `submap` | Add a small child map first, with `split_as: task`, then the task under it. | Add a child map for the design, then its tasks under it. |
| missing or mixed | Stop. Let `split` settle the type, or fix the tree first. | Stop. |

The child map in the `submap` row is a real map with its own Target and Acceptance direction. It is small because it holds one task, not because it is a placeholder. Its `split_as` is `task`; the task under it is written by `task-design`.

`split` owns the type decision and the freeze. This table is the check the update run does before it invokes `split`; it does not replace that skill.

## The order

1. Apply the two tests and write the confirmed decision and acceptance. When reopening a map, invalidate its existing Review as `content.md` directs; do not fabricate one for a legacy map.
2. Reopen a closed map if its verdict fails, then start the reopened map to resume `in_progress`, keeping its existing `split_as`. An already `in_progress` split map needs no reopen; start an `open` split map before resuming. A different subject requires retire-and-replace. If a closed map's verdict still holds, leave it closed and stop to discuss the proposed new work before adding a child.
3. Read `split_as` and invoke `split` to hang the child according to the shape above; task bodies follow `task-design`. When an existing child already carries the new requirement, nothing is hung: that child takes its own disposition instead — a closed one reopens, an open one has its acceptance changed by its owner.
4. Check the ticket is writable: the body carries the sections its kind requires, `needs_human` agrees with the `Person:` steps, the parent is a map, and there is no `dependencies` block. A failure stops here and goes back to the owner; do not execute a malformed ticket.
5. Read the task's `reversibility`, `needs_human`, and the impact scan from `SKILL.md`. Decide whether to execute now.
6. If the gate allows, load `execute-one-task`, then the owner's `task-review`. The verdict decides whether the ticket closes; both skills agree that `passed` and `wrong direction` close it, so one `waymark close` completes the hand-back.
7. Review the map against the new content with `map-review`. Its verdict decides whether the map closes; the run issues the close when the verdict calls for it.

The task closes before the map that reopened. The reopened map's acceptance counts the child; closing the map first leaves a closed map with unfinished work under it.

## The execution gate

The size of the change is not the test. A small change can be one-way; a large one can be two-way.

Stop after writing the task when any of these holds:

- `reversibility: one_way`. The task's acceptance signal names who confirms; wait for that.
- `needs_human: true`. The task has a `Person:` step; wait for the person.
- The impact scan reaches a node owned by someone else whose content must change. The branch stops there, and that owner is told in an issue.
- The change rewrites the map's `Target` or `Acceptance direction`, or the task's `Action` or `Acceptance signal`, and the owner has not confirmed the new promise. Confirmation addressed to the run counts, whether the run reads it in the ticket, in the issue that carried the decision, or in a message to an agent speaking for the owner.

Otherwise, run the task in the same pass: `execute-one-task`, then `task-review`. A task stopped at the gate stays open; set `waiting_on` to the person who holds the answer. If it was already started, keep `Progress` as well. `waiting_on` has to be a declared custom field in the project — `waymark config add field waiting_on string` once if it is not — and where the project cannot hold it, `Progress` names the holder instead. When `execute-one-task` or `task-review` is not installed, the run stops at the task it wrote: the task stays open with that note, and the report says which skill was missing.

## What this file does not do

- Decide whether the change is a map's or a task's content. That is `content.md`.
- Decide the child type or the freeze. That is `split`.
- Write the task body. That is `task-design`.
- Carry the task. That is `execute-one-task` and `task-review`.
