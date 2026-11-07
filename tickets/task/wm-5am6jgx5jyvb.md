---
schema: 1
id: wm-5am6jgx5jyvb
title: Make Result the shared outcome section
category: task
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-07T10:34:18Z
updated_at: 2026-11-07T10:34:35Z
parent: wm-793jrqph1ckv
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Make `Result` the one section where a task's outcome lives, for both kinds.

1. Move `Result` out of the probe-only list and define it for both kinds: a delivery records where the deliverable is and how to open it, a probe records the finding and its verdict.
2. Say that what a person hands back is written into `Result`, with a link, instead of being posted as a comment.
3. Add `Result` to the delivery section list, in order, and mark it as added when the work ends.
4. Update `Progress` so it points at `Result` for what the work produced, rather than at a comment.
5. Keep the whole-ticket example and the two probe examples, and update the sentences that describe them.

## Acceptance signal

`body.md` defines `Result` once, for both kinds, in the sections written after creation. Every place that used to send the outcome to a comment now points at `Result`, and a reader of the file alone can write a closed delivery ticket that says what it produced and where it is.

## Boundaries

- No change to `properties.md` or `kind.md`.
- No new section.
