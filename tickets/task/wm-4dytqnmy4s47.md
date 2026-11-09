---
schema: 1
id: wm-4dytqnmy4s47
title: Write the update skill
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-08T09:46:06Z
updated_at: 2026-11-09T08:14:29Z
parent: wm-9sfmaphskg0c
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/update/SKILL.md` and its two references: change what a closed map or task says, and carry the change to its children, dependents, and recorded review.

1. State the trigger: a closed node, or a map that has already split. Not the size of the edit.
2. The two tests in order — same question, then does the verdict hold — and the three dispositions they sort a change into.
3. The impact scan: children, parent, dependency edges both ways, soft links, references in bodies and examples. No depth limit.
4. The decision boundary against the write boundary, and the one rule for a cross-owner write: it runs, and the owner is told in an issue afterwards.
5. `content.md`: what counts as substantive, the struck-through change, the reopen loop, children under changed content, and the write order that ends in archive.
6. `move.md`: relocating a subtree, which of the three tickets reopen, and why a move records nothing.
7. Verify every claim about waymark against a scratch project rather than against a reading of the tree.
8. Say what the skill does not do.

## Acceptance signal

`weave-your-work/update/SKILL.md` exists with `content.md` and `move.md` beside it, and installs with `npx skills add` without a YAML parse error. A reader holding one closed map, one split map, and one closed task can take each through the skill, and after each run the node's status, its recorded verdict, and its dependency edges agree with the change. Every factual claim about waymark carries a verification, and the skill points at no file outside its own directory.

## Boundaries

- No design of the issue exchange; that belongs to the communication category.
- No split rules; that belongs to the split skill.
- No review rules; that belongs to the review skill.

## Result

`weave-your-work/update/SKILL.md` and its three references exist and install as one skill. The review ran against the current files in isolated installs, temporary Waymark 0.1.2 projects, and this repository's git history.

Reference boundary: `need-execute.md` and `move.md` invoke the `map` skill for dependency rules; `need-execute.md` invokes `split` for child shape instead of naming `submap.md` or `task.md`. No update file names another skill's file, cites a repo path, or links to a missing local file in the installed copy. A stale `04-dependencies.md` pointer in `content.md` was replaced with the `map` skill.

Command claims, checked in waymark 0.1.2: `parent set` left the old parent byte-identical and a nested subtree followed; `show` prints all five relationships with `[]` or `null` for empties while `--compact` list drops them; `search` matches titles, bodies, `owner`, and custom fields but not `status`, `category`, or a timestamp; `body replace` leaves status and `closed_at` alone, so the reopen is a separate command; `link add` and `link remove` write both ends; `archive` strips inbound dependencies and soft links, moves a dependent from `blocked` to `ready`, and refuses a map with an unarchived child; archived nodes reject body, status, and parent writes; `list` defaults to 100 rows; `ready` ignores `parent`; and `waymark` closes a map with an open child without warning, so the tree is read first. Move history survives in git at `b699d5f` (`-parent:` and `+parent:`) and in `waymark git history --item`.

Disposition walkthroughs, run for real: a closed task changed its acceptance, kept its old signal struck, reopened, was redone against a regenerated file, re-reviewed, and closed; its closed map was struck, reopened, started, re-reviewed with the invalidated Review retained above the fresh one, and closed only after the child closed; an in-progress split map took an acceptance-direction edit with status and `split_as` unchanged and its child re-read; and the retire order was confirmed the hard way, where archiving a child and then its parent without clearing the parent field produced `DANGLING_REFERENCE` at the child and left hand-editing as the only repair.

Independent readers, given only the installed skill and a scratch project, drove each case. Each round exposed a real gap and each is fixed: the subject test now reads the body rather than the title, a wrong cross-reference in the move step was corrected, the unfinished-node branch gained a rule that picks edit over retire, retiring runs bottom-up, the implicit `Progress` section and the title write are named, non-git moves and soft-link cleanup are covered, a missing `map-review` stops instead of inventing a verdict, and `waiting_on` is documented as a field the project must declare.

Limits: the earlier retire-with-foreign-dependent run was not repeated end to end in this pass; that evidence stays historical. The `GLIBC_2.39` weak-version warning still appears on every command.

## Review

needs changes

- Goal: read against the four parts of the `Acceptance signal`. The files exist and install, re-checked after the last edit, with no broken local link and no path outside the skill. A reader took one closed map, one split map, and one closed task through the skill; after the run the status, the recorded verdict, and the dependency edges agreed on all four nodes, and `waymark validate` reported no findings. Every Waymark claim the skill states now has a command behind it, and the four this pass found wrong were corrected: `show` prints empty relations rather than omitting them, `--compact` drops them, `body replace` never moves status, and `waymark` closes a map over an open child without warning. One gap is still open. The walkthrough that needs `map-review` was run with that skill absent, so the reader wrote the fresh map verdict itself; the split between update retaining the struck history and `map-review` writing the new verdict is stated in prose and has not been exercised by a second agent. That is the same class of gap this review has been catching, and it leaves the signal partly unproven rather than disproven.
- Convention: `task-design/body.md` holds — sections in order, quoted description, no filler section, `Result` before this section, `Progress` after it. Repo rules held: every ticket write went through `waymark`, and every commit was path-scoped. One deviation is recorded rather than repaired: the build ran before this ticket existed, so the first verdict here was wrong, which is why the ticket was reopened and this review replaces it.

The design survived six rounds of reader feedback: two tests, three dispositions, the ownership boundary, and the write order. What changed was factual accuracy and the handling of states the first draft assumed away — an unfinished node with no verdict, a missing downstream skill, a project that cannot store a field, a move made outside git.

## Progress

The owner confirmed the reference boundary: update may invoke the `map` skill but must not point at files inside it. `need-execute.md` and `move.md` now invoke `map` for dependency rules and stop if it is unavailable. An isolated `npx skills add --copy` install succeeded; its local Markdown links resolved within the skill and both dependency branches retained the invocation. `waymark validate` found no structural issues. These checks do not establish the remaining reader walkthroughs or verification of every Waymark claim; keep this task open for that separate review.

Update invalidated the prior passed verdict on the same subject: the acceptance signal requires no references outside the update skill directory, but its dependency disposition now calls for the map skill frontmatter reference; universal verification of Waymark claims has not been re-established for the changed files. Reassess the signal and current evidence before re-review. Seven related skills, including update, were copied successfully by npx skills add in an isolated temporary project; that install alone does not establish semantic usability. Related implementation: wm-q6477pe7x8tp.

Gap to close for re-review: install `map-review` beside update in an isolated project and have a reader take a closed map through strike, reopen, start, and the fresh verdict written by `map-review` rather than by the reader, then confirm the status, the retained struck history, and the child's state agree. Nothing else in the signal is open.
