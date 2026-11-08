---
schema: 1
id: wm-9sfmaphskg0c
title: 'Update skill: change a closed map or task'
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T06:50:43Z
updated_at: 2026-11-08T10:11:37Z
closed_at: 2026-11-08T09:46:46Z
parent: wm-qhd3twqjzhma
---
## Target

Write the update skill: change the content of a closed map or task, decide whether the node is edited in place or retired and replaced by a parallel ticket, and keep its children, dependents, and recorded review consistent with the change.

Why: waymark lets any closed node be rewritten with no cascade and no warning, while children refine the node, dependents wait on it, and the review verdict was judged against the text being changed.

## Acceptance direction

The skill exists under `weave-your-work/update/`; a reader can take one closed map, one split map, and one closed task through it, and after each run the node's status, its review record, and its dependency edges agree with the change. The move path has been read end to end against the repository's own move at `b699d5f`; the retire-and-replace path has been run end to end in a scratch project, and its write order held.

All children are complete and no further children are needed.

Review point: Check that the skill states the two boundary tests, the three dispositions, the ownership stop rule, and the order that ends in archive.

## Decisions so far

- It is a standalone skill under `weave-your-work/update/`. The Map operating procedure will point at it when that map is built, and the update rules in its fog are removed then. (user confirmed)
- advance stays the umbrella for every write an owner makes; update is the narrower operation that changes the content of a node that is already closed or already split into children. (user confirmed)
- The trigger is the node's state, not the size of the change: update runs on a closed node, or on a map that has already split. An open node with no children is plain advance. (user confirmed)
- ~~Content changes on a closed node split two ways: a small change is edited on the ticket; a large change retires the ticket with archive and opens a parallel new ticket.~~ Superseded on 2026-11-08: the split is decided by the two tests below, not by the size of the edit. A one-line change that flips the subject retires the node; a paragraph that only sharpens it does not. (user confirmed)
- A substantive change keeps the old text struck through with a `Superseded on <date>: <reason>` line; an editorial change replaces the text. (user confirmed)
- ~~When the recorded acceptance no longer holds after the change, the node reopens, is reviewed again, and closes again. Status is the only signal the tree reads.~~ Superseded on 2026-11-08: the reopen-and-reclose part stands. The last sentence is too strong — `waymark ready` reads dependency edges and never looks at a parent or a status, so a status is not the only thing the tree reads. What a false closed child falsifies is its parent's acceptance, which counts children as complete; that is the reason to reopen, and it is narrower than the old sentence claimed.
- A completed node that its parent no longer needs is archived with a reason; `outcome=failed` is not used, and the archived definition grows to cover "done but retired by an upstream change". (user confirmed)
- The impact scan is not depth-limited: follow children, the parent, dependency edges in both directions, soft links, and references in bodies, examples, and testimony. (user confirmed)
- ~~The write boundary is ownership: the operator edits the tree it owns and stops at any node owned by someone else. That node is handed over by opening an issue, never by editing it.~~ Superseded on 2026-11-08: the boundary is what a run may decide, not what it may write. A foreign node's content, status, and parent are never the run's to set; a foreign node's relations are touched only by the two waymark commands that write both ends, and that is announced. (user confirmed)
- The boundary is two tests in order: does the node still answer the same question, and does the recorded acceptance still hold? Same subject and verdict holds → edit in place, status unchanged. Same subject and verdict fails → strike the old text with `Superseded on <date>: <reason>`, reopen, review again, close. Different subject → archive the old ticket and open a parallel new one under the same parent. (user confirmed)
- A branch that needs a foreign node's content changed stops there, not the whole run: the operator finishes the tree it owns and hands the rest over. (user confirmed)
- ~~A branch cannot continue when the foreign node is the parent whose Children list must change.~~ Superseded on 2026-11-08: the map body no longer carries a Children list, so recording a parent relation writes only the child. A foreign parent stops the branch only when its own content must change — its Target, its acceptance, or its status. (user confirmed)
- Hand-over to another owner is an issue. The issue's shape and count belong to the communication category; update only names the hand-over and records the link. (user confirmed)
- Update never hangs a child under a foreign map without consent: the rules for a foreign parent — hang directly when it is open, open an issue and wait when it is closed, and prepare the child as an isolated node meanwhile — belong to [Map front matter and dependencies](tickets/map/wm-8zyyyafxbdwr.md) and update points there instead of restating them. (user confirmed)
- ~~Two waymark writes cross ownership and update must call them out rather than perform them quietly.~~ Superseded on 2026-11-08 by the rule below: they run and the owner is told. What stands: `link add` / `link remove` writes both tickets, and `archive` removes inbound dependencies and soft links from every ticket pointing at the archived node, so retiring a node that others depend on is a write to their files. (verified in waymark 0.1.2)
- The rule for a cross-owner write is one rule, not two: the write proceeds and the affected owner is told in an issue afterwards. This covers `link add` / `link remove` as well as `archive`. The narrower test that once seemed available — "allow the write only when there is no alternative" — does not survive contact with the archive case, since an archive that others depend on always has the alternative of building the replacement under the foreign tree. Once archive is allowed to write and notify, so is link. (user confirmed)
- A relocation is chosen by the same two tests as any other change. Content unchanged and only the position wrong → `waymark parent set` writes one file and every dependent keeps working. Content changed as well → the node is retired and rebuilt, so the move does not get its own path. (user confirmed)
- Rebuilding for a pure relocation is the one case the tests rule out, because it destroys what the move was meant to preserve: archiving the old node removes the edges of everyone depending on it, and `waymark create` always produces an open node, so a closed node comes back open. (verified in waymark 0.1.2)
- Naming the foreign inbound edges before an archive is cheap: `waymark --json list` returns `dependents` for every item, so the operator reads the full set without grepping. Links are not in that field — a soft link lives on both files, so it shows up as the other ticket's own `soft_links`. (verified in waymark 0.1.2)
- `--dry-run` computes the full blast radius but does not judge it: `archive --dry-run` lists every ticket whose front matter it will edit and stays silent about their owners. When the archived node belongs to the operator and a foreign ticket is in `affected`, the envelope carries no warning at all — a run that rewrites three other people's files looks clean. Reading `affected` and looking up each owner is the operator's job, and it is the only step nothing automates. (verified in waymark 0.1.2)
- Archiving changes what a dependent may do, not just what its file says. With carol's ticket depending on kim's node, archiving the node takes carol's ticket from `blocked` to `ready` — her plan moves without her knowing. That consequence, not the merge, is why the issue goes to her rather than to a reviewer. (verified in waymark 0.1.2)
- Every waymark write command takes `--dry-run`: archive, close, create, link add/remove, dependency add/remove, parent set/clear, status set, body replace. The skill runs it before every write that reaches past one ticket, and reads the affected list. What the comparison is for changed with the ruling above: the ids in `affected` become the list of owners to notify, not a reason to stop. (verified in waymark 0.1.2)
- ~~The gate before an archive is the inbound edge list: if a dependency or soft link pointing at the node sits on a ticket the operator does not own, the archive stops and that branch is handed over.~~ Superseded on 2026-11-08: the archive runs. Ownership is enforced by telling the affected owner afterwards, not by refusing the write. (user confirmed) The measurement behind the old rule still stands: a dependency edge is stored only on the dependent side, so archiving a depended-on node always rewrites the dependent's file, and a soft link is stored on both. There is no version of the archive that spares them.
- The preview is not optional even though the write is allowed: before an archive, run `waymark archive <id> --reason <text> --dry-run` and write down, per affected ticket, whose it is and which relation disappears. The human output names the relation (`removes dependencies` / `removes soft_links`); the JSON `affected` array carries only id and path, so the human output is the one to read. `no inbound relationships to remove` means nothing outside the node is touched. (verified in waymark 0.1.2)
- One issue per affected owner, filed after the archive, and it carries an action: the relation that was removed, the id that replaced the node, and the decision the owner has to make — re-point the edge at the replacement, or drop the wait if the archived outcome is enough. Without the replacement id the issue is noise, which is another reason archive and replacement travel together. (user confirmed)
- Archiving a subtree in order to move it destroys the record it was meant to keep. A child left pointing at an archived parent makes `waymark validate` report DANGLING_REFERENCE, so each child's parent field is cleared before its parent is archived — clearing it erases the old position from the ticket. The move trace ends up in git either way, so the archive path buys nothing it promised. (verified in waymark 0.1.2)
- The retire order is unforgiving in one place: archiving a child that still points at its parent is not caught at the time, and once the parent is archived `validate` reports DANGLING_REFERENCE at the child — but the child is archived too, so `parent clear` is rejected and there is no unarchive command. The only repair is editing the archived file by hand to drop the `parent:` line. Clearing the child's parent *before* archiving anything is what keeps the run recoverable. (verified in waymark 0.1.2)
- Rebuilding also resets what the nodes assert: `waymark create` always produces an open node, so a closed task rebuilt under a new parent comes back open and its recorded review does not carry over. A relocation that preserves status has to be a `parent set`. (verified in waymark 0.1.2)
- The skill has two references, following split's shape: `content.md` for changing a node's content and `move.md` for relocating a subtree. SKILL.md keeps what both share — the two boundary tests, the ownership stop, the impact scan, and the reopen rule — and routes to one of them. (user proposed; accepted)
- A move writes no record field anywhere. `waymark parent set` leaves the old parent in the git diff of the moved node, and `waymark git history --item <id>` prints it; a line saying "moved from X" would be a second copy of something git already holds. (user confirmed)

