---
schema: 1
id: wm-9sfmaphskg0c
title: 'Update skill: change a closed map or task'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-08T06:50:43Z
updated_at: 2026-11-08T08:36:42Z
parent: wm-qhd3twqjzhma
---
## Target

Write the update skill: change the content of a closed map or task, decide whether the node is edited in place or retired and replaced by a parallel ticket, and keep its children, dependents, and recorded review consistent with the change.

Why: waymark lets any closed node be rewritten with no cascade and no warning, while children refine the node, dependents wait on it, and the review verdict was judged against the text being changed.

## Acceptance direction

The skill exists under `weave-your-work/update/`; a reader can take one closed map, one split map, and one closed task through it, and after each run the node's status, its review record, and its dependency edges agree with the change.

All children are complete and no further children are needed.

Review point: Check that the skill states the two boundary tests, the three dispositions, the ownership stop rule, and the order that ends in archive.

## Decisions so far

- It is a standalone skill under `weave-your-work/update/`. The Map operating procedure will point at it when that map is built, and the update rules in its fog are removed then. (user confirmed)
- advance stays the umbrella for every write an owner makes; update is the narrower operation that changes the content of a node that is already closed or already split into children. (user confirmed)
- The trigger is the node's state, not the size of the change: update runs on a closed node, or on a map that has already split. An open node with no children is plain advance. (user confirmed)
- Content changes on a closed node split two ways: a small change is edited on the ticket; a large change retires the ticket with archive and opens a parallel new ticket. (user confirmed)
- A substantive change keeps the old text struck through with a `Superseded on <date>: <reason>` line; an editorial change replaces the text. (user confirmed)
- When the recorded acceptance no longer holds after the change, the node reopens, is reviewed again, and closes again. Status is the only signal the tree reads. (user confirmed)
- A completed node that its parent no longer needs is archived with a reason; `outcome=failed` is not used, and the archived definition grows to cover "done but retired by an upstream change". (user confirmed)
- The impact scan is not depth-limited: follow children, the parent, dependency edges in both directions, soft links, and references in bodies, examples, and testimony. (user confirmed)
- The write boundary is ownership: the operator edits the tree it owns and stops at any node owned by someone else. That node is handed over by opening an issue, never by editing it. (user confirmed)
- The boundary is two tests in order: does the node still answer the same question, and does the recorded acceptance still hold? Same subject and verdict holds → edit in place, status unchanged. Same subject and verdict fails → strike the old text with `Superseded on <date>: <reason>`, reopen, review again, close. Different subject → archive the old ticket, open a parallel new one, and repoint the parent's Children. (user confirmed)
- A foreign-owned node stops that branch, not the whole run: the operator finishes the tree it owns and hands the rest over. (user confirmed)
- ~~A branch cannot continue when the foreign node is the parent whose Children list must change.~~ Superseded on 2026-11-08: the map body no longer carries a Children list, so recording a parent relation writes only the child. A foreign parent stops the branch only when its own content must change — its Target, its acceptance, or its status. (user confirmed)
- Hand-over to another owner is an issue. The issue's shape and count belong to the communication category; update only names the hand-over and records the link. (user confirmed)
- Update never hangs a child under a foreign map without consent: the rules for a foreign parent — hang directly when it is open, open an issue and wait when it is closed, and prepare the child as an isolated node meanwhile — belong to [Map front matter and dependencies](tickets/map/wm-8zyyyafxbdwr.md) and update points there instead of restating them. (user confirmed)
- Two waymark writes cross ownership and update must call them out rather than perform them quietly: `link add` / `link remove` writes both tickets, and `archive` removes inbound dependencies and soft links from every ticket pointing at the archived node. Retiring a node that others depend on is a write to their tickets. (verified in waymark 0.1.0)
- The skill has two references, following split's shape: `content.md` for changing a node's content and `move.md` for relocating a subtree. SKILL.md keeps what both share — the two boundary tests, the ownership stop, the impact scan, and the reopen rule — and routes to one of them. (user proposed; accepted)
- A move writes no record field anywhere. `waymark parent set` leaves the old parent in the git diff of the moved node, and `waymark git history --item <id>` prints it; a line saying "moved from X" would be a second copy of something git already holds. (user confirmed)

## Not yet specified

- The order of writes for the retire-and-replace path, including the steps that must happen before archiving because an archived ticket rejects every write.
- Whether update is model-invocable or user-invoked only.
- Which of the moved node and its two parents reopen on a move. The rule proposed earlier follows the work: the moved node keeps its status, the old parent reopens when its Target no longer holds without it, and the new parent reopens only when an unfinished subtree arrives under a closed map.
- Whether a relocation happens in place or by archiving the original subtree and rebuilding it at the destination. (user proposed archiving the original, so the old shape stays readable in the archive instead of being recorded in extra text.) The measured costs of that path: an archived ticket rejects every write, so nothing can be fixed after the fact; archiving a node removes inbound dependencies and soft links from other people's tickets, which is itself a cross-owner write; a map cannot be archived while any child is still active, so the subtree goes bottom-up; and rebuilt nodes get new ids, breaking the references they carried — this repository holds 21 id mentions across 10 ticket bodies and 6 example files. A plain `waymark parent set` leaves the old parent in the moved node's git diff, which `git log -p --follow` prints, so the trace costs nothing. (verified in waymark 0.1.0)
- Whether update can move a node that is open and not yet split. The trigger for content changes is "closed node or split map", but relocating applies in any state, so `move.md` either widens SKILL.md's entry condition or is reachable only for closed and split nodes.
- What "relate the isolated preparation tree to the target node" means while an issue is open. `waymark link add` writes both tickets, which is the write the rule exists to prevent, so the only non-invasive relation is a line in the child's own body. The same question applies to soft links in general: a link is symmetric, so it is not a second copy that can drift (one command writes both ends), but it does touch a foreign file and can collide with its owner's edits. Children was removed for redundancy; links are a different case and need their own ruling.
- The hand-over issue itself is designed in the communication category; whether update adds a dependency edge to that map is undecided.

## Out of scope

- Editing nodes that are still open, which is plain advance.
- Designing the issue exchange itself, which belongs to the communication category.
