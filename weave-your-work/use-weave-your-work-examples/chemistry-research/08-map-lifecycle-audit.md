# Map lifecycle audit

This audit ran the map lifecycle in a separate Waymark project at [`map-audit/`](map-audit/). It uses a fictional report workflow and invented values to test map records and review. It does not claim that any chemistry experiment happened. The older [`waymark/`](waymark/) project remains unchanged; its tickets are illustrative fixtures, not test execution evidence.

## What ran

The audit root is [Map audit: fictional report has a reviewable result](map-audit/work/map/wm-98h7n5a01bh0.md). The discussion is in [testimony wm-ev0yh7xh7681](map-audit/work/testimony/wm-ev0yh7xh7681.md). Its settled entries are also on the map before splitting.

The first settled layer split the root into two maps: [Design the synthetic comparison protocol](map-audit/work/map/wm-x1bjza36xwqh.md) and [Produce the synthetic report and document its basis](map-audit/work/map/wm-qyyxhrazaq0n.md). Both hang directly from the root and have the same `split_as: task` value, written at their first split. The root's `split_as: submap` did not change when a later map was added.

The protocol map split into [Write the synthetic comparison protocol](map-audit/work/task/wm-6w02npknj8zy.md). The report map split into [Write the synthetic comparison report](map-audit/work/task/wm-kmthyscmtrpe.md). After the protocol map closed, a further settled question led to a second root split: [Record the synthetic report interpretation](map-audit/work/map/wm-7yf6bypy1260.md), again a child map. That map split into [Calculate the illustrative threshold result](map-audit/work/task/wm-qvfnzn5rb5q9.md), a probe task.

The task outputs are [`report-protocol.md`](map-audit/results/report-protocol.md) and [`synthetic-report.md`](map-audit/results/synthetic-report.md). The report has six invented rows. Under its explicitly illustrative rule, Pd-X passes and Ni-Y does not. Those numbers are process-test data only.

## Observed status path

| Item | Status path | Evidence |
|---|---|---|
| Root map | `open` → `in_progress` on first split → `closed` after all three child maps closed and fog was empty | Waymark `start`, `tree`, and `close` output; root ticket |
| Protocol map | `open` → `in_progress` on task split → `closed` after task close | protocol task and map tickets |
| Report map | `open` → `closed` after its report task closed | report task and map tickets |
| Interpretation map | `open` → `in_progress` on task split → `closed` after probe close | probe and map tickets |

The root was split twice while `in_progress`; it stayed `in_progress` between the two splits. Its children were all maps, so its frozen type remained `submap`. Descendant maps chose `task` for their own children.

The audit project was checked with:

```sh
waymark --project weave-your-work/use-weave-your-work-examples/chemistry-research/map-audit tree --root wm-98h7n5a01bh0
waymark validate --project weave-your-work/use-weave-your-work-examples/chemistry-research/map-audit
```

The final tree showed all seven map/task tickets closed. `validate` reported no findings over seven work-item documents.

## Update path and error

The closed root received one same-subject clarification about the synthetic report's source. I initially reopened it before checking the two update tests. That was the wrong order. Test one still passed: the map answered the same question. Test two also passed: the acceptance direction still held against the same evidence. After noticing the mismatch, I reviewed the unchanged target and children, closed the map again, then applied an editorial wording change in place. Waymark showed the map remained `closed` after that body edit. This demonstrates that a closed map does not reopen just because it changed; the verdict decides.

The ticket retains both clarifications, and this case records the mistaken reopen so it is not presented as the prescribed update path. The extra reopen/close was a test operator error, not a reason to change update's rule.

## What went wrong during the run

- `waymark init` accepts one `--category` per invocation. The attempted repeated flag failed; the audit then declared the other category with `waymark config add category`.
- The first root-map create failed because the scratch config had not declared `split_as`. The field was added with the Waymark config command before creating the root. The configured values were also checked against the local project config.
- A command that mixed global option ordering used a positional form Waymark did not accept. It made no write; the corrected command put `--project` before the subcommand and its `show` confirmed the current state.
- The first attempt to add a parent dependency edge was rejected by map rules: parent-child is refinement, not order. The edge was removed before further work. The final tree has no parent-child dependency.
- Creating the task category was initially attempted before declaring it; creation failed without a ticket. After adding the category, task creation succeeded.
- I initially used the wrong relative path prefix while reading the nested project, and created an empty duplicate config at `weave-your-work-examples/chemistry-research/map-audit/`. It held no work items and was removed. All actual audit data is under this directory, `weave-your-work/use-weave-your-work-examples/chemistry-research/map-audit/`.

These failures were recoverable because failed commands did not create the intended item or edge; the one mistaken closed-map reopen was corrected by reviewing and closing again. The audit did not hide those steps.

## Map-review findings

The core path worked: create a five-section map, settle fog into decisions before splitting, start on first split, add same-type maps in a later layer, let descendants choose tasks, and close each map after its children closed. The specific lifecycle mechanics were observable in actual ticket states and tree output.

The audit did not directly test `needs changes`, `needs discussion`, or `wrong direction`; it tested the passing review path only. It did not test a child being reopened during a parent review, a blocked dependency on a map, cross-owner writes, retirement and replacement, or a map whose type is `task` at its first split. It also did not test the bundle rules, grill behavior beyond recording one settled fixture discussion, or the task skills as a complete end-to-end system.

The initial config failures suggest a practical gap before the map lifecycle starts: the map procedure shows create and split commands but does not point clearly to initializing the project categories and fields. This is a setup concern as well as a possible missing prerequisite in the map entry. Record it for design; do not treat it as a failure of map state transitions.
