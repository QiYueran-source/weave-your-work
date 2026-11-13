# Task review

How a task is judged, and the shape its `## Review` takes. The action that writes it is `task-review`.

## Two axes, one verdict each

Each axis is judged on its own and reports its own verdict from the four below. Neither covers the other, and merging them hides a failing axis behind a passing one.

- **Goal**: the evidence the signal names is there, and someone who did not do the work can read it by the method the signal names. For a `delivery` that means the named output exists where `Result` says; for a probe it means the finding is there and the answer it gives is the one the task asked for.
- **Convention**: the run stayed inside `Boundaries` and the project's rules, and wrote only what it may write.

Every finding names its source: the signal line, the boundary, or the rule.

## Four verdicts

| Verdict | When |
|---|---|
| `passed` | this axis holds |
| `needs changes` | this axis names a gap an agent can close |
| `needs discussion` | the signal or the standard is unclear, or the task waits on a person |
| `wrong direction` | the task itself was wrong |

## What the pair does to the record

| Goal | Convention | The record |
|---|---|---|
| `passed` | `passed` | `waiting_on` cleared, the task closes |
| `wrong direction` on either axis | any verdict | `outcome=failed`, `waiting_on` cleared, the task closes |
| `needs discussion` on either axis, and no `wrong direction` | any verdict | the question is recorded, `waiting_on` is set, the task stays open |
| anything else | anything else | the task stays open, the gap is named, `advance-task` takes it back |

The rows are read top to bottom, so the first one that fits decides. A `wrong direction` on either axis means the task asked for the wrong thing and no repair reaches it; the other axis being `passed` does not save it. A ticket that still carries `waiting_on` is waiting, not passed: its review takes `needs discussion` on both axes.

A failed task leaves nothing behind to inherit. If the work still matters, it is a new decision: the person settles it in `grill-and-records`, and a new task is written from what that settles. Nothing opens a replacement for a task that closed `failed`.

## The section

One block per review: `Goal: <verdict>` and `Convention: <verdict>`, each on its own line with that axis's evidence under it. A later review adds a new block; when an older block no longer holds, it is struck under the rule `map/res/body.md` gives every section.

## Assertions

- `outcome=failed` with a verdict other than `wrong direction`. [check-records]
- A `passed` task that still carries `waiting_on`. [check-records]
- A `Review` that merges the two axes into one verdict. [review]
- A finding with no source. [review]
