# Task body

A task body says what one action is, what it must leave behind, and how someone checks it. This file defines every section a task body may hold. Field-level rules live in `properties.md`; how to choose the kind lives in `kind.md`.

A body carries one complete action: one goal. The goal may take several steps.

Two tests say whether the action is small enough. The action leaves one result you can name. That result does not wait on another task to be checkable. Work that fails either test still needs splitting: two goals become two tasks, and work that only makes sense after a sibling finishes belongs with that sibling, or in a map of its own.

Length is not the test. A task may run for days while it waits on a person or on data.

A task that only prepares ground for other tasks has no result of its own. Fold it into the task that uses the result, or state its open question as a probe.

Sections are written when they carry something. A section with nothing to say is left out, not filled with `None`.

## Shared sections

### Action

Purpose: say what work is done and what it must produce or answer.

Format:
- A delivery task states the output the work delivers.
- A probe task states the hypothesis or question it tests, and how.
- Steps are written as a numbered list only when the order matters.
- A step that must be done by a person starts with `Person:`. The prefix is always English, whatever language the rest of the body uses. Everything else in the body may be written in the project's own language.
- What the person hands back is written as a comment on the ticket, with a link to the evidence. The body is not rewritten to hold it, except in a probe, where the finding goes into `Result`.

Example, delivery:

```
Run the baseline click-through query for the last four weeks and save the result.

1. Pull the weekly click-through numbers for the last four weeks.
2. Save them as `baseline-click-through.csv` in the shared folder.
```

Example, probe:

```
Find out whether reviewers open the checklist before commenting.

1. Ask three reviewers to comment on a sample change without giving them a checklist.
2. Note whether each one asks for a checklist or produces one unprompted.
```

Example with a human step:

```
Check that the exported invoice matches the accounting system.

1. Export the September invoice batch.
2. Person: reconcile the totals against the accounting system and paste the two totals into the task.
3. Compare the two totals and record the difference.
```

### Acceptance signal

Purpose: say what evidence shows the action is done, and how that evidence is read.

Format:
- Name the evidence first, then the standard that reads it.
- The evidence must be checkable by someone who did not produce it. The owner still decides whether it passes.
- A delivery task states what a good output looks like.
- A probe task states the possible results and which of them count as a complete check. A negative finding is a complete check.
- The signal cites only what this task produces. A signal that has to cite a sibling task's output describes a slice of a larger result, not a task.

Example, delivery:

```
The saved file holds four weekly rows, and the two reviewers agree on the baseline number without asking the author.
```

Example, probe:

```
Every reviewer either asks for the checklist or says they work without one. Either answer completes the check.
```

### Boundaries

Purpose: keep the task from growing into work nobody agreed to.

Format: a short list of what this task does not include. Write it when the edge is easy to misread; a task with an obvious edge leaves it out.

Example:

```
- No dashboard changes.
- No historical backfill before August.
```

## Delivery sections

A delivery task promises an output. Failure is an incident.

Sections: Action, Acceptance signal, Failure recovery. Boundaries is optional.

### Failure recovery

Purpose: say what happens when the output is missing or does not meet the acceptance signal.

Format:
- Required when `reversibility` is `one_way`. Optional when it is `two_way`.
- State the consequence of failure, then the remediation.
- When nothing can be undone, say what is done instead: who is told, what is restored, what is recorded.

Example, `one_way`:

```
The migration drops the old table, so a bad run loses September's rows.

- Consequence: September data is gone and cannot be recreated from the source system.
- Remediation: stop the job, restore the last backup, and tell the data owner before rerunning. Only the data owner decides whether to rerun.
```

## Probe sections

A probe task buys information. A negative result is a normal result.

Sections: Action, Acceptance signal, Result, Next step. Boundaries is optional. Failure recovery is added only when the check could not be completed and a retry or abandonment needs recording.

### Result

Purpose: record what the check found and whether the hypothesis holds.

Format:
- Written after the check, by the task owner, before the task is closed.
- State the finding, then say whether the hypothesis holds.
- When the check could not be completed, say so and give the reason.

Example:

```
None of the three reviewers asked for a checklist, and two said they skim changes.

The hypothesis does not hold for this sample.
```

### Next step

Purpose: say what the map does with the answer.

Format: two lines, one for each outcome. Both are required, because a probe that ends without either outcome leaves the map where it started.

Example:

```
- If it holds: add the checklist to the review template and drop the reminder email from the plan.
- If it does not hold: drop the checklist and spend the effort on the comment-length limit instead.
```

## Keeping a body short

A body with Action and Acceptance signal only is a valid task, unless the work is `one_way`: that case always carries Failure recovery. Every other section answers a question a reader would otherwise have to guess. Add the section when that question is real; leave it out when it is not.
