---
name: update
description: "Change a record that other records already rely on: edit it in place, strike the old text and reopen it, or retire it and open a replacement, then carry the change to its children, its dependents, and its links. Use when a closed record, or a map that has already split, has to change."
family: track
invocation: model
---

# Update

An open record with no children is yours to shape. A closed one, or a map that has already split, is something other records stand on: children refine it, dependents wait for it, and a verdict was judged against its text. Changing it is a change to a promise.

## When it runs

The trigger is the record's state, not the size of the change:

- a closed record, map or task;
- a map that has already split, even while still open.

Relocating a record is the exception: a subtree moves in any state, because what makes it an update is that its old and new parents relied on where it sat.

## Steps

1. **Scan what relies on it.** Children, the parent, dependency edges in both directions, soft links, and any body naming it by id or title. `waymark --json show <id>` returns the relations in one answer; `waymark search "<text>"` finds the bodies.
2. **Apply the two tests** to the record, and to each record the scan reaches: same question? then, do the verdicts still hold? A verdict holds when both axes of its latest block pass on the content as it now stands; a closed descendant does not reopen because an ancestor changed, its own verdicts have to fail.
3. **Pick the disposition** from `waymark`'s `res/disposition.md` and apply it: edit in place, strike and reopen, or retire and replace. Which entries inside the record are struck and which are added follows the record's own section rule — `map/res/body.md` for a map, `task/res/body.md` for a task — and only what the new fact overturns is struck.
4. **Carry the change** to the records the scan named, within one owner: every child that refined the old text, every dependent that waited on it, every link that now points at nothing.
5. **Reopen what counted it.** Reopening a child does not reopen its parent; a map whose acceptance direction ends with "all children are complete" is falsified by reopening any child. Reopen the closed ancestors whose acceptance counted the changed record, and write one line under the reopened record's `Review` saying why it is open again.
6. **Add before you split.** A reopened map that gains work gets the new decision, exclusion, or fog entry first, and only then the children that carry it: `fog-explore` or `split` reads the body for what is still missing.
7. **Leave a conflict to its owner.** A reopened record can contradict a closed sibling: the same result promised twice, or two outcomes that cannot both hold. Retiring or moving that sibling is its owner's write, never this run's, even when the reopened record is its parent's subject. Report the conflict and file an `issue` when the owner is someone else.
8. **Tell a foreign owner.** When the scan reaches a record owned by someone else and that record's content must change, the branch stops there: finish what this run owns, then file an `issue` naming the relation that disappeared, the record that replaced it, and the decision the owner has to make.

`link add`, `link remove`, and `archive` write the other record by design. Their owner is told in the same run.

## Moving a subtree

A move changes where a record sits and nothing else: `waymark parent set <id> <new-parent>` writes one field, and the moved record keeps its content, its status, and its history. Read both parents afterwards: a parent whose acceptance direction counts its children may need reopening, and that is the same test as step 5. `task/res/body.md` gives a task the same section rule. A move is not a category change, and the edges on the moved record do not move with it.

## When the change needs new work

A change that needs work is not written into a delivered record. It becomes a child of the map, of the type the map's `split_as` froze, written by `split`; the run then commits to it only when the record's own acceptance direction requires it, and otherwise leaves it open for a later run.

## Transformation

```
before: a record that others rely on, and its dependents
after:
- the record carries the disposition it earned, and its status matches it
- every struck passage carries Superseded on <date> and the reason
- every reopened record is left open for a review, not closed by this run
- every dependent whose relation still means something was updated, or still waits in the shape it had
- every foreign owner reached was told in an issue, with the relation and the replacement named
```

## Hands off

- `task-review` or `map-review` to judge the changed record again; a reopened record is not closed by anything else.
- `adr` when the change overturns a decision an ADR records: the new ADR supersedes the old one, and the changed record names it.
- `issue` for a foreign owner.
- The sibling a reopened record contradicts, when its owner has to decide whether it stays.

## What this skill does not do

- Change an open record with no children: that is a plain edit, and its owner does it.
- Decide whether a map should split, or a task should exist.
- Use `outcome=failed` for a retirement. Failure is a verdict on an attempt; retirement is a verdict on a subject.
