---
schema: 1
id: wm-q6477pe7x8tp
title: Align map lifecycle skills with audit decisions
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-09T05:25:57Z
updated_at: 2026-11-09T05:58:32Z
closed_at: 2026-11-09T05:58:32Z
parent: wm-hy12yjm0yn9g
soft_links:
  - wm-c3pkrzmxr4h0
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Align the map lifecycle instructions with the decisions in the parent map, so a reader can split, execute, review, and update a map without following conflicting rules.

1. Inspect affected closed design and execution tickets against update's same-subject and verdict tests. Record the impact and, where warranted and owned by this run, synchronize design and reopen affected tickets and ancestors; do not claim the old review failed merely because a new requirement exists. Preserve historical testimony and existing audit fixtures.
2. Revise `weave-your-work/map/` (`body.md`, `frontmatter.md`, `procedure.md`, entry and usage), `split/` (entry, `task.md`, `submap.md`), `map-review/SKILL.md`, and `update/` (`SKILL.md`, `content.md`, `move.md`, `need-execute.md`) to implement the parent map's confirmed decisions. Coordinate `execute-one-task/SKILL.md` and `execute-all/SKILL.md` where required for dependency input checks; check task-design for compatibility. Keep task Review's own existing history policy unless the confirmed map-specific design requires otherwise.
3. Check the instructions with representative cases: partial task layers and uncovered acceptance, all four map review verdicts, an invalidated Review and a legacy map without one, interrupted status/Review writes, a reopened child, failed dependencies with and without usable outputs, and review gaps inside versus outside the original task signal. Report which checks were static walkthroughs and which were executed, without treating Waymark validation as review evidence.
4. Re-read affected examples as historical records, preserving what actually happened; annotate only if a current-rule statement would otherwise mislead, without rewriting past operations or declaring untested paths passed.

## Acceptance signal

The named skill instructions agree with every confirmed decision in the parent map. A reader can follow the split plan, write and invalidate a map Review, distinguish dependency readiness from input availability, repair a review gap without an illegal sibling-task dependency, and apply the existing update tests. The ticket's Result identifies each checked case, evidence and limitations; `waymark validate` is reported only as a structural check. Affected prior tickets are assessed individually rather than automatically reopened, and no historical audit is presented as a successful review without evidence.

## Boundaries

- Do not modify concurrent issue work or the original audit project fixtures.
- Do not invent past reviews or bulk backfill old maps.
- Do not change task Review history rules without a separate confirmed decision.

## Result

The confirmed map, split, map-review, update and execution rules are implemented in `weave-your-work/map/`, `split/`, `map-review/`, `update/`, `execute-one-task/`, `execute-all/`, and the input check in `task-review/`. The map body now records Review and its history; the split plan lives in testimony; cumulative coverage and actual evidence gate acceptance; needed map inputs and failed dependencies are checked; and update uses the existing subject and verdict tests. No task Review history policy was changed.

`weave-your-work/use-weave-your-work-examples/chemistry-research/09-map-improvement-checks.md` records independent static walkthroughs for partial layers, all four verdicts, legacy maps and tasks, invalidated and mismatched reviews, reopened children, usable and unusable failed-dependency outputs, and original-signal versus new-requirement gaps. An isolated Waymark project actually ran first and later task splits, two task reviews, and a map review with `needs changes`: its agent plan did not constitute a human grill. No valid human-grilled complete pass, other verdict execution, or cross-owner workflow is claimed.

Seven skill directories were installed separately with `npx skills add --copy` in an isolated temporary project, and their YAML and relative Markdown links checked. `git diff --check` and `waymark validate` passed; validation is structural, not acceptance evidence. Waymark commands succeeded with a `GLIBC_2.39` weak-version warning.

Ticket disposition: `wm-vz22et2b7gja` and `wm-3j7mzce437f4` were reopened, revised against the confirmed status/Review decision, and re-reviewed against their current deliverables. `wm-b75en7eez6tj` and `wm-4dytqnmy4s47` are open because their original signals conflict with the current body reference and external skill dependency, respectively; each Progress states the evidence. `wm-tzpgke8n6cxd` remained closed after the task-split gate was changed back to referencing task design instead of restating it; its original signal's gate walkthrough is in its historical Result. `wm-6h8k4mvs3snr` remains closed because its signal asks for dependency direction and timing, both still present, even though its historical Action names an obsolete direction. The earlier audit task `wm-rxe8ntrjx845` and its parent remain open: its claimed passing review was retracted using the corrected case, not the untouched fixtures.

The affected design maps `wm-6c4f9e2a7b31`, `wm-bfqvr54kz3h4`, `wm-8zyyyafxbdwr`, `wm-3spf0jbvf9y9`, `wm-9d7e4c1a2b60`, `wm-9sfmaphskg0c`, and their affected ancestors `wm-3nhrhmds8rqd` and `wm-0b59r7xfhk73` remain reopened for their own evidence-based reviews. Legacy maps were not given invented `split_as` fields or historical reviews. Independent inspection also noted pre-existing overlap between no-duplication signals and required reference content in `wm-v9t392x7bxe2`, `wm-wwhftqxkatdj`, `wm-w87msnqhda40`, and `wm-rbz5gt51wnn1`; baseline files already contained the cited patterns, and this task did not declare those historical verdicts newly failed solely from that observation.

Historical case text was annotated as historical; the original audit project fixtures and parallel issue work were not changed.

## Review

passed

- Goal: checked the parent map's decisions against the revised skill files and the scenarios and limitations recorded in `09-map-improvement-checks.md`. The split, Review, input and update paths state the agreed decisions; the real scratch run and static cases are distinguished. The task Result records each prior-ticket disposition and the two unresolved original-signal conflicts.
- Convention: the changes stay within the confirmed map skill-family and related task execution/review input checks. Task Review replacement rules were retained; historical fixture tickets and concurrent issue work were not edited. Seven isolated installs, metadata/link checks, `git diff --check`, and structural `waymark validate` were run as recorded above.
