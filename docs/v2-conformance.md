# v2 conformance review

A check of the v2 set on branch `v2-resources-and-actions` against what the design discussion settled, and against Matt's set where the discussion said to follow it. Written after the change, from the files, not from memory. Every row names where the thing is and how it was checked.

## The numbers

| | v1 | v2 |
|---|---|---|
| Skills | 23 | 22 |
| Skill `SKILL.md` lines | 1,730 | 1,180 |
| Reference and resource lines | 2,367 | 526 |
| Record definitions per kind | one per skill, several overlapping | one per kind, under its own skill's `res/` |
| Rules stated as checkable assertions | none | 68, each tagged `[waymark]`, `[check-records]`, or `[review]` |
| Lines per resource | up to 291 | at most 56 |
| Scripts deciding a rule | 1 (install check) | 3 (install, references, records) |

The set is about 55% of its former size in prose, and the part that remains is mostly rules a script or a reviewer can decide.

## The settled decisions

| # | What was settled | Where it is | Status |
|---|---|---|---|
| 1 | A record is read by a machine and by a person; uniformity is not what a machine needs | `waymark/SKILL.md` opens with the two readers; the constraints are assertions, not templates | met |
| 2 | An assertion is the unit, and it names what decides it | every `## Assertions` bullet ends with one of three tags; `scripts/check-references.mjs` fails an untagged bullet | met, enforced |
| 3 | A resource defines, never runs; short, with the required parts and the assertions | 15 resources, none over 56 lines, none with a `## Steps` section | met, enforced |
| 4 | An action states its writing as before/after | five mainline actions and the auxiliary actions carry a `## Transformation` block | met |
| 5 | Architecture: resources vs actions, actions split into mainline and auxiliary | `MAINLINE.md` names the five and the twelve | met, enforced |
| 6 | Mainline: split, fog-explore, advance-task, task-review, map-review; open-map auxiliary | `MAINLINE.md`; `check-references.mjs` requires the five names | met, enforced |
| 7 | An auxiliary action changes what the line reads, never adds a step | stated in `MAINLINE.md` "The one rule between them" | met (stated; not machine-checked) |
| 8 | Recursion is the line itself; a child map re-enters at split; no depth limit | `MAINLINE.md` recursion paragraph | met |
| 9 | `submap` is a map: no resource, no action of its own | `map/res/body.md` covers root, child, and grandchild alike; `split` writes one | met |
| 10 | Handoff is a resource plus an action; no `dispatch` | `handoff/res/body.md` and `handoff/SKILL.md` | met |
| 11 | Field checking once at the entry of a stretch of work; `--dry-run` only on a foreign write | `advance-task` "one check of the tracker"; `waymark/res/fields.md` writing rules | met |
| 12 | Resources grouped by record type | `map/res/`, `task/res/`, `grill/res/`, `adr/res/`, `glossary/res/`, `issue/res/`, `handoff/res/`, `stop-and-wait/res/`, and `waymark/res/` for what every record shares | met |
| 13 | Installable parts leave the skills and live under setup | `setup/rules/`, `setup/tools/`, `setup/install*.md`; no other skill carries `bundle/`, which `check-references.mjs` enforces | met, enforced |
| 14 | Setup follows the configuration-first shape | `configure-project.md` explores, presents, confirms, writes; `join-project.md`; `check-project.md` reports only | met |
| 15 | v1 keeps working beside v2 | v1 stays on `qiyueran/dev` and its parents; this work is on a branch | met |

## v1 functionality, skill by skill

Every v1 skill and where its capability lives now. "Same" means the skill exists under the same name with its job intact.

| v1 | v2 | What changed |
|---|---|---|
| `ask-me` | `ask-me` | rewritten for the v2 routes; still the only router |
| `waymark` | `waymark` | fields and relations kept; `queries.md` folded into `res/relations.md`, with the `--limit` and `--compact` traps |
| `map` | `open-map` (action) + `map` (resources) | the entry and the opening pass are one action; the body, placement, and lifecycle are resources |
| `split` | `split` | child templates replaced by the `map` and `task` resources |
| `fog-explore` | `fog-explore` | same; the fog forms now live in `map/res/body.md` |
| `map-review` | `map-review` | same; the axes and verdicts are `map/res/review.md` |
| `task` | `task` | now the record reference, not an entry that routes |
| `task-design` | `task` | body, kind, and placement are the task resources; placement's dependency rule is `waymark/res/relations.md` |
| `execute-one-task` | `advance-task` | same preflight, stops, and `Result` |
| `execute-all` | `advance-task` (batch) | claim, dispatch, one commit per task, collision list |
| `task-review` | `task-review` | same; axes and verdicts in `task/res/review.md` |
| `update` | `update` | impact scan, two tests, three dispositions, reopening ancestors, foreign owner; moving a subtree and "a change that needs new work" folded in |
| `grill` | `grill` | rounds and frontier kept; the testimony is `grill/res/testimony.md`; `how-to-grill.md` folded into the steps |
| `adr` | `adr` | same; format and gates in `adr/res/format.md` |
| `glossary` | `glossary` | same; the entry shape is `glossary/res/entry.md`, the CLI usage is in its install guide |
| `issue` | `issue` | five actions and the queue kept; the format is `issue/res/format.md`, the listener setup is in `setup/install-issue.md` |
| `handoff` | `handoff` | the five sections are `handoff/res/body.md` |
| `wait-what` | `wait-what` | same table, same columns |
| `stop-and-wait` | `stop-and-wait` | six classes and read set kept; the report shape is `stop-and-wait/res/report.md` |
| `salvage-and-restart` | `salvage-and-restart` | five steps and five checks kept |
| `setup` | `setup` + `configure-project` + `join-project` + `check-project` + `install.md` | the two flow documents rewritten in the configuration-first shape; installs consolidated |
| `feedback-me-please` | `feedback-me-please` | same gates; trimmed |
| `use-weave-your-work-examples` | `use-weave-your-work-examples` | same two examples; two links repointed |

