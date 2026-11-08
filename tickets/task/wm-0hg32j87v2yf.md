---
schema: 1
id: wm-0hg32j87v2yf
title: Write the ADR skill
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T11:24:43Z
updated_at: 2026-11-08T11:26:53Z
closed_at: 2026-11-08T11:26:53Z
parent: wm-fptggp5yhf8s
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/adr/SKILL.md`, the skill that decides whether a decision deserves an ADR and writes or supersedes the record.

1. State the trigger: a settled decision that is hard to reverse, surprising without context, and the result of a real trade-off; grill calls it when a decision passes the three gates.
2. Write the three gates as a test; a failing gate leaves the decision in the caller's `Decisions so far`.
3. Write the file rule: `docs/adr/NNNN-slug.md`; the next number is one above the highest existing.
4. Write the record shape: a title and one paragraph; `Status`, `Considered Options`, and `Consequences` are optional sections.
5. Write the supersede flow: the new record names the old one; the old record gets `Status: Superseded by ADR-NNNN`; the old file and number stay.
6. Say how the record links back: the owning ticket id, and the testimony when one exists.
7. End with what it does not do: make the decision, write the ticket, record a decision that fails a gate, or give architecture advice.

## Acceptance signal

`weave-your-work/adr/SKILL.md` exists and installs with `npx skills add`. A reader holding one settled decision can say whether it qualifies, write the next numbered record, and supersede an older one; a decision that fails a gate stays in the caller's ticket. The file names the three gates, the file pattern, the template, and the supersede write.

## Result

`weave-your-work/adr/SKILL.md` is in place. It holds the three gates, the file pattern, the one-paragraph template with three optional sections, the supersede write, and the link back. `npx skills add ./adr --list` parsed the front matter and found 1 skill; a temp install copied it with no skip.

## Review

passed

- Goal: the `Acceptance signal` asks for a reader who can qualify a decision, write the next record, and supersede an older one. The file holds the gates, the pattern, the template, and the supersede steps.
- Convention: no `Boundaries` line was crossed; the run wrote the skill file and this task's `Result` and `Review` only.

## Boundaries

- No decision making; the owner decides.
- No glossary or testimony format.
- No architecture advice.
