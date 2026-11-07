# Reviewing a delivery

A delivery promises an output, and failure is an incident. The goal axis asks whether the output is there and whether it is what the signal says a good one looks like.

## The goal axis

Read the `Acceptance signal` literally. It names the evidence first, then the standard that reads it. The evidence is a file, a page, a report, a set of rows.

1. Open the evidence where `Result` says it is, by the method that says how to open it.
2. Read the standard against the thing: the rows, the fields, the counts, the sections, the dates.
3. Check that a reader who did not build it could do the same without asking anyone.

The standard is met by the thing itself, not by `Result` describing it. When `Result` says the file holds four weeks and the file holds three, the axis fails, and the sentence in `Result` is the finding.

## When it falls short

- Not there, or cannot be opened: `needs changes`, naming where it was expected and what was looked for.
- There, but short of the standard: `needs changes`, naming the gap between the standard and what the evidence holds.
- There and meeting the standard, but the standard was written for something the map no longer wants: `wrong direction`.
- `Result` records that the work could not be finished: the output is not there and the reason is in the ticket. That is `needs changes` unless the reason is that the task itself was wrong.

## A person's confirmation

When `reversibility` is `one_way`, the signal also names who confirms the plan and what they confirm. Check that the confirmation is in `Result`, with its link.

A missing confirmation is not a defect in the output: it is an answer only that person can give. That is `needs discussion`, and the task waits on them.

## The convention axis

- `Boundaries`: whether the run touched what the ticket said it would not.
- Writes: `Result` and `Progress` from the run, `waiting_on` while it waits, `## Review` and `outcome` from this review. Anything else on the body or the front matter was written by someone who was not advancing the task.
- The repo rules the signal or the boundaries put in play. They are read where they live, not restated here.

## What the review does not do

- Reproduce the work to see whether it could have been better.
- Judge taste. When the signal names no standard for it, it is not a finding.
