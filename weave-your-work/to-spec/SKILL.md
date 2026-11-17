---
name: to-spec
description: "Turn the current conversation into a spec and publish it to the project tracker: no interview, just synthesis of what you've already discussed."
disable-model-invocation: true
---

This skill takes the current conversation and the project's current state and produces a spec. Do NOT interview the user; just synthesize what you already know.

## Process

1. Read the project's current state, if you haven't already. That means the specs and tickets that are open, `GLOSSARY.md`, `ADR.md`, and any document the change touches. Write the spec in the vocabulary those records use, and respect the decisions they have already settled. The read answers three things: what the project calls things, what it has decided, and whether a spec for this change already exists.

2. Settle two things with the user: what is being handed over, and how a reader will know it was handed over. Judge the delivery at the finished thing, not at a step toward it: the paper handed in, not the chapter written. Keep the judgement to one line where possible.

3. Write the spec using the template below, then publish it to the project tracker.

## Who it belongs to

The spec's owner is the person writing it. When the writer is doing this for someone else, they name that person as the owner instead: the spec then says who answers for it, and the tracker still records who wrote it.

An operator writes the specs and tickets they own. Taking on a colleague's is a transfer of ownership, which leaves a record, rather than an edit made under the other name. Nothing enforces this — the tracker warns and writes anyway. The rule is the whole mechanism.

## The project's records

How this project writes a record lives in `.work-weave/config/tracker.md`. Read it
before writing one.

<spec-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

What is being made and what was settled in order to make it, in one list. A ticket cut from this spec needs both.

- What is being made, and what changes around it
- Who is affected, and how their work changes
- Facts clarified from records, correspondence, or agreements
- Practices settled, with the alternatives rejected and why
- Changes to what a record holds, such as a new field or a new category
- Agreements made with an outside party

Do NOT include specific locations or code. A location changes, and the reader may not be able to reach it at all. Say what is to be obtained, not where it sits. Skill text is the opposite case: a skill that does not say where its files live makes the agent guess.

Exception: a concrete shape that says something prose cannot, such as the columns of a table or the values a state takes. Inline only the part that carries the decision, and note briefly where it came from.

## Acceptance

What the second step settled, and nothing else:

- The delivery: one sentence naming what is handed over.
- The judgement: one to three lines saying how a reader tells it was handed over.

Judge at the finished thing, not at a step toward it. A reader seeing "the chapter is written" has not been told the paper is handed in.

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes about the feature.

</spec-template>
