---
schema: 1
id: wm-f1n3gx540n8p
title: Run every collected test file in the test runner and prove the total
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

`scripts/test.mjs` passes ten file names to one `node --test` call, and the run reports 81 passes while the files contain 86 tests, so at least five never report. The runner invokes each file in its own `node --test` call, or isolates them, so every test the files contain reports.

1. Compare the printed count, the per-file counts, and the count one file per invocation gives.
2. Change `scripts/test.mjs` so each collected file runs and its result is aggregated.
3. Run `npm test` and compare the total against the per-file sum.

## Acceptance signal

The total `npm test` reports equals the sum of running every collected file on its own, and the run still exits 0.

## Boundaries

- The test files themselves are not edited.
