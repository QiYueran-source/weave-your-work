---
name: task-review
description: "Judge a finished task against the acceptance signal written before the work started, give each axis its own verdict, and record both with their evidence. Use when a task has a Result and has to close, or when a task comes back after a fix."
family: track
invocation: model
---

# Task review

A task is not done because its executor says so. This skill reads what the work left behind against the signal written before it started, judges the goal and the convention separately, and records both. The axes, the four verdicts, and the shape of `## Review` are the `task` skill's.

## When it runs

A run has finished the work and written `Result`. A task reviewed again after a fix is reviewed by the same rules.

## Who reviews

The owner reviews and closes. The owner may be the agent that did the work, when that agent runs the owner's task; a run that is not the owner's stops at `Result` and reports. The owner may reopen a ticket it closed.

## Steps

1. **Read the ticket**: `Action`, `Acceptance signal`, `Boundaries`, `Result`, `waiting_on`.
2. **Read the work `Result` points at** — the file, the page, the answers. `Result` is a claim about that work; the review checks the claim against the thing itself.
3. **Judge one axis at a time**: first the goal, then the convention, each on the evidence its axis names. A finding goes under the axis it belongs to and cites the signal line, the boundary, or the rule it broke.
4. **Write `## Review`** by the `task` skill's rule: one block, `Goal:` and `Convention:` each with its own verdict and evidence. How an older block is struck is that skill's rule too.
5. **Act on the pair** as the `task` skill's table says: both `passed` closes the ticket; otherwise the worse verdict decides what happens next.

## Transformation

```
before: a task with a Result and no current Review
after:
- Review carries a Goal verdict and a Convention verdict, each with its evidence
- both passed: status closed, waiting_on cleared
- otherwise: the task is open, its waiting_on set only for a person, and the next step named
- an older block that no longer holds is struck with the reason it was superseded
```

## Hands off

- `advance-task` for a named gap.
- The owner for `needs discussion`, or for a task that no longer holds.

## What this skill does not do

- Do the work or fix it.
- Define the axes, the verdicts, or the shape of `## Review`; the `task` skill does.
- Review a map, or check that the ticket was designed completely.
- Pass a task on its executor's word, or on the absence of a complaint.
