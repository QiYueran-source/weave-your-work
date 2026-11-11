---
schema: 1
id: wm-5nz6m9f8n7a4
title: Walk every skill's paths and apply the fixes
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T15:24:32Z
updated_at: 2026-11-10T15:24:32Z
parent: wm-p4r56pz7v480
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Walk every skill's paths once over `use-weave-your-work-examples/` and apply the changes the walk shows.

1. Read `docs/gaps.md` and the root map's acceptance direction.
2. For each skill, exercise the paths in the examples, including the four examples named there; write or update the worked example where a path has no walk.
3. Record what each walk found, fix what the walk shows is wrong in the skill or example, and keep the rest in `docs/gaps.md` with a reason.
4. Run `npm test` and `waymark validate`; report the result.

## Acceptance signal

A batch record lists every skill and the paths walked, every gap is either exercised or left open with a reason, the worked examples and skills carry the fixes, and `npm test` and `waymark validate` pass.

## Boundaries

- Do not add skills, categories, or a per-skill functional test.
- Do not change a delivered promise without the update skill and its owning map.
- Do not claim a path was walked when it was only read.
