---
name: map-review
description: "Judge a map against the acceptance direction it was written with, give each axis its own verdict, record both with their evidence, and close the map or send it back. Use when every child of a map is closed, or when a map's verdict is questioned."
family: track
invocation: user
---

# Map review

A map is not accepted because its owner says the children are done. This skill reads the map against its acceptance direction, judges the goal and the convention separately, and records both. The axes, the four verdicts, and the shape of `## Review` are the `map` skill's.

## When it runs

Every child is closed, every dependency is closed, `Not yet specified` has no open entry, and no accepted part of the direction is uncovered. A map still carrying fog or known uncovered acceptance work is not ready: send it to `fog-explore` or `split` first. Children that contradict each other are `whole-review`'s question; that pass runs only when a person asks for it, so a map judged here may not have had one. When two children look contradictory while reading them, say so in a finding instead of judging which one wins.

A map with no children can be reviewed, and the review is where the absence is explained: either the map was opened with nothing to deliver, or it should not have been opened.

## Who reviews

The owner reviews and closes. A run that is not the owner's reports its findings and does not close the map.

## Steps

1. **Read the map**: `Target`, `Acceptance direction`, the review point under it, `Decisions so far`, and `Review` if one is there.
2. **Read the actual children**: each type against `split_as`; each task's `Result`, `Review`, and deliverable; each child map's `Review` and evidence, both axes. `waymark validate` checks structure and does not establish acceptance.
3. **Judge the goal axis** line by line against the acceptance direction. Completed and planned layers together cover it; a plan is not evidence. A struck or archived child does not count as coverage; a review that still stands on live content does.
4. **Judge the convention axis**: body shape, child types against `split_as`, no children index, relations, and write ownership. A legacy map whose review never existed is not required to have had one retroactively.
5. **Write `## Review`** by the `map` skill's rule: one block, `Goal:` and `Convention:` each with its own verdict and evidence. A finding that cites nothing is an opinion and is dropped.
6. **Act on the pair** as the `map` skill's table says: both `passed` closes the map; otherwise the worse verdict decides what happens next.

A child reopened during the review voids it: wait for it to close and review again. When `Review` and `status` disagree, recheck the children and the evidence before either changes; neither status nor an old verdict alone proves a pass.

## Transformation

```
before: a map whose children are all closed and whose fog is cleared
after:
- Review carries a Goal verdict and a Convention verdict, each with its evidence
- both passed: status closed
- wrong direction on either axis: outcome = failed, status closed, a sibling opened and linked
- otherwise: status unchanged, the gap or the question recorded
- an older block that no longer holds is struck with the reason it was superseded
```

## Hands off

- `update` when a verdict names `needs changes` and a closed child's verdict no longer holds.
- `grill` when either axis says `needs discussion`.

## What this skill does not do

- Accept a task.
- Find a contradiction between two children; `whole-review` does that.
- Define the axes, the verdicts, or the shape of `## Review`; the `map` skill does.
- Split the map or clear its fog.
- Open the replacement for a failed map. The owner does that.
