---
name: map-review
description: "Judge a map against the acceptance direction it was written with, record one verdict with both axes and their evidence, and close it or send it back. Use when every child of a map is closed, or when a map's verdict is questioned."
family: track
invocation: user
---

# Map review

A map is not accepted because its owner says the children are done. This skill reads the map against its acceptance direction and records one verdict with evidence for both axes. The shape of the section and the two axes are the `map` skill's.

## When it runs

Every child is closed, every dependency is closed, `Not yet specified` has no open entry, and no accepted part of the direction is uncovered. A map still carrying fog or known uncovered acceptance work is not ready: send it to `fog-explore` or `split` first.

A map with no children can be reviewed, and the review is where the absence is explained: either the map was opened with nothing to deliver, or it should not have been opened.

## Who reviews

The owner reviews and closes. A run that is not the owner's reports its findings and does not close the map.

## Steps

1. **Read the map**: `Target`, `Acceptance direction`, the review point under it, `Decisions so far`, and `Review` if one is there.
2. **Read the actual children**: each type against `split_as`; each task's `Result`, `Review`, and deliverable; each child map's `Review` and evidence. `waymark validate` checks structure and does not establish acceptance.
3. **Judge the goal axis** line by line against the acceptance direction. Completed and planned layers together cover it; a plan is not evidence.
4. **Judge the convention axis**: body shape, child types against `split_as`, no children index, relations, and write ownership. A legacy map whose review never existed is not required to have had one retroactively.
5. **Write `## Review`**: the verdict, then one line per axis with evidence. Every finding names its source; a finding that cites nothing is an opinion and is dropped.
6. **Act on the verdict** below.

## The four verdicts

| Verdict | When | What follows |
|---|---|---|
| `passed` | both axes hold | close the map |
| `needs changes` | an axis names a gap someone can close | stays `in_progress`; repair, then review again |
| `needs discussion` | ambiguity prevents reading the direction as a standard, or the map's words contradict each other | stays `in_progress`; the recorded question goes to `grill` |
| `wrong direction` | the map cannot be judged because it was the wrong target | `outcome=failed`, then close; the owner opens the sibling that replaces it and the two are soft-linked |

A child reopened during the review voids it: wait for it to close and review again. When `Review` and `status` disagree, recheck the children and the evidence before either changes; neither status nor an old verdict alone proves a pass.

## Transformation

```
before: a map whose children are all closed and whose fog is cleared
after:
- Review carries exactly one verdict, then one line per axis, each with evidence
- passed: status closed
- wrong direction: outcome = failed, status closed, a sibling opened and linked
- needs changes or needs discussion: status unchanged, the gap or the question recorded
- an older verdict on the same subject is struck through with the reason it was superseded
```

## Hands off

- `update` when the verdict is `needs changes` and a closed child's verdict no longer holds.
- `grill` when the verdict is `needs discussion`.

## What this skill does not do

- Accept a task.
- Split the map or clear its fog.
- Open the replacement for a failed map. The owner does that.
