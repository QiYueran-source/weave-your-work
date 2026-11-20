---
name: grilling
description: "Grill a person about a plan, decision, or idea until it is clear: ask the questions that can be answered now, wait for the answers, and write each round into a testimony as it happens. Use when a plan is still fuzzy, or when a step reaches a decision it cannot settle alone."
family: method
invocation: model
---

# Grilling

Interview the person until you reach a shared understanding. Map this as a
**design tree**: every decision branches into the decisions that hang off it.

## The rounds

Work the tree in **rounds**. The **frontier** is every decision whose
prerequisites are already settled: the questions you can ask _now_ without
guessing at answers you haven't heard yet. Ask the whole frontier in one round:
number each question and give your recommended answer. Then wait for the
person's answers before the next round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Word each question so "yes" accepts your recommended answer.

Each round the person answers reshapes the tree: settled decisions push the
frontier outward and unblock questions that depended on them. Recompute the
frontier and ask the next round. A question whose answer depends on another
question still open in this round belongs to a _later_ round, not this one.

## Finding facts

Finding _facts_ is your job, never the person's. Look in this order, and stop at
the first source that answers:

1. **The project itself**: its records, its documents, the glossary, the ADRs.
   Search these first.
2. **Outside the project, where a tool reaches it**: an email, whether a piece
   of equipment was bought, whether an outsourced task finished. Use the MCP
   servers and web tools this project gives you.
3. **Neither**: put the question to the person, and only there.

Which sources a tool can reach depends on this project, not on this skill. Judge
it against what you actually have; when no tool reaches a source, say so and ask
the person rather than guessing.

Dispatch the lookup to a sub-agent with a fresh context window. A running lookup
is an unsettled prerequisite, so only the questions downstream of it wait; ask
the rest of the frontier now.

Every fact you carry into the discussion names the source it came from. A source
that answers only partly, or two sources that disagree, is not an answer: say
what each says and put the disagreement to the person with the round's
questions. Never take one side because it is the easier to use.

The _decisions_ are the person's: put each to them and wait.

## The testimony

Create a testimony once the subject can be named in one sentence, which is after
the first round is planned and before the first answer is recorded. Write its
body as each round happens, never batched to the end: a discussion interrupted
after one round leaves that round behind.

`TESTIMONY-FORMAT.md` gives the shape, and `TESTIMONY-EXAMPLE.md` shows it
filled in. The short form:

- `Subject` names what is being decided, and the record the discussion serves
  when there is one.
- `Rounds` records each round: the question, the recommended answer, what the
  person said, and the question it hangs off.
- `Settled` holds one line per decision, with the question it came from.
- `Open` holds what is still unanswered, or `(none)`.
- `Handed off` holds the work the discussion produced, as `work: <what>` lines.

The design tree is not written a second time. Each question's `Parent` line
carries the structure, and the tree is recovered from those lines.

This skill writes the testimony and nothing else. What the discussion settled
belongs to whoever asked for it; this skill draws no conclusion from it.

## When it ends

The discussion is done when the frontier is empty and the testimony is written:
every branch of the design tree visited, nothing left silently assumed. Do not
act on it until the person confirms you have reached a shared understanding.

A discussion that settles nothing is a finished run: the testimony alone says why.

## What this skill does not do

- Decide; the person does.
- Carry what it settled into any other record; the caller does that.
