---
name: map-review
description: "Accept a map or send it back: read it against the acceptance direction it was written with, report both axes, and record one verdict on the ticket."
---

# Map review

A map is not accepted because its owner says the children are done. The review reads the map against the direction it was written with and records one verdict. That verdict is the ticket's status: a map has no `Review` section, because the status already says what became of it.

## When it runs

Every child is closed. Moving a map to the point where it can be reviewed belongs to the operating procedure; this file is the check itself.

A map still carrying fog is not ready. An entry in `Not yet specified` says a further child may still be needed, which contradicts the claim the review is testing. Send it to explore first, and review after.

## Who reviews

Anyone, including the owner. The owner is the standing acceptant: a passing review closes the map, and the owner may reopen it. A reviewer who is not the owner acts with that authority, not instead of it.

## What it reads

The map: `Target`, `Acceptance direction`, the review point under it, and `Decisions so far` for what changed since the map was split.

The children: each one's status, and its `Result` and `Review` where the work produced them.

The rules: `body.md` for the body shape and the split skill for the child rules.

The review point is not a checklist to open first. It was written before the work started, and reading the map against it is the check.

## Two axes

**Goal check**: did the map do what its `Acceptance direction` says? Read the direction line by line and the review point with it. Every line has to be answered by what the map and its children delivered.

**Convention check**: was the map built to the rules? The five sections, one child type, no children index in the body, a dependency edge where an order exists, and every ticket write made by the party that owns it.

Read the two separately and report them separately. One holding does not cover the other, and merging them hides a failing axis behind a passing one.

Every finding names its source: the acceptance direction line it did not meet, the `body.md` rule it broke, or the split rule it broke. A finding that cites nothing is an opinion, and it is dropped rather than reported.

## Four verdicts

**passed**: both axes hold. The map closes.

**needs changes**: an axis names a gap someone can close. The map stays open, the gap is written into `Decisions so far`, and the owner closes it and asks for another review. Only the gap is fixed; the rest of the map is not rewritten while the review is still the thing left to do.

**needs discussion**: the acceptance direction or the review point cannot be read as a standard, or the map's own words contradict each other. The map stays open and the question goes to grill. The review does not invent the answer.

**wrong direction**: the map cannot be judged because it was the wrong target: the parent no longer wants this, or the target was never reachable. The map closes as a failed attempt, `outcome=failed` is written, and the owner opens the sibling that replaces it. The two are soft-linked.

## What it writes

`passed` and `wrong direction`: close the map. With `wrong direction`, also write `outcome=failed` before closing.

`needs changes`: write the gap into `Decisions so far`. The map stays open.

`needs discussion`: write nothing on the map. The question goes to grill, and the testimony that discussion produces is where the answer starts.

Nothing else. No `Review` section, because a map has none. No rewrite of `Target`, no edit to a child's ticket, no comment on the work.

## The report

Four lines: what the map delivered, the two axes and what each read, the verdict, and what the verdict produced on the ticket. Sources stay on the ticket, not in the report.

A report that names something the ticket does not hold is a missing write, not a report.

## What this skill does not do

- Accept a task. That is `task-review`.
- Split the map or clear its fog. Those are split and explore.
- Define the body sections or the front matter. Those are `body.md` and `frontmatter.md`.
- Open the replacement for a failed map. The owner does that.
