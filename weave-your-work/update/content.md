# Content

Change what a closed map or task says, without making it a different node. `SKILL.md` carries the two tests, the three dispositions, and the ownership limits; this file is what the first two dispositions look like when they are carried out.

The third — retire and replace — is at the end of this file, because it is the one that ends in archive and the one whose write order matters.

## Where the change goes

A ticket body is written to be read as it stands. A change that rewrites it invisibly leaves every earlier reader holding a different text than the one on disk, and leaves no way to reconstruct what they read.

So a change marks itself:

- **Editorial** — spelling, a broken link, a sentence that reads badly, a fact that was always wrong. Replace the text. The meaning is identical, so there is nothing to reconstruct.
- **Substantive** — the answer changed, a decision was reversed, a scope narrowed. Keep the old text with a strike-through and put the replacement after it, or a `Superseded on <date>: <reason>` line below it when the old text is long enough that striking it hurts readability.

The test is not "how much text changed". It is: could someone who read the old version have acted differently because of it? If yes, the old text stays visible.

Strike-through works on the decisions and the target statement — the parts a reader acts on. A whole section rewritten is easier to read with the old one struck at the top than with every phrase struck inside the sentence.

Format:

```
- The export runs nightly. ~~The export runs weekly.~~ Superseded on 2026-11-08: the upstream feed moved to daily.
```

or, for a rewritten paragraph:

```
~~The map hands its children one destination at a time and waits for each to close before opening the next.~~

Superseded on 2026-11-08: children are parallel; order comes from dependency edges. See `04-dependencies.md`.
```

Do not delete the old text and do not keep both without marking them. A reader who cannot tell which line is current is worse off than one reading a stale ticket, because they do not know to be careful.

## The reopen loop

A closed node carries a verdict. When the change makes that verdict false, the verdict has to be taken back before anything else happens, because status is the only signal the tree reads: `ready`, `blocked`, and the parent's readiness all key off it, and a closed node whose acceptance no longer holds quietly misleads every one of them.

```
waymark status set <id> open
waymark body replace <id> --body-file <path>
```

Then the node goes through review again, against the new text, by the same rules as the first time. The review skill replaces the `## Review` section rather than appending to it. When it passes, the node closes again.

Two things to keep straight:

- **The old review is not deleted.** It is replaced by the new one, because a ticket carries one verdict. What the earlier review read survives in git, which is where a reader goes when they need it. Striking the old verdict in place would leave two verdicts on one ticket and no way to tell which the close was based on.
- **The node reopens even when the change is small.** Size is not the test. If the verdict still holds after the change, the node does not reopen at all — that is the first disposition, and the status never moves.

A reopened node is not automatically claimed by the run that reopened it. It goes back into the tree as work, and whoever picks it up advances it as usual.

## Children when the content moves under them

A child refines its parent. When the parent's content changes, each child has to be read again against the new content, and there are three outcomes:

- **Still refines it.** Nothing happens to the child.
- **Refines it, but its own acceptance no longer holds.** The child goes through the second disposition itself: strike, reopen, review, close. This recurses, which is why the scan has no depth limit.
- **No longer refines anything.** The child is retired with archive and a reason. `outcome=failed` is not used: the child did its job, and the parent moved out from under it. If the work is still wanted somewhere else, a replacement is opened where it now belongs.

A map cannot be archived while any child is still active; waymark refuses with `cannot archive <id>: N unarchived child item(s)`. So retiring a subtree runs bottom-up, and each child's own disposition is decided before its parent's.

## Retire and replace

The third disposition. The old node answers a question the tree no longer asks, so it is archived and a parallel node takes its place under the same parent.

This is the disposition with an order to it, because waymark refuses every write to an archived ticket and refuses to archive a map with active children.

**1. Decide the children first.** Each child gets one of the three outcomes above. A child that is still valid must be re-hung on the replacement, and re-hanging can only happen once the replacement exists — so this step is decided here and written in step 4.

