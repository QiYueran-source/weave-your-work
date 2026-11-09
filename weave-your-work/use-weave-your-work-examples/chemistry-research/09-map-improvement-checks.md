# Map improvement checks

The map skill-family changes were checked after the two audit rounds in [the lifecycle audit](08-map-lifecycle-audit.md). These checks are not a third valid human-grilled audit, and they do not repair or replace either round's tickets.

## Scratch command run

In a separate temporary Waymark 0.1.2 project, an agent recorded its proposed plan before each split, started an `open` map, set `split_as=task`, created and closed one task, then created and closed a second task without resetting the type or status. Both tasks recorded Result and Review, with real command-output files as their deliverables. A map Review recorded `needs changes` and left the map `in_progress`: the goal check read both deliverables and passed, while the convention check failed because no human grill settled the layers. The agent's plan was not represented as a human testimony.

`waymark validate` returned zero errors and warnings, with one `NOT_A_GIT_REPOSITORY` informational finding for the temporary project. It did not detect the missing human grill. Commands succeeded but emitted a `GLIBC_2.39` weak-version warning. This run exercises Waymark writes and one non-passing review; it does not prove all map-review branches work.

## Independent static walkthrough

The following cases were read against the skill instructions; they were not executed as Waymark workflows:

| Case | Expected disposition |
|---|---|
| Closed child has a type different from `split_as` | Convention fails; a repairable mismatch is `needs changes`. Do not flip the frozen type. |
| Map acceptance standard first found ambiguous during review | Record `needs discussion` and the question; leave the map in progress and call grill. Known fog goes to explore before review. |
| Parent no longer wants the map's target | `wrong direction`: record both checks, set `outcome=failed`, close, and open a linked replacement. |
| Every requirement has actual evidence, children and dependencies are ready, and both checks pass | Write `passed` with evidence and close. Clear a stale failed outcome only after a fresh pass is established. |
| First task layer is complete but remaining acceptance work is only planned | Do not review as complete; retain the full acceptance direction and create later same-type children when settled. |
| Dependency closes failed | Inspect the output: work needing an absent or unusable output waits; if usable, it may proceed subject to other gates. The owner decides any replacement or change of dependency. |
| Child reopens during review or after a passed parent review | A running review is void. For a closed parent, apply update's ancestor test; invalidate and reopen only a parent whose verdict no longer holds. |
| Review says passed but the map is still in progress and evidence changed | Do not infer a pass. Invalidate the stale review with its reason, wait for review prerequisites, and perform a fresh review. |
| Review finds a task gap | If the original task signal required the missing work, apply update's tests to that task. If the parent omitted a new requirement, discuss target or structure first; do not create an implicit sibling-task dependency. |
| Legacy child has no Review | Read its existing acceptance signal or direction, result and actual evidence; do not invent a historical verdict. |

The walkthrough led to corrections for reopened map status, invalidated interim reviews, legacy task evidence, dependency checks and the update example. It also found a separate task-design wording conflict about `Boundaries` section order; that is not repaired by the map changes. `needs_human` being optional in general task properties but required explicitly by the split task reference is a stricter split rule, not by itself a contradiction.

Not executed here: a valid human-grilled end-to-end map acceptance, the `passed`, `needs discussion`, and `wrong direction` branches in a real review, failed dependency replacement, cross-owner writes, or interruption between Review and status writes. Static walkthroughs and structural validation do not establish those behaviors.
