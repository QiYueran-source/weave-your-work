---
schema: 1
id: wm-6h8k4mvs3snr
title: Write the map front matter reference
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T10:43:08Z
updated_at: 2026-11-08T10:45:23Z
closed_at: 2026-11-08T10:45:23Z
parent: wm-8zyyyafxbdwr
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/map/frontmatter.md`, the reference for a map's front matter and its dependency edges, so each field has a named writer, ordering lives on edges, and an accepting party knows what to check.

1. Point at `waymark --help` for the core fields instead of repeating them, and state that every front matter change goes through a waymark command, never a hand edit.
2. Define the skill's custom fields with who writes each: `split_as` (submap or task, written by split at the first split, never flipped), `outcome` (failed, written by review when a node closes as a failed attempt), and `task_kind` (delivery or probe, task tickets only).
3. State the writing practice that keeps the file honest: `waymark body replace` for body edits so `updated_at` moves with the change, and one owner per item.
4. Write the dependency rules: parent-child is a natural dependency and gets no explicit edge; an explicit edge is for sibling or cross-branch waits; direction is that the blocked node must be independently implementable; timing is grill the relation first, wire the edge last.
5. State what the two symmetric commands imply for ownership: `link add`, `link remove`, and `archive` write the foreign ticket, so both proceed and the foreign owner is told afterwards in an issue naming the relation lost and the id that replaced the node.
6. Describe soft links without turning them into requirements: symmetric, not dependencies, no effect on readiness.
7. End with the Checking front matter list, split into what `waymark validate` catches and what a person must judge.
8. Read one real map's front matter against the finished file and fix whatever that read exposes.

## Acceptance signal

`weave-your-work/map/frontmatter.md` exists under `weave-your-work/map/`. It sends readers to `waymark --help` for the core fields, names each custom field with its writer, states the waymark-only writing practice, states dependency direction and timing, and ends with the violation list. A real map's front matter can be read and updated from the file without asking its author.

## Result

`weave-your-work/map/frontmatter.md` is written. It sends readers to `waymark --help` for the core fields and adds the part waymark does not enforce: which side of a relation each command writes, the three custom fields with their writers and rules, the waymark-only writing practice, the dependency direction and timing rules, what the symmetric commands imply for ownership, soft links as a non-requirement, and the checking list split into what a command catches and what a person judges.

Reading this repository's own front matter against the file found one violation of a decided rule: six map tickets carried `task_kind: delivery`, a field the reference limits to task tickets. Cleared with `waymark field update --clear task_kind` on `wm-0b59r7xfhk73`, `wm-31f6a2c9d840`, `wm-6c4f9e2a7b31`, `wm-87pgn0b75yy5`, `wm-9d7e4c1a2b60`, and `wm-rq3exm0m5563`.

A second thing the read showed was left alone: no map records `split_as`, although several have children. The field was decided after those maps were split, and writing it now would record a split that no split run performed.

## Review

passed

- Goal: `weave-your-work/map/frontmatter.md` exists; it points at `waymark --help`, names the three custom fields with their writers, states the writing practice, the dependency direction and timing rules, the two symmetric commands, and ends with the violation list. Read line by line against the acceptance signal.
- Convention: besides the deliverable, the run changed six map tickets' custom fields, which the acceptance asks for as the result of reading real front matter, and wrote this ticket's `Result`, `Review`, and status. It wrote no body and no other field.

## Boundaries

- No body content rules. Those are `body.md`.
- No lifecycle, statuses, or hand-offs. Those are the operating procedure reference.
- No task front matter beyond naming `task_kind` as a task-only field. That is task design.