**2. Write the replacement.** `waymark create --parent <the old node's parent>`. The body opens by naming what it replaces: `Replaces <old id>, retired on <date> because <reason>.` An open parent is a plain hang; a foreign parent has its own rules, in [Map front matter and dependencies](../../tickets/map/wm-8zyyyafxbdwr.md).

The replacement starts open. If the old node was closed and the work is genuinely carried over, the replacement is reviewed and closed like any other node — it does not inherit the verdict, because the verdict was about the old text.

**3. Put the replacement's id on the old ticket.** It has to be there before the archive, because after the archive nothing can be written to it. A line in the body is enough: `Superseded by <new id> on <date>.`

This is also what the hand-over issue quotes. An archive with no replacement id gives the affected owners nothing to act on.

**4. Re-hang the children that survive.** `waymark parent set <child> <new id>`, one file each. This writes only the child, so it needs no parent-side index and no second edit.

**5. Retire the subtree bottom-up.** Children that are not carried over are archived first, leaves before their parents, each with an `archive_reason` that names the replacement or the upstream change that retired it.

Clear each child's parent before its parent is archived, or `waymark validate` reports an error:

```
error DANGLING_REFERENCE at work item wm-ad6...: wm-ad6... parent the archived item wm-n9w...
```

The check fires at the child, so clearing the *parent field* is what avoids it — archiving the child is not enough on its own. Verified in waymark 0.1.0: a child archived while still pointing at its parent leaves the tree inconsistent the moment the parent is archived, and `validate` says so; clearing first leaves `validate: no findings`.

There is no way back through waymark. An archived ticket rejects `parent clear` the same way it rejects every other write, and there is no unarchive command. The only repair is editing the archived child's file by hand to drop the `parent:` line, which is exactly the kind of write this skill exists to avoid needing. Get the order right the first time.

**6. Archive the old node.** `waymark archive <id> --reason "<reason>; replaced by <new id>"`. Before running it, `--dry-run` and read the affected list — that list is the set of people to tell.

**7. Tell them.** One issue per affected owner, naming the relation that disappeared, the replacement id, and the decision they have to make. Archiving a node a dependent was blocked on moves that ticket to `ready`, which is a change to their plan that no diff shows.

Step 6 gets its own commit. A cross-owner edit hidden inside a commit with five other changes is one nobody finds.

## Ordering the writes that way, and not another

The constraints are waymark's, not this skill's preference:

- **Archive last among the writes to the old node**, because it is the point of no return: an archived ticket rejects `parent set`, `status`, and `body replace` with `<id> is archived and rejects <verb>`.
- **Replacement before archive**, because the old ticket's last write names the replacement.
- **Children before parent** on a retired subtree, because a map with active children cannot be archived.
- **Parent fields cleared before the holder is archived**, or `validate` reports the dangling reference and there is no way back: the archived child cannot be cleared and the archived parent cannot be restored. Clearing erases the old position from the ticket, which is why a *move* is never done this way — see `move.md`.

## What lands where

- The changed body, via `waymark body replace`.
- `status`, via `waymark status set`, when the verdict no longer holds.
- `## Review`, replaced, by the review skill.
- `archived_at` and `archive_reason`, by `waymark archive`.
- The replacement's body opens by naming the node it replaces.

Nothing else. No separate change log on the ticket, no comment ticket recording the edit. Git holds the diff, the ticket holds the current text, and a struck-through line holds the part of the old text a reader needs in order to understand the new one.

## A whole run, short

A closed map says the exporter runs weekly. It runs daily now, and one of its two tasks was built around a weekly window.

- Test one: still the same map, same destination. Pass.
- Test two: the weekly window task's acceptance says "seven days of data"; daily data still reads as seven days, so its verdict holds. The other task's acceptance says "runs on the weekly schedule", which is now false.
- First disposition for the map: strike the weekly line, keep the rest, status unchanged.
- Second disposition for the second task: strike its acceptance line, reopen, review against the new text, close.
- No archive, no issue, one commit.

The same map, now told it exports only to the internal warehouse. That is a different question, and the tree hangs a different map under the parent. Third disposition: replacement created, children re-hung or retired, old map archived bottom-up with its children, one issue to whoever depended on it.
