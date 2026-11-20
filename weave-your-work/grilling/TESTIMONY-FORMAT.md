# Testimony format

The record of one discussion. It holds what the discussion reached and how; it
is never accepted as work, and nothing judges it done or not done.

A testimony answers five sections, in this order. A section with nothing in it
says so rather than disappearing.

## Subject

One sentence: what is being decided. When the discussion serves a record that
already exists, name it by id; when it does not, the sentence alone stands.

## Rounds

One block per round, in the order the rounds happened. Every question carries
four lines and its parent:

```
- **Q1** <short title>
  - Question: <the full question, with any choices>
  - Recommended: <the answer that a yes accepts>
  - Answer: <what the person said, in their words>
  - Parent: none
```

`Parent` names the question this one hangs off, or `none` for a root question.
This line is the only place the design tree is written: the tree is recovered
from these lines, never drawn a second time.

`Answer` is the person's words with typos fixed and filler dropped, and nothing
else changed. It is not a summary: the words are what a later reader came for.

`Recommended` carries the source a fact came from, in parentheses, when the
recommendation rests on one: `Recommended: Finance. (from the current lease,
clause 7)`. A recommendation that rests on nothing but judgement carries no
parenthesis. When the sources disagree, both readings go to the person, and what
each said stays in `Answer`.

A question that was asked and answered in a later round pulls its parent from
that round, not this one. A `Question` block that has no `Answer` while the
testimony is closed is a discussion that stopped early, and the testimony says
so.

## Settled

One line per decision the discussion reached:

```
- <what was decided> (from Qn)
```

`from Qn` names the question that settled it, and nothing else goes on the line.
Which skill writes the decision down is not this record's to say: the caller
decides that once the discussion is over, and one decision may become a term, an
ADR, a line in a spec, or nothing at all.

## Open

What was still unanswered when the testimony closed, one line each, or `(none)`
when the frontier emptied.

## Handed off

The work the discussion produced, one line each, as `work: <what>`, for the
caller to open as a record. A work line names no landing either, for the same
reason a settled line does not. A discussion that produced no work says `(none)`.

## Assertions

- A testimony with no `Subject`. [check-records]
- A closed testimony holding a question with no `Answer`. [check-records]
- A `Settled` line with no `(from Qn)`. [check-records]
- A `Settled` or `Handed off` line naming a landing (`→`, a skill name, a
  record id). [review]
- A testimony carrying a field that belongs to a ticket or a spec. [check-records]
- A design tree written a second time beside the `Parent` lines. [review]
