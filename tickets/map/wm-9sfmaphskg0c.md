---
schema: 1
id: wm-9sfmaphskg0c
title: 'Update skill: change a closed map or task'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-08T06:50:43Z
updated_at: 2026-11-08T09:07:16Z
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
- A relocation is chosen by the same two tests as any other change. Content unchanged and only the position wrong → `waymark parent set` writes one file and every dependent keeps working. Content changed as well → the node is retired and rebuilt, so the move does not get its own path. (user confirmed)
- Rebuilding for a pure relocation is the one case the tests rule out, because it destroys what the move was meant to preserve: archiving the old node removes the edges of everyone depending on it, and `waymark create` always produces an open node, so a closed node comes back open. (verified in waymark 0.1.0)
- Naming the foreign inbound edges before an archive is cheap: `waymark --json list` returns `dependents` for every item, so the operator reads the full set without grepping. Links are not in that field — a soft link lives on both files, so it shows up as the other ticket's own `soft_links`. (verified in waymark 0.1.0)
- `--dry-run` computes the full blast radius but does not judge it: `archive --dry-run` lists every ticket whose front matter it will edit and stays silent about their owners. When the archived node belongs to the operator and a foreign ticket is in `affected`, the envelope carries no warning at all — a run that rewrites three other people's files looks clean. Reading `affected` and looking up each owner is the operator's job, and it is the only step nothing automates. (verified in waymark 0.1.0)
- Archiving changes what a dependent may do, not just what its file says. With carol's ticket depending on kim's node, archiving the node takes carol's ticket from `blocked` to `ready` — her plan moves without her knowing. That consequence, not the merge, is the reason a foreign inbound edge stops the archive. (verified in waymark 0.1.0)
- Every waymark write command takes `--dry-run`: archive, close, create, link add/remove, dependency add/remove, parent set/clear, status set, body replace. The skill runs it before every write and reads the affected list. Dry-run is not a permission check, though: `archive --dry-run` names each ticket whose front matter it will edit (`affected` in the JSON envelope, one `removes dependencies` / `removes soft_links` line each in the human output) and raises no OWNER_MISMATCH for those tickets — only the node being archived is warned about. The operator compares the affected ids against its own. (verified in waymark 0.1.0)
- ~~The gate before an archive is the inbound edge list: if a dependency or soft link pointing at the node sits on a ticket the operator does not own, the archive stops and that branch is handed over.~~ Superseded on 2026-11-08: the archive runs. Ownership is enforced by telling the affected owner afterwards, not by refusing the write. (user confirmed) The measurement behind the old rule still stands: a dependency edge is stored only on the dependent side, so archiving a depended-on node always rewrites the dependent's file, and a soft link is stored on both. There is no version of the archive that spares them.
- The preview is not optional even though the write is allowed: before an archive, run `waymark archive <id> --reason <text> --dry-run` and write down, per affected ticket, whose it is and which relation disappears. The human output names the relation (`removes dependencies` / `removes soft_links`); the JSON `affected` array carries only id and path, so the human output is the one to read. `no inbound relationships to remove` means nothing outside the node is touched. (verified in waymark 0.1.0)
- One issue per affected owner, filed after the archive, and it carries an action: the relation that was removed, the id that replaced the node, and the decision the owner has to make — re-point the edge at the replacement, or drop the wait if the archived outcome is enough. Without the replacement id the issue is noise, which is another reason archive and replacement travel together. (user confirmed)
- Archiving a subtree in order to move it destroys the record it was meant to keep. A child left pointing at an archived parent makes `waymark validate` report DANGLING_REFERENCE, so the parent field has to be cleared first, bottom-up — and clearing it erases the old position from the ticket. The move trace ends up in git either way, so the archive path buys nothing it promised. (verified in waymark 0.1.0)
- Rebuilding also resets what the nodes assert: `waymark create` always produces an open node, so a closed task rebuilt under a new parent comes back open and its recorded review does not carry over. A relocation that preserves status has to be a `parent set`. (verified in waymark 0.1.0)
- The skill has two references, following split's shape: `content.md` for changing a node's content and `move.md` for relocating a subtree. SKILL.md keeps what both share — the two boundary tests, the ownership stop, the impact scan, and the reopen rule — and routes to one of them. (user proposed; accepted)
- A move writes no record field anywhere. `waymark parent set` leaves the old parent in the git diff of the moved node, and `waymark git history --item <id>` prints it; a line saying "moved from X" would be a second copy of something git already holds. (user confirmed)

## Not yet specified

- The order of writes for the retire-and-replace path. Known constraints: an archived ticket rejects every write, so the replacement must exist and its id must be on the old ticket before the archive; and a child left pointing at an archived parent makes `waymark validate` report DANGLING_REFERENCE, so a subtree retires bottom-up with each parent field cleared first.
- Whether update is model-invocable or user-invoked only.
- Which of the moved node and its two parents reopen on a move. The rule proposed earlier follows the work: the moved node keeps its status, the old parent reopens when its Target no longer holds without it, and the new parent reopens only when an unfinished subtree arrives under a closed map.
- Whether update can move a node that is open and not yet split. The trigger for content changes is "closed node or split map", but relocating applies in any state, so `move.md` either widens SKILL.md's entry condition or is reachable only for closed and split nodes.
- What "relate the isolated preparation tree to the target node" means while an issue is open. Archive now proceeds across ownership and notifies afterwards, which is the same trade `link add` would make, so the two may be settled together: either both write and both notify, or both stay inside the operator's own files.
- Whether a soft link may be written to a foreign ticket at all. It is the one relation stored on both sides, so `link add` and `link remove` rewrite the other owner's file even when nothing about their work changes; nothing is removed from it, unlike the archive case, which is why the two are not automatically the same ruling. (user asked to keep the current behaviour working while the question is open)
- The hand-over issue itself is designed in the communication category; whether update adds a dependency edge to that map is undecided.

## Out of scope

- Editing nodes that are still open, which is plain advance.
- Designing the issue exchange itself, which belongs to the communication category.
