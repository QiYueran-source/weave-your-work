---
name: whole-review
description: "Read the children of one map against themselves, their siblings, and their parent, and report where the set does not hold together: a child that contradicts its own review, two that promise the same result, or one that reaches past the map's acceptance direction. Use when a person asks for a whole-map check before judging a map."
family: track
invocation: user
---

# Whole review

Each child of a map is reviewed on its own, and each one can pass while two of them fight. This skill reads the children as a set, after they are all closed, and reports the places where the set does not hold together. It writes a report into the map and closes nothing.

## When it runs

A person asks for it, usually with a map whose children are all closed and about to be judged by `map-review`, or a map whose children lean on each other enough that the set is worth reading as one. Nothing calls this skill by itself: `map-review` judges the map without it, and a map judged without this pass carries no `Whole review` paragraph, which is not a finding.

A child reopened after this pass makes it stale: run it again once the child closes.

## Steps

Every child is read against three things: itself, its siblings, and its parent. `task-review` and `map-review` judge one record each and establish that; this pass asks only whether the set holds together.

1. **Read the set**: every child's `Target` or `Action`, its `Acceptance signal`, its `Result`, and both verdicts in its `Review`. Read `Decisions so far` and `Acceptance direction` of the map above them.
2. **Against its own review**: a child whose two verdicts cannot both be true of what its `Result` says.
3. **Against its siblings**: two children whose results cannot both be the deliverable, or whose finished work has to be replaced by the other; two children that lean on one decision or one deliverable, where one of them has since struck that decision or replaced that deliverable. Name both ids.
4. **Against its parent**: a child that delivers something `Acceptance direction` never asked for and that no decision in `Decisions so far` rules into scope, and a line of the direction no child answers.
5. **Write the report** as a paragraph of the map's `## Review`, headed `Whole review, <date>`. One bullet per finding, naming both sides by id and citing the line in each that contradicts; the fourth check is the exception that names one side, and it cites the direction line that nothing answers; when there is nothing, say so in one line. It sits beside the two axis blocks and carries no verdict; the section rule for adding or striking it is `map/res/body.md`'s.

The map carries one dated `Whole review` paragraph, and nothing else in the tree moved.

## Hands off

- `map-review`, which reads the paragraph as part of its goal axis.
- `update` for a contradiction someone has to change a record to settle; the owner of the child settles it.

## What this skill does not do

- Decide whether a child is acceptable; that is `map-review`.
