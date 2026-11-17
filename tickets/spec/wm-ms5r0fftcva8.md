---
schema: 1
id: wm-ms5r0fftcva8
title: 'ADR: office-ready, per-operator sources, millisecond ids'
category: spec
status: open
owner: frank
creator: frank
created_at: 2026-11-17T06:06:58Z
updated_at: 2026-11-17T06:06:58Z
---
## Problem Statement

The ADR skill in this set was written for a code repository: it writes one
Markdown file per decision under `docs/adr/`, numbers them by scanning for the
highest existing number, and assumes a single author. Three problems follow.

The records are not office work. An office project has decisions that are just
as hard to reverse as a schema change: which supplier is signed, who owns a
dataset, which approval path a request takes, what deadline the contract
imposes. The current skill states the three gates but gives no example of what
passes them in that world, so a person cannot tell whether a decision in front
of them qualifies.

Concurrent writes collide. Two people writing an ADR at the same time both read
the same highest number and both pick the next one, so the number stops
identifying a decision. This is filed as issue #28 and never reproduced, but
the numbering rule guarantees it.

The readable view is also the write target. With one file per decision in a
shared directory, every author edits the same tree, and a reader cannot tell
which entries are current after a merge.

## Solution

Keep the shape a future reader needs, which is Matt's: three gates, a list of
what qualifies, one short paragraph per ADR, and superseding instead of editing.
Change the storage to the pattern the glossary in this set already uses.

Each operator writes only their own source file, one JSONL line per ADR. A merge
step generates a single readable `ADR.md` at the project root from every source.
No two people edit the same file, and the readable view is never hand-edited.

An ADR is identified by its operator name and a UTC timestamp to the millisecond,
not by a position in a sequence. Two people writing at the same moment get two
different identifiers without coordinating, which settles #28 without a lock.

## User Stories

1. As a person running a discussion, I want to record a decision that passes the
   three gates, so that a future reader knows why it was made this way.
2. As a person new to the project, I want to read every ADR in one place, so that
   I do not have to search the repository for scattered decision notes.
3. As a person deciding whether something deserves an ADR, I want examples drawn
   from office work rather than code, so that I can judge my own case.
4. As a person whose decision is easy to reverse, I want to be told it does not
   deserve an ADR, so that the record stays useful rather than noisy.
5. As a person whose decision contradicts an existing ADR, I want to supersede it
   rather than edit it, so that the old reasoning stays readable.
6. As an operator writing an ADR, I want to write only my own source file, so that
   I never touch another person's work.
7. As an operator merging after a pull, I want the readable view rebuilt
   automatically, so that I never hand-edit it.
8. As an operator writing two ADRs in the same second, I want them to get
   different identifiers, so that the merge keeps them apart.
9. As a reader of `ADR.md`, I want each entry to name its source file, so that I
   can find the operator who wrote it.
10. As a reader of `ADR.md`, I want superseded decisions still visible, so that I
    can follow how a decision changed.
11. As a person settling a decision during a discussion, I want `grill-with-docs`
    to record it without a separate step, so that the write happens while the
    reasoning is still in front of me.
12. As an operator, I want an ADR to name the `waymark` record that owns the
    decision, so that I can move between the decision and the work it shaped.
13. As a reviewer, I want to see which ADRs fail a gate, so that the record does
    not fill with ordinary decisions.
14. As an operator, I want the merge to refuse an empty view, so that a broken
    source directory reports an error instead of silently emptying `ADR.md`.
15. As an operator whose two sources define the same decision under two
    identifiers, I want the merge to keep both, so that nothing is dropped
    silently; settling which one wins is a person's job.

## Implementation Decisions

**Location.** Sources live in `.work-weave/adr/<operator>.jsonl`, beside the
glossary sources. The generated view is `ADR.md` at the project root, beside
`GLOSSARY.md`. Both are gitignored at the root; the sources are committed.

