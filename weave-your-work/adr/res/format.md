# ADR

A decision a future reader cannot reconstruct from the record that made it.

## The three gates

All three must hold. If any fails, the decision stays in the map's `Decisions so far`.

1. **Hard to reverse** — changing your mind later costs something meaningful.
2. **Surprising without context** — a future reader will wonder why it was done this way.
3. **A real trade-off** — there were alternatives, and one was chosen for specific reasons.

## The file

`docs/adr/NNNN-slug.md`, where `NNNN` is one more than the highest number in `docs/adr/`. The directory is created with the first ADR, never before.

A title and one paragraph: what was decided and why, including the context the reason needs.

```md
# Usage-based pricing for the API

The API is priced per request rather than per seat because most customers call it from their own product, where seats do not map to usage.
```

Three sections are optional and only when they add something a reader cannot infer: `## Status` (`proposed`, `accepted`, `deprecated`, `superseded by ADR-NNNN`), `## Considered Options`, `## Consequences`.

## Superseding

Never edit an old decision into a new one. Write a new ADR, name the old one in it (`Supersedes ADR-0003.`), and give the old record `## Status` with `Superseded by ADR-0007.` The old file keeps its number: a number is a position in history, not a version. When only part is superseded, name the part in both records.

## Linking back

Name the record that owns the decision, by id. The record says who asked and what was settled around it; the ADR says why.

## Assertions

- An ADR with no paragraph explaining why. [review]
- A new ADR whose number skips or repeats. [check-records]
- An edited old ADR instead of a new one that supersedes it. [review]
- An ADR that fails one of the three gates. [review]
