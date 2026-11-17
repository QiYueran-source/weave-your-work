---
name: grill-with-docs
description: "Grill a plan or design and write down what the discussion settles: run the interview, then record the terms it fixed in the glossary and the decisions that pass the three gates as ADRs. Use when a plan needs a person's answers, or when an idea is sharpened into something the project can act on."
disable-model-invocation: true
---

# Grill with docs

A discussion is worth having for what it settles. `grilling` asks the questions and keeps the answers; the interview is not this skill's. What this skill adds is the order and the writing: the discussion runs to the end, then what it settled is recorded before the run stops.

Questions are `grilling`'s. Three gates are `adr`'s. One name for one thing is `glossary`'s. None of those three writes on its own, and this is the one action that runs them.

## Steps

1. **Hold the discussion.** Call `grilling` with the subject in one sentence: what is being decided.

2. **Read what it settled**: the terms it fixed, the decisions it reached, and the work it handed off.

3. **Record each term it fixed.** Call `glossary` once per term. It reads the view before writing and decides whether a term belongs at all; a word the project already names is not written twice.

4. **Judge each settled decision against the three gates.** Call `adr` for each one. It asks its own three gates and writes nothing for a decision that fails one; a decision that fails still counted as a judgement, and that is the whole result for it.

5. **Report what is still open**: the work the discussion handed off, and any question it left unanswered. Opening a record for that work is the caller's, not this action's.

A discussion that settles nothing is a finished run: no ADR, no glossary entry, and the testimony alone says why.

## Hands off

- The caller, for the work the discussion handed off.
- The record that asked for the discussion, which carries on where it stopped.

## What this skill does not do

- Ask the questions, or decide what an answer means; `grilling` runs the discussion.
- Decide whether a word belongs, or write a glossary entry; `glossary` does both.
- Judge a decision's three gates, or write an ADR; `adr` does both.
