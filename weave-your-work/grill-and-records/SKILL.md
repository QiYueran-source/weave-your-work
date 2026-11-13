---
name: grill-and-records
description: "Settle a fuzzy plan, decision, or idea and write down what it settled: run the discussion, then write the terms into the glossary and the decisions into ADRs. It assembles; the discussion is `grilling`'s and each record is `adr`'s or `glossary`'s. Use when a decision needs a person, or when another skill reaches a question it cannot settle alone."
family: method
invocation: model
---

# Grill and records

A discussion is worth having for what it settles. `grilling` gets the answers out of a person and keeps them in a testimony; `glossary` and `adr` write the term and the decision where the project keeps them. Neither of those writes on its own, and this is the one action that runs all three.

This action assembles and decides nothing itself. The questions are `grilling`'s, the three gates are `adr`'s, and one name for one thing is `glossary`'s. What it adds is the order and the hand: the discussion runs to the end, then what it settled is written before the run stops.

## Steps

1. **Call `grilling`** with the subject: one sentence saying what is being decided, and the record the discussion serves. It runs the rounds, waits for the person's answers, and closes the testimony.
2. **Read what the testimony settled**: the terms it fixed, the decisions it left, and the work it handed off.
3. **Call `adr` for each settled decision.** It asks its own three gates and writes nothing for a decision that fails one; a decision that stays in the map's `Decisions so far` was still judged, and that is the whole result for it.
4. **Call `glossary` for each term it fixed.** One entry per term, in the shape `glossary/res/entry.md` gives.
5. **Report what is still open**: the work the testimony handed off, and any question the discussion left unanswered. Opening a record for that work is the caller's, not this action's.

A discussion that settles nothing is a finished run: no ADR, no entry, and the testimony alone says why.

## Hands off

- The caller, for the work the testimony handed off.
- The record that asked for the discussion, which carries on where it stopped.

## What this skill does not do

- Ask the questions, or decide what the person's answer means; `grilling` runs the discussion.
- Judge a decision's three gates, or write an ADR; `adr` does both.
- Choose a canonical term, or write a glossary entry; `glossary` does both.
