---
schema: 1
id: wm-4shspm0ad42t
title: 'Make npm test green: the issue suites cannot find their dependencies'
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-12T07:41:37Z
updated_at: 2026-11-12T07:42:11Z
parent: wm-4n3skak99g1c
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

`npm test` runs 86 tests and 38 fail, so the release cannot claim a green test run. Every suite the runner collects is made to run: the issue runtime's dependencies are installed where its tests look for them, or the runner's file list is fixed so each suite runs on its own.

1. Run `npm test` and read which suites fail; the known cause is `Cannot find package 'smol-toml'` in the issue runtime.
2. Fix the runner or the runtime install so the glossary, lock, origin, catch-up, configure, isolation, and security suites run.
3. Run the suite again and record the counts in `Result`.

## Acceptance signal

`npm test` exits 0, and the printed counts are at least the 86 tests the ten files contain, with 0 failing.

## Boundaries

- No skill under `weave-your-work/` is changed to make a test pass.
