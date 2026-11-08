---
schema: 1
id: wm-9sfmaphskg0c
title: 'Update skill: change a closed map or task'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-08T06:50:43Z
updated_at: 2026-11-08T06:57:55Z
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
- The boundary is two tests in order: does the node still answer the same question, and does the recorded acceptance still hold? Same subject and verdict holds → edit in place, status unchanged. Same subject and verdict fails → strike the old text with `Superseded on <date>: <reason>`, reopen, review again, close. Different subject → archive the old ticket, open a parallel new one, and repoint the parent's Children. (user confirmed)
- A foreign-owned node stops that branch, not the whole run: the operator finishes the tree it owns and hands the rest over. A branch cannot continue when the foreign node is the parent whose Children list must change. (user confirmed)
- Hand-over to another owner is an issue. The issue's shape and count belong to the communication category; update only names the hand-over and records the link. (user confirmed)

## Not yet specified

- Whether update triggers only on closed nodes or also on a map that is split and still open.
- The order of writes for the retire-and-replace path, including the steps that must happen before archiving because an archived ticket rejects every write.
- Whether update is model-invocable or user-invoked only.
- The hand-over issue itself is designed in the communication category; whether update adds a dependency edge to that map is undecided.

## Out of scope

- Editing nodes that are still open, which is plain advance.
- Designing the issue exchange itself, which belongs to the communication category.
