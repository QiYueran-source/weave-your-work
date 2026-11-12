---
name: grill
description: "Grill a plan, decision, or idea until it is clear: ask the questions that can be answered now, record the answers in a testimony, write the terms and ADRs that settle, and hand off the work the discussion produces. Use when a plan is still fuzzy, or when another skill reaches a decision it cannot settle alone."
family: method
invocation: model
---

# Grill

A discussion that ends with a shared understanding and a written record. It asks the questions a person has not answered, waits for the answers, and moves outward as the answers settle. One testimony per run: this action writes it and does not decide how many discussions there are; the caller asked for this one.

Use it when a plan, decision, or idea is still fuzzy, or when `fog-explore`, `split`, `map-review`, or `task-review` reaches a decision it cannot settle alone.

## Before the first question

Name the subject in one sentence: what is being decided. Create the testimony with `waymark create --category testimony`, link it to the record the discussion serves, and keep its body to `res/testimony.md`.

## The rounds

Think of the discussion as a tree of questions, where a child is a narrower part of its parent. Work it in rounds.

- **The frontier** is every question whose prerequisites are already settled: what can be asked now without guessing at answers not yet heard.
- **Ask the whole frontier in one round.** Number each question and give your recommended answer, worded so that "yes" accepts it.
- **Then wait** for the answers before the next round. A question whose answer depends on another question open in this round belongs to a later round.
- **Facts are your job, not the person's.** Look it up in the repository, the documents, or online; ask a person only for what only a person knows. A running lookup is an unsettled prerequisite, so only the questions downstream of it wait.

Done when the frontier is empty: every branch visited, nothing left silently assumed, and the person confirms the shared understanding.

## What the discussion writes

- **The testimony**: each round's questions and answers, as they happen. Not batched to the end.
- **The records that settle**: a term goes through `glossary`; a decision that passes the three gates goes through `adr`; the decision itself goes into the map or task the discussion serves, written by the caller.
- **Work**: a question that becomes work is written as `work: <what>` in the testimony and handed to the caller, which opens the record.

## The output contract

At the end, name the decisions and facts that are clear, the testimony, the terms and ADRs written, and the work handed off. A caller that asked a specific question gets the answer first.

## Transformation

```
before: an open question and a person who has not answered it
after:
- the testimony exists and every round in it carries its questions, the recommended answers, and what the person said
- every settled term is in the glossary, and every gated decision is an ADR
- the caller has, for each decision or work hand-off, the record that will hold it
```

## What this skill does not do

- Clear a map's fog: it answers a question; `fog-explore` lands it.
- Split a map, or create a task. It hands work off.
- Review anything.
- Write the decision into a map or task. The caller owns that write; the testimony keeps what was said.
