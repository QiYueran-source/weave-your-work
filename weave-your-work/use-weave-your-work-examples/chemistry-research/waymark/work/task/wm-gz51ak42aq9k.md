---
schema: 1
id: wm-gz51ak42aq9k
title: Run the 5 L palladium pilot
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T12:03:10Z
updated_at: 2026-11-08T12:10:38Z
closed_at: 2026-11-08T12:10:38Z
parent: wm-5ysrcd4r1g6y
custom_fields:
  needs_human: true
  reversibility: one_way
  task_kind: delivery
---
## Action

Run the 5 L pilot under the palladium conditions selected by the screen, and record whether the pilot reproduces the screening yield and purity.

1. Person: confirm the charge sheet, the palladium catalyst, and the fixed conditions before charging.
2. Charge the reactor and run one batch under the confirmed conditions.
3. Sample at 12 h and measure yield and purity by the screen's method.
4. Record the charge sheet, the measurements, and any deviation in the pilot record.
5. Person: sign the pilot record.

## Acceptance signal

Before the run, the process chemist confirms the charge sheet, catalyst, and conditions. The pilot record names the catalyst, the charge sheet, the yield and purity at 5 L, the deviation from the screening result, and the process chemist's signature. A reader who did not run the pilot can check the record against the screening table.

## Result

`lab/pilot-record.md` records charge sheet P-051 under palladium, 87% yield and 99.1% purity at 5 L, and a -4 point deviation from the screen on 4-bromotoluene within the mixing correction. The process chemist confirmed the charge sheet before charging and signed the record; both are linked in [confirmations.md](../../lab/confirmations.md) and [pilot-record.md](../../lab/pilot-record.md).

## Review

passed

- Goal: the pilot record names the catalyst, charge sheet, yield, purity, deviation, and signature, and the pre-run confirmation is recorded; read against the `Acceptance signal`.
- Convention: the charge sheet was signed before charging, no condition changed after it, and the run wrote only `Result` and this section.

## Failure recovery

The pilot consumes the last palladium batch on site, so a wrong charge cannot be rerun this month.

- Consequence: the campaign slips a month unless the charge is stopped before the reactor is heated.
- Remediation: stop before heating, quench the charge, tell the process chemist and the site scheduler, and let the process chemist decide whether to rerun.

## Boundaries

- No change to the catalyst or ligand after the charge sheet is signed.
- No campaign beyond one batch.
