---
name: adr
description: >-
  Record a decision as an ADR when it is hard to reverse, surprising without
  context, and the result of a real trade-off: write the next numbered file,
  link it to its ticket, and supersede an older record without deleting it.
---

# ADR

An ADR records a decision a future reader cannot reconstruct from the repository: what was decided, and why. It is not a design document and not a meeting note. It earns its place only when the decision will still surprise someone later.

## The three gates

Write an ADR only when all three hold:

1. **Hard to reverse.** Changing your mind later costs something meaningful.
2. **Surprising without context.** A future reader will wonder why it was done this way.
3. **A real trade-off.** There were alternatives, and one was chosen for specific reasons.

If any gate fails, skip the ADR. The decision stays in the ticket's `Decisions so far`. A decision that is easy to reverse will be reversed; one that is not surprising needs no explanation; one with no alternative has nothing to explain.

## What qualifies

The gates are abstract; these are the common shapes of a decision that passes them. The list helps a reader recognize one; it is not a checklist.

- **Where a document lives.** A kind of material gets its own root, or a generated file stops being the source.
- **What counts as a record.** A record type, its category, owner, status, and body.
- **How work moves.** A hand-off rule, a review gate, or when a record is written.
- **Who owns what.** Which skill or role decides, which one only records it, and what may parent what.

## The file

`docs/adr/NNNN-slug.md`

`NNNN` is the next number: read the highest number in `docs/adr/` and add one. `slug` is a short kebab-case name for the decision. Create `docs/adr/` only when the first ADR is needed.

The record is a title and one paragraph: what was decided and why, including whatever context the reason needs.

```md
# Usage-based pricing for the API

The API is priced per request rather than per seat because most customers call it from their own product, where seats do not map to usage. A flat subscription would make the price unpredictable for the smallest customers and unprofitable for the largest.
```

A paragraph is enough. The value is in recording that the decision was made and why.

Three sections are optional, and only when they add something a reader cannot infer:

- `## Status` — `proposed`, `accepted`, `deprecated`, or `superseded by ADR-NNNN`.
- `## Considered Options` — the alternatives that lost, when their rejection is not obvious.
- `## Consequences` — downstream effects that are not obvious from the decision.

## Superseding a record

Do not edit the old decision into the new one. Write a new ADR and leave the old file in place:

1. The new record names the old one: `Supersedes ADR-0003.`
2. The old record gets `## Status` with `Superseded by ADR-0007.`
3. The old file keeps its number. A number is a position in history, not a version.

## Linking back

Name the ticket that owns the decision, by id. When a testimony exists, link it next to the decision. The record says why; the ticket says who asked and what was settled around it.

## What it does not do

- Make or recommend a decision. The owner decides; this skill writes it down.
- Write the ticket or the testimony.
- Record a decision that fails a gate.
