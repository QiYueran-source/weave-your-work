# What the walk found

The single-task path worked. A reader could design a delivery or a probe, run it to `Result`, review it, and close it. The batch and review paths had conflicts.

The walk produced 19 numbered findings. The analysis added two more: the table/probe pair is a split error, and `execute-all` used the operator where it meant the owner. This page records what happened to each after the Task skill map reopened on 2026-11-08.

## Fixed

- **#1 A batch can reopen closed tasks.** `execute-all` now selects only `open` and `in_progress`; a closed task is never claimed.
- **#3 Nothing clears `waiting_on`.** The field is now person-only. The owner clears it after handling the answer; a run that sees a value stops.
- **#4 Task parent and dependency are not machine-checked.** `properties.md` now says they are person-checked, and `execute-one-task` reads the parent category and the `dependencies` block before work.
- **#7 `waymark owner` is not the command.** It now says `waymark owner transfer`.
- **#12 The three optional fields.** The opening paragraph now separates the field written at creation from the two written during the run.
- **#14 A re-run does not read the gap.** `execute-one-task` reads `## Review` and fixes only a `needs changes` gap.
- **#15 A full-body replace can drop `Review`.** `execute-one-task` now says to include the existing `## Review` unchanged when replacing the body.
- **#16 The batch's write permission is wider than the run's.** `dispatch.md` now lists `Result`, `Progress`, `waiting_on`, and the claim.
- **#18 The example task is stale.** [task-example.md](../task-example.md) is rewritten in the current shape.
- **#19 A hand-back has no route to a failed close.** `execute-one-task` writes `Result` and invokes `task-review`; the review closes it as `wrong direction` or waits on the owner.
- **The table/probe pair.** It is a split error: a task that reads another task's output is one action with several steps, or two child maps with an edge. `waiting_on` is for a person, not for a task's output. `split/task.md` now says this.
- **The operator/owner conflict.** `execute-all` selects tasks owned by the chosen map's owner, not by the local operator.

## Rejected

- **#2 A batch does not check the parent map.** The first fix was a recursive `startable` check that walked every ancestor. It was rejected: it would re-block closed descendants when a distant ancestor later waits, and waymark has no inherited state to read. The replacement is the execution-time input check: list the task's inputs and the parent's unfinished dependencies, and stop only when the task uses a blocker's output. A blocked map does not freeze its subtree. `GLOSSARY.md` and `map/frontmatter.md` now say the edge gates acceptance, not the subtree.

## Still open

- **#5 Order is carried by the tree.** `task-design/SKILL.md` still says order is carried by the tree; the glossary says edges carry order. The sentence needs the same fix as the map reference.
- **#6 Only the owner advances, but anyone may review.** The cross-owner exception is still not written.
- **#8 Required sections are not reviewed.** `Failure recovery` and `Next step` are still not checked by any gate.
- **#9 `needs_human` and `Person:` are not checked.** The field/body agreement is still only a design rule.
- **#10 The incomplete-probe branch has no verdict.** `probe.md` still does not say whether an incomplete check is `needs changes` or `needs discussion`.
- **#11 `Next step` confirmation is not checked.** No skill reads the map owner's confirmation.
- **#13 `Progress` starts when the work starts, or only when it stops.** `body.md` still says start; `execute-one-task` writes it only on a stop.
- **#17 "Child maps" for a sequence.** `task-design/SKILL.md` and `body.md` still use that wording.

## What held

- The probe's negative finding passed. Nickel missed the floor, the ticket closed, and no `outcome` was set.
- The `one_way` gate was honored: the confirmation was recorded before the charge, and the review found it in `Result`.
- `Person:` steps and `needs_human` agreed in the probe and the pilot, so the batch exclusion was correct.
- The root `submap`, screen `task`, and pilot `task` split produced the tree the scenario needed.
- `waiting_on` recorded the lab wait and kept the probe out of the batch.
- The `task` entry routed each question to the right skill without repeating their rules.
- `split_as` froze the child type of each map.

## What this walk did not do

The batch's subagent dispatch was not run. The selection, claim, and field states were checked with waymark commands. The review's `needs discussion` and `wrong direction` paths were checked in scratch copies, not in the committed fixture. The hand-back path now has a rule; it was not exercised after the fix.

The chemistry fixture still holds the table and probe as separate tasks. It is left as the counterexample the walk found; the page above says what the correct split would be. The example does not claim the fixture is the right shape.
