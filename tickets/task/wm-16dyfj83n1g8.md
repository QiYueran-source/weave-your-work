---
schema: 1
id: wm-16dyfj83n1g8
title: Write the stop-and-wait skill and run one report
category: task
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-10T01:25:49Z
updated_at: 2026-11-10T01:25:52Z
parent: wm-0jc0gzrgv7z0
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Deliver `weave-your-work/stop-and-wait/` and prove the report format on this repository.

1. `SKILL.md`: the trigger, the read set, the six conflict classes as a closed list, the two-sides rule, the report path and the shape of one finding, and what the run never writes.
2. `report.md`: the file's skeleton, shown with invented findings.
3. Run one pass over this repository and write the real report to `docs/stop-and-wait/2026-11-10-<topic>.md`. Every finding names two sides, each with a resolvable ticket id or file path plus line.
4. Re-open both sides of every finding before it goes in the file; drop any finding that has one side only, and say in `Not checked` what the pass did not open.
5. Say which parts of the read set the pass skipped and why.

## Acceptance signal

`weave-your-work/stop-and-wait/SKILL.md` and `report.md` exist. One real report exists under `docs/stop-and-wait/`. A reader who did not run the pass can open every cited side at the cited location: ticket ids resolve through `waymark show`, file citations land on the line named, and no finding names only one side. The report's `Not checked` section names at least one skipped area.

## Boundaries

- No ticket is created, closed, archived, or edited by the run.
- The findings are not repaired here; that is the person's choice afterward.
