# Task body

What a task contains. The field rules are `waymark/res/fields.md`; the kinds are `kind.md`, and the review is `review.md`.

A task is the finest node of the tree: one action that ends at a result someone can hand over and someone else can check. A task ends at a result that can be handed over whole and checked on its own, and its action may cross several stages to reach it. A slice — one stage finished before anything downstream can use it — needs a sibling to mean anything, and that need is the sign it belongs inside the task that delivers the result. Length is not the test: a task may run for days while it waits. It takes no children and no dependency edge.

## Body

`Action` and `Acceptance signal` open every body, in that order.

- `Action` — the result in the first sentence; a constraint that shapes the work (a hard date, a fixed budget) in that sentence too. Then the steps: prose when their order does not matter, a numbered list when it does. A step only a person can do starts with `Person:`.
- `Acceptance signal` — the evidence that shows the result is there, written before the work starts, so a reader who did not do the work can check it. It distinguishes done, not done, and cannot judge yet.
- `Boundaries` — what the work stays out of.
- `Result` — for a delivery, where the deliverable is and how to open it; for a probe, the finding and the verdict.
- `Progress` — written when a run stops: the step it reached, what it waits for, and what happens next.
- `Review` — the verdict, then one line per axis with evidence.

A delivery that is `one_way` carries `Failure recovery`; a probe carries `Next step`. `Result`, `Progress`, and `Review` are written after creation: `advance-task` writes the first two, a review writes the last.

## Assertions

- `Action` or `Acceptance signal` missing. [check-records]
- A `one_way` delivery without `Failure recovery`, or a probe without `Next step`. [check-records]
- A closed task with no `Result`. [check-records]
- A task with a dependency edge, or a parent that is not a map. [check-records]
- An `Acceptance signal` that names no evidence, or two readings of it disagree. [review]
- A `Result` claiming a deliverable that cannot be found. [review]
