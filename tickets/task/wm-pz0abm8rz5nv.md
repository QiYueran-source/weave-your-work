---
schema: 1
id: wm-pz0abm8rz5nv
title: Add map and task work-record bundles
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-09T01:38:51Z
updated_at: 2026-11-09T01:38:51Z
parent: wm-hfs0qa6h35yx
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Deliver two installable work-record rules, one for the map skill and one for the task skill, and align the existing hand-offs with them.

1. Add `weave-your-work/map/bundle/rules/rules-map.md` and `weave-your-work/task/bundle/rules/rules-task.md`. The map rule requires a map for project design, including before a project-design grill; the task rule requires an existing or newly created task before advancing work, even a small result. Read-only investigation and pure consultation do not require work tickets. Record settled discussion decisions promptly in the owning ticket; if work has already advanced without a ticket, record the actual sequence and evidence, without claiming a prior plan or a passed review.
2. Route changes on split maps and closed maps or tasks to `update`; allow ordinary edits to an open unsplit map. Do not impose automatic reopening where update's tests permit an in-place edit. Respect ticket ownership and existing skill boundaries.
3. Add each bundle's `setup.md` with the five project-standard sections. Instruct copying its rule into `.agents/rules/`, skipping identical files, and asking the person rather than overwriting a different file. Give Unix and PowerShell instructions and a verification check. Add `usage.md` for each skill and point to usage and setup from its `SKILL.md`.
4. Align `grill/SKILL.md`, `grill/how-to-grill.md`, and `grill/testimony.md` so settled decisions reach their owning ticket promptly while testimony records the discussion and the caller remains responsible for work creation. Align `map/procedure.md` with update's two tests and three dispositions rather than automatically reopening every affected closed descendant.
5. Record the requirement that the future total setup explicitly lists these two bundles in the open setup map. Do not create a total setup skill or install either rule into this repository as part of this task.

## Acceptance signal

Both rule files and both bundle setup guides exist; the guides prescribe safe installation and a check, and each skill points to its setup and usage. The rules distinguish work advancement from read-only investigation, require timely ticket records, and route changes to update without inventing verdicts. The grill and map procedure instructions agree with them and with the existing update skill. The setup map records the future registration requirement. Review all changed Markdown and check the ticket graph with `waymark validate`; report any untested behavior. Worked examples and whole-set testing remain with the root map.

## Boundaries

- No separate grill or update bundle rule.
- No total setup skill or installation of the new rules into this checkout.
- No changes to ownership, split type, or update's dispositions.
- No worked-example or end-to-end acceptance batch.
