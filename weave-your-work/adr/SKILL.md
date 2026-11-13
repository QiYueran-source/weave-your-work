---
name: adr
description: "Record a decision as an ADR when it is hard to reverse, surprising without context, and the result of a real trade-off: write the next numbered file, link it to its record, and supersede an older one without deleting it. Use when a discussion settles a decision that passes the three gates."
family: method
invocation: model
---

# ADR

An ADR records a decision a future reader cannot reconstruct from the records around it: what was decided, and why. It earns its place only when the decision will still surprise someone later.

The three gates and the file format are `res/format.md`. This skill applies them.

## When it runs

A decision is settled — by a discussion, by a split, or by `update` changing one — and whoever holds it decides whether it earned a file. Ask the three gates in order: hard to reverse, surprising without context, a real trade-off. If any fails, write nothing: the decision stays in the map's `Decisions so far`.

## Steps

1. **Judge the gates.** Say which one carried it, in one line, when you write.
2. **Number it.** Read the highest number in `docs/adr/` and add one. Create the directory only with the first ADR.
3. **Write the file**: a title and one paragraph — what was decided and why, with whatever context the reason needs. The three optional sections only when they add something a reader cannot infer.
4. **Link back** to the record that owns the decision, by id, and to the testimony when there is one.
5. **Supersede, never edit.** A new ADR names the old one; the old one gets `## Status` with `Superseded by ADR-NNNN.`; the old file keeps its number.

One new file sits under `docs/adr/`, and `adr/res/format.md` says what it holds.

## What this skill does not do

- Make or recommend the decision. The owner decides; this skill writes it down.
- Write the map, the task, or the testimony.
- Record a decision that fails a gate.
