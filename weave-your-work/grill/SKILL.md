---
name: grill
description: >-
  Grill a plan, decision, or idea until it is clear: ask one round of numbered
  questions with recommended answers, write the testimony as the discussion
  happens, and hand settled terms and decisions to the glossary and ADR skills.
---

# Grill

Grill is a discussion that ends with a shared understanding and a written record. It asks the questions the user has not answered, waits for the answers, and writes the discussion down while it happens.

Use it when a plan, decision, or idea is still fuzzy, or when `fog-explore`, `split`, or `review` reaches a decision it cannot settle alone.

## Before the first question

Name the subject in one sentence: what is being decided. Open the testimony file and write that sentence into it; `testimony.md` holds the scope, naming, and citation rule.

When another skill called the grill, ask what it needs back. The caller owns the conclusions and lands them in its own ticket.

## The protocol

Work in rounds. A round asks the whole frontier: every question whose prerequisites are settled, so no question depends on another question still open in the same round.

- Number each question and give a recommended answer. Word it so "yes" accepts the recommendation.
- When the harness offers a choice prompt, use it for a question with a few options. When it does not, ask the question in text with the recommendation.
- Facts are the run's job. Look them up; do not ask the user for something the repository or the tools can answer.
- Decisions are the user's. Put each one to them and wait.
- Wait for the answers before the next round, then recompute the frontier from what changed.

The grill ends when the frontier is empty and the user confirms the shared understanding. Do not close the grill before that.

## What the grill writes

- **Testimony**: edit the file as the discussion moves. `testimony.md` holds the naming, scope, and citation rule.
- **Glossary terms**: when a term resolves, write it through the `glossary` skill. Grill decides that the term resolved; the glossary skill owns the file, the fields, and the generated view.
- **ADRs**: when a settled decision passes the three gates, call the `adr` skill. The ADR skill owns the gates and the record.
- **Nothing else**: map decisions, split results, and task creation are the caller's. Return the clear conclusions and the artifact paths; the caller writes its own ticket. A standalone grill returns the conclusions to the user with the ticket each one should land in, or "no ticket yet" when none owns it.

## The output contract

At the end, name:

- the decisions and facts that are now clear, one line each;
- the testimony path;
- the source file each term was written to, and the path of every ADR written.

A caller that asked a specific question gets the answer first, then the artifacts.

## What it does not do

- Clear a map's fog. `fog-explore` does that; grill answers the questions `fog-explore` routes to it.
- Split a map or create tasks.
- Review a map or a task.
- Write a ticket. The caller writes its own.
- Design an issue. The communication category owns that.
