---
name: grill
description: >-
  Grill a plan, decision, or idea until it is clear: ask the questions that can
  be answered now, record the answers in the testimony, write resolved terms
  and ADRs through their skills, and hand off the work the discussion produces.
---

# Grill

Grill is a discussion that ends with a shared understanding and a written record. It asks the questions the person has not answered, waits for the answers, and moves outward as the answers settle.

Use it when a plan, decision, or idea is still fuzzy, or when `fog-explore`, `split`, or `review` reaches a decision it cannot settle alone.

## Before the first question

Name the subject in one sentence: what is being decided. Create the testimony item for this grill, link it to the discussion's work item when there is one, and open `testimony.md` for what it holds.

Read `how-to-grill.md` before the first round. It defines the question tree, the askable set, the fact rule, and the hand-off.

## What the grill writes

The grill has three record branches and a work hand-off. Testimony is a reference file in this skill; glossary and ADR are independent skills.

- **Testimony**: the record of this grill. `testimony.md` holds the item and body rules. Append what the person said after each round.
- **Map and task decisions**: as a decision settles, write it into the owning map or task during the discussion. The caller owns that ticket write; testimony preserves what was said, while the ticket carries the current decision.
- **Glossary terms**: when a term resolves, write it through the `glossary` skill.
- **ADRs**: when a decision may pass the ADR skill's gates, call the `adr` skill; it decides and writes the record.
- **Work**: when a question becomes work, write `work: <what>` in the testimony and hand it to the caller. The caller creates the map or task; the grill does not.

Before a project-design grill, the caller finds or creates its map. A standalone grill that is pure consultation needs no work ticket. When a grill settles a project target or produces work, return the owning ticket for each decision or work hand-off; do not leave it only in testimony or chat.

## The output contract

At the end, name the decisions and facts that are clear, the testimony path, the terms and ADRs written, and the work handed off. A caller that asked a specific question gets the answer first.

## Finish

Close the testimony when the askable set is empty and the user confirms the shared understanding. Tickets cite it after it closes.

## What it does not do

- Clear a map's fog. `fog-explore` does that.
- Split a map or create tasks. The split skill does that; the grill hands work off.
- Review a map or a task.
- Write a work ticket or an issue.
