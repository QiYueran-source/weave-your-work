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

A **run** means one pass through this skill, made by one owner, over one node and whatever the scan reaches from it. Every rule below that says "the run owns" or "the run's tickets" means that owner's tickets and no one else's.

## When it runs

The trigger is the node's state, not the size of the change.

- A closed node, map or task.
- A map that has already split into children, even while it is still open.

An open node with no children is plain advance, and none of the three dispositions applies. A run that finds itself weighing "is this change big enough to count" is asking the wrong question; ask the two tests instead.

Relocating a node is the exception to that trigger, and it is not a content change: a subtree can be moved in any state, including open and unsplit. What makes it an update is that its old and new parents were relying on where it sat.

## The two tests

Ask them in order and stop at the first one that fails.

1. **Same question?** Does the node still answer the question the tree hung it under? Judge what the body promises, not whether its title is stale: a title that drifted from unchanged content is repaired with the content, and only a different promise makes a new subject. A task named for one action that now describes a different action has changed subject. A map whose Target now names a different destination has changed subject.
2. **Does the verdict hold?** Read the recorded acceptance against the new content. Would the same review still pass, on the same evidence, by the same reading?

Both yes is the first disposition. First yes, second no is the second. First no is the third, and the second does not need asking.

## Where the verdict is

The second test needs something to read, and where that is depends on the node:

- **A task** — its `## Review` section, when it has one. Many closed tasks do not: the review skill writes that section, and every task closed before the skill existed closed without it. When it is absent, read the `Acceptance signal`, `Result`, actual evidence, and `outcome` together. A failed outcome is a failed attempt, not a pass; closure alone does not prove the signal and result agreed. Re-reviewing such a task writes a fresh `## Review`; there is no old one to replace.
- **A map** — its `## Review`, read with `## Acceptance direction`, the review point, and the evidence. A legacy map may have no Review: read the acceptance direction, children, outcome and available evidence against its closed status without inventing a past review or treating a failed outcome as a pass. If Review and status disagree, the owner rechecks children and evidence before the appropriate state change; changed evidence requires a fresh review, not an assumed pass.

**An `open` or `in_progress` node with no valid closed verdict has none to reopen.** A map may nevertheless have a `needs changes` or `needs discussion` Review. Its acceptance direction is still a plan: an unfinished node takes the first or the third disposition, and test two is not asked. Test one still decides between them — the same promise is edited in place, a different promise is retired. Preserve any invalidated map review history and review the changed work when ready. If a passing Review and unfinished status disagree, resolve that mismatch against the evidence first rather than assuming either a pass or no verdict.

Reading still happens, and it is not test two. An unfinished split map's acceptance direction is read for two other reasons: it is what its children refine, so a change there sends every child back through its own two tests; and it is what the map will be reviewed against when it does close, so a change that makes it unreachable leaves a map that cannot be accepted. Neither is a closed verdict being overturned, so both are edits under the first disposition, with the children re-read and the status left alone.

## Three dispositions

| Tests | What happens | Status |
|---|---|---|
| Same subject, verdict holds | Edit the ticket. Editorial changes replace the text; substantive ones keep the old text struck through. | Unchanged |
| Same subject, verdict fails | Strike the old text with a `Superseded on <date>: <reason>` line, reopen, review again, close again. A closed node only. Invalidate a map Review and retain it on re-review; see `content.md`. | closed → open → closed |
| Different subject | Retire the ticket with archive and open a parallel one under the same parent. | archived |

The second disposition exists because a closed child is how its parent counts itself done: a map is accepted when its children are complete. A child left closed on a verdict that no longer holds makes its parent's claim false as well.

Reopening the child does not reopen the parent. Nothing in waymark walks upward, and nothing warns: `ready` reads dependency edges and never looks at `parent`. So the run that reopens a child has to look at the closed ancestors itself and reopen the ones whose acceptance counted that child. A map's acceptance direction often ends with the sentence that does it — most write "All children are complete" — and where that sentence is there, reopening any child falsifies the map.

If an ancestor is owned by someone else, that is where the branch stops: reopen what the run owns, tell the owner in an issue, and let them decide about theirs.

The third exists because a node that answers a different question is not the same node. Editing it would leave its children refining a subject they never agreed to. Retiring it keeps the old text readable and gives the new one a clean review. An unfinished node with active children is retired bottom-up: each child takes its own disposition first, because waymark refuses to archive a map that still has an unarchived child. When the children must stay, the map is not retired; the work belongs under a new sibling, and the map is closed only through its own review path.

`outcome=failed` is not used for any of this. Failure is a verdict on an attempt; retirement is a verdict on a subject. A node that was completed and then made obsolete by an upstream change is archived with a reason, not marked failed.

## When the change needs execution

On a map, a change that needs new work is not written into the delivered file by this run. Apply the two tests before reopening a closed map; a split map that is already unfinished needs no reopen, and one still `open` is started before its next review. `need-execute.md` handles the child shape and the distinction between a gap already required by a task's signal and a new parent requirement. A task takes no child: its new work is its own `Action`, and a different task is a retire-and-replace.

`need-execute.md` carries the shape, the order, and the gate.

## The impact scan

The scan is not depth-limited. From the node being changed, follow:

- **children**, which refine the content being changed;
- **the parent**, whose Target the node was hung to serve;
- **dependency edges in both directions**, since a dependent waits on this node and this node waits on others;
- **soft links**, in either direction;
- **references in bodies**, in tests, in examples, and in testimony — anything that names the node by id or by title.

