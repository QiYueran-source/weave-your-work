# Reviewing a probe

A probe buys information, and a negative result is a normal result. The goal axis asks whether the check produced the evidence the signal asked for, and whether the finding stands on that evidence.

## The goal axis

Read the `Acceptance signal` as a list of evidence, not as a result to reach. For a probe it says what the answer must cover for the check to count as complete, and it is explicit that completeness is about the evidence gathered, not about which way the answer went.

1. List the evidence the signal asks for: who was asked, what was measured, what was read.
2. Open the evidence `Result` points at, and check each item is there.
3. Check the finding against that evidence: every claim in `Result` is carried by a line in the evidence.
4. Check that `Result` records the map owner's confirmation of both `Next step` lines. The confirmation is the owner's answer, not a judgment of the finding; a missing one is `needs discussion`.

Two of three reviewers answering does not complete a check that names three. A finding that goes further than its evidence, such as a general claim from a small sample, is a gap even when the claim is probably true.

## A negative finding passes

"It does not hold" is a result. The probe passes, the ticket closes, and no `outcome` field is set.

The review does not decide what the map does with the answer. The `Next step` section already says what either answer leads to, and the map's owner confirms both lines when the answer lands. `Result` records that confirmation; the review checks it.

## When it falls short

- The evidence the signal asks for is not all there: `needs changes`, naming the item that is missing.
- The evidence is there but the finding is not carried by it: `needs changes`, naming the claim and the lines that do not support it.
- The question was answered, but the check was aimed at a question the map no longer asks: `wrong direction`.
- What is missing is a person's answer: `needs discussion`, and the task waits on them.
- The map owner's confirmation of the two `Next step` lines is missing: `needs discussion`, and the task waits on the owner.

A check that could not be completed at all is recorded in `Result` with its reason and what happens to the work instead. Read that first: there is no finding to judge, and the axis asks whether the reason and the retry match what the map can do. If the executor can still gather the missing evidence, that is `needs changes`; if only the owner can decide whether to retry, narrow the question, or stop, that is `needs discussion`.

## The convention axis

The same as for a delivery: `Boundaries`, the writes, and the repo rules the ticket put in play.

## What the review does not do

- Chase the people who did not answer. The run does that, and `waiting_on` records it.
- Read the finding as good or bad news. Both are results.
- Re-run the check to get a better answer.
