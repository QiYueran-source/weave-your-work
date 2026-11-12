---
name: whole-review
description: "Read the children of one map together and report where they contradict each other, promise the same result twice, or reach past the map's acceptance direction. Use after every child of a map is closed and before the map is judged."
family: track
invocation: model
---

# Whole review

Each child of a map is reviewed on its own, and each one can pass while two of them fight. This skill reads the children as a set, after they are all closed, and reports the places where the set does not hold together. It writes a report into the map and closes nothing.

## When it runs

Every child of a map is closed, and the map is about to be judged by `map-review`. A child reopened after this pass makes it stale: run it again once the child closes.

## Steps

1. **Read the set**: every child's `Target` or `Action`, its `Acceptance signal`, its `Result`, and both verdicts in its `Review`. Read `Decisions so far` and `Acceptance direction` of the map above them.
2. **Look for the same result promised twice**: two children whose results cannot both be the deliverable, or whose finished work has to be replaced by the other. Name both ids.
3. **Look for an overturned premise**: two children that lean on one decision or one deliverable, where one of them has since struck that decision or replaced that deliverable.
4. **Look for reach past the direction**: a child that delivers something `Acceptance direction` never asked for, and that no decision in `Decisions so far` rules into scope.
5. **Write the report** as a paragraph of the map's `## Review`, headed `Whole review, <date>`. One bullet per finding, naming both sides by id and citing the line in each that contradicts; when there is nothing, say so in one line. It sits beside the two axis blocks and carries no verdict; the section rule for adding or striking it is `map/res/body.md`'s.

## Transformation

```
before: a map whose children are all closed, each judged alone
after:
- the map carries one Whole review paragraph, dated, with a bullet per contradiction and both sides cited
- no record other than the map is written
- no verdict and no status changed
```

## Hands off

- `map-review`, which reads the paragraph as part of its goal axis.
- `update` for a contradiction someone has to change a record to settle; the owner of the child settles it.

## What this skill does not do

- Judge a child, or a map. The two reviews do that.
- Close, reopen, archive, or move anything. The contradiction is reported, and its owner settles it.
- Find a contradiction inside one child; that child's own review does.
