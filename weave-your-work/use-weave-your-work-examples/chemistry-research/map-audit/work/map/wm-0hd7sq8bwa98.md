---
schema: 1
id: wm-0hd7sq8bwa98
title: 'Fixture: a complete synthetic review note'
category: map
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-09T03:57:32Z
updated_at: 2026-11-09T04:05:18Z
parent: wm-91h5dy4pmtem
custom_fields:
  split_as: task
---
## Target

A reader can verify both the label and limitation of an invented test result in one note.

Why: the fixture gives the reviewer a specific, fixable gap.

## Acceptance direction

A synthetic note identifies its label and says that the value is invented.

Review point: `results/review-gap.md` contains both the label and the limitation; all children are complete and no further children are needed.

## Decisions so far

- Use the fictional label `sample-A` in the note. (audit fixture)
- Review found that `results/review-gap.md` did not say the value was invented, as required by the acceptance direction and review point. The limitation was added. (needs changes review)
- The fix was wrongly created as a sibling task that reads another task's output, contrary to split/task.md. The note still lacks the invented value required by the acceptance direction, and the convention check fails; do not close this map as passed. (second review, split/task.md)

## Not yet specified

(none; fixture requirements are settled)

## Out of scope

- Laboratory work or a chemical conclusion.
