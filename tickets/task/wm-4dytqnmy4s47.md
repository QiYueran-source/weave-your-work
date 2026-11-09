---
schema: 1
id: wm-4dytqnmy4s47
title: Write the update skill
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-08T09:46:06Z
updated_at: 2026-11-09T06:12:59Z
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

Three files, 413 lines: `SKILL.md` (139), `content.md` (158), `move.md` (116). The first version was 363 lines; three blind reads found the second test unreadable on real tickets, a map verdict defined two contradictory ways, a `create` command that is not runnable as written, a scan that named relations with no command to read them, and two rounds of wrong corrections to what `--json list` returns. The fixes run from `a866db2` to `926c1a4`.

Verified in waymark 0.1.2 against scratch projects, which corrected four claims the first draft had asserted from reading the tree: `parent clear` belongs on the child, not on its holder (`DANGLING_REFERENCE` is unrecoverable once both ends are archived); `waymark ready` never reads `parent`, so a subtree moved under a blocked map still reads ready; `waymark move` exists and swaps the category without touching the body; and the trigger fires on node state, never on how large the edit looks.

The retire-and-replace order was run end to end — a map with two children and a foreign dependent, `validate` clean afterwards, the dependent going `blocked` → `ready`, exactly as the hand-over issue describes. The move path is checked against this repository's own move at `b699d5f`, whose `-parent:` line survives in git where `move.md` says it does.

## Review

passed

- Goal: read against the `Acceptance signal`'s four parts. The files exist and install with `npx skills add`, re-checked after the last edit, and the installed copy holds no path outside its own directory. The reader walkthrough was the part this ticket first passed on nothing, and it now has evidence: three subagents given only the three files and three real tickets. The first two could not use the skill; the third called it usable and found one contradiction left, fixed in `ccad92f`. A fourth reader then checked that fix, found the section still used one word for two things — a map's acceptance direction as its verdict and as not-a-verdict — and that was fixed by separating a plan from a kept promise. At that point the readers were finding wording, not missing steps, which is where the reading stopped.
- Convention: `task-design/body.md` and rule 05 hold — sections in order, quoted description, no filler section, `Result` written before this section. One deviation stands and is recorded: the build ran before this ticket existed, and the verdict it wrote first was wrong.

The three rounds changed the wording and the reading path, not the design. The three dispositions, the two tests, and the ownership rule survived all of them. What did not survive: where a verdict lives, what an open node's status means, whether a map's verdict is its acceptance direction or its status, how a run learns its own name, and which command reads which relation.

## Progress

The owner confirmed the reference boundary: update may invoke the `map` skill but must not point at files inside it. `need-execute.md` and `move.md` now invoke `map` for dependency rules and stop if it is unavailable. An isolated `npx skills add --copy` install succeeded; its local Markdown links resolved within the skill and both dependency branches retained the invocation. `waymark validate` found no structural issues. These checks do not establish the remaining reader walkthroughs or verification of every Waymark claim; keep this task open for that separate review.

Update invalidated the prior passed verdict on the same subject: the acceptance signal requires no references outside the update skill directory, but its dependency disposition now calls for the map skill frontmatter reference; universal verification of Waymark claims has not been re-established for the changed files. Reassess the signal and current evidence before re-review. Seven related skills, including update, were copied successfully by npx skills add in an isolated temporary project; that install alone does not establish semantic usability. Related implementation: wm-q6477pe7x8tp.
