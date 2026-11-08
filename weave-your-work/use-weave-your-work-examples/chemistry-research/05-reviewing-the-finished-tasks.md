# Reviewing the finished tasks

`task-review` reads the ticket and the work `Result` points at, then writes one verdict. The scenario produced four passing reviews, one `needs changes`, one `needs discussion`, and one `wrong direction`, the last three in scratch copies.

## The two axes

The goal axis reads the `Acceptance signal` against the evidence. The convention axis reads `Boundaries`, the writes, and the repo rules the ticket put in play. The walk reported them separately, as the skill asks.

For the protocol, the goal axis opened `lab/comparison-protocol.md` and found all four things the signal names. For the table, it opened `lab/screening-table.csv` and counted rows. For the pilot, it opened `lab/pilot-record.md` and `lab/confirmations.md`, and checked the charge sheet, the yield and purity, the deviation, the signature, and the pre-run confirmation.

## Passed

- [Write the comparison protocol](waymark/work/task/wm-wea2f4ywz4v1.md): `passed`.
- [Measure the nickel yield on the three substrates](waymark/work/task/wm-0jba45z3c75b.md): `passed`, with a negative finding. Nickel missed the floor on two substrates. The ticket closed without `outcome: failed`, because a negative probe is a complete result.
- [Compile the screening table](waymark/work/task/wm-p3ktzx61k2yw.md): `passed` on the second review, after one `needs changes`.
- [Run the 5 L palladium pilot](waymark/work/task/wm-gz51ak42aq9k.md): `passed`. The one-way signal's confirmation was in `Result`, so the review did not return `needs discussion`.

## Needs changes

The table's first pass had four rows. The review named R-05 and R-06 as missing, left the ticket open, and the next pass added them. The second review passed. The closed ticket now carries only the passing `Review`; the earlier verdict was replaced. The scenario page describes the first pass because the ticket cannot.

## Needs discussion

A scratch task with `reversibility: one_way` ran without recording the pre-run confirmation. The review returned `needs discussion`, because the missing item was a person's answer, not a defect in the output. It wrote `Progress`, set `waiting_on` to the process chemist, and left the ticket `in_progress`.

That is the right verdict, but the route to it is odd. `execute-one-task` is supposed to stop before the work when the `one_way` confirmation has not landed. The scratch task only reached the review because the run went ahead anyway. The review branch is a backstop, not the normal path.

## Wrong direction

A scratch task called "Run the nickel pilot" was written for the nickel conditions before the screen closed. When the screen came back negative, the task promised a pilot the map no longer wanted. The review returned `wrong direction`, set `outcome=failed`, and closed the ticket as a failed attempt.

The verdict and the field work. The run to it does not. `execute-one-task` says a task that no longer holds is handed back to the owner with `Progress` and `waiting_on`, still `in_progress`. It does not write `Result`. `task-review` starts from `Result`. The owner had to write a `Result` and invoke the review by hand to reach the failed close. No skill describes that step.

## What the review does not read

`task-review` says it reads `Action`, `Acceptance signal`, `Boundaries`, and `Result`. It does not name `Failure recovery` or `Next step`, even though `task-design` makes the first required for `one_way` work and the second required for a probe. A ticket missing either can still pass, because the review never checks for it.

The same gap covers the field and the body. `properties.md` says `needs_human: true` requires at least one `Person:` step, and `false` requires none. The review's convention axis checks `Boundaries` and writes, not that agreement. A task can carry `needs_human: true` with no person step and still pass.

## Who may review

`task-review` says anyone may review, and a reviewer who is not the owner acts with the owner's authority. `map/frontmatter.md` says one owner per item and only the owner advances it. Waymark itself warns but allows the write:

```
$ waymark start wm-s1yn3reqwq15
set wm-s1yn3reqwq15 open -> in_progress
  OWNER_MISMATCH: operator frank is not the owner alice of wm-s1yn3reqwq15
```

The warning is not a refusal. A non-owner reviewer can close the ticket. The two rules need one answer: either the reviewer is a delegate and the ownership rule has an exception, or only the owner reviews.
