# Task body

A task body says what one action is, what it hands over, and how someone checks it. This file defines every section a body may hold, the order they appear in, and ends with a whole ticket. Field rules are in `properties.md`; choosing the kind is in `kind.md`.

## How a body is laid out

Sections appear in the order this file lists them. Each is a `##` heading carrying the English name given here, whatever language the text under it is written in.

A section is written when it carries something. One with nothing to say is left out, never filled with filler such as `TBD`.

## The size rule

One test decides whether the action is small enough: it ends at a result that can be handed over whole and checked on its own. The action may cross several stages to reach it. Cleaning a dataset and then analysing it is one task when the analysis is what gets handed over, because a cleaned dataset nobody is using yet is a step, not a result.

The shape to avoid is a slice: one stage of a result, finished before anything can be used. A slice needs a sibling to mean anything, and that need is the sign it belongs inside the task that delivers the result.

Length is not the test. A task may run for days while it waits on a person or on data.

A task carries no dependency edges, for the reason above: work that waits on a sibling is a slice. Where two pieces of work must run in sequence, either they are one action with several steps, or the map splits into child maps that carry the edge.

## Shared sections

These appear in both kinds, in this order, before the kind's own sections.

### Action

Purpose: say what work is done and what result it hands over.

Format:
- Open with one sentence stating the result. A constraint that shapes the work, such as a hard date or a fixed budget, may be stated in that opening sentence.
- A delivery task states the output it delivers. A probe task states the question or hypothesis it tests, and how.
- Below the opening, write the steps as prose when there is one step or when their order does not matter, and as a numbered list when the order matters.
- A step that a person must do starts with `Person:`. The prefix is always English. Every step a person must do carries it, not just the first.
- What the person hands back is posted as a comment on the ticket, with a link to the evidence. The body is not rewritten to hold it. The one exception is a probe, whose finding goes into `Result`.

Example, delivery:

```
Produce the four-week click-through baseline so the next decision has a number to compare against.

1. Pull the weekly click-through numbers for the last four weeks.
2. Save them as `baseline-click-through.csv` in the shared folder.
```

Example, probe:

```
Find out whether reviewers open the checklist before commenting.

1. Give three reviewers a sample change without a checklist.
2. Person: ask each reviewer to comment on the change and to say afterwards whether they wanted a checklist.
3. Record what each one says.
```

### Acceptance signal

Purpose: say what evidence shows the result is there, and how that evidence is read.

Format:
- Name the evidence first, then the standard that reads it.
- The evidence must be checkable by someone who did not produce it. The owner still decides whether it passes.
- A delivery task states what a good output looks like.
- A probe task states what the answer must cover for the check to count as complete. Completeness is about the evidence gathered, not about which way the answer goes: three reviewers asked and three answered completes the check, and two answering of three does not.
- When `reversibility` is `one_way`, the signal also names who confirms the plan and what they confirm, before work starts.

Example, delivery:

```
`baseline-click-through.csv` holds four weekly rows, one per week, with no week missing. A reader who did not build the file can see the four rows and the four dates without asking the owner anything.
```

Example, probe:

```
All three reviewers give an answer, and for each one the note says whether they wanted a checklist. A reviewer who does not answer leaves the check incomplete.
```

### Boundaries

Purpose: keep the task from growing into work nobody agreed to.

Format: a short list of what this task does not include. Write it when a reader would otherwise have to guess whether something is inside; leave it out when the edge is plain.

Example:

```
- No dashboard changes.
- No historical backfill before August.
```

## Delivery sections

A delivery task promises an output. Failure is an incident.

Sections, in order: Action, Acceptance signal, Failure recovery, Boundaries.

Action and Acceptance signal are required. Failure recovery is required when `reversibility` is `one_way` and optional when it is `two_way`. Boundaries is optional.

### Failure recovery

Purpose: say what happens when the output is missing or does not meet the acceptance signal.

Format:
- State the consequence of failure, then the remediation.
- The consequence says what is lost and whether it can be restored.
- The remediation says what is done instead, who is told, and who decides the next attempt.

Example, `one_way`:

```
The migration drops the old table, so a bad run loses September's rows.

- Consequence: September data is gone and cannot be recreated from the source system.
- Remediation: stop the job, restore the last backup, and tell the data owner before rerunning. Only the data owner decides whether to rerun.
```

## Probe sections

A probe task buys information. A negative result is a normal result.

Sections, in order: Action, Acceptance signal, Result, Next step, Failure recovery, Boundaries.

Action, Acceptance signal and Next step are required. Result is added after the check. Failure recovery is required when `reversibility` is `one_way` and optional when it is `two_way`. Boundaries is optional.

### Result

Purpose: record what the check found.

Format:
- Written after the check, by the task owner, before the ticket is closed. Add it with `waymark body replace`; it is the one section that appears after creation.
- State the finding first, then the verdict. For a hypothesis, say whether it holds. For a question, state the answer.
- When the check could not be completed, say so and give the reason. A failed attempt is recorded here, not in Failure recovery.

Example, hypothesis:

```
None of the three reviewers asked for a checklist, and two said they skim changes.

The hypothesis does not hold for this sample.
```

Example, question:

```
All three reviewers answered. Two work from memory and one wants a checklist before commenting.

The answer is that reviewers split, and the sample is too small to say which is more common.
```

### Next step

Purpose: say what the map does with the answer.

Format: two lines, one for each outcome of a completed check. Both are required, because a probe that ends without either outcome leaves the map where it started. Write them when the task is designed, and have the map's owner confirm them when the answer lands.

When the check could not be completed, replace the two lines with what happens to the work instead: whether it is retried, and by whom.

Example:

```
- If it holds: add the checklist to the review template and drop the reminder email from the plan.
- If it does not hold: drop the checklist and spend the effort on the comment-length limit instead.
```

## Keeping a body short

Action and Acceptance signal are the only sections every task needs. Every other section answers a question a reader would otherwise have to guess; write it when that question is real and leave it out when it is not. The exceptions are the ones named above: Failure recovery for `one_way` work, and Next step for a probe.

## A whole ticket

A delivery task as waymark stores it. Waymark writes the id, ownership, status and timestamps; the parts below that matter to this skill are `custom_fields` and the body.

```markdown
---
schema: 1
id: wm-abc123def456
title: Produce the four-week click-through baseline
category: task
status: open
owner: frank
creator: frank
created_at: 2026-03-01T09:00:00Z
updated_at: 2026-03-01T09:00:00Z
parent: wm-map00000000
custom_fields:
  task_kind: delivery
  reversibility: two_way
  needs_human: true
---
## Action

Produce the four-week click-through baseline so the next decision has a number to compare against.

1. Pull the weekly click-through numbers for the last four weeks.
2. Person: confirm with the analytics owner that the four weeks use the same report definition.
3. Save the numbers as `baseline-click-through.csv` in the shared folder.

## Acceptance signal

`baseline-click-through.csv` holds four weekly rows, one per week, with no week missing, and the analytics owner's confirmation is linked in a comment. A reader who did not build the file sees both without asking the owner anything.

## Boundaries

- No dashboard changes.
```

The title names the result, not the activity. A probe uses the same shape with `task_kind: probe`, then Action, Acceptance signal, Next step, and Boundaries if it has one. Its `Result` is added later, by the owner, with `waymark body replace`.
