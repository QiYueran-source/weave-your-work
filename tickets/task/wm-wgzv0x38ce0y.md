---
schema: 1
id: wm-wgzv0x38ce0y
title: Walk every skill's paths in the worked examples and apply the fixes found
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-12T01:49:04Z
updated_at: 2026-11-12T01:49:30Z
parent: wm-p4r56pz7v480
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Someone other than the author plans a batch of tasks across the whole set, runs it, judges each result, and records what the walk showed was wrong. The batch is [Walk every skill's paths and apply the fixes](wm-5nz6m9f8n7a4.md)'s, and its record is the batch record the root map's review point names.

1. Read the current `weave-your-work/` skills and `docs/gaps.md`. The gap list is the batch's input; there is no fixed count of scenarios and prompts, and the batch record plus the root review decide passing.
2. Walk each path the gap list names, in a scratch project, not against this repository's tickets.
3. Record what the walk showed was wrong in the batch record under the root map, and fix it in the skill or in the worked example under `use-weave-your-work-examples/`.

## Acceptance signal

The batch record under the root map names the example walk and every change it forced. Each item in `docs/gaps.md` is exercised, or says on the record why it was deferred. The root map's review point reads true: the batch record names the walk, and the changes it names are the ones in `git log` since the batch started.

## Boundaries

- The worked examples are not used as the scenario source: they were written before v2 and are history.
- No skill is changed to make the walk pass; a change comes from what the walk showed.
- `docs/gaps.md` items that the rule change removed stay listed, struck, with the reason.
