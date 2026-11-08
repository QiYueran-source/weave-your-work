---
schema: 1
id: wm-bbf6fjc0mcvy
title: Write the testimony reference
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T11:24:43Z
updated_at: 2026-11-08T11:26:53Z
closed_at: 2026-11-08T11:26:53Z
parent: wm-31f6a2c9d840
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/grill/testimony.md`, the reference for the record a grill leaves.

1. State the scope: what the person said while a decision was discussed — answers, ideas raised, alternatives that lost. Research findings, run history, and a ticket's conclusions are not testimony.
2. State that it is not a ticket: no frontmatter, not processed by waymark, not in the target tree, status, frontier, or acceptance.
3. Give the file rule: `testimony/YYYY-MM-DD_operator_topic.md`; the operator is the project operator or the git user name; the topic is human-readable kebab-case.
4. Give the writing rule: open the file when the grill starts and edit it as the discussion moves; a file written after the discussion is a summary, not a testimony.
5. Give the citation rule: a relative Markdown link next to the relevant decision, fact, or fog entry; cite after the grill closes; `Related tickets` is optional.
6. Say the body has no required structure.

## Acceptance signal

`weave-your-work/grill/testimony.md` exists; `weave-your-work/grill/SKILL.md` points at it. A reader holding a ticket and a grill can place the record under `testimony/`, name it, write it during the discussion, and cite it from the right body entry without opening another file. The reference says a testimony is not a ticket and holds no research or run history.

## Result

`weave-your-work/grill/testimony.md` is in place. It states the scope, the not-a-ticket rule, the file pattern, the write timing, the citation rule, and the no-structure rule. The grill `SKILL.md` points at it.

## Review

passed

- Goal: the `Acceptance signal` asks for a reference that lets a reader name, write, and cite a testimony without another file. The reference holds each rule and the link example.
- Convention: no `Boundaries` line was crossed; the run wrote the reference and this task's `Result` and `Review` only.

## Boundaries

- No required body structure.
- No research or evidence store.
- No issue or ticket design.
