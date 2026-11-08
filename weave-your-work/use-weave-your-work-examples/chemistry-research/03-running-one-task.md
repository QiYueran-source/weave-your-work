# Running one task

`execute-one-task` takes one ticket from unclaimed to handed over. The scenario walked three shapes: a task that finishes without a person, a probe that stops at a lab step, and a one-way task whose gate was read before the charge.

## A delivery that runs to the end

The protocol task started with `waymark start wm-wea2f4ywz4v1`, wrote the file `lab/comparison-protocol.md`, and finished with `Result` and `Review` before `waymark close`. The review read the file against the four things the Acceptance signal names: three substrates, both catalysts, the fixed conditions and sampling point, and the pass rule. All four were there, so the verdict was `passed`.

The task wrote only `Result` and `Review`. It did not touch the `Action`, the fields, or the map.

## A probe that stops at a person

The probe has two `Person:` steps. `execute-one-task` says a person step stops the run, so the scratch walk stopped after preparing the substrate batches and wrote:

- `Progress`: where the work stands and what happens next.
- `waiting_on`: the process chemist, with the six runs named.

The ticket stayed `in_progress`. When the six runs came back, the owner cleared `waiting_on`, the run read the run log against the signal, and wrote the finding. Nickel reached 76%, 64%, and 41% yield; the hypothesis did not hold. The review passed, because the probe's completeness is about the evidence, not about which way the answer went.

The clearing step used to be where the skill was thin. `properties.md` says `waiting_on` is cleared when the answer arrives, not when work resumes. `execute-all` says the owner clears it. Neither skill had a step that said when. The rule now says the owner clears it after handling the answer, before the next selection; the run stops on a non-empty value. In the walk a person did it by hand with `waymark field update wm-0jba45z3c75b --clear waiting_on`, which is now what the rule describes.

## A task that comes back

The table's first pass wrote four rows; R-05 and R-06 were missing. The review against the six-row signal returned `needs changes`, named the two missing rows, and left the ticket open. The second pass added the rows, replaced `Result`, and was reviewed again; that pass returned `passed` and closed the ticket.

The ticket now shows only the passing `Review`. The earlier one was replaced, not appended, which is what `task-review` requires. A reader of the closed ticket cannot see that the first pass failed; that history lives only in the conversation and in Git if the ticket was committed between passes.

`execute-one-task` now reads the earlier `## Review` before a re-run. A `needs changes` task fixes only the named gap; a `needs discussion` task stops. The ticket carries the gap, so `dispatch.md` does not have to add it to the subagent prompt.

## A one-way task

The pilot's `reversibility` is `one_way`, and its signal names the process chemist as the person who confirms the charge sheet before charging. `execute-one-task` stops before the work when that confirmation has not landed. In the fixture the confirmation was recorded, so the run continued: charge sheet P-051, 87% yield, 99.1% purity, a -4 point deviation on 4-bromotoluene, and the signed record.

The gate is the right shape. The review's delivery path also checks the confirmation in `Result`; if it is missing, the verdict is `needs discussion`, not a defect in the output.

## The commands the run used

```bash
waymark --project waymark start <task-id>
waymark --project waymark body replace <task-id> --body-file result-and-review.md
waymark --project waymark close <task-id>

# a stop
waymark --project waymark field update <task-id> --set waiting_on="process chemist: R-01 to R-06"
waymark --project waymark body replace <task-id> --body-file progress.md

# the answer arrived
waymark --project waymark field update <task-id> --clear waiting_on
```

The project path is `waymark/` relative to this directory. Its files sit inside this repository, so `validate` finds the parent Git history and reports no findings.
