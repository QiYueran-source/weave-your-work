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
| anything else | anything else | stays open; the next step comes from the worse of the two, below |

A ticket that still carries `waiting_on` is waiting, not passed: its review takes `needs discussion` on both axes. When the two verdicts disagree on the next step, `wrong direction` outranks `needs discussion`, which outranks `needs changes`, which outranks `passed`.

- `passed` or `wrong direction`: `waiting_on` is cleared. For `wrong direction`, `outcome=failed` is written first, then the task closes.
- `needs changes`: leave the task open and name only the gap.
- `needs discussion`: record the question, set `waiting_on`, leave the task open.

## The section

One block per review: `Goal: <verdict>` and `Convention: <verdict>`, each on its own line with that axis's evidence under it. A later review adds a new block; when an older block no longer holds, it is struck under the rule `map/res/body.md` gives every section.

## Assertions

- `outcome=failed` with a verdict other than `wrong direction`. [check-records]
- A `passed` task that still carries `waiting_on`. [check-records]
- A `Review` that merges the two axes into one verdict. [review]
- A finding with no source. [review]