**Record shape.** One JSONL line per ADR with these fields:

- `id` — the operator name, a `T`, then the UTC time to the millisecond, for
  example `frank-20261117T055259.123`. The millisecond is kept because two ADRs
  written in the same second are two decisions. When two land in the same
  millisecond, append `-1`, then `-2`, until the identifier is unused.
- `title` — one line naming the decision.
- `decision` — what was decided and why. This is the part a reader cannot
  reconstruct from the record.
- `status` — `accepted`, `proposed`, `deprecated`, or `superseded`.
- `supersedes` — the `id` this one replaces, or `null`.
- `record` — the `waymark` id that owns the decision, or `null`.
- `created_at` — ISO 8601 with milliseconds.

**The three gates stay as they are.** Hard to reverse, surprising without
context, a real trade-off. All three must hold. The first gate says the cost of
changing your mind is meaningful, not that the decision cannot be changed; this
distinction is what lets office decisions qualify.

**A qualification list is added.** Seven shapes a decision takes that pass all
three gates, written for office work: how work is organised, how parties hand
work to each other, a dependency expensive to leave, where responsibility stops,
a deliberate departure from the usual path, a constraint the records do not
show, and an alternative rejected for a non-obvious reason.

**Superseding is computed, not written back.** A new ADR names the old `id` in
`supersedes`. The old entry's source line is never edited, because it may belong
to another operator. The merge reads every `supersedes` field and renders the
replaced entry as superseded.

**The merge groups by state.** `ADR.md` lists accepted decisions newest first,
then superseded ones, each naming its source file and, when present, its
superseded-by identifier.

**No pre-write search for an existing ADR.** Matt's set does not require it and
this spec follows him. Two operators who record the same decision produce two
entries; the merge keeps both and a person settles it.

**The tool is a sibling of `glossary.js`, not a copy.** Shared parts are the
project root resolver, the operator reader, the source-file reader, and the
merge-to-view writer. What differs is the identifier generator, the absence of
de-duplication by title, the superseded computation, and the view layout.

**The skill text is rewritten for office work.** `SKILL.md` stops describing a
code repository and speaks about decisions in the work this set is used for. It
keeps the three gates, names the seven shapes, and says how the write happens.

**No MCP server.** The glossary has one because lookups happen constantly during
a discussion. An ADR is written once and read through `ADR.md`, so a CLI and the
merge are enough.

## Testing Decisions

Tests assert what an operator or a reader observes, not how the tool is built.

The existing suite under the glossary tool is the prior art: it builds a
temporary project, writes sources through the CLI, merges, and reads the view.

Tests to write:

- A write produces one line in the operator's own source file and touches no
  other file.
- Two writes in the same second get two different identifiers.
- Two operators writing at the same moment get two different identifiers.
- A merge renders every source entry exactly once.
- A merge marks an entry superseded when another names it, without modifying the
  first operator's source line.
- A merge with an empty source directory fails with a message rather than writing
  an empty view.
- A hand-edited `ADR.md` is overwritten by the next merge.
- Two entries describing the same decision under two identifiers both survive the
  merge.

## Out of Scope

- Resolving a decision recorded twice under two identifiers. The merge keeps both.
- Searching existing ADRs before writing a new one. Not required, per Matt.
- A lock or sequence server for identifiers.
- An MCP server for ADRs.
- Migrating existing `docs/adr/` files into the new format.
- Changing the glossary, the mainline skills, or any other skill in this set.
- The `map` and `task` categories, retired with the old waymark project.

## Further Notes

The specification for a decision's *content* is unchanged from the upstream set:
one paragraph, no heading sections required, no template to fill out. What this
spec changes is where it is stored, how it is numbered, and what a reader opens.

The id format was chosen over a sequence because a sequence needs coordination.
The cost is that an id says who wrote it and when, which reads oddly in a
historical listing. The view sorts by time, so the order still reads correctly.
