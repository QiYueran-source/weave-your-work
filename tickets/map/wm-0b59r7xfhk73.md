---
schema: 1
id: wm-0b59r7xfhk73
title: Map skill
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-06T12:11:25Z
updated_at: 2026-11-09T15:12:13Z
closed_at: 2026-11-09T15:12:13Z
parent: wm-qhd3twqjzhma
custom_fields:
  split_as: submap
---
## Target

~~Design the map skill so a team can turn a target into a tree: write the five-section map body, hang children, move a map through its status transitions, and accept it when every child is done and no further child is needed.~~

Superseded on 2026-11-09: Design the map skill so a team can turn a target into a tree: write the map body, hang children, move a map through its status transitions, and accept it when every child is done and no further child is needed. A Review section records map verdicts. See [the confirmed discussion](../../testimony/wm-0xrcwvnrcc9k.md).
Why: map is the node that answers "what I want"; without this skill the tree has no entry point.

## Acceptance direction

All children are complete and no further children are needed: the SKILL.md exists under `weave-your-work/map/`. ~~An example map can be rebuilt from it, and `waymark tree` shows the same structure the example describes.~~ The worked example is the batch the root map names: [Work-weave: general team collaboration skill set](wm-wjwa9081hse1.md).

Review point: read `weave-your-work/map/SKILL.md` and the three references it names — SKILL.md says what a map is and which reference answers each question; `body.md`, `frontmatter.md`, and `procedure.md` between them cover the body, the fields, and the lifecycle from a stated target to a closed ticket; and each step is named with the skill that runs it.

## Decisions so far

- Inherits the execution map's decisions: the semantic model, the map template, and the frontmatter choice. The template includes Review after a verdict; see [the confirmed discussion](../../testimony/wm-0xrcwvnrcc9k.md).
- `/map` is the single entry that routes to explore, split and review (user confirmed).
- Status flow: a new map starts open; split starts it (open to in_progress) when it gets children; when every child is closed, `/map` runs review; review closes the map or leaves it in_progress (user confirmed).
- A decision may be recorded directly in Decisions so far without fog; split then turns it into a child (user confirmed).
- The map body format is designed in the separate Map body format child map. `body.md` defines the writing shape for map sections; this Map skill keeps the workflow and references that file. (see [Map body format](wm-6c4f9e2a7b31.md))
- Current scope: the map skill covers the child-map lifecycle — write the body per `body.md`, hang children, move a map through its status transitions, and accept it via review. The body keeps no children index; structure is read from waymark's parent field. The task paths (splitting tasks, task children, task-level acceptance) stay fog until the Task skill is settled. Source: user confirmation.
- Front matter management is a reference of the map skill: a separate `frontmatter.md` alongside `body.md` and the operating procedure reference, designed in its own child map. Source: user confirmation.

## Not yet specified

~~The function details of the map skill: when a node is a map rather than a task, what each section holds, hanging children, status transitions, and the acceptance check.~~
  Resolved on 2026-11-09: the details live in `SKILL.md`, `body.md`, `frontmatter.md`, and `procedure.md`; this map keeps the entry and routes to them.

## Out of scope

- Task skill design (sibling map under the execution map).
- Software-specific workflows.

## Review

passed

- Goal: `weave-your-work/map/SKILL.md` exists and says what a map is, which reference answers each question, and which skill runs each step; `body.md`, `frontmatter.md`, and `procedure.md` between them carry the body, the fields, and the lifecycle from a stated target to a closed ticket. The struck example clause is deferred to the root map's batch, as the acceptance direction says.
- Convention: the body carries the sections `body.md` lists, in order, with the required review point, and every Decisions entry carries a source. `split_as: submap` matches the seven active children, which are all maps; the two archived children are retired. The one fog entry was resolved at this review against the references that settled it, and the map is started here because it carried children while still `open`. A link written from the repository root now uses the sibling form. `waymark validate` reports no findings.
