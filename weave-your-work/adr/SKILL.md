---
name: adr
description: "Record a decision as an ADR when it is hard to reverse, surprising without context, and the result of a real trade-off: judge the three gates, write one line to your own source file, and supersede an older one instead of editing it. Use when a discussion settles a decision that passes all three gates."
family: method
invocation: model
---

# ADR

An ADR records a decision a future reader cannot reconstruct from the records
around it: what was decided, and why. It earns its place only when the decision
will still surprise someone later.

The three gates, the shapes that pass them, and the record format are
`ADR-FORMAT.md`. This skill applies them.

## When it runs

A decision is settled, in a discussion or anywhere else, and whoever holds it
decides whether it earned an ADR. Ask the three gates in order: hard to reverse,
surprising without context, a real trade-off. If any fails, write nothing: the
decision stays in the record that made it.

## Steps

1. **Judge the gates.** Name which one carried it, in one line. When a gate
   fails, name the gate that failed and stop.
2. **Write one line to your own source file** with `adr.js write`, the CLI
   under `.work-weave/runtime/adr/`, in the shape `ADR-FORMAT.md` gives. Write
   it the moment the decision settles, one decision at a time; do not batch a
   discussion's decisions into one write at the end.
3. **Link back** to the record that owns the decision, by `waymark` id, in
   `record`.
4. **Supersede, never edit.** When an ADR replaces an earlier one, name the old
   `id` in `supersedes`. Do not touch the old line: it may belong to someone
   else, and the merge works out the rest.
5. **Merge when the discussion ends.** Run `merge` so `ADR.md` at the project
   root reflects every source. A person who pulls runs it too; the post-merge
   hook does that for them.

Never write to another operator's source file, and never edit `ADR.md` by hand:
the next merge overwrites it.

## What this skill does not do

- Make or recommend the decision. The owner decides; this skill writes it down.
- Decide what a decision belongs to. The record that owns it says that.
- Settle two entries that describe the same decision under two ids. The merge
  keeps both; a person settles them.
- Record a decision that fails a gate.
