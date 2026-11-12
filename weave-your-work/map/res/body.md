# Map body

What a map contains, and the states it moves through. The field rules are `waymark/res/fields.md`; the review is `review.md`.

## Body

Six sections, each a `##` heading with the English name below. A section is written when it carries something; one with nothing to say is left out, except `Not yet specified`, which every map carries from creation.

- `Target` — one outcome as a state of the world, then a `Why:` line: what it is for, or what its absence costs.
- `Acceptance direction` — how someone other than the owner confirms it: the default `All children are complete…`, or the observable result; either way a `Review point:` line names the checkable items.
- `Decisions so far` — one decision per bullet, in its concrete form, with its source at the end: `(user confirmed)`, `(verified in waymark 0.1.2)`, or a link to the record it came from. A decision added later also carries the date it was settled.
- `Not yet specified` — the fog, or `(none; no open fog, no known uncovered work)`.
- `Out of scope` — one bullet per excluded item, with the reason.
- `Review` — the verdict, then one line per axis with evidence.

A body holds no list of its children: the `parent` field is the structure. A parent's body is never edited to record a new child.

## When a section changes

`Decisions so far`, `Review`, and `Out of scope` follow one rule. A new fact **adds** an entry beside the old one, with its date and its source, when the old one still holds; it **strikes** the old one where it stands, with `Superseded on <date>: <why>` on the line below and the replacement under that, when it does not. An entry present at creation takes the record's `created_at`; later writes carry their own date. Strike only the part that is overturned and keep the rest. Archive is for a whole record, never for an entry inside one.

## Fog

Fog is the in-scope part of a map's own target that is not yet sharp enough to act on. It is written when the map is created, and later only through a change.

### The walk

Walk the whole target once and send each part to one place: a child, when one action and a checkable result can be written for it now; `Not yet specified`, when the question cannot be stated precisely yet; `Out of scope`, when it lies beyond `Target` and `Acceptance direction`; `Decisions so far`, when it is already settled.

The test is whether the question can be stated now, not answered now: a precise question that waits on a person is a child. Do not pre-slice an entry into the shape of a child; an entry naming each of its parts is a child not yet hung. A walk with no child and no entry produces no map.

### The entry

An entry is one line with a kind and, under it, a line saying what resolving it would change: `- Decision: whether each role gets its own checklist.` over `  Why it matters: …`. Kinds: `Decision`, `Fact`, `Assumption`, `Thing to try`; the second line is `If wrong:` for an assumption.

### Where a cleared entry lands

The answer goes into the section that owns it, never into the fog entry:

- a decision: `Decisions so far`, in its concrete form, with its source
- a sharpened goal: `Target`, and `Acceptance direction` with it when the bar moves
- a refusal: `Out of scope`, with the reason
- work that needs its own record: a child of the map, opened by the action for that record

A cleared entry stays in place, struck through, followed by `Resolved on <date>: <what it became and where>`; an irrelevant one is deleted.

## Assertions

- `Target` or `Acceptance direction` missing. [check-records]
- `Target` without its `Why:` line. [check-records]
- `Acceptance direction` without a `Review point:` line. [check-records]
- A body listing its children. [check-records]
- `Not yet specified` missing. [check-records]
- A fog entry without its second line. [check-records]
- A resolved entry not struck, or a struck entry without `Resolved on <date>`. [check-records]
- `split_as` changed after children exist: a map with children carries `split_as`, and its value matches the children's category (`submap` for maps, `task` for tasks). [check-records]
- A decision bullet with no source. [review]
- A map whose `Not yet specified` was never walked: every part of its target is already a child, a decision, or an exclusion, and no entry was ever struck. [review]
