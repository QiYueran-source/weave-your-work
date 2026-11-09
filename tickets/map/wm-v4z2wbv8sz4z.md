---
schema: 1
id: wm-v4z2wbv8sz4z
title: Map skill entry
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-09T00:27:57Z
updated_at: 2026-11-09T00:28:13Z
closed_at: 2026-11-09T00:28:13Z
parent: wm-0b59r7xfhk73
custom_fields:
  split_as: task
---
## Target

A reader who has a goal and opens `weave-your-work/map/SKILL.md` learns what a map is, which of the three references answers their question, and which skill runs the next step.

Why: the three references are written and closed, and nothing points at them. A reader who finds `body.md` first has no way to learn that `procedure.md` exists, or that a split is what gives a map its children.

## Acceptance direction

`weave-your-work/map/SKILL.md` exists, states what a map is, names `body.md`, `frontmatter.md`, and `procedure.md` with what each one holds, and names the four skills that run the steps without restating their rules.

All children are complete and no further children are needed.

Review point: open `SKILL.md` alone and check that a reader can name the file that answers their question without opening the other two, and that the entry repeats no rule that lives in one of the three references.

## Decisions so far

- The map skill is one entry plus three references: `body.md` for content, `frontmatter.md` for fields, `procedure.md` for the steps. (user confirmed)
- The entry states what a map is and routes; it writes no rule of its own. Splitting, clearing fog, accepting, and updating are other skills, named but not described. (this map's decision, following the task entry's shape)
- The entry is delivered by a task hung under its own child map, so the Map skill map keeps one child type. (user confirmed)

## Not yet specified

(none; the fog is cleared)

## Out of scope

- The three references themselves.
- The four skills that run the steps.
