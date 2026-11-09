# Map lifecycle audit

This audit ran map workflows in a separate Waymark project at [`map-audit/`](map-audit/). Its reports and sample labels are invented for workflow testing; no chemistry experiments were performed. The older [`waymark/`](waymark/) project remains unchanged. The first round contains review and recording mistakes described below; its closed statuses do not establish that the map reviews passed.

## What ran

The audit root is [Map audit: fictional report has a reviewable result](map-audit/work/map/wm-98h7n5a01bh0.md). [Testimony wm-ev0yh7xh7681](map-audit/work/testimony/wm-ev0yh7xh7681.md) was written after the root closed, not during the discussion. It is a retrospective summary, not a valid contemporaneous grill record. The existing tickets do not prove when the specific discussion decisions were settled.

The first recorded layer split the root into two maps: [Design the synthetic comparison protocol](map-audit/work/map/wm-x1bjza36xwqh.md) and [Produce the synthetic report and document its basis](map-audit/work/map/wm-qyyxhrazaq0n.md). Both hang directly from the root and carry `split_as: task`. The report map was not started at its first split, contrary to the procedure. The root's `split_as: submap` did not change when a later map was added.

The protocol map split into [Write the synthetic comparison protocol](map-audit/work/task/wm-6w02npknj8zy.md). The report map split into [Write the synthetic comparison report](map-audit/work/task/wm-kmthyscmtrpe.md). After the protocol map closed, the operator added a map in a second root split: [Record the synthetic report interpretation](map-audit/work/map/wm-7yf6bypy1260.md), again a child map. That map split into [Calculate the illustrative threshold result](map-audit/work/task/wm-qvfnzn5rb5q9.md), a probe task.

The task outputs are [`report-protocol.md`](map-audit/results/report-protocol.md) and [`synthetic-report.md`](map-audit/results/synthetic-report.md). The report has six invented rows. Under its explicitly illustrative rule, Pd-X passes and Ni-Y does not. Those numbers are process-test data only.

## Observed status path

| Item | Status path | Evidence |
|---|---|---|
| Root map | `open` → `in_progress` on first split → `closed` after all three child maps closed and fog was empty | Waymark `start`, `tree`, and `close` output; root ticket |
| Protocol map | `open` → `in_progress` on task split → `closed` after task close | protocol task and map tickets |
| Report map | `open` → `closed` after its report task closed | report task and map tickets |
| Interpretation map | `open` → `in_progress` → `closed` after probe close | probe and map tickets; the type and review were invalid, as explained below |

The root was split twice while `in_progress`; it stayed `in_progress` between the two splits. Its children were all maps, so its frozen type remained `submap`. Two descendant maps used `split_as: task`; the interpretation map incorrectly retained `submap` while creating a task.

The audit project was checked with:

```sh
waymark --project weave-your-work/use-weave-your-work-examples/chemistry-research/map-audit tree --root wm-98h7n5a01bh0
waymark validate --project weave-your-work/use-weave-your-work-examples/chemistry-research/map-audit
```

At that point the tree showed seven map/task tickets closed. After the retrospective testimony was added, `validate` reported no findings over eight work-item documents. That validation checks Waymark's structure, not compliance with the map or task skills.

## Update path and error

The closed root received a same-subject clarification about the synthetic report's source. I reopened it before applying the update tests, closed it again, and made an editorial wording change while it remained `closed`. The original run claimed that the old verdict still held. Later inspection found that the underlying map review had not passed: a descendant had the wrong split type and no task result. The operation shows that Waymark permits an in-place edit without changing status; it does not establish a valid passing update review. The unnecessary reopen and the invalid review remain part of the test record.

## What went wrong during the run

- `waymark init` accepts one `--category` per invocation. The attempted repeated flag failed; the audit then declared the other category with `waymark config add category`.
- The first root-map create failed because the scratch config had not declared `split_as`. The field was added with the Waymark config command before creating the root. The configured values were also checked against the local project config.
- A command that mixed global option ordering used a positional form Waymark did not accept. It made no write; the corrected command put `--project` before the subcommand and its `show` confirmed the current state.
- I added a parent-child dependency edge and later removed it: parent-child is refinement, not order. Waymark accepted the edge; the mistake was caught by the skill rules, not rejected by the tool.
- Creating the task category was initially attempted before declaring it; creation failed without a ticket. After adding the category, task creation succeeded.
- I initially used the wrong relative path prefix while reading the nested project, and created an empty duplicate config at `weave-your-work-examples/chemistry-research/map-audit/`. It held no work items and was removed. All actual audit data is under this directory, `weave-your-work/use-weave-your-work-examples/chemistry-research/map-audit/`.

