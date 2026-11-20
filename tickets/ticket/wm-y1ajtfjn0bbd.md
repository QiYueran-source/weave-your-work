---
schema: 1
id: wm-y1ajtfjn0bbd
title: Add the ordering test
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T07:06:51Z
updated_at: 2026-11-17T07:07:45Z
closed_at: 2026-11-17T07:07:45Z
parent: wm-w8p1a8by9ang
---
## Action

Add one test to the existing suite: three terms in one group, written with timestamps in ascending order, render in descending order in the view the merge writes.

The assertion reads the generated view, not a sort function. The suite's seam is the command line and the view, and this test keeps to it.

## Acceptance signal

- The new test fails when the sort is removed from the merge, and passes when it is present.
- The suite reports twelve tests, zero failures.

## Result

Done. The test builds a temporary project, writes a source file whose three terms share a group and carry `2026-01-01`, `2026-06-01`, and `2026-12-01` as `updated_at`, merges, reads the view, and asserts the order of the three term names.

It is named `terms in a group render with the most recently settled first` and sits beside the existing default-group test.

The suite reports twelve tests, zero failures.
