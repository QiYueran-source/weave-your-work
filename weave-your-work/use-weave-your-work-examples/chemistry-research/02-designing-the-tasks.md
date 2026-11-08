# Designing the tasks

The entry [task/SKILL.md](../../task/SKILL.md) routes by the question a reader has. Writing a ticket goes to `task-design`; advancing one goes to `execute-one-task`; a batch goes to `execute-all`; judging a finished one goes to `task-review`. The scenario used the entry four times, once per question, and the routing held.

## Two kinds

The first design question is what the task commits to: an output or an answer. The [kind reference](../../task-design/kind.md) says to name the output now. If you can, the task is a delivery. If naming it needs something the map does not know yet, the task is a probe.

The nickel screen is a probe. The lab does not know whether nickel reaches 70% yield on all three substrates, so the ticket commits to six run records and a finding, not to a file with a known shape. The result turned out negative: nickel reached 76%, 64%, and 41% yield, so it missed the floor on two substrates. That is still a complete probe. The ticket closed because the evidence was complete, not because nickel won.

The protocol, the table, and the pilot are deliveries. Each has an output that can be named before the work: `comparison-protocol.md`, `screening-table.csv`, and `pilot-record.md`.

## The fields

The task front matter carries the fields the [properties reference](../../task-design/properties.md) defines:

| Ticket | `task_kind` | `reversibility` | `needs_human` |
|---|---|---|---|
| Write the comparison protocol | `delivery` | `two_way` | `false` |
| Measure the nickel yield | `probe` | `two_way` | `true` |
| Compile the screening table | `delivery` | `two_way` | `false` |
| Run the 5 L palladium pilot | `delivery` | `one_way` | `true` |

The probe is `two_way` because a failed analysis can be repeated with the same substrate stock. The pilot is `one_way` because it consumes the last palladium batch on site; a wrong charge cannot be rerun that month. The pilot's Acceptance signal names the process chemist as the person who confirms the charge sheet before the run, which is what the `one_way` rule asks for.

## What the body carries

The shared sections are `Action`, `Acceptance signal`, and, when a reader would otherwise guess, `Boundaries`. The probe adds `Next step`, which says what the map does with either answer. The pilot adds `Failure recovery`, required because the work is `one_way`.

The probe's `Action` has two `Person:` steps: run the six experiments, and confirm the base batch and analytical method. The `needs_human: true` field and the two person steps agree. The protocol and the table have no person step and carry `needs_human: false`.

The design held when the tickets were written. The probe's two `Person:` steps and `needs_human: true` agreed, and in the scratch walk its stop state carried `Progress` and `waiting_on`. The pilot's `one_way` signal named the confirmation and the record carried it. The fields matched what the bodies said, which is what let `execute-all` exclude the human tasks without reading the bodies.

## What the walk changed

- The `properties` reference first said the three optional fields were `waiting_on`, `outcome`, and `needs_human`, then called `needs_human` "the only optional one". The walk found the contradiction; the file now separates the field written at creation from the two written during the run.
- The `body` reference says `Progress` is set when the work starts. `execute-one-task` does not write it at the start; it writes it only when the run stops. The walk found the contradiction. `body.md` now writes `Progress` only when a run stops; a normal run has none, and the `in_progress` status is enough while it works.