Failed commands did not create their intended items. The invalid dependency was a successful write and had to be removed. The closed-map reopen was also a successful, unnecessary state change; I closed the map again, but later inspection found the underlying review was not valid.

## Map-review findings

The first round demonstrated actual Waymark state and tree operations, but its claim that the whole map-review path passed was wrong:

- The [interpretation map](map-audit/work/map/wm-7yf6bypy1260.md) says `split_as: submap`, but its only [child](map-audit/work/task/wm-qvfnzn5rb5q9.md) is a task. Its closed child has neither `Result` nor `Review`, although the map's review point requires the task result. The map attributes its conclusion to that missing task result, so the attribution is unsupported. Neither axis supports the recorded passing verdict.
- The report map closed directly from `open`; the procedure requires `in_progress` at the first split. The report task reads the protocol, and the interpretation task reads the report, but their respective maps have no ordering dependency. These are convention-review gaps, not findings that Waymark validation can detect.
- The current root has no dated, retained resolved fog entries. Together with the late testimony, the files do not establish that fog was resolved and discussion recorded in the required way before splitting. They do not prove that no discussion occurred.
- The first round did create task children under maps marked `split_as: task`, contrary to this report's earlier statement that the type was never tried. The report map's missing start means it did not follow the complete prescribed path.

The first round did not test the three non-passing review verdicts, a child reopened during review, dependency blocking, cross-owner writes, retirement and replacement, the bundle rules, or an end-to-end task/grill acceptance. The initial project configuration failures also suggest that a setup prerequisite may be unclear. These are observations for later design work, not proof that the map skill's state transitions failed.

## Second round: exceptional review paths

The following records the rules in force during the run. The later design moves the task-layer plan to testimony, permits cumulative task-layer coverage, and adds a map Review section. No retroactive review was performed under those new rules; the other recorded defects and limitations still need to be checked against actual evidence.

The [second audit root](map-audit/work/map/wm-91h5dy4pmtem.md) is a sibling of the first root. Its scenarios are deliberately constructed workflow fixtures. Waymark does not select a verdict or enforce map-review rules. The sequence below records the operator's observed command output; the current tickets alone do not preserve every intermediate status, review, or earlier file version.

### Needs changes

The [review-gap map](map-audit/work/map/wm-0hd7sq8bwa98.md) first split directly into the [label task](map-audit/work/task/wm-w4f9edjaxatf.md). After the task closed, the map remained `in_progress`. The original note contained `sample-A` but did not state that it was invented. The map's acceptance direction and review point explicitly required that limitation: the goal check failed. The first task was a leaf, matched the map's frozen `split_as: task`, and had a Result and Review. However, the parent did not retain the task-layer plan required by `split/task.md`, so a complete convention pass is not established. The verdict was `needs changes`; I wrote the missing limitation in the map's `Decisions so far` without closing it.

I then created a [second task](map-audit/work/task/wm-7krjnd07cc2d.md) to amend the first task's note. The [note](map-audit/results/review-gap.md) now says the label is invented, but the acceptance direction asks for an invented value, and the note contains no value. The goal check still fails. The second task also reads and changes a sibling task's output. `split/task.md` forbids this task-layer dependency. The second review therefore found a convention gap, not a passing verdict; the map remains `in_progress`. No repair of this new split-design mistake was attempted. This scenario shows detection and a partial fix, not a full needs-changes-to-passed cycle.

### Needs discussion

The [ambiguous-standard map](map-audit/work/map/wm-ekx3yrwpv0jj.md) asks for a note that is “sufficiently detailed” without defining the standard. Its [task](map-audit/work/task/wm-rx4nfwh6tr16.md) closed after writing a concrete [fictional note](map-audit/results/ambiguous-fixture.md). Goal check: the map's standard cannot be judged from its own words. Convention check: `map/body.md` requires checkable review points, which this deliberately ambiguous fixture lacks. The attempted verdict was `needs discussion` rather than a guessed pass or fix. However, `map/body.md` treats an uncheckable review point as unresolved fog, and `map-review` requires fog to be cleared before review. Because the fixture falsely says there is no fog, it was not eligible for review. This is an attempted hand-off from an invalid fixture, not a valid execution of the verdict. At that point I did not change the map body or close it; it remained `in_progress`.

