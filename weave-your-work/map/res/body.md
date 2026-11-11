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

An entry is one line with a kind, then a line that says what resolving it would change:

```
- Decision: whether each role gets its own checklist.
  Why it matters: it decides how many documents exist and who keeps them current.
```

Kinds: `Decision`, `Fact`, `Assumption`, `Thing to try`. The second line is `If wrong:` for an assumption, `Why it matters:` otherwise.

Fog is written once, when the map is created, and later only through a change. A map's fog is the part of its own target that is in scope and not sharp enough to act on; content beyond the target is `Out of scope`, not fog. A question that can be stated precisely is a child, not fog, even when it cannot be answered yet.

A resolved entry stays in place, struck through, followed by `Resolved on <date>: <what it became and where>`. An entry that turned out irrelevant is deleted. A section whose entries are all struck carries no fog.

## States

```
open → in_progress → closed
```

- `open`: a target before its first split, or work reopened.
- `in_progress`: from the first split until a verdict lands. A map splits again whenever a layer settles; the number of splits is not fixed.
- `closed`: the review passed, or the direction failed.

There is no `reviewing` state: a map under review stays `in_progress` until the verdict is written. `split_as` is written at the first split and never changes; every later child is the same type.

## Assertions

- `Target` or `Acceptance direction` missing. `[check-records]`
- `Acceptance direction` without a `Review point:` line. `[check-records]`
- A body listing its children. `[check-records]`
- `Not yet specified` missing. `[check-records]`
- A fog entry without its second line. `[check-records]`
- A resolved entry not struck, or a struck entry without `Resolved on <date>`. `[check-records]`
- `split_as` changed after children exist. `[check-records]`
- A decision bullet with no source. `[review]`