All five of those come back from one command. `waymark --json show <id>` returns a `relationships` object holding `parent`, `children`, `dependencies`, `dependents`, and `soft_links` — every key present, with `[]` or `null` for an empty relation. `waymark --json list` carries the same five per row, split across two levels: `children`, `dependents`, and `blocked_by` at the top, and `item.parent` and `item.soft_links` inside the item. `--compact` drops the top-level relations, so do not use it for the scan. `list` stops at 100 rows unless you pass a larger `--limit`, which is the one way a sweep silently misses a dependent.

Bodies are the other half, and there are two kinds of them. `waymark search "<text>"` matches titles, front matter, and ticket bodies, which finds the other tickets that quote the node. It searches the ticket store and nothing else — the skill files, the examples, the testimony, and the tests are ordinary Markdown on disk, so those need `grep -rn` over the repository. Run both; a node named only in an example is the reference no ticket-side query will show.

`waymark tree --root <id>` gives the shape below the node when the children list is long enough that reading ids one at a time is useless.

Each one is read for one question: does this relation still mean what it meant? A child that refined the old content may not refine the new. A dependent waiting on a completed node may be waiting on something that no longer exists. A passage in an example quoting the old text now quotes something retracted.

A soft link is the one relation that records no reason. Waymark stores it as a bare id on both tickets, so the edge does not say what the two nodes had to do with each other. When the scan reaches one, the reason has to come from reading both bodies — and if it cannot be found, the link is already meaningless and the change is a fair moment to drop it.

The scan is unlimited in reach and the write is not; see below.

## What a run may decide, and what it may write

Two different limits, and only the first is absolute.

**Decisions stop at ownership.** The content, status, and parent of a node owned by someone else are never this run's to set. When the scan reaches such a node and that node's own content must change, the branch stops there: finish everything reachable through nodes the run owns, then hand that branch over. A foreign node whose content is untouched does not stop anything.

**Writes go slightly further than decisions, by the tool's design.** Two waymark commands write a ticket on the other side of an ownership line no matter who runs them:

- `waymark link add` and `link remove` write both tickets, because a soft link is stored on both.
- `waymark archive` rewrites every ticket pointing at the archived node, removing inbound dependencies and soft links from files it does not own.

Both are allowed to run. Both are announced afterwards, in the issue the next section describes.

That is not a loophole, it is the shape of the tool: there is no command that removes one end of a symmetric relation, and no command that retires a depended-on node without clearing the edges that pointed at it. Refusing to run them would mean a node others depend on can never be retired at all.

## Before a cross-owner write, and after it

Before: `--dry-run`. Every waymark command that writes a ticket takes it, down to `title set` and `owner transfer`. It reports the change it would make, or that there is none — `would create wm-…`, `would be unchanged`, `already has that parent`. `body replace --dry-run` reports only the new byte count, so read the body file yourself when the shape of the change matters. For `archive` and `link`, read the affected list and write down, for each ticket in it, whose it is and which relation disappears. The human output names the relation (`removes dependencies`, `removes soft_links`); in JSON, `affected` carries only ids and paths and `removals` carries the relation per id. `no inbound relationships to remove` means nothing outside the node will be touched.

The dry-run computes the blast radius and judges none of it. It warns about the owner of the node being archived, not about the owners of the tickets it is about to rewrite; a run that will edit three other people's files can look completely clean. Comparing each affected id against the tickets the run owns is the step nothing automates, and comparing two owner names is all it takes: every ticket records `owner`, `waymark --json show <id>` prints it, and the run's own tickets are the ones carrying the run's name.

A run's name is the `owner` of the node it started from. It is not the operator recorded in the project config: that is whose machine the command ran on, and on a shared checkout it says nothing about whose tickets these are. When the starting node's owner and the operator disagree, the owner is the one the boundary is drawn around.

After: one issue per affected owner. The issue carries three things, and an issue missing any of them is noise:

- the relation that disappeared, named;
- the id that replaced the node;
- the decision the owner has to make — re-point the edge at the replacement, or drop the wait if the archived outcome is enough.

An archive with no replacement has nothing to say to those owners, which is why retiring a node and naming its successor happen in the same run.

What the file change does not show, and the issue must: archiving a node a dependent was waiting on changes what that dependent may do. A ticket blocked on the archived node immediately reads `ready`. The diff shows two deleted lines; the owner's plan has moved.

Archive gets its own commit for this reason. A cross-owner edit buried in a commit with five other changes is one nobody finds.

## Where the answers live

- `content.md`: all three dispositions in detail — what counts as substantive, the shape of a struck-through change, the reopen loop and the ancestors it reaches, what happens to children when the content moves under them, and the seven steps of retire-and-replace in the order waymark forces.
- `move.md`: relocating a subtree under another parent, which changes no content and still changes what the tree means — the one write it takes, which of the three tickets reopen, and why it records nothing.
- `need-execute.md`: a change that needs execution — the child shape by `split_as`, the order of the writes, and the gate that decides whether the run executes the task now or stops.

Most updates use one of these, not several. When the content changes and the position is wrong too, the move is not a second operation: the third disposition already builds a replacement, and it is built under the parent that should hold it. `move.md` is for the node whose content is right and whose place is not.

## Reporting

Three lines: what changed and which test decided it, what was written and what was left alone, and who was told. The ticket holds the sources; the report repeats them.

## What this skill does not do

- Change a node that is still open and unsplit. That is plain advance, and the owner does it without a scan.
- Decide whether a map should split, or a task should exist. That is the split skill, and it runs before this one.
- Carry the task it writes. That is `execute-one-task`, with `task-review` for the verdict.
- Design the issue it files. The shape of an issue belongs to the communication category; this skill names what the issue must carry and points there.
- Judge a review. The reopen in the second disposition hands the node back to the review skill, with the changed text as the thing being reviewed.