I created an [open testimony](map-audit/work/testimony/wm-9gq10zj238rq.md) containing the unresolved question and soft-linked it to the map. That link changes the map's front matter because Waymark links are reciprocal; the review itself made no body or status write. No person answered the fixture question, so this demonstrates the hand-off and open record, not a completed grill or resolved standard.

### Wrong direction

The [unreachable map](map-audit/work/map/wm-ze97pcxt8e44.md) asks for an original measurement even though the fixture explicitly defines none. Its [probe task](map-audit/work/task/wm-1t77nbf0anjx.md) confirmed that fact from the map's fixture decision and closed. The goal check cannot succeed because the requested recorded measurement does not exist. That was already known before splitting, and the probe could not produce the map's acceptance result; `split/task.md` requires each acceptance line to be produced by the layer. The fixture was therefore invalid before review. The reviewer chose `wrong direction` and checked the resulting writes, but this is not a valid end-to-end split and review.

I ran `waymark field update wm-ze97pcxt8e44 --set outcome=failed` and `waymark close wm-ze97pcxt8e44`. I then created the [replacement sibling](map-audit/work/map/wm-1fqvcyvd3kvn.md), which asks to document the absence instead, and ran `waymark link add wm-ze97pcxt8e44 wm-1fqvcyvd3kvn`. `show` displayed the failed map as `closed` with `outcome: failed` and the reciprocal soft link. The replacement is still `open`; creating it and linking it is the tested hand-off, not evidence that its target was delivered.

### Child reopened during review

The [reopen map](map-audit/work/map/wm-1dw8dn53xk7t.md) had one [task](map-audit/work/task/wm-m1adx58ztqzh.md). After the task closed, `waymark tree --root wm-1dw8dn53xk7t` showed a closed child under an `in_progress` map. Before completing the parent's review I ran `waymark reopen wm-m1adx58ztqzh`; a second tree showed the child `open` while the parent remained `in_progress`. The pending review was discarded. After re-reading the task's Result, Review, and [note](map-audit/results/reopen-fixture.md), I closed the child again, re-read the tree, and reviewed the parent afresh. Goal check: the note meets the review point and the child is closed. I checked the map sections, `split_as: task`, and the single leaf task, then closed the map. Subsequent inspection found that the task-layer plan was missing and the single-action target may belong in a task rather than a map. The closing verdict is therefore not an established full convention pass.

This was an interruption staged by the audit operator between review steps, not a concurrent automated review. Waymark did not signal that the earlier review was void; the procedure supplies that rule.

### First split directly to task

The [direct-task map](map-audit/work/map/wm-zr0cemer1zpq.md) started `open`. `waymark start wm-zr0cemer1zpq` moved it to `in_progress`; `waymark field update wm-zr0cemer1zpq --set split_as=task` froze the child type. Its only [task](map-audit/work/task/wm-whds7wwb5fk7.md) wrote the [fictional note](map-audit/results/direct-leaf.md), recorded Result and Review, and closed. The tree showed the task without children. The goal check read the note against the map's review point. I checked the map shape, type and task, then `waymark close wm-zr0cemer1zpq` moved the map from `in_progress` to `closed`. Later inspection found the task-layer plan missing and questioned whether the one-action target should have been a task rather than a map. The run demonstrates the status operations, not a fully compliant passing map review.

The task was kept as a leaf by following the skill; this run did not try to create a child under it or claim that Waymark would reject one.

### Status and limits

The second root is intentionally `in_progress`: the gap map still has goal and convention findings, the ambiguous map awaits discussion, and the replacement map remains open.

All second-round task-split scenario maps lack the count and one-line-per-task plan required by `split/task.md` before ticket creation. That instruction conflicts with `split/SKILL.md` and another part of `split/task.md`, which say the split does not edit the parent body. The run did not resolve that conflict, and the records do not support full convention-pass claims. In addition, the two single-action passing fixtures may be tasks rather than maps under `map/procedure.md`; their narrow status tests do not establish compliant map design. A successful `waymark validate --project weave-your-work/use-weave-your-work-examples/chemistry-research/map-audit` reports structural findings only; it cannot certify a review verdict, split convention, or the truth of a testimony. No map-skill files were changed. Cross-owner behavior, dependency blocking, retire-and-replace update, real concurrent review, and a completed human grill remain untested.
