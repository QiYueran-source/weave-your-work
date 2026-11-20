# ADR format

A decision a future reader cannot reconstruct from the record that made it.

## The three gates

All three must hold. If any fails, the decision stays in the record that made it.

1. **Hard to reverse** — changing your mind later costs something meaningful.
2. **Surprising without context** — a future reader will wonder why it was done this way.
3. **A real trade-off** — there were alternatives, and one was chosen for specific reasons.

The first gate is about cost, not permanence: a decision you could undo in an
afternoon is not hard to reverse, and one that would take a contract
renegotiation is, even though it can still be changed.

When a gate fails, say which one and stop. A decision that is easy to reverse
will just be reversed; one that surprises nobody has no question to answer; one
with no real alternative records nothing beyond "we did the obvious thing".

## What qualifies

The gates are abstract. These are the shapes a decision takes that pass all
three in office work:

- **How work is organised.** "Requests go through one queue." "Planning runs
  quarterly, not every two weeks."
- **How parties hand work to each other.** "Every cross-team request is a
  ticket; chat agreements do not count." "A customer change needs written
  confirmation before it starts."
- **A dependency that is expensive to leave.** A signed supplier contract, a
  compliance certification, an outsourcing agreement. Not every tool: only the
  ones that would take a quarter to replace.
- **Where responsibility stops.** "Legal owns this data; the business reads it."
  An explicit no is worth as much as a yes: it saves the same question being
  asked again.
- **A deliberate departure from the usual path.** Anything a reasonable reader
  would assume went the other way. These stop the next person from "fixing"
  something that was chosen on purpose.
- **A constraint the records do not show.** A deadline set by contract, a
  requirement from a parent organisation, a partner's approval window.
- **An alternative that was rejected for a non-obvious reason.** If it was
  weighed and dropped for subtle reasons, record it; otherwise someone proposes
  it again in six months.

## The source

ADRs are written per operator and merged into one view. Each operator writes
only their own source file; the readable view is generated from all of them, so
no two people edit the same file.

One JSONL line in `.work-weave/shared/adr/<operator>.jsonl`:

```json
{"id":"frank-20261117T055259.123","title":"Usage-based pricing for the API","decision":"The API is priced per request rather than per seat because most customers call it from their own product, where seats do not map to usage.","status":"accepted","supersedes":null,"record":"wm-j2mbwych54bj","created_at":"2026-11-17T05:52:59.123Z"}
```

- `id` — the operator name, a `T`, then the UTC time to the millisecond, for
  example `frank-20261117T055259.123`. The millisecond is kept: two ADRs written
  in the same second are still two decisions. When two land in the same
  millisecond, append `-1`, then `-2`, until the id is unused.
- `title` — one line naming the decision.
- `decision` — what was decided and why. This is the part a reader cannot
  reconstruct from the record.
- `status` — `proposed`, `accepted`, `deprecated`, or `superseded`.
- `supersedes` — the `id` of the ADR this one replaces, or `null`.
- `record` — the `waymark` id of the record that owns the decision, or `null`.
- `created_at` — ISO 8601 with milliseconds.

An ADR can be one paragraph. The value is in recording that a decision was made
and why, not in filling out sections. A decision that is easy to reverse or that
nobody would question is not an ADR.

## The view

`ADR.md` at the project root is generated from every source and is never edited
by hand; the next merge overwrites it. It lists accepted decisions newest first,
then superseded ones. Each entry names the source file it came from.

The merge does not settle a decision recorded twice under two ids. Two operators
who record the same decision get two entries, and a person settles it.

## Superseding

Never edit an old decision into a new one. Write a new ADR that names the old
`id` in `supersedes`. The old entry's source line is never edited, because it
may belong to another operator; the merge reads every `supersedes` field and
shows the replaced entry as superseded.

When only part of a decision changes, name the part in both records.

## Linking back

Name the record that owns the decision, by `waymark` id, in `record`. The record
says who asked and what was settled around it; the ADR says why.

## Assertions

- An ADR whose `decision` explains no reason. [review]
- An ADR with no `id`, or an `id` not shaped `<operator>-<UTC time to the millisecond>`. [check-records]
- Two ADRs whose `id`s are equal. [check-records]
- An edited ADR instead of a new one that supersedes it. [review]
- An ADR that fails one of the three gates. [review]
- A hand edit to `ADR.md`. [check-records]
- A write to another operator's source file. [review]
