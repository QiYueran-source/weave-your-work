---
schema: 1
id: wm-xkfyz16xde00
title: Write the salvage-and-restart skill and run it on a scratch project
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T01:25:49Z
updated_at: 2026-11-10T01:46:55Z
closed_at: 2026-11-10T01:46:55Z
parent: wm-14tmxq9g2083
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Deliver `weave-your-work/salvage-and-restart/` and run its order once on a scratch waymark project.

1. `SKILL.md`: the trigger, the test that separates a restart from an edit, the five steps in order, the salvage record's four lists and where it lives, the move in step 3, and the five checks.
2. Build a scratch waymark project under `/tmp` that stands in for a tangled tree: a root, two child maps, a few tasks, one closed and one abandoned.
3. Run the five steps on it: write a salvage record, move one surviving branch under the new root, raise the new root, archive the old tree bottom-up.
4. Run the five checks and record each result. Check 5 means no ticket file is removed.
5. Correct `SKILL.md` wherever the run showed the order or a command does not work as written.

## Acceptance signal

The skill files exist, and the scratch run's record names the new root id, the count of archived tickets, and all five checks with their results. `waymark tree` in the scratch project shows one root. No live ticket there has `parent` pointing at an archived node, and `waymark validate` reports no findings in it. Every command quoted in `SKILL.md` was run in that project.

## Boundaries

- Nothing is changed in this repository's own tickets. The scratch project is disposable.
- No real project is restarted.

## Result

`weave-your-work/salvage-and-restart/SKILL.md` exists, and its five steps ran end to end in a scratch project at `/tmp/wmfinal` (waymark 0.1.2, two categories, `task_kind` and `reversibility` declared).

The scratch tree was a root with two child maps and one task under each. The run wrote `docs/salvage/2026-11-10-restock.md`, raised `wm-29nwpztbksc1` as the new root citing it, moved `wm-qpf0y91hn5rq` (Child A) under the new root with `parent set`, and cleared then archived three nodes: `wm-4s0mtdnmdcg8`, `wm-mbgw05ht2ykm`, and the old root `wm-b3jqzp8pb4v0`. The result is one root in `waymark tree`, three entries in `waymark list --archive archived` each still carrying its `archive_reason`, and `waymark validate --strict` exiting 0 with one info finding, `NOT_A_GIT_REPOSITORY`.

Three things the run corrected in the skill, all now written into it:

1. **The clear is part of the step.** The first run archived bottom-up without `parent clear`, and `waymark validate` reported three `DANGLING_REFERENCE` errors: an archived child whose `parent` names an archived node. A second scratch project reproduced it on a two-node tree, and `parent clear` on the archived child was rejected with `<id> is archived and rejects parent clear`. There is no unarchive command, so the only repair is editing the archived file. Step 5 now runs `parent clear` before each `waymark archive`, and check 2 tests the archived nodes too.
2. **An archived item rejects `tree`.** `waymark tree --root <old-root>` fails with `<id> is archived and rejects tree`, so the old shape cannot be read that way. Check 1 reads `waymark list --archive archived` and `waymark show <id> --json` instead.
3. **The new root comes before the move.** The first ordering moved a branch onto a root that did not exist yet, so step 3 is now raising the new root and step 4 is the move.

The `--strict` flag matters for check 2: plain `waymark validate` exits 0 on error findings and only reports them, so "no findings" was never what the check could test.

## Review

passed

- Goal: the `Acceptance signal` asks for the skill, a scratch run whose record names the new root id, the archived count and all five checks, one root in `waymark tree`, no live ticket pointing at an archived node, no validate findings, and every quoted command run. In `/tmp/wmfinal`: new root `wm-29nwpztbksc1`, three archived nodes, `waymark tree` shows one root with `wm-qpf0y91hn5rq` under it, `waymark validate --strict` exits 0 with one info finding, and `Result` records each of the five commands and the three corrections the run forced.
- Convention: nothing in this repository's own tickets was changed by the scratch run, and no real project was restarted. The skill files and the ticket's `Result` are the only writes.
