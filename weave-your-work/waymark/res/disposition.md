# Disposition of a change

A change to a record that other records already rely on is not an edit. This file defines the three ways it is carried, and what decides between them.

## The two tests

Ask in order and stop at the first one that fails.

1. **Same question?** Does the record still answer the question the tree hung it under? Judge what the body promises, not whether the title is stale.
2. **Does the verdict hold?** Read the recorded acceptance against the new content. Would the same review still pass, on the same evidence, by the same reading?

## The three dispositions

| Tests | What is written | Status |
|---|---|---|
| same subject, verdict holds | the text, replaced; a substantive change keeps the old text struck through | unchanged |
| same subject, verdict fails | old text struck with `Superseded on <date>: <reason>`; the record reopens; it is reviewed and closed again | closed → open → closed |
| different subject | the record is archived with a reason, and a parallel record opens under the same parent | archived |

The second exists because a closed child is how its parent counts itself done: a child left closed on a verdict that no longer holds makes the parent's claim false too. Reopening a child does not reopen the parent, so the run that reopens a child also checks the closed ancestors whose acceptance counted it.

The third exists because a record that answers a different question is not the same record. Retiring it keeps the old text readable and gives the new one a clean review. A map with children is retired bottom-up: each child takes its own disposition first.

`outcome=failed` is not used for any of this. Failure is a verdict on an attempt; retirement is a verdict on a subject.

## The impact scan

From the record being changed, follow: children, the parent, dependency edges in both directions, soft links, and any body that names the record by id or title. `waymark --json show <id>` returns the first four in one answer; `waymark search "<text>"` finds the bodies.

Each one is read for one question: does this relation still mean what it meant?

## Assertions

- A closed record whose text changed without its `Review` being struck through or rewritten. [check-records]
- A record that changed subject but kept its id and its review. [review]
- A superseded entry without a date, or a struck passage with no `Superseded on` line under it. [check-records]
- An archived record that still has an unarchived child. [waymark]
- A change carried into a record owned by someone else without telling that owner. [review]
