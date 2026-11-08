# Move

Relocate a subtree under another parent. The content does not change; where the tree puts it does, and that is enough to change what several nodes mean.

`SKILL.md` carries the two tests. This file is the case where both come back "the node is fine, the position is wrong".

## What a move actually writes

One command, one file:

```
waymark parent set <node> <new parent>
```

`parent set` writes the node's own front matter and nothing else. The old parent's ticket is not touched — a map body carries no children list, and the tree is read from `parent` fields. Every descendant follows automatically, because each of them points at its own parent and none of them points at the grandparent.

Verified in waymark 0.1.0: the parent file's checksum is unchanged after a child is re-hung, and `waymark tree --root <old parent>` and `--root <new parent>` show the whole subtree in its new place, with the descendants intact.

This is why a move is not a retire-and-rebuild. Rebuilding would mean new ids, re-litigating every review verdict, and — the part that cannot be undone — archiving the old node, which strips the edges of everyone depending on it.

## The three tickets a move touches

A move writes one file and changes three tickets' meaning.

- **N, the node being moved.** Its status does not change. It answers the same question it answered before; only who it refines has changed.
- **P, the old parent.** P no longer has N. P's Target has to be read without it.
- **Q, the new parent.** Q now has N. Q's Target and its acceptance have to be read with it.

Only N is written. P and Q may need to change for reasons of their own, and that is a separate decision made by their own two tests.

## When P and Q reopen

Follow the work, not the edit.

**N never reopens for the move itself.** It kept its content, its verdict, and its acceptance. A move is not a change to the node.

**P reopens when its Target no longer holds without N.** A map whose Target is "ship the importer" and whose only child was the importer task does not survive that task leaving. A map with six children and one of them moved usually does. The test is the recorded acceptance, not a feeling about importance.

**Q reopens only when an unfinished subtree arrives under a closed map.** A closed map asserts that its work is done. Hanging an open subtree under it makes that assertion false, and Q's owner has to reopen it and decide. An already-closed subtree arriving under a closed map changes nothing about Q's verdict, so Q does not move.

P and Q belong to whoever owns them. When either is not the run's, the run moves N and hands over the reopen decision with the reason — see `SKILL.md` on ownership.

## Two tests before the write

Both are the same two tests, asked about the move rather than the content.

1. **Does N still refine Q?** Q's Target has to be something N is a step toward. A task hung under a map whose Target it does not advance is a child that will never be looked for.
2. **Does P still hold without N?** Read P's Target and its remaining children. If P was only ever a container for N, P is not a map any more, and the honest move is to retire P as well.

A "no" to the first says the destination is wrong. A "no" to the second says the origin should go too, which is two operations in one run and worth saying out loud.

The first test is the one that decides whether this is a move at all. A node that no longer refines anything at its current parent is not being badly placed; it is answering a different question, and that is the third disposition in `content.md`. Move only when the node is right and the position is wrong.

## Readiness follows the destination

A move can make work start or stop without touching the moved node's status.

- Moving N under a map that is `blocked` by a dependency makes everything under N unreachable until that dependency clears. `waymark ready` will stop listing it.
- Moving N out from under a blocked map frees it.

Check `waymark ready` and `waymark blocked` after the move, not before. The tree is the only place this shows up, and neither P's nor N's ticket says anything about it.

## What the move does not record

Nothing. There is no "moved from" field, no note in the body, no change to P.

The old parent survives in git:

```
$ waymark git history --item <node>
```

and in the diff of the commit that moved it:

```diff
-parent: wm-kg13s52tp3r1
+parent: wm-tvk7pg30dn94
```

A line on the ticket saying "moved from X" would be a second copy of something git already holds, and it would be a second thing to keep true. The commit message names both ids and the reason, which is where a reader looks anyway.

## A move is not a category change

`parent set` moves a node between maps. Turning a task into a map, or a map into a task, is a different operation: the body format, the required sections, and the review rules all differ, and no waymark command changes a category. That is a retire-and-replace — see `content.md`.

The same goes for changing what a node is for. If N is moving because it now answers a different question, that is not a move at all; that is the third disposition with a new parent.

## The order

1. State the three ids and the reason for each: N moves, P may reopen, Q may reopen.
2. Run the two tests. If N does not refine Q, stop — the destination is wrong.
3. Check ownership of P and Q. A foreign one gets an issue with the reopen decision, not an edit.
4. `waymark parent set <N> <Q>`.
5. Read back: `waymark tree --root <Q>`, `waymark tree --root <P>`, `waymark ready`, `waymark blocked`.
6. Reopen P or Q where step 2 said so, each with its own review.
7. One commit naming N, P, and Q. The message says where it came from and why.

Step 4 can be one command for a whole subtree only because the subtree hangs from N. Moving several unrelated nodes is several moves, and each gets its own decision about its own P and Q.

## A run, short

A task that installs the glossary sits under the setup map. It belongs to the glossary map: the setup map is about provisioning an environment, and installing a glossary is not that.

- Test one: does the task advance the glossary map's Target? Yes, it is the last step of it.
- Test two: does setup's Target still hold without it? Yes — setup has five other children and its Target never mentioned the glossary.
- N does not reopen. P does not reopen. Q is open, so it does not reopen either.
- `waymark parent set <task> <glossary map>`. One file written.
- Read back: the task appears under the glossary map, setup is unchanged, nothing became blocked.
- One commit: "Install task moved to the glossary map; it advances nothing in setup."

This is what happened in this repository on 2026-11-06 (`b699d5f`), except the task also carried a dependency edge on the glossary map, which was removed in the same commit: a child does not wait for its parent.
