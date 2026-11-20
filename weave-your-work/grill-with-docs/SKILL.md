---
name: grill-with-docs
description: "Grill a plan or design and write down what the discussion settles: run the interview, then record the terms it fixed in the glossary and the decisions that pass the three gates as ADRs. Use when a plan needs a person's answers, or when an idea is sharpened into something the project can act on."
disable-model-invocation: true
---

# Grill with docs

A discussion is worth having for what it settles. `grilling` asks the questions
and writes the testimony; the interview is not this skill's. What this skill
adds is the hand: the discussion runs to the end, then what it settled is
written before the run stops.

## Steps

1. **Hold the discussion.** Call `grilling` with the subject in one sentence:
   what is being decided.

2. **Read the testimony's `Settled` lines.** Each names a decision and the
   question that settled it. Nothing on the line says what kind of decision it
   is; that reading is this step's.

3. **Call `glossary` once per term the discussion fixed**, and `adr` once per
   settled decision. Each decides for itself whether to write: `glossary` judges
   whether the word belongs, and `adr` asks its three gates and writes nothing
   for a decision that fails one. A decision that fails a gate was still judged,
   and that judgement is the whole result for it.

4. **Report what the discussion left open**: the work it handed off, and any
   question it left unanswered. Opening a record for that work is the caller's,
   not this action's.

A discussion that settles nothing is a finished run: the testimony alone says
why.

## Hands off

- The caller, for the work the discussion handed off.
- The record that asked for the discussion, which carries on where it stopped.

## What this skill does not do

- Ask the questions, or decide what an answer means; `grilling` runs the discussion.
- Decide whether a word belongs, or write a glossary entry; `glossary` does both.
- Judge a decision's three gates, or write an ADR; `adr` does both.
