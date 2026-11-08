---
schema: 1
id: wm-0jba45z3c75b
title: Measure the nickel yield on the three substrates
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T12:02:55Z
updated_at: 2026-11-08T12:10:38Z
closed_at: 2026-11-08T12:10:38Z
parent: wm-eq30h8a29n4y
custom_fields:
  needs_human: true
  reversibility: two_way
  task_kind: probe
---
## Action

Find out whether the nickel catalyst reaches 70% yield and 98% purity on all three substrates under the palladium conditions.

1. Prepare the three substrate batches from the shared stock.
2. Person: run each substrate with the nickel catalyst and with the palladium control under the same temperature, solvent, and base.
3. Record the yield and purity for each run in the run log, with the run id.
4. Person: confirm that the six runs used the same batch of base and the same analytical method.

## Acceptance signal

All six run records exist, one per substrate and catalyst, and each carries a yield, a purity, and a run id. The process chemist confirms the base batch and analytical method are the same across the six. A reader who did not run the experiment can trace each number to its run record.

## Result

All six runs are in `lab/run-log.md`, R-01 to R-06, on base batch B-17 with method GC-3 / HPLC-2. The process chemist confirmed the batch and method; the confirmation is in [confirmations.md](../../lab/confirmations.md). Nickel reached 76%, 64%, and 41% yield on the three substrates; the pass rule needs 70% on all three.

The hypothesis does not hold: nickel misses the yield floor on 4-bromotoluene and 2-bromonaphthalene. Purity stays above 97.9% on every nickel run.

## Review

passed

- Goal: all six run records exist with yield, purity, and run id, and the process chemist's confirmation of B-17 and GC-3 / HPLC-2 is recorded; the negative finding is carried by R-04 and R-06, read against the `Acceptance signal`.
- Convention: the run stayed inside `Boundaries`; only `Result` and this section were added, and `waiting_on` was cleared when the answer arrived.

## Next step

- If it holds: carry the nickel conditions into the pilot map and name the catalyst in the decision note.
- If it does not hold: keep palladium for the pilot, and record the nickel result as the reason the cheaper route was dropped.

## Boundaries

- No optimization beyond the fixed conditions.
- No new substrates.
