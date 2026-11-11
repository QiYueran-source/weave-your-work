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

## Gaps and residual risks

1. **The two worked examples were not migrated.** Their inner ticket stores were written under v1 rules, so `check-records.mjs` skips them (it reads the project's `tickets/` only). A reader following an example sees records that would fail the assertions this set now states. This is fog on the v2 map, not a hidden fact.
2. **Rule 7 (auxiliary actions add no step) is stated, not checked.** It is not decidable from prose; a reviewer reads `MAINLINE.md` against the actions.
3. **Acyclicity of the call graph is not machine-checked.** The rule is "calls go one way"; the check enforces no cross-skill path links, which removes the way v1's loops were built, but a cycle of calls written as prose would not be caught.
4. **The baseline holds 152 known findings.** The assertions are real and pass for new records; the legacy records keep their old shape until someone migrates them. Deleting the baseline would make the check red for 152 reasons and teach people to ignore it.
5. **`use-weave-your-work-examples` describes a 2026-11-08 walk.** Its pages say so, and the two links that pointed at removed skills were repointed.
6. **Trigger quality was not measured.** The descriptions were rewritten toward Matt's model-facing style, but no eval was run; the first weeks of use are the test.
