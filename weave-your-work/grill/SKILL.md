---
name: grill
description: "Grill a plan, decision, or idea until it is clear: ask the questions that can be answered now, record the answers in a testimony, and name the terms and decisions the caller still has to write down. Use when a plan is still fuzzy, or when another skill reaches a decision it cannot settle alone."
family: method
invocation: model
---

# Grill

A discussion that ends with a shared understanding and a written record. It asks the questions a person has not answered, waits for the answers, and moves outward as the answers settle. One testimony per run: this action writes it and does not decide how many discussions there are; the caller asked for this one.

Use it when a plan, decision, or idea is still fuzzy, or when `fog-explore`, `split`, `map-review`, or `task-review` reaches a decision it cannot settle alone.

## Before the first question

Name the subject in one sentence: what is being decided. Create the testimony with `waymark create --category testimony`, link it to the record the discussion serves, and keep its body to `res/testimony.md`.

Ask in the project's vocabulary: use the words `GLOSSARY.md` defines, and stay inside decisions `docs/adr/` already records. When the discussion needs a word the glossary does not have, or would overturn a recorded decision, say so in that round's testimony and leave the write to whoever asked for the discussion; this action adds no glossary entry and no ADR.

## The rounds

Think of the discussion as a tree of questions, where a child is a narrower part of its parent. Work it in rounds.

- **The frontier** is every question whose prerequisites are already settled: what can be asked now without guessing at answers not yet heard.
- **Ask the whole frontier in one round.** Number each question and give your recommended answer, worded so that "yes" accepts it.
- **Then wait** for the answers before the next round. A question whose answer depends on another question open in this round belongs to a later round.
- **Facts are your job, not the person's.** Look it up in the repository, the documents, or online; ask a person only for what only a person knows. A running lookup is an unsettled prerequisite, so only the questions downstream of it wait.

Done when the frontier is empty: every branch visited, nothing left silently assumed, and the person confirms the shared understanding.

## What the discussion writes

Everything this action writes goes into the testimony, as each round happens and not batched to the end:

- **The rounds**: the questions, the recommended answers, and what the person said.
- **The settled decisions**, with the alternative that lost, for the caller to write into the map or task the discussion serves.
- **The terms** the discussion fixed and will not change again, and the decisions that a recorded ADR no longer matches.
- **Work**: a question that becomes work is written as `work: <what>` for the caller, which opens the record.

The caller writes the records these become, and the caller decides whether a term or a decision is worth a `glossary` entry or an ADR: the `mainline` skill lists what a step leaves behind, and the testimony keeps what was said and what it named.

## The output contract

At the end, name the decisions and facts that are clear, the terms the testimony fixed, the work handed off, and anything that will need an ADR. A caller that asked a specific question gets the answer first.

The testimony exists, and `grill/res/testimony.md` says what it holds.

## What this skill does not do

- Decide; the person does.
