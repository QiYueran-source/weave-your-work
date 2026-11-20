---
schema: 1
id: wm-2yqj26gbkyeh
title: 'Implement-spec: the merger reads a batch and reports to the run'
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-18T08:24:51Z
updated_at: 2026-11-18T08:25:24Z
closed_at: 2026-11-18T08:25:24Z
custom_fields:
  needs_human: false
---
Part of wm-n5wyafybvx25

## What to do

`weave-your-work/implement-spec/SKILL.md` carries a merger section, so the run
has someone to read a batch's results together before anyone treats them as done.

## Acceptance criteria

- [x] The section says when the merger runs: when every subagent in the batch has
      returned.
- [x] The section says the merger is not a git merge, and why: nothing is being
      combined into one file, and there is no conflict for a tool to report.
- [x] The merger answers three questions: do the results contradict each other,
      was the same thing done twice, do they hold together as one body of work.
- [x] A small difference is settled in the merger's own line with its reason; a
      contradiction is stated with both sides and left for someone to choose.
- [x] The section says the merger reports to the run, not to a person, and gives
      the reason: the run carries the result forward.
- [x] The skill reports contradictions in its final report, each with both sides.
- [x] Every prose line is 80 columns or under, and the file keeps mode 644.

## The result

`implement-spec/SKILL.md` carries a "The merger" section. It runs when every
subagent in the batch has returned; it is stated as not a git merge, because
nothing is combined into one file and no tool reports a conflict. It answers
three questions: contradiction, repetition, and whether the results hold
together as one body of work. A small difference is settled in the merger's own
line with its reason; a contradiction is stated with both sides and left for
someone to choose. The merger reports to the run rather than to a person,
because the run is what carries the result forward, and the run's final report
names every contradiction with both sides.

Verified by reading back: every prose line is 80 columns or under, and the file
is mode 644.

## Blocked by

- Part of wm-n5wyafybvx25 by name; no blocking edge between tickets.
