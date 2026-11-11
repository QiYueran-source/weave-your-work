---
name: salvage-and-restart
description: "Restart a project whose tree no longer describes its work: write down what is still usable, raise a new root map, and clear then archive the old tree bottom-up, each retired ticket carrying a reason that names the record."
---

# Salvage and restart

A tree stops describing its work in a recognizable way: maps whose targets no longer exist, tasks reopened for the third time under the same shape, a root whose acceptance direction nobody can read a child against. Editing it costs more than the tree is worth.

The temptation is to delete it and start clean. That throws away the part that was real: which work actually finished, the vocabulary the project settled, and the dead ends already ruled out. The new tree then pays for all of it again.

This skill keeps the salvage and drops the structure. It runs in one pass, in a fixed order, and the order matters: the record is written before the first archive command runs, so nothing is retired before what it taught is written down.

## When it runs

- `stop-and-wait` reported conflicts that cannot be settled by editing a few tickets, and the person chose to restart.
- Most of the tree is `open` work nobody will do, or `closed` work whose claims no longer hold.
- The root map's `Target` has changed enough that its children refine a different problem.
- The person says the project is a mess and asks to start over.

A tree that needs a few ticket edits is not a restart. That is `update`. The test: can a reader still answer "what is this tree working toward" from the root's `Target`? If yes, repair. If no, restart.

## The five steps

Run them in this order, and do not start a later step before the earlier one is written down.

### 1. Read before deciding

Read `stop-and-wait`'s latest report if one exists. It is the reason most restarts happen, and it already names what contradicts what. Then read what the report does not cover:

- every closed map and task, and what each one actually delivered;
- the glossary, for words the project settled and will keep using;
- `docs/adr/`, for decisions that survive the restart.

### 2. Write the salvage record

One file: `docs/salvage/YYYY-MM-DD-<topic>.md`. It holds four lists, and only what can be cited. A claim without a ticket id or a file path does not go in.

- **Keep** — work that finished and still holds. Name the ticket, what it delivered, and where the deliverable is now.
- **Keep the word** — glossary terms that survive, because the new tree will use them.
- **Keep the decision** — ADRs that still bind, and the ticket each came from.
- **Do not repeat** — dead ends. What was tried, why it failed, and the ticket that shows it. This list is the expensive one; a restart that loses it repeats the same failure inside a month.

Close the file with `## What was not examined`: the parts of the tree the pass did not open. An empty section is not allowed.

### 3. Raise the new root

Open it with the map skill's `open-a-map.md`, the same pass that opens any map: the target, the survey, and the fog all come from it. A restart adds one thing to that pass, the salvage record as the source of what is already settled, and the command below is what the pass writes. Reading the pass first keeps the new root from being opened under a rule this skill invented.

```
waymark create --category map --title "<the new target>" --owner <name> \
  --body-file <the body>
```

A root has no `--parent`. Its body opens with `Target` and `Acceptance direction`, and its `Decisions so far` opens with one line citing the salvage record and the archived root:

```markdown
- This tree replaces the root archived on 2026-11-10. What survived is in
  [the salvage record](../../docs/salvage/2026-11-10-<topic>.md). (user confirmed)
```

The new root is `open`; its first split writes `split_as` with the type that split chooses — `submap` or `task` — not before.

### 4. Move what survives

A subtree that is still the right shape moves under the new root instead of being archived. `waymark parent set <id> <new-root>` writes one field; the subtree keeps its content, its owner, and its history.

Move only whole branches that still answer a question the new root asks. Everything else is cleared and archived in step 5. A branch moved because it is nearly right, with an intention to repair it later, is the restart already failing.

### 5. Clear, then archive, bottom-up

For every node that is not carried over, two commands in this order:

```
waymark parent clear <id>
waymark archive <id> --reason "Restarted under <new-root-id>; what it taught is in docs/salvage/YYYY-MM-DD-<topic>.md"
```

The clear is the step that is easy to skip and the one that cannot be repaired. Archiving a parent while a child still names it leaves the child pointing at an archived item; `waymark validate` reports `DANGLING_REFERENCE`, and the child is archived too, so `parent clear` is rejected with `<id> is archived and rejects parent clear` and there is no unarchive command. The only repair left is editing the archived file by hand. Run both commands on one node at a time, leaves first: `waymark` refuses to archive a map that still has an unarchived child.

Clearing erases where the node sat, which is the cost. For a restart that is the point: the old position is not something the new tree should inherit.

Before archiving a node nobody in this run owns, tell its owner. The restart is the root owner's decision; a foreign ticket is not.

Finish with the old root, cleared and archived with a reason that names the new one. One root is left standing.

## The check

After the last archive command, five checks. All five pass or the restart is not done.

1. `waymark tree` shows one root, and the retired nodes are all still there: `waymark list --archive archived` names them, and `waymark show <id> --json` still returns each one's `archive_reason`. An archived item rejects `tree`, so the old shape is read from the archive listing, not from `tree --root`.
2. No live ticket has `parent` pointing at an archived node, and no archived ticket points at one either. `waymark validate --strict` reports no error findings.
3. The new root's `Decisions so far` cites the salvage record, and the record exists at that path.
4. Every branch the record lists under **Keep** is either under the new root or still open and named in the record with where it went.
5. Nothing was deleted: `git status` shows no removed ticket file, only added and modified ones.

Check 5 is the one people skip. Archive is reversible only in the sense that nothing is gone; a delete is not, and the record of a failed attempt is the part nobody can rebuild.

## What it never does

- Delete a ticket file, rewrite git history, or touch the remote.
- Archive anything before the salvage record is written and committed.
- Decide the new target. The person states it; this skill records it and raises the root.
- Restart a tree it does not own. Tell the owner and stop.
- Run as a repair for a few tickets. That is `update`.
- Carry a ticket over without checking it still answers a question the new root asks.
- Leave two roots. A restart that ends with the old tree still standing has moved the mess, not cleared it.

## What it hands back

The salvage record path, the new root id, the count of archived tickets, and the five checks with their results. Then the new root's own work starts at `fog-explore` or `split`, whichever it needs.
