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

A question that was asked and answered in a later round pulls its parent from
that round, not this one. A `Question` block that has no `Answer` while the
testimony is closed is a discussion that stopped early, and the testimony says
so.

## Settled

One line per decision the discussion reached:

```
- <what was decided> (from Qn) → <where it lands>
```

`from Qn` names the question that settled it. `<where it lands>` is the skill
that writes it, `glossary` or `adr`, or the record it belongs in. A settled line
with no landing is a decision nobody will find again.

## Open

What was still unanswered when the testimony closed, one line each, or `(none)`
when the frontier emptied.

## Handed off

The work the discussion produced, one line each, as `work: <what>`, for the
caller to open as a record. A discussion that produced no work says `(none)`.

## Assertions

- A testimony with no `Subject`. [check-records]
- A closed testimony holding a question with no `Answer`. [check-records]
- A `Settled` line with no `(from Qn)` or no landing. [review]
- A testimony carrying a field that belongs to a ticket or a spec. [check-records]
- A design tree written a second time beside the `Parent` lines. [review]
