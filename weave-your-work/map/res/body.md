# Map body

What a map contains, and the states it moves through. The field rules are `waymark/res/fields.md`; the review is `review.md`.

## Body

Six sections, each a `##` heading with the English name below, whatever language the text under it uses. A section is written when it carries something; one with nothing to say is left out, except `Not yet specified`, which every map carries from creation.

- `Target` — one outcome as a state of the world, then a `Why:` line: what it is for, or what its absence costs.
- `Acceptance direction` — how someone other than the owner confirms it. Either `All children are complete and no further children are needed.` or the observable result. Either way, a `Review point:` line names what the reviewer looks at, as checkable items.
- `Decisions so far` — one decision per bullet, in its concrete form, with its source at the end: `(user confirmed)`, `(verified in waymark 0.1.2)`, or a link to the record it came from.
- `Not yet specified` — the fog, or `(none; no open fog, no known uncovered work)`.
- `Out of scope` — one bullet per excluded item, with the reason.
- `Review` — the verdict, then one line per axis with evidence.

A body holds no list of its children: the `parent` field is the structure, and `waymark tree` reads it back. A parent's body is never edited to record a new child.

## Fog

Fog is the in-scope part of a map's own target that is not yet sharp enough to act on. It is written when the map is created, and later only through a change.

### The walk

Walk the whole target once and send each part to one place:

| The part | Where it goes |
|---|---|
| one action and a checkable result can be written for it now | a child |
| in scope, and the question cannot be stated precisely yet | `Not yet specified` |
| beyond what `Target` and `Acceptance direction` state | `Out of scope`, with the reason |
| already settled | `Decisions so far`, with its source |

The test for the second row is whether the question can be stated now, not whether it can be answered now: a precise question that waits on a person is a child. Draft the entries and show them to the owner before writing; do not pre-slice one into the shape of a child, because an entry that names each of its parts is a child that has not been hung yet.

A walk that finds neither a child nor an entry does not produce a map: the target is small enough to be a task, or too vague to state.

### The entry

An entry is one line with a kind, then a line that says what resolving it would change:

```
- Decision: whether each role gets its own checklist.
  Why it matters: it decides how many documents exist and who keeps them current.
```

Kinds: `Decision`, `Fact`, `Assumption`, `Thing to try`; the second line is `If wrong:` for an assumption, `Why it matters:` otherwise. A resolved entry stays in place, struck through, followed by `Resolved on <date>: <what it became and where>`; one that turned out irrelevant is deleted.

## Assertions

- `Target` or `Acceptance direction` missing. [check-records]
- `Target` without its `Why:` line. [check-records]
- `Acceptance direction` without a `Review point:` line. [check-records]
- A body listing its children. [check-records]
- `Not yet specified` missing. [check-records]
- A fog entry without its second line. [check-records]
- A resolved entry not struck, or a struck entry without `Resolved on <date>`. [check-records]
- `split_as` changed after children exist. [check-records]
- A decision bullet with no source. [review]
- A map whose `Not yet specified` was never walked: every part of its target is already a child, a decision, or an exclusion, and no entry was ever struck. [review]
