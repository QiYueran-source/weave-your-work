---
schema: 1
id: wm-9sfmaphskg0c
title: 'Update skill: change a closed map or task'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-08T06:50:43Z
updated_at: 2026-11-08T06:50:43Z
parent: wm-qhd3twqjzhma
---
## Target

Write the update skill: change the content of a closed map or task, decide whether the node is edited in place or retired and replaced by a parallel ticket, and keep its children, dependents, and recorded review consistent with the change.

Why: waymark lets any closed node be rewritten with no cascade and no warning, while children refine the node, dependents wait on it, and the review verdict was judged against the text being changed.

## Acceptance direction

The skill exists under `weave-your-work/update/`; a reader can take one closed map and one closed task through it, and after each run the node's status, its review record, its parent's Children list, and its dependency edges agree with the change.

All children are complete and no further children are needed.

Review point: Check that the skill states the two boundary tests, the three dispositions, the ownership stop rule, and the order that ends in archive.

## Children

(none yet)

## Decisions so far

- It is a standalone skill under `weave-your-work/update/`. The Map operating procedure will point at it when that map is built, and the update rules in its fog are removed then. (user confirmed)
- advance stays the umbrella for every write an owner makes; update is the narrower operation that changes the content of a node that is already closed. (user confirmed)
- Content changes on a closed node split two ways: a small change is edited on the ticket; a large change retires the ticket with archive and opens a parallel new ticket. (user confirmed)
- A substantive change keeps the old text struck through with a `Superseded on <date>: <reason>` line; an editorial change replaces the text. (user confirmed)
- When the recorded acceptance no longer holds after the change, the node reopens, is reviewed again, and closes again. Status is the only signal the tree reads. (user confirmed)
- A completed node that its parent no longer needs is archived with a reason; `outcome=failed` is not used, and the archived definition grows to cover "done but retired by an upstream change". (user confirmed)
- The impact scan is not depth-limited: follow children, the parent, dependency edges in both directions, soft links, and references in bodies, examples, and testimony. (user confirmed)
- The write boundary is ownership: the operator edits the tree it owns and stops at any node owned by someone else. That node is handed over by opening an issue, never by editing it. (user confirmed)

## Not yet specified

- The boundary between the in-place edit and the parallel replacement: proposed as two tests (is it the same subject? does the recorded acceptance still hold?) giving three dispositions; waiting for confirmation.
- Whether update triggers only on closed nodes or also on a map that is split and still open.
- Whether a foreign-owned node stops the whole run or only that branch.
- What the hand-over issue contains, whether one issue covers several nodes, and whether the run waits for an answer.
- The order of writes for the retire-and-replace path, including the steps that must happen before archiving because an archived ticket rejects every write.
- Whether update is model-invocable or user-invoked only.

## Out of scope

- Editing nodes that are still open, which is plain advance.
- Designing the issue exchange itself, which belongs to the communication category.
