---
schema: 1
id: wm-16dyfj83n1g8
title: Write the stop-and-wait skill and run one report
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T01:25:49Z
updated_at: 2026-11-10T01:46:55Z
closed_at: 2026-11-10T01:46:55Z
parent: wm-0jc0gzrgv7z0
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Deliver `weave-your-work/stop-and-wait/` and prove the report format on this repository.

1. `SKILL.md`: the trigger, the read set, the six conflict classes as a closed list, the two-sides rule, the report path and the shape of one finding, and what the run never writes.
2. `report.md`: the file's skeleton, shown with invented findings.
3. Run one pass over this repository and write the real report to `docs/stop-and-wait/2026-11-10-<topic>.md`. Every finding names two sides, each with a resolvable ticket id or file path plus line.
4. Re-open both sides of every finding before it goes in the file; drop any finding that has one side only, and say in `Not checked` what the pass did not open.
5. Say which parts of the read set the pass skipped and why.

## Acceptance signal

`weave-your-work/stop-and-wait/SKILL.md` and `report.md` exist. One real report exists under `docs/stop-and-wait/`. A reader who did not run the pass can open every cited side at the cited location: ticket ids resolve through `waymark show`, file citations land on the line named, and no finding names only one side. The report's `Not checked` section names at least one skipped area.

## Boundaries

- No ticket is created, closed, archived, or edited by the run.
- The findings are not repaired here; that is the person's choice afterward.

## Result

`weave-your-work/stop-and-wait/SKILL.md` and `report.md` exist, and one real pass is written to `docs/stop-and-wait/2026-11-10-skill-set.md`.

The pass read every live map and task, the six numbered rules plus the three bundle rules, `.waymark/config.toml`, `GLOSSARY.md`, both ADRs, and all nineteen `SKILL.md` files. It produced four findings, one per class it used: two rule-against-practice, one promise-against-artifact, one uncovered-direction. Every finding names two sides, and all seven files and seven ticket ids cited were re-opened at the cited line or resolved with `waymark show` before the report was committed.

Candidate findings that were dropped, and why: the fifteen skills without a `usage.md` (the rule was amended on 2026-11-10 to make `usage.md` optional, so the two sides no longer contradict); `weave-your-work-examples/` at the repository root (untracked and empty, so it promises nothing); the `grill` skill's use of "work item" (the glossary lists it as a term to avoid, but no reader is misled and one side is a preference); the `wm-wjwa9081hse1` heading set on its own (folded into F2 with the entry map, because two findings about one contradiction are one finding).

`Not checked` names the listener tools, the five worked examples beyond their cited lines, and `testimony/`.

## Review

passed

- Goal: the `Acceptance signal` names three things. `weave-your-work/stop-and-wait/SKILL.md` and `report.md` exist with the six classes, the two-sides rule, and the fixed finding shape; `docs/stop-and-wait/2026-11-10-skill-set.md` is the real pass, and its four findings cite seven files and seven ticket ids that were each re-opened at the cited line or resolved with `waymark show`; `Not checked` names the listener tools, the examples, and `testimony/`. Nothing in the report names one side only.
- Convention: the run stayed inside `Boundaries`. It opened no ticket, changed no ticket body, and fixed none of the four findings. The only files it added are the skill, its example, and the report.
