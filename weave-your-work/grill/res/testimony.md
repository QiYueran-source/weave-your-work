# Testimony

The record of one discussion; nothing judges it as work.

## Body

- `Subject` — one sentence: what is being decided.
- `Question tree` — the open questions, each with the narrower questions that hang off it.
- `Rounds` — one block per round. A round records each question as asked, the recommended answer, and what the person answered.
- `Settled` — what the discussion decided, one line each, with where it landed: a map or task decision, a glossary term, an ADR.
- `Open` — what is still unanswered when the testimony closes, or `(none)`.
- `Handed off` — the work the discussion produced, as `work: <what>` lines, for the caller to open as a record.

A testimony cites the records it produced; it never restates them.

## Assertions

- A testimony with no `Subject`. [check-records]
- A round with a question and no answer recorded, while the testimony is closed. [check-records]
- A testimony that carries a map or task field (`split_as`, `task_kind`, `reversibility`, `needs_human`, `waiting_on`). [check-records]
- A settled line with no destination. [review]
