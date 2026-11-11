---
name: task-review
description: "Judge a finished task against the acceptance signal written before the work started, and record one verdict with both axes and their evidence. Use when a task has a Result and has to close, or when a task comes back after a fix."
family: track
invocation: model
---

# Task review

A task is not done because its executor says so. This skill reads what the work left behind against the signal written before it started, and records one verdict. The shape of the section and the two axes are the `task` skill's.

## When it runs

A run has finished the work and written `Result`. A task reviewed again after a fix is reviewed by the same rules.

## Who reviews

The owner reviews and closes. The owner may be the agent that did the work, when that agent runs the owner's task; a run that is not the owner's stops at `Result` and reports. A passing review closes the ticket on the spot, and the owner may reopen it.

## Steps

1. **Read the ticket**: `Action`, `Acceptance signal`, `Boundaries`, `Result`, `waiting_on`.
2. **Read the work `Result` points at** — the file, the page, the answers. `Result` is a claim about that work; the review checks the claim against the thing itself.
3. **Judge the goal axis**: the evidence the signal names is there, and someone who did not do the work can read it by the method the signal names.
4. **Judge the convention axis**: the run stayed inside `Boundaries` and the project's rules, and wrote only what it may write.
5. **Write `## Review`**: the verdict, then one line per axis with its evidence. Every finding names its source: the signal line, the boundary, or the rule.
6. **Act on the verdict** below.

## The four verdicts

| Verdict | When | What follows |
|---|---|---|
| `passed` | both axes hold and `waiting_on` is empty | clear `waiting_on`, close the ticket |
| `needs changes` | an axis names a gap an agent can close, and `waiting_on` is empty | leave it open, name only the gap, hand it back |
| `needs discussion` | the signal or the standard is unclear, or the task still waits on a person | record the question, set `waiting_on`, leave it open |
| `wrong direction` | the task itself was wrong: the map no longer wants it, or the action never could produce the thing | clear `waiting_on`, write `outcome=failed`, close |

A ticket that still carries `waiting_on` is waiting, not passed: it takes `needs discussion`.

When the evidence is not there — no `Result`, or a deliverable that cannot be found — that is `needs changes` naming what is missing, unless `waiting_on` is set.

## Transformation

```
before: a task with a Result and no current Review
after:
- Review carries exactly one verdict, then one line per axis, each with evidence
- passed or wrong direction: status closed, waiting_on cleared
- wrong direction: outcome = failed
- needs changes or needs discussion: status unchanged, waiting_on set only for a person
- an older verdict on the same subject is struck through with the reason it was superseded
```

## Hands off

- `advance-task` for a named gap.
- The owner for `needs discussion`, or for a task that no longer holds.

## What this skill does not do

- Do the work or fix it.
- Review a map, or check that the ticket was designed completely.
- Pass a task on its executor's word, or on the absence of a complaint.
