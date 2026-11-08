---
name: update
description: >-
  Change what a map or task says after other nodes already rely on it: edit it
  in place, retire and replace it, or move it under another parent, and carry
  the change to its children, its dependents, and its recorded review.
---

# Update

An open ticket is yours to shape. A closed one, or a map that has already split, is something other nodes stand on: children refine it, dependents wait for it, and a review verdict was judged against the text. Changing it is not an edit; it is a change to a promise.

Update is that operation. It is a branch of advance — the owner's write — narrowed to nodes that are already relied on. Every update is an advance; not every advance is an update.

## When it runs

The trigger is the node's state, not the size of the change.

- A closed node, map or task.
- A map that has already split into children, even while it is still open.

An open node with no children is plain advance, and none of the three dispositions applies. A run that finds itself weighing "is this change big enough to count" is asking the wrong question; ask the two tests instead.

Relocating a node is the exception to that trigger, and it is not a content change: a subtree can be moved in any state, including open and unsplit. What makes it an update is that its old and new parents were relying on where it sat.

## The two tests

Ask them in order and stop at the first one that fails.

1. **Same question?** Does the node still answer the question the tree hung it under? A task named for one action that now describes a different action has changed subject. A map whose Target now names a different destination has changed subject.
2. **Does the verdict hold?** Read the recorded acceptance against the new content. Would the same review still pass, on the same evidence, by the same reading?

Both yes is the first disposition. First yes, second no is the second. First no is the third, and the second does not need asking.

## Three dispositions

| Tests | What happens | Status |
|---|---|---|
| Same subject, verdict holds | Edit the ticket. Editorial changes replace the text; substantive ones keep the old text struck through. | Unchanged |
| Same subject, verdict fails | Strike the old text with a `Superseded on <date>: <reason>` line, reopen, review again, close again. | closed → open → closed |
| Different subject | Retire the ticket with archive and open a parallel one under the same parent. | archived |

The second disposition exists because a closed child is how its parent counts itself done: a map is accepted when its children are complete. A child left closed on a verdict that no longer holds makes its parent's claim false as well, and the falseness travels upward. Nothing in waymark checks this — `ready` reads dependency edges and never looks at `parent` — so nobody is warned.

The third exists because a node that answers a different question is not the same node. Editing it would leave its children refining a subject they never agreed to. Retiring it keeps the old text readable and gives the new one a clean review.

`outcome=failed` is not used for any of this. Failure is a verdict on an attempt; retirement is a verdict on a subject. A node that was completed and then made obsolete by an upstream change is archived with a reason, not marked failed.

## The impact scan

The scan is not depth-limited. From the node being changed, follow:

- **children**, which refine the content being changed;
- **the parent**, whose Target the node was hung to serve;
- **dependency edges in both directions**, since a dependent waits on this node and this node waits on others;
- **soft links**, in either direction;
- **references in bodies**, in tests, in examples, and in testimony — anything that names the node by id or by title.

Each one is read for one question: does this relation still mean what it meant? A child that refined the old content may not refine the new. A dependent waiting on a completed node may be waiting on something that no longer exists. A passage in an example quoting the old text now quotes something retracted.

The scan is unlimited in reach and the write is not; see below.

## What a run may decide, and what it may write

Two different limits, and only the first is absolute.

**Decisions stop at ownership.** The content, status, and parent of a node owned by someone else are never this run's to set. When the scan reaches such a node and that node's own content must change, the branch stops there: finish everything reachable through nodes the run owns, then hand that branch over. A foreign node whose content is untouched does not stop anything.

**Writes go slightly further than decisions, by the tool's design.** Two waymark commands write a ticket on the other side of an ownership line no matter who runs them:

- `waymark link add` and `link remove` write both tickets, because a soft link is stored on both.
- `waymark archive` rewrites every ticket pointing at the archived node, removing inbound dependencies and soft links from files it does not own.

Both are allowed to run. Both are announced afterwards.

That is not a loophole, it is the shape of the tool: there is no command that removes one end of a symmetric relation, and no command that retires a depended-on node without clearing the edges that pointed at it. Refusing to run them would mean a node others depend on can never be retired at all.

## Before a cross-owner write, and after it

Before: `--dry-run`. Every waymark command that writes a ticket takes it, down to `title set` and `owner transfer`, and it either reports the change or says `would be unchanged`. For `archive` and `link`, read the affected list and write down, for each ticket in it, whose it is and which relation disappears. The human output names the relation (`removes dependencies`, `removes soft_links`); the JSON `affected` array carries only ids and paths. `no inbound relationships to remove` means nothing outside the node will be touched.

The dry-run computes the blast radius and judges none of it. It warns about the owner of the node being archived, not about the owners of the tickets it is about to rewrite; a run that will edit three other people's files can look completely clean. Comparing each affected id against the run's own tickets is the step nothing automates.

After: one issue per affected owner. The issue carries three things, and an issue missing any of them is noise:

- the relation that disappeared, named;
- the id that replaced the node;
- the decision the owner has to make — re-point the edge at the replacement, or drop the wait if the archived outcome is enough.

An archive with no replacement has nothing to say to those owners, which is why retiring a node and naming its successor happen in the same run.

What the file change does not show, and the issue must: archiving a node a dependent was waiting on changes what that dependent may do. A ticket blocked on the archived node immediately reads `ready`. The diff shows two deleted lines; the owner's plan has moved.

Archive gets its own commit for this reason. A cross-owner edit buried in a commit with five other changes is one nobody finds.

## Where the answers live

- `content.md`: the three dispositions in detail — what counts as substantive, the shape of a struck-through change, the reopen and re-review loop, what happens to children when the content moves under them, and the order of writes that ends in archive.
- `move.md`: relocating a subtree under another parent, which changes no content and still changes what the tree means.

Most updates are one of these, not both. An update that changes the content and moves the node is the second disposition followed by the first, and the move happens last, after the new node exists.

## Reporting

Three lines: what changed and which test decided it, what was written and what was left alone, and who was told. The ticket holds the sources; the report repeats them.

## What this skill does not do

- Change a node that is still open and unsplit. That is plain advance, and the owner does it without a scan.
- Decide whether a map should split, or a task should exist. That is the split skill, and it runs before this one.
- Design the issue it files. The shape of an issue belongs to the communication category; this skill names what the issue must carry and points there.
- Judge a review. The reopen in the second disposition hands the node back to the review skill, with the changed text as the thing being reviewed.
