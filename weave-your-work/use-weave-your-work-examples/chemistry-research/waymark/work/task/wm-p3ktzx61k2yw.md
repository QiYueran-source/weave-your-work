---
schema: 1
id: wm-p3ktzx61k2yw
title: Compile the screening table
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T12:02:59Z
updated_at: 2026-11-08T12:03:20Z
closed_at: 2026-11-08T12:03:20Z
parent: wm-eq30h8a29n4y
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Compile the six screening runs into one table the pilot decision can read.

1. Read the six run records and the comparison protocol.
2. Put one row per substrate and catalyst in `screening-table.csv`, with yield, purity, and run id.
3. Mark any run that did not follow the protocol.

## Acceptance signal

`screening-table.csv` holds six rows, one per substrate and catalyst, each with yield, purity, and a run id that resolves to a run record. No cell is blank. A process chemist can read the pass or fail for nickel from the table and the protocol without opening the run log.

## Result

`lab/screening-table.csv` holds six rows, one per substrate and catalyst, each with yield, purity, and a run id that resolves to R-01 to R-06. No cell is blank. Nickel passes on 4-bromoanisole and fails on 4-bromotoluene and 2-bromonaphthalene, read against the protocol's 70% floor.

## Review

passed

- Goal: six rows, one per substrate and catalyst, each with yield, purity, and a run id that resolves to a run record; no blank cell, read against the `Acceptance signal`.
- Convention: the rerun changed only the two missing rows and the sections the review named; `Boundaries` held.

## Failure recovery

If a run record is missing, the table says which run is missing and stops; the table is not filled from memory.

## Boundaries

- No new analysis of the raw data.
- No decision about the pilot.
