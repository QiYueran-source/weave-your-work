---
schema: 1
id: wm-1dw8dn53xk7t
title: 'Fixture: child reopens during map review'
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-09T03:59:22Z
updated_at: 2026-11-09T03:59:55Z
closed_at: 2026-11-09T03:59:55Z
parent: wm-91h5dy4pmtem
custom_fields:
  split_as: task
---
## Target

A reader can find an invented sample label in a note.

Why: this fixture tests the effect of a child reopening during review.

## Acceptance direction

All children are complete and no further children are needed.

Review point: `results/reopen-fixture.md` says that `sample-C` is invented for the audit.

## Decisions so far

- Use one task to write the note. (audit fixture)

## Not yet specified

(none; the task is settled)

## Out of scope

- Laboratory work.
