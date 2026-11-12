---
schema: 1
id: wm-9kbzepe027pj
title: Install the set from this branch and read every line of the output
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-12T07:42:19Z
updated_at: 2026-11-12T07:42:11Z
parent: wm-4n3skak99g1c
custom_fields:
  needs_human: false
  reversibility: one_way
  task_kind: delivery
---
## Action

Nobody has run the install on this branch. `npx skills add ./weave-your-work` is run in a scratch copy, its output read line by line, and the older copy under `.agents/skills/` is replaced or removed so the two directories stop disagreeing.

1. Copy the repository to a scratch directory, run the install there with the agent targets the README names, and read the output for `Skipped` lines.
2. Compare what installed with `ls weave-your-work/`; every skill must appear.
3. Record the command, the target, and the output in `Result`. If a skill is skipped, its front matter is the cause and the finding goes to the owner.

## Acceptance signal

The install lists all 24 skills with no `Skipped` line, and the command and its output are quoted in `Result`.

## Boundaries

- Nothing under `weave-your-work/` is edited to make the install pass, unless a front matter block is the proven cause and the fix is recorded.

## Failure recovery

The install runs in a scratch copy outside the repository; a failed run leaves the repository untouched.
