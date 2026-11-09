# Content

Change what a closed map or task says, without making it a different node. `SKILL.md` carries the two tests, where a verdict lives, the three dispositions, and the ownership limits; this file is what each disposition looks like when it is carried out.

The first two — edit in place, and strike and reopen — come first, because they are the common case. Retire and replace is at the end: it is the one that ends in archive and the one whose write order matters.

## Where the change goes

A ticket body is written to be read as it stands. A change that rewrites it invisibly leaves every earlier reader holding a different text than the one on disk, and leaves no way to reconstruct what they read.

So a change marks itself:

- **Editorial** — spelling, a sentence that reads badly, a link whose target moved but whose label still says the right thing. Replace the text. The meaning is identical, so there is nothing to reconstruct.
- **Substantive** — the answer changed, a decision was reversed, a scope narrowed. Keep the old text with a strike-through and put the replacement after it, or a `Superseded on <date>: <reason>` line below it when the old text is long enough that striking it hurts readability.

The test is not "how much text changed". It is: could someone who read the old version have acted differently because of it? If yes, the old text stays visible.

A fact that was always wrong belongs to whichever side that question puts it on, and the answer is usually substantive. If the wrong fact was a date, a version, or a path that a reader would have relied on, someone may have acted on it, so strike it and say what it now is. It is editorial only when the wrongness could not have changed what anyone did — a typo in a name nothing references, a count in a paragraph nobody plans from. The question comes first and the label follows it; a fact being wrong is not by itself a reason to erase it.

Strike-through works on the decisions and the target statement — the parts a reader acts on. A whole section rewritten is easier to read with the old one struck at the top than with every phrase struck inside the sentence.

Format:

```
- The export runs nightly. ~~The export runs weekly.~~ Superseded on 2026-11-08: the upstream feed moved to daily.
```

or, for a rewritten paragraph:

```
~~The map hands its children one destination at a time and waits for each to close before opening the next.~~

Superseded on 2026-11-08: children are parallel; order comes from dependency edges, which the map skill defines.
```

Do not delete the old text and do not keep both without marking them. A reader who cannot tell which line is current is worse off than one reading a stale ticket, because they do not know to be careful.

## The reopen loop

A closed node carries a verdict. When the change makes that verdict false, the verdict has to be taken back before anything else happens, because a closed ticket is read as "done" by everything above it: a map is accepted when its children are complete, so a child left closed on a false verdict makes its parent's claim false too.

```
waymark body replace <id> --body-file <path>
waymark reopen <id>
```

For a map, include its invalidated Review in the body replacement before reopening: strike through each line with `~~` and record why it is invalid. A legacy map without a Review has none to strike; do not fabricate one. For a task, keep its Review unchanged and write in `Progress` that update invalidated that verdict, why, and what must be repaired; task-review replaces it after execution. Write that `Progress` section if the ticket has none. `waymark reopen` puts the node in `open`. A reopened split map is started again before repair or review; keep its existing `split_as`. An unfinished split map that was never closed is not reopened and does not need starting. A reopened task is started by its executor. Then review the node again against the new text and close it when it passes.

When the new content does not exist yet, the run does not write it. On a map, it hangs the work as a child; a task takes no child and rewrites its own `Action`. `need-execute.md` carries the shape, the order, and the gate.

Do the same to every closed ancestor whose acceptance counted this node. `waymark reopen` moves one ticket; it does not walk the tree, and no other command does either. So after reopening a child, read its `parent` and reopen that map too if it is closed, then the map above it, stopping where the completion claim stops being about this child. That is the impact scan from `SKILL.md`, run upward, and it is the run's job because nothing else does it.

An ancestor owned by someone else is where the write stops. Reopen what the run owns, and tell that owner in an issue that their map's acceptance no longer holds and why.

Where the verdict lands depends on the category, and on whether there is one to replace.

**A task** carries a `## Review` section when the review skill wrote one. It does not always — a task closed before that section existed carries `Result` and no `Review`. If the section is there, the review replaces it rather than appending. If it is not, the `Acceptance signal` and `Result` are the record, and the re-review writes `## Review` for the first time. While a reopened task awaits re-review, `Progress` says which prior verdict was invalidated and why; update does not write the Review section.

**A map** carries a `## Review` with the verdict and both axes. When reopening invalidates it, retain the struck-through review and its reason alongside the fresh review for the same subject. A legacy map without Review gets its first entry on re-review. If status and Review disagree, the owner rechecks children and evidence before completing the appropriate state change; changed evidence requires a fresh review.

An open map's acceptance direction is a plan, not a kept promise. Changing it is the first disposition and the status does not move — but the children still get re-read, because it is the thing they refine, and it is also what the map will be judged against when it closes.

Whichever category, the run reads the acceptance direction before it writes: `## Acceptance signal` for a task, `## Acceptance direction` for a map. A node with neither is not ready to be updated; write the acceptance direction first, or the second test has nothing to read.

Two things to keep straight:

- **Task review history is unchanged.** The new task review replaces the old one; a verdict retracted because the review itself was wrong is the existing exception. For a map, retain each invalidated review struck through and record the reason, so the current review is distinguishable from history.
- **Reopening is decided by the verdict, never by the size of the edit.** A one-line change that makes the acceptance false reopens the node; a long clarifying paragraph that leaves it true does not. That is the first disposition, and the status never moves.