## Not yet specified

- `update` is model-invocable, unlike `execute-all` and `execute-one-task`. The trigger is the state of a node, not a command a person types: a run that finds a closed node whose content no longer holds should reach for the rules, and a person should not have to remember the skill exists. The two execute skills are user-invoked for the opposite reason — they spend an unbounded number of subagents, which nobody should start by accident. (agent decision, revisable)
- Whether update adds a dependency edge to the communication map. The issue it files is the communication category's to design; update names what the issue must carry and points there. An edge between the two maps would say the update work waits on the issue work, which is false today — the skill can file issues by hand.
- ~~The seven-step retire-and-replace order is written into `content.md` from waymark's constraints, not from a worked run.~~
  Resolved on 2026-11-08: the order was run end to end in a scratch project and held. A map with two children and a foreign dependent was retired through all seven steps; `validate` reported no findings, the surviving child read under the replacement, the dependent went `blocked` → `ready`, and the dry-run named exactly the ticket the archive would edit. One correction came out of it: the parent field is cleared on the **child**, not the holder — archiving the child while it still points at its parent breaks `validate` once the parent is archived, and an archived child cannot be cleared afterwards (no unarchive command exists; the only repair is a hand edit). That correction is in `content.md`.
- The skill must stand on its own once installed: `npx skills add` copies only the skill's own directory, so a relative link to a ticket becomes a dead link. The one such link (the foreign-parent rules) is inlined in `content.md`. (verified by installing and checking every relative link in the copy)

## Not yet specified

- The build ran before its own ticket existed. `wm-9sfmaphskg0c` was closed at 09:16 with the skill already written and no child task under it, and the ticket was reopened on 2026-11-08 to hang [Write the update skill](tickets/task/wm-4dytqnmy4s47.md) and close it. The order the method asks for — map, then task, then work — was inverted. The artifacts are unchanged; the record of who did what and when was written after the fact.

## Built

- `weave-your-work/update/SKILL.md`: the trigger, the two tests, the three dispositions, the impact scan, the decision/write boundary, and the dry-run-then-notify routine.
- `weave-your-work/update/content.md`: the first two dispositions in detail, the retire-and-replace order, and a whole short run.
- `weave-your-work/update/move.md`: the move, its two tests, which of the three tickets reopen, and why it records nothing.
- The Map operating procedure and the execution map point at the skill; the glossary defines update and move.

## Out of scope

- Editing nodes that are still open, which is plain advance.
- Designing the issue exchange itself, which belongs to the communication category.
