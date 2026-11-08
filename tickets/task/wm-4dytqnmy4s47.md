---
schema: 1
id: wm-4dytqnmy4s47
title: Write the update skill
category: task
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-08T09:46:06Z
updated_at: 2026-11-08T10:23:05Z
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

Three files, 409 lines: `SKILL.md` (137), `content.md` (156), `move.md` (116). The first version was 363 lines; three blind reads found the second test unreadable on real tickets, a map verdict defined two contradictory ways, a `create` command that is not runnable as written, a scan that named relations with no command to read them, and two rounds of wrong corrections to what `--json list` returns. The fixes run from `a866db2` to `ccad92f`.

Verified in waymark 0.1.2 against scratch projects, which corrected four claims the first draft had asserted from reading the tree: `parent clear` belongs on the child, not on its holder (`DANGLING_REFERENCE` is unrecoverable once both ends are archived); `waymark ready` never reads `parent`, so a subtree moved under a blocked map still reads ready; `waymark move` exists and swaps the category without touching the body; and the trigger fires on node state, never on how large the edit looks.

The retire-and-replace order was run end to end — a map with two children and a foreign dependent, `validate` clean afterwards, the dependent going `blocked` → `ready`, exactly as the hand-over issue describes. The move path is checked against this repository's own move at `b699d5f`, whose `-parent:` line survives in git where `move.md` says it does.

## Review

passed

- Goal: the acceptance signal has four parts and each was checked against something other than the skill's own prose. The three files exist and install with `npx skills add`, re-verified after the last edit, and the installed copy carries no path outside its own directory. Three subagents were each given only the three files and three real tickets. The first two could not use the skill. The third called it usable and found one contradiction left, which was then fixed; no reader has seen the skill since that last fix, so the claim that it is now followable rests on a repair rather than on a fresh read. That gap is in the example's gap list, not hidden here. Every factual correction came with a probe behind it, and two of the corrections were themselves wrong until a later reader caught them.
- Convention: `task-design/body.md` and rule 05 hold — sections in order, quoted description, no filler section. One deviation stands and is recorded rather than smoothed over: the build ran before this ticket existed, and the verdict it wrote first was wrong.

### What the three readers changed

Not the design — the wording and the reading path. Three dispositions, two tests, and the ownership rule survived all three rounds unchanged. What did not survive: where a verdict lives, what an open node's status means, whether a map's verdict is its acceptance direction or its status, how a run learns its own name, and which commands actually read which relation. That is the difference between a skill whose facts are right and a skill someone can follow, and only a blind read tells them apart.
