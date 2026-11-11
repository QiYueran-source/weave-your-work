---
name: salvage-and-restart
description: "Restart a project whose tree no longer describes its work: write down what is still usable, raise a new root map, and clear then archive the old tree bottom-up, each retired record carrying a reason that names the salvage record. Use when a stop-and-wait report shows the tree itself is the problem, or the person asks to start over."
family: track
invocation: user
---

# Salvage and restart

A tree stops describing its work in a recognizable way: maps whose targets no longer exist, tasks reopened for the third time under the same shape, a root whose acceptance direction nobody can read a child against. Editing it costs more than the tree is worth.

The temptation is to delete it and start clean. That throws away the part that was real: which work finished, the vocabulary the project settled, and the dead ends already ruled out. This skill keeps the salvage and drops the structure.

## When it runs

- A `stop-and-wait` report shows conflicts that editing a few records cannot settle, and the person chose to restart.
- Most of the tree is open work nobody will do, or closed work whose claims no longer hold.
- The person says the project is a mess and asks to start over.

A tree that needs a few edits is `update`, not a restart. The test: can a reader still answer "what is this tree working toward" from the root's `Target`? Yes repairs; no restarts.

## Steps

Run them in order, and do not start a later one before the earlier is written down.

1. **Read before deciding.** The latest `stop-and-wait` report, then what it does not cover: every closed map and task and what it delivered, the glossary, and `docs/adr/`.
2. **Write the salvage record**: `docs/salvage/YYYY-MM-DD-<topic>.md`, four lists, and only what can be cited.
   - **Keep** — work that finished and still holds, with the record id, what it delivered, and where the deliverable is now.
   - **Keep the word** — glossary terms the new tree will use.
   - **Keep the decision** — ADRs that still bind, and the record each came from.
   - **Do not repeat** — dead ends: what was tried, why it failed, the record that shows it.
   Close with `## What was not examined`; an empty section is not allowed.
3. **Raise the new root** with `open-map`, the same pass that opens any map. A restart adds one thing to that pass: the salvage record as the source of what is already settled, cited in the new root's `Decisions so far`, with a link and the archived root's id.
4. **Move what survives.** A subtree that is still the right shape moves with `waymark parent set <id> <new-root>`: one field, keeping content, owner, and history. Move only whole branches that still answer a question the new root asks; a branch moved because it is nearly right is the restart already failing.
5. **Clear, then archive, bottom-up.** For every node not carried over:

   ```
   waymark parent clear <id>
   waymark archive <id> --reason "Restarted under <new-root-id>; what it taught is in docs/salvage/YYYY-MM-DD-<topic>.md"
   ```

   The clear cannot be skipped: archiving a parent while a child still names it leaves the child dangling, and an archived item rejects `parent clear`. Run both on one node at a time, leaves first; waymark refuses to archive a map with an unarchived child. Before archiving a node this run does not own, tell its owner.

   Finish with the old root. One root is left standing.

## The check

All five, or the restart is not done.

1. `waymark tree` shows one root, and the retired nodes are still there: `waymark list --archive archived` names them, and each still shows its `archive_reason`.
2. No live record points at an archived node, and no archived record points at one. `waymark validate --strict` reports no error findings.
3. Every branch that survived is under the new root.
4. The salvage record cites every kept item, and its `## What was not examined` is not empty.
5. The new root names the salvage record and the old root in its `Decisions so far`.

## Transformation

```
before: a tree that no longer describes its work
after:
- one salvage record under docs/salvage/, citing everything kept
- one root, standing
- every retired record archived with a reason naming the salvage record
- every surviving branch under the new root, with its content and history intact
```

## What this skill does not do

- Judge whether a restart is needed; `stop-and-wait` reports, the person decides.
- Repair a tree that still describes its work. That is `update`.