Writing the changed body before reopening also means the reopen lands on a ticket that already says what it now claims. Reopening first leaves a short window where the tree says "not done" and the ticket still describes the old promise.

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

**2. Write the replacement.** A `create` needs three flags before it runs — `--category`, `--title`, and `--owner` — and takes `--parent` for the hang:

```
waymark create --category <same as the old node> \
  --title "<the old title, or the sharper one>" \
  --owner <you> --parent <the old node's parent> \
  --body-file <path> --dry-run
```

The body opens by naming what it replaces: `Replaces <old id>, retired on <date> because <reason>.` Read the dry-run's `would create`, then run it again without the flag.

The parent decides whether the hang is allowed, not who owns it, and waymark enforces none of this — `create --parent` will happily hang a child under a closed map owned by a stranger. The rule to follow: an open parent is a plain hang; a closed parent is not, whatever its owner. Ask the owner to reopen it, and meanwhile build the replacement as an isolated node with no parent, carrying `Intended parent: <id>, waiting on <issue link>` in its own body. `parent set` happens when they reopen. Skipping the wait leaves a closed map that quietly has unfinished work under it.

The replacement starts open. If the old node was closed and the work is genuinely carried over, the replacement is reviewed and closed like any other node — it does not inherit the verdict, because the verdict was about the old text.

**3. Put the replacement's id on the old ticket.** It has to be there before the archive, because after the archive nothing can be written to it. A line in the body is enough: `Superseded by <new id> on <date>.`

This is also what the hand-over issue quotes. An archive with no replacement id gives the affected owners nothing to act on.

**4. Re-hang the children that survive.** `waymark parent set <child> <new id>`, one file each. This writes only the child, so it needs no parent-side index and no second edit.

**5. Retire the subtree bottom-up.** Children that are not carried over are cleared (`waymark parent clear <child>`) and then archived, leaves before their parents, each with an `archive_reason` that names the replacement or the upstream change that retired it. The clear is not optional and not a formality; the next section says why.

**6. Archive the old node.** `waymark archive <id> --reason "<reason>; replaced by <new id>"`. Before running it, `--dry-run` and read the affected list — that list is the set of people to tell.

**7. Tell them.** One issue per affected owner, naming the relation that disappeared, the replacement id, and the decision they have to make. Archiving a node a dependent was blocked on moves that ticket to `ready`, which is a change to their plan that no diff shows.

Step 6 gets its own commit. A cross-owner edit hidden inside a commit with five other changes is one nobody finds.

## Ordering the writes that way, and not another

The constraints are waymark's, not this skill's preference:

- **Archive last among the writes to the old node**, because it is the point of no return: an archived ticket rejects `parent set`, `status`, and `body replace` with `<id> is archived and rejects <verb>`.
- **Replacement before archive**, because the old ticket's last write names the replacement.
- **Children before parent** on a retired subtree, because a map with active children cannot be archived.
- **Each child's parent field cleared before that child is archived**, or `waymark validate` reports a dangling reference and there is no way back.

The last one is the only step that punishes a wrong order permanently, so it is worth seeing. Archiving a parent while a child still names it produces:

```
error DANGLING_REFERENCE at work item wm-ad6...: wm-ad6... parent the archived item wm-n9w...
```

The finding is at the child, and the child is archived too — so `parent clear` is rejected with `<id> is archived and rejects parent clear`, and there is no unarchive command to undo either half. The only repair left is editing the archived file by hand to drop its `parent:` line. Clearing before archiving is what keeps the run recoverable; verified both ways in waymark 0.1.2.

Clearing also erases the old position from the ticket, which is why a *move* is never done this way — see `move.md`.

## What lands where

- The changed body, via `waymark body replace`.
- `title`, via `waymark title set`, when the change is substantive. Put the old title inside the struck replacement in the body, because a title cannot carry a strike-through.
- `status` via `waymark reopen`, and back to closed through review, when the verdict no longer holds.
- For a task, `## Review`, replaced by the review skill under its existing history policy. For a map, `## Review` records each verdict; on same-subject reopen and re-review retain the invalidated struck-through review and its reason.
- `archived_at` and `archive_reason`, by `waymark archive`.
- The replacement's body opens by naming the node it replaces.

Nothing else. No separate change log on the ticket, no comment ticket recording the edit. Git holds the diff, the ticket holds the current text, and a struck-through line holds the part of the old text a reader needs in order to understand the new one.

## A whole run, short

A closed map says the exporter runs weekly. It runs daily now, and one of its two tasks was built around a weekly window.

- Test one: still the same map, same destination. Pass.
- Test two: the weekly window task's acceptance says "seven days of data"; daily data still reads as seven days, so its verdict holds. The other task's acceptance says "runs on the weekly schedule", which is now false.
- First disposition for the map's text: strike the weekly line and keep the rest. The map's own verdict still needs an ancestor check after the child reopens.
- Second disposition for the second task: strike its acceptance line, record the invalidated task verdict in Progress, reopen, fix, and review against the new text.
- If the map's acceptance counted that task as complete, reopen and start the map too; after the task closes, review the map again. Otherwise leave it closed only if its own acceptance still holds.
- No archive and no issue are needed for this owned branch; commit the completed changes.

The same map, now told it exports only to the internal warehouse. That is a different question, and the tree hangs a different map under the parent. Third disposition: replacement created, children re-hung or retired, old map archived bottom-up with its children, one issue to whoever depended on it.
