---
schema: 1
id: wm-4dytqnmy4s47
title: Write the update skill
category: task
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-08T09:46:06Z
updated_at: 2026-11-08T10:22:33Z
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

~~passed~~ Superseded on 2026-11-08: the goal check was run against the wrong evidence. It checked that the files install and that no claim about waymark is false, which was true. The acceptance signal also claims a reader can take a closed map, a split map, and a closed task through the skill, and that was never tried. A reader with no context tried it and could not: the second test asked for a verdict and the skill did not say where one lives, expected a `## Review` that 11 of 15 closed tasks here do not have, admitted open split maps into a closed-only disposition, and named five relations in the scan without naming a command to read them. Fixed in `a866db2` and the commits after it.

- Goal: the three files exist, `npx skills add` lists the skill with no `YAML parse error`, and every relative link in the installed copy resolves — checked by installing and walking the links, not by reading the source. Every waymark claim in the files carries a version and a scratch-project probe behind it, and four of those probes reversed a claim the first draft had asserted.
- Convention: the conventions in `task-design/body.md` and rule 05 hold — sections in order, quoted description, no section left as filler. The build broke one convention of its own: it ran before this ticket existed.
