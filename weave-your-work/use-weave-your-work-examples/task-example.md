# Example task: produce the four-week click-through baseline

A delivery task as waymark stores it. The kind and reversibility are front matter fields; the body uses the sections task design defines.

```markdown
---
schema: 1
id: wm-abc123def456
title: Produce the four-week click-through baseline
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-03-01T09:00:00Z
updated_at: 2026-03-01T09:00:00Z
closed_at: 2026-03-01T09:00:00Z
parent: wm-map00000000
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Produce the four-week click-through baseline so the next decision has a number to compare against.

1. Pull the weekly click-through numbers for the last four weeks.
2. Save the numbers as `baseline-click-through.csv` in the shared folder.

## Acceptance signal

`baseline-click-through.csv` holds four weekly rows, one per week, with no week missing. A reader who did not build the file can see the four rows and the four dates without asking the owner anything.

## Result

`baseline-click-through.csv` is in the shared folder, four weekly rows, no week missing.

## Review

passed

- Goal: `baseline-click-through.csv` holds four weekly rows and no week is missing, read as the `Acceptance signal` asks.
- Convention: only the CSV was written, and the task carries `Result` and this section.

## Boundaries

- No dashboard changes.
```
