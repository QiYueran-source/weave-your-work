---
name: ask-me
description: "Name the skill, or the sequence of skills, that fits the situation a person describes, and say where their decisions sit in it. Use when a person does not know which skill to open next."
disable-model-invocation: true
---

# Ask me

You do not remember every skill, so ask. Describe the situation: an idea with
no spec yet, a finished spec nobody cut, a ticket waiting on a person, a word
the project uses two ways. This skill names the skill to open next, or the
sequence to run, and stops.

It recommends. It does not run the skill it names, does not write a record, and
does not read the project's records to answer. What you get back is what to type
next.

Before saying what a skill does, or recommending that one be skipped, read that
skill's `SKILL.md`. The lines below are for orientation only; when this file and
the skill's own text disagree, the skill is right.

## The mainline

The route a project's work travels from an unsettled idea to read results. Each
step reads what the last one wrote.

1. **Settle what is being decided.** A spec is written from a conversation that
   already happened; it is not written from an unwritten idea. Run **`grilling`**
   when you want the interview alone, or **`grill-with-docs`** when the terms and
   decisions the discussion settles should be recorded as well. `grill-with-docs`
   runs `grilling` and then hands what it settled to `glossary` and `adr`.
2. **`to-spec`** turns the conversation into a spec and publishes it: the
   problem, the solution, what is handed over, and how a reader tells it was.
3. **`to-tickets`** cuts the spec into tickets, each one whole task with one
   arranger and the tickets that block it.
4. **Do the work.** **`implement`** does one ticket and stops at a ticket that is
   a person's. **`implement-spec`** works a whole spec in one run, a batch of the
   frontier at a time, and closes each batch once it has.
5. **`review`** reads the finished tickets on two axes: whether each result
   meets its own acceptance, and whether the work addresses the problem the spec
   names.

`implement` runs `review` once a ticket's result is written, and `implement-spec`
reaches it through `implement`. A person can also run `review` over a spec on
their own.

## Branch points

Each opens on a state, not on a position in the mainline. Name two or three at
most; a person holding a question needs one answer, not a list.

- **`setup`** when the project is not configured. The reliable reading is
  `node <the set's setup/tools/utils/check-setup.mjs>` from the project root, run
  as it is installed: a `fail` line names what to install, and its `repair` line
  names the step. No `.agents/rules/` in the project is the same signal.
  Nothing else in the mainline works until setup's checks pass.
- **`hand-back`** when a ticket a person was to do is finished. The person
  reports what they did, the result is written, the ticket closes, and the next
  one is named. A ticket whose project field marks it as a person's work is the
  one `implement` stops at; `hand-back` is how it comes back.
- **`communicate-with-issue`** when another owner has to answer something, or
  when the session opened with threads in the pending queue. It sends one issue
  to one owner in the roster and answers one in its thread. Only the sender
  closes an issue, so a thread waiting on a reply is answered, not closed.
- **`glossary`** when the words, not the process, are the problem: a term
  fuzzy, overloaded, or used two ways. It decides whether the word belongs,
  checks it against what the project already calls things, and writes it.
- **`adr`** when a discussion settles a decision and you need to know whether
  it is recorded. A decision earns an ADR only when it passes all three gates:
  hard to reverse, surprising without context, the result of a real trade-off.
  One that fails a gate stays in the record that made it.
- **`feed-me-back`** when a skill itself went wrong: a step that cannot be
  followed, a command that fails, a rule that contradicts another. It sends the
  report upstream. A mistake in this project's own records is not this; repair
  that here.

## The tests that separate two skills

Where two skills look interchangeable, the difference is one question, not a
matter of taste.

| You are holding | The test | The answer |
|---|---|---|
| An idea | Has a discussion settled what it is? | No: `grilling` or `grill-with-docs`. Yes: `to-spec` |
| Settled terms and decisions | Should the discussion leave a record of them? | Yes: `grill-with-docs`. No: `grilling` |
| A spec | How many batches of the frontier will it have? | One ticket, or a change you want to watch: `implement`. Several tickets that can run together: `implement-spec` |
| A ticket that finished | Who worked it? | A person: `hand-back`. An agent: `review` |
| A word | Is it unique to this project, or a general office word? | Unique: `glossary`. General: leave it out |
| A decision | Does it pass all three ADR gates? | Yes: `adr`. No: it stays where it was made |

## Where the person decides

`grilling` asks the person the questions and the agent finds the facts; then
`to-spec` asks them to settle what is handed over and how a reader will know it
was. `to-tickets` shows the breakdown and the person confirms it. A spec and a
ticket are owned by the person who writes them; a ticket marked as a person's
is theirs to do. `review` reports and changes nothing: each finding names the
ticket, who worked it, and whose it is to fix.

## What this does not do

- Invoke a skill. The person opens the one it names.
- Read the project's records. The skills do that for their own step.
- Answer when the skill is already picked. A person who names the skill they
  want has had the route; opening it directly is faster.