What v1 did that v2 no longer does, and why:

- **The `task` entry router.** It routed by the question a reader had; `ask-me` now does that once for the whole set, so the per-family entry was a second index.
- **`usage.md` walkthroughs** for map, handoff, glossary, issue, and wait-what. They are what the skill does, told twice; the walk that remains is the two worked examples.
- **Per-kind review pages** (`delivery.md`, `probe.md`). Their one operative difference is now a sentence in `task/res/review.md`.
- **`update/content.md`'s seven-step ordering.** The order that still matters — strike before reopen, children before a parent's archive — is in `waymark/res/disposition.md` and `update`; the rest was a walkthrough.

## Where Matt's set was the reference

| Pattern | Matt | v2 |
|---|---|---|
| One job per skill | `SKILL.md` states when, what, and what it writes | same four things; a resource owner is the one deliberate exception, and it has no steps |
| References owned by one skill, reached by calling it | `domain-modeling` owns the glossary and ADR formats | each record owner holds its `res/`; actions name the owner, never a path into its folder |
| Calls, not deep links | "Call the Skill tool with `grilling`" | "read the `task` skill", "hand the layer to `split`"; `check-references.mjs` fails a link into another skill's folder |
| One router, complete | `ask-matt`; a router that misses a skill lies | `ask-me`; the reference check fails when a skill is unnamed or a named thing is not a skill |
| Two invocation modes | `disable-model-invocation` plus `agents/openai.yaml` | `invocation: user \| model` in the front matter; the installer accepts both keys (tested) |
| Setup writes text and confirms before writing | `setup-matt-pocock-skills`, five steps | `setup` routes; `configure-project` explores, presents, confirms, writes; installs are consolidated in one guide |
| Small reference files beside the skill that owns them | 31–60 lines each | 15–56 lines each |

## Where v2 deliberately differs

- **One record owner per kind, not one skill in total.** Matt's references are private to one skill. A map record is written by `open-map`, `split`, `update`, and judged by `map-review`, so its definition has to be shared. It is shared by calling `map`, not by copying the file.
- **A resource owner with no action.** `map`, `task`, `waymark` are references, not procedures. Matt has no such skill; the alternative was letting each action keep its own copy, which is what v1 did.
- **A baseline for records that predate an assertion.** Matt's set has no tracker data to migrate. Here 147 records were written under v1 rules; `scripts/check-records-baseline.json` records the 152 findings they already had, and the check fails only on a new one.

## What the checks actually prove

Run on the branch, at the last commit:

```
npm test                        85 pass, 0 fail
check-references.mjs            0 findings across 22 skills
check-records.mjs --baseline    0 new findings across 149 records, 152 known
check-setup.mjs --all           17 checks: 17 ok
npx skills add (clean checkout) 22 installed, front matter valid
```

The first three are new in v2 and wired into `verify.yml`.

## Changes after the first review

The fog design was found to be split across two files: the `map` skill defined what fog is, and `open-map` carried the generation rule, which is the one fact PRINCIPLES rule one names by hand. It now reads:

| Where | Holds |
|---|---|
| `map/res/body.md` | the fog definition, the walk that sends each part to a child, an entry, an exclusion, or a decision, the entry shape, and the stop rule |
| `open-map/SKILL.md` | step 2 runs that walk and no rule of its own; every action that creates a map does the same, and none carries a copy |
| `split/SKILL.md` | a child map's fog is written when the child is opened; a split calls `open-map` or `open-task` once per child and writes no child body |

PRINCIPLES rule two was made decidable. A call is written `call \`name\`` and is the only edge in the graph; every other mention is a reference and carries no edge; `check-references.mjs` builds that graph and fails on a cycle. It was checked both ways: `split` calls `open-map` and `open-task` with no cycle, and an injected `open-map → split` fails with the cycle printed. The rule now also says a node is not a file: descending a tree is not returning up it.

The cycle check found one defect while being written: `split`'s step 3 phrased its call as a bare backticked name, which is the shape that let the v1 loops go unnoticed.

Writing a fog entry and clearing one were owned in different places, and neither file said where the line was. `map/res/body.md` now owns both halves as one fact: the walk that decides what becomes an entry, and where a cleared entry lands (a decision, a sharpened goal, a refusal, or a child). `fog-explore` keeps the execution — judge, get the missing part, write, strike — and reads the landings instead of restating them.

## Gaps and residual risks

1. **The two worked examples were not migrated.** Their inner ticket stores were written under v1 rules, so `check-records.mjs` skips them (it reads the project's `tickets/` only). A reader following an example sees records that would fail the assertions this set now states. This is fog on the v2 map, not a hidden fact.
2. **Rule 7 (auxiliary actions add no step) is stated, not checked.** It is not decidable from prose; a reviewer reads `MAINLINE.md` against the actions.
3. **Acyclicity of the call graph is not machine-checked.** The rule is "calls go one way"; the check enforces no cross-skill path links, which removes the way v1's loops were built, but a cycle of calls written as prose would not be caught.
4. **The baseline holds 152 known findings.** The assertions are real and pass for new records; the legacy records keep their old shape until someone migrates them. Deleting the baseline would make the check red for 152 reasons and teach people to ignore it.
5. **`use-weave-your-work-examples` describes a 2026-11-08 walk.** Its pages say so, and the two links that pointed at removed skills were repointed.
6. **Trigger quality was not measured.** The descriptions were rewritten toward Matt's model-facing style, but no eval was run; the first weeks of use are the test.
