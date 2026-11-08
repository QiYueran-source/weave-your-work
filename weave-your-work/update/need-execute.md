# Need execution

A change sometimes needs more than new text on the ticket: a new skill, a new reference, a section that does not exist. For a map, the update run does not write that work into the delivered file. It reopens the map, hangs the work as a child, and hands the child to the execution skills. A task takes no child; the next section covers that case.

`SKILL.md` carries the two tests and the three dispositions. This file is the case where a change needs new work, not only new words.

## When the node is a task

A task takes no child. If the change is to a task and its verdict fails, the work is the task's own `Action`: reopen the task, rewrite `Action` and `Acceptance signal`, then execute the task again and review it. A change that needs a different task is a retire-and-replace under the task's map, not a child hang.

The rest of this file is about a map that needs a child.

## The shape

Read the parent map's `split_as` before creating anything. It is the type the parent's children must have, and one update does not change it.

| `split_as` | One task | More than one task, or order/grouping needed |
|---|---|---|
| `task` | Add the task under the parent. | Several parallel tasks are still children of the parent. If they need order or a group, stop: this layer cannot take a child map, and the work may need a sibling map. |
| `submap` | Add a small child map first, with `split_as: task`, then the task under it. | Add a child map for the design, then its tasks under it. |
| missing or mixed | Stop. Let `split` settle the type, or fix the tree first. | Stop. |

The child map in the `submap` row is a real map with its own Target and Acceptance direction. It is small because it holds one task, not because it is a placeholder. Its `split_as` is `task`; the task under it is written by `task-design`.

`split` owns the type decision and the freeze. This table is the check the update run does before it calls `split`; it does not replace `submap.md` or `task.md`.

## The order

1. Write the new decision and acceptance on the map that will reopen.
2. Reopen the map. A closed map takes no child; an open split map needs no reopen.
3. Read `split_as` and hang the child according to the shape above. The child map's body is written by `submap.md`; the task's body by `task-design`.
4. Check the ticket is writable: the body carries the sections its kind requires, `needs_human` agrees with the `Person:` steps, the parent is a map, and there is no `dependencies` block. A failure stops here and goes back to the owner; do not execute a malformed ticket.
5. Read the task's `reversibility`, `needs_human`, and the impact scan from `SKILL.md`. Decide whether to execute now.
6. If the gate allows, load `execute-one-task`, then the owner's `task-review`. Close the task.
7. Review the reopened map against the new content and close it.

The task closes before the map that reopened. The reopened map's acceptance counts the child; closing the map first leaves a closed map with unfinished work under it.

## The execution gate

The size of the change is not the test. A small change can be one-way; a large one can be two-way.

Stop after writing the task when any of these holds:

- `reversibility: one_way`. The task's acceptance signal names who confirms; wait for that.
- `needs_human: true`. The task has a `Person:` step; wait for the person.
- The impact scan reaches a node owned by someone else whose content must change. The branch stops there, and that owner is told in an issue.
- The change rewrites the map's `Target` or `Acceptance direction`, or the task's `Action` or `Acceptance signal`, and the owner has not confirmed the new promise in this conversation.

Otherwise, run the task in the same pass: `execute-one-task`, then `task-review`. A task stopped at the gate stays open; set `waiting_on` to the person who holds the answer. If it was already started, keep `Progress` as well.

## What this file does not do

- Decide whether the change is a map's or a task's content. That is `content.md`.
- Decide the child type or the freeze. That is `split`.
- Write the task body. That is `task-design`.
- Carry the task. That is `execute-one-task` and `task-review`.
