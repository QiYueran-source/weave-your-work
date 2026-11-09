---
name: map-review
description: "Accept a map or send it back: read it against the acceptance direction it was written with, report both axes, and record one verdict on the ticket."
---

# Map review

A map is not accepted because its owner says the children are done. The review reads the map against its acceptance direction and records one verdict and evidence for both axes in `Review`. Status remains the lifecycle state.

## When it runs

The map has at least one child, every child is closed, and each dependency is closed. Check required output availability, including failed blockers, using the map skill's `frontmatter.md` before accepting the map. Moving a map to the point where it can be reviewed belongs to the operating procedure; this file is the check itself.

A map still carrying fog or known uncovered acceptance work is not ready. Send known ambiguity to `fog-explore` first. Completed and planned layers together must cover the full direction, but planned work is not evidence; review requires evidence for every requirement. A gap first discovered during review receives the appropriate verdict below.

## Who reviews

The owner reviews and closes. A non-owner who has findings reports them to the owner and does not close the map. The owner is the standing acceptant: a passing review closes the map, and the owner may reopen it.

## What it reads

The map: `Target`, `Acceptance direction`, the review point under it, and `Decisions so far` for what changed since the map was split.

The actual children: compare each type with `split_as`, read status and outcome, and inspect failed outcomes and replacements. Read task `Result`, `Review`, and actual deliverables against the map's acceptance direction. A task closed before task-review existed may lack Review: inspect its Acceptance signal, Result, and actual deliverables without inventing a past review. Missing evidence is not a pass. Read child maps' Review and supporting evidence; for a legacy child map without Review, inspect its acceptance direction, children, and available evidence without inventing a past review. `waymark validate` checks structure; it does not establish semantic acceptance.

The rules: `body.md` for the body shape, the split skill for the child rules, and `map/frontmatter.md` for dependency readiness and required outputs, including failed dependencies.

The review point is not a checklist to open first. It was written before the work started, and reading the map against it is the check.

## Two axes

**Goal check**: did the map do what its `Acceptance direction` says? Read the direction line by line and the review point with it. Every line has to be answered by what the map and its children delivered.

**Convention check**: was the map built to the rules? Check the body shape and applicable sections against `body.md`, actual child types against `split_as`, no children index in the body, dependencies against `frontmatter.md`, and ticket write ownership. Optional empty sections and a legacy Review that never existed are not required retroactively.

Read the two separately and report them separately. One holding does not cover the other, and merging them hides a failing axis behind a passing one.

Every finding names its source: the acceptance direction line it did not meet, the `body.md` rule it broke, or the split rule it broke. A finding that cites nothing is an opinion, and it is dropped rather than reported.

## Four verdicts

**passed**: both axes hold. The map closes.

**needs changes**: an axis names a gap someone can close. The map stays `in_progress`; the owner repairs the gap and asks for another review.

**needs discussion**: ambiguity discovered during review prevents reading the acceptance direction or review point as a standard, or the map's words contradict each other. The map stays `in_progress` and the question goes to `grill`. The review does not invent the answer.

**wrong direction**: the map cannot be judged because it was the wrong target: the parent no longer wants this, or the target was never reachable. The map closes as a failed attempt, `outcome=failed` is written, and the owner opens the sibling that replaces it. The two are soft-linked.

## What it writes

Write `Review` for all four verdicts, including the verdict, separate goal and convention checks with evidence, and any unresolved question. Cite evidence for passing checks as well as sources for findings. Preserve invalidated struck-through reviews on same-subject re-review, as `map/body.md` and `update` specify.

`passed` and `wrong direction`: close the map. With `wrong direction`, write `outcome=failed` before closing. If a failed outcome remains from an interrupted or invalidated review and the owner has freshly established `passed`, clear it with `waymark field update <map> --clear outcome` before closing; do not clear a failed outcome merely to make the fields match.

`needs changes`: record the gap and its source. If a task's acceptance signal already required the missing work, use `update` to decide whether to reopen, fix, and re-review that task. If the task met its signal but the parent omitted a new requirement, discuss the target or structure first; do not automatically create a task dependent on a sibling's output. Respect the map's frozen child type.

`needs discussion`: record the unresolved question in Review and take it to `grill` without choosing an answer.

If a child reopens during review, the review is void; wait for it to close and review again. If Review and status disagree, the owner rechecks children and evidence before completing the appropriate state change. When an existing verdict is invalidated by changed evidence, strike it through with the reason even if the map is already `in_progress`; keep it as history, wait until review prerequisites hold, and write a fresh review. Neither status nor an old verdict alone proves a pass.

## The report

Four lines: what the map delivered, the two axes and what each read, the verdict, and what the verdict produced on the ticket. Sources stay on the ticket, not in the report.

A report that names something the ticket does not hold is a missing write, not a report.

## What this skill does not do

- Accept a task. That is `task-review`.
- Split the map or clear its fog. Those are split and explore.
- Define the body sections or the front matter. Those are `body.md` and `frontmatter.md`.
- Open the replacement for a failed map. The owner does that.
