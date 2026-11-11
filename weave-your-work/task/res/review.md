# Task review

How a task is judged. The verdict lands in the task's `## Review` section, in the shape below; the action that writes it is `task-review`.

## Two axes

Read them separately and report them separately.

- **Goal**: the evidence the signal names is there, and someone who did not do the work can read it by the method the signal names.
- **Convention**: the run stayed inside `Boundaries` and the project's rules, and wrote only what it may write.

Every finding names its source: the signal line, the boundary, or the rule.

## Four verdicts

| Verdict | When | What follows |
|---|---|---|
| `passed` | both axes hold and `waiting_on` is empty | clear `waiting_on`, close |
| `needs changes` | an axis names a gap an agent can close, and `waiting_on` is empty | leave it open, name only the gap |
| `needs discussion` | the signal or the standard is unclear, or the task waits on a person | record the question, set `waiting_on`, leave it open |
| `wrong direction` | the task itself was wrong | clear `waiting_on`, `outcome=failed`, close |

A ticket that still carries `waiting_on` is waiting, not passed: it takes `needs discussion`.

## The section

The verdict, then one line per axis with its evidence. An older verdict on the same subject is struck through with the reason it was superseded.

## Assertions

- `outcome=failed` with a verdict other than `wrong direction`. `[check-records]`
- A `passed` task that still carries `waiting_on`. `[check-records]`
- A `Review` that merges the two axes into one verdict. `[review]`
- A finding with no source. `[review]`
