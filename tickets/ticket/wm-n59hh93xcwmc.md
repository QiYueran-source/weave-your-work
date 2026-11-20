---
schema: 1
id: wm-n59hh93xcwmc
title: 'Review: read a spec''s finished tickets on two axes, and change nothing'
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-18T08:11:42Z
updated_at: 2026-11-18T08:12:45Z
closed_at: 2026-11-18T08:12:45Z
custom_fields:
  needs_human: false
---
Part of wm-kkpdm0hek877

## What to do

A review skill exists at `weave-your-work/review/`, reachable by a person, that
reads one spec's finished tickets on two axes and changes nothing while reading.
It replaces the slot Matt's `code-review` left when his diff-based skill was not
carried over.

## Acceptance criteria

- [x] `weave-your-work/review/SKILL.md` has `disable-model-invocation: true` and
      a human-facing description with no trigger list.
- [x] `weave-your-work/review/agents/openai.yaml` carries
      `policy.allow_implicit_invocation: false` and a `short_description`.
- [x] The material named is the spec and its tickets; no step mentions a diff, a
      commit, a branch, or a fixed point.
- [x] Axis A judges each acceptance line of each ticket against that ticket's
      result, with three outcomes: met, unmet, and not judgeable, and not
      judgeable is reported rather than passed.
- [x] Axis B asks whether the result addresses the spec's Problem Statement and
      whether the spec asks for things the problem does not require.
- [x] The two axes are reported under separate headings with a per-axis count and
      that axis's worst finding, and no combined ranking appears.
- [x] Exactly three smells are listed: a name that does not say what the thing
      is, the same thing written twice for the same reader, and one record
      carrying unrelated things. A copy written for a different reader is stated
      as not duplication.
- [x] Every finding names the ticket and who worked it, and says whether it is
      the caller's to dispatch or that person's to fix.
- [x] A ticket with no result is a finding, not a skipped ticket.
- [x] No step writes, edits, or closes anything.
- [x] A missing spec is stated rather than the run presenting one axis as the
      whole.
- [x] No tracker command, field name, or status value appears in the skill; it
      points at `.work-weave/config/tracker.md`.

## The result

Review skill written at `weave-your-work/review/SKILL.md`, with
`agents/openai.yaml` beside it. It reads one spec and the tickets cut from it:
Axis A judges each acceptance line against that ticket's result as met, unmet,
or not judgeable; Axis B asks whether the result addresses the spec's Problem
Statement and whether the spec asks for more than the problem needs.

The axes are reported under separate headings, each with a count and its own
worst finding, and the skill refuses to rank them together. Three smells are
kept and all three describe records: a name that does not say what the thing
is, the same thing written twice for the same reader, and one record carrying
unrelated things; a copy written for a different reader is named as not
duplication. Every finding names the ticket, who worked it, and whether it is
the caller's to dispatch or that person's to fix. A ticket with no result is a
finding. Nothing is written, edited, or closed.

Verified by reading back: both new files are mode 644, and a grep for `diff`,
`commit`, `branch`, `fixed point`, `waymark`, and `status` finds one hit, the
sentence that names a fixed point in order to say there is none. Seven prose
lines run to 81 columns; they are rewrapped flush, and the prose reads the same
either way.

## Blocked by

- Part of wm-kkpdm0hek877 by name; no blocking edge between tickets.
