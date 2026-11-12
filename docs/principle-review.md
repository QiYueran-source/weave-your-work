# Principle review of the skill set

A pass over the skills and resources in `weave-your-work/` against the four rules in `weave-your-work/PRINCIPLES.md`, done on 2026-11-12 on branch `v2-resources-and-actions`.

The automatic checks passed before the pass and after it: `check-references.mjs` reports 0 findings across 23 skills, `check-records.mjs --baseline` reports 0 new findings, and `npm test` runs 10 files and 86 tests that all pass. A check passing says only that nothing in `weave-your-work/` contradicts what the check reads; the pass below looks at what the checks do not.

Findings are grouped by principle. Each one gives the contradiction, the file that lost, and whether this pass fixed it. The open ones are questions for the owner: I recorded them and changed nothing.

## One: one fact, in one place

### Fixed

**A cleared fog entry had two shapes.** `map/res/body.md` says a cleared entry stays in `Not yet specified`, struck through, with `Resolved on <date>: <what it became and where>`; `fog-explore/SKILL.md` step 4 said to "strike the entry through and add" the line, and its `Transformation` said the entry "carries" it. A run could not tell whether the line was on the entry or under it. The resource keeps its one shape, and the clearing step now quotes it.

**The fog walk was owned by one action but written for all of them.** `map/SKILL.md` said every action that creates a map runs the fog walk; only `open-map` creates a map. `open-map/SKILL.md` step 2 also restated the entry shape ("what becomes a child … and what an entry looks like"). Both now name `map/res/body.md` as the one place the walk is written, and neither restates it.

**The parent of a split child was set twice, and a step said it was set nowhere.** `open-map/SKILL.md` step 3 carries `--parent <map>` on its create command. `split/SKILL.md` step 3 said "this skill supplies the parent", step 4 said "Neither writer sets the parent on its own: this step does", and `open-map`'s `--parent` says a writer does. Step 4 now names the one step that sets it, and step 3 no longer claims `split` supplies it.

**Two rule counts disagreed.** `setup/SKILL.md` said seven rules are copied into `.agents/rules/`; `install.md` and `configure-project.md` say eight, `join-project.md` says seven, `rules-install.md` says eight, and `setup/rules/` holds eight files. `setup/SKILL.md` now says eight.

**The install guide named a test that `npm test` does not run.** `install.md` said "the setup test checks that the copies still match". `scripts/test.mjs` loads every `*.test.cjs` and `test-*.mjs` in the three tool directories, but `--test <files>` does not recurse: the glossary and issue test files are listed and never run. The guide now says the copies are kept equal by hand, and a new test in `project-root-copies.test.cjs` fails if a guide claims that comparison again.

**The reviewer was told to read v1 files.** `stop-and-wait/res/report.md`'s `Assertions` referred to `usage.md`, a file v2 does not have; the walk it points at is `stop-and-wait/SKILL.md`'s `## Steps` now.

**A router pointed at files, not at a skill.** `ask-me/SKILL.md` sent a fresh project to `configure-project`, `join-project`, or `check-project` as three destinations. They are three flow documents inside `setup`, and the router should name the skill a person opens.

### Open

**Where a field's "when to write" lives.** `PRINCIPLES.md` rule one names "the custom fields it carries and when each is written" as a fact of the map record. Today the values and the writing time are in `waymark/res/fields.md`, the freeze is in `map/res/body.md`, and the moment `split_as` is written is in `split/SKILL.md` step 5: three homes for one fact. Rule one also says the command that writes a field is shared on purpose, so the field table has a defensible home; the timing rule does not.

**Whether an action's one sentence about `parent` is a second copy.** `waymark/res/relations.md` defines `parent`; `open-map`, `open-task`, and `split` each repeat one clause of that definition for their own write. I kept each to the one sentence the action needs to be followed, and did not cut further because a bare "set the parent" leaves the caller without the rule that the child carries the field.

## Two: no dependency for a call, no cycle in the graph

**The graph is acyclic and the check reads the right edges.** `check-references.mjs` builds the call graph from `call \`name\`` and finds no cycle. `MAINLINE.md` says `split` calls `open-map` and `open-task`, and that neither writer calls `split`; no `SKILL.md` states the opposite.

**One document outside the graph contradicts it.** `docs/v2-conformance.md` §12 says "no action links into another action's folder" and marks it met and enforced, while `split` calls `open-map` and `open-task` by design and by the same document's §6. A reference is not a link, so the skill set is right and the document's row is stale. I left the document alone: it is the record of an earlier review, and correcting it is a separate edit for whoever owns it.

## Three: when unsure, follow Matt

**No skill names the Matt skill it followed.** The table in `PRINCIPLES.md` names where each question was answered, and the check for this rule is a reviewer's word. No document in the repository gives that word for any skill, and `docs/v2-conformance.md` marks rows "met" without naming one. This rule is stated and never exercised. It needs a reviewer's pass over the structure, not a text edit, so I did not write names I could not stand behind.

## Four: rules set direction, not layout

### Fixed

**`ASSERTIONS.md` carried an assertion that no file stated.** It listed "`split_as` changed after children exist" under Map with the `[check-records]` tag, and `map/res/body.md` did not state it. `check-records.mjs` reads exactly that — a map with children has no `split_as`, or one whose value does not match the children's category — so the assertion is now in `map/res/body.md` with the check beside it.

**Two files told the reader a count.** `setup/check-project.md` said "the ten checks a session start covers" and `setup/install.md` said "every check" after the same phrase; `rules-checklist.md` is the one file that knows which checks are starred, and it says so. Both now point at the checklist instead of copying a number that goes stale when a check is added.

### Open

**The `Transformation` blocks.** Every action carries a before/after block. It is the set's chosen shape, not something `PRINCIPLES.md` requires, and rule four asks what reads it. Nothing does. I left every block in place: a run uses it to know it stopped in the right state. Whether it is a machine contract or decoration is a question for the owner.

**The size rule is written twice.** `task/res/body.md` §"The size rule" and `open-task/SKILL.md` carry the same three sentences, once as a record rule and once as a step. The record file owns it; the action repeats it. I did not cut it, because the action is what a run reads when it decides whether a piece of work is one task or two, and the sentence there is the decision, not a description of the record's contents. This is the same shape as the fog walk above, which I did fix, and the owner may want one answer for both.

## Gaps the checks could not see

- **Four tool test files never run.** `scripts/test.mjs` passes `--test` a list of files and expects it to run them; Node runs the first named file and its children, and the raw output reports 86 tests against 10 files. The glossary and issue suites — lock, origin, catch-up, configure, isolation, security, and the glossary store — are collected and then skipped. Running them as separate `node --test <dir>` invocations or with `--test` on the directories would report them; I did not change the runner.
- **`docs/v2-conformance.md` overstates what the checks prove.** Its "How these are checked" section and its residual-risks list name a `src/` test layout, a call-cycle check, and a 22-skill count that the scripts and the tree do not have. The document is history; the skills are what this pass could fix.

## What this pass changed

| File | Change |
|---|---|
| `weave-your-work/split/SKILL.md` | step 3 stops claiming `split` supplies the parent; step 4 names the one step that sets it |
| `weave-your-work/open-map/SKILL.md` | step 2 reads the walk from `map/res/body.md` and restates nothing |
| `weave-your-work/map/SKILL.md` | the walk is stated for the action that runs it, not for every action |
| `weave-your-work/map/res/body.md` | the `split_as` freeze assertion states what `check-records` reads |
| `weave-your-work/fog-explore/SKILL.md` | step 4 quotes the resource's shape instead of describing its own |
| `weave-your-work/stop-and-wait/res/report.md` | the preamble names the file the walk is in |
| `weave-your-work/ask-me/SKILL.md` | setup is routed as a skill, not as three files |
| `weave-your-work/setup/SKILL.md` | eight rules, not seven |
| `weave-your-work/setup/check-project.md` | the check count is left to `rules-checklist.md` |
| `weave-your-work/setup/install.md` | same, and it no longer claims a test that does not run |
| `weave-your-work/setup/tools/project-root-copies.test.cjs` | a test that fails when a guide claims that comparison again |

## New findings from this pass

The four principles were written to rule on structure the checks cannot see, and applying them turned up conflicts of their own. None is fixed here; each needs the owner's decision because either side is defensible.

**A task's `Action` shape is defined twice, and the records read both ways.** `task/res/body.md` defines the `Action` section: "the result in the first sentence; a constraint that shapes the work … in that sentence too. Then the steps". `open-task/SKILL.md` step 2 repeats it and adds one clause ("A hard constraint that shapes the work — a date, a fixed budget — goes in that first sentence"). Rule one gives the definition to `task/res/body.md`. In the 82 task records, 33 `Action` sections open with "Write", 11 with "Deliver", 6 with "Add". Whether a sentence that opens with a verb states "the result" is the reviewer's call, and no check reads it either way. The duplication is the finding; the records are not broken by it.

**A map's `Target` needs a `Source:` line that the record file does not state.** `scripts/check-records.mjs` fails a `Target` that does not carry exactly one `Source:` line, `ASSERTIONS.md` indexes "`Target` without its `Where it came from`", and `map/res/body.md` says only "one outcome …, then a `Why:` line". A writer reading the map resource alone cannot produce a passing map. This is the same defect as the `split_as` row above, and the fix belongs wherever the owner decides the source line lives: under rule one, a record fact belongs to the record.

**`open-map` carries two rules of layout word for word.** Its `Transformation` block lists "Target carries an outcome and a Why line" and "Acceptance direction carries a Review point", which are two of `map/res/body.md`'s assertions. The `Transformation` blocks were already open under rule four; this is the one place where a block repeats a resource's assertions instead of describing the action's own end state.

## The state the checks are in

`npm test` passes (86 tests, 10 files), and `check-references.mjs` reports 0 findings. `npm run check:records` passes against its baseline with 213 known findings across 154 records, and fails 213 times without it. Most of that count is one cause: `waymark init` does not declare `split_as`, so 55 of the 57 maps that have children carry no value — two of this pass's new records are the second and third maps with one — and a map with children and no `split_as` is a finding. The rest are old maps without a `Source:` line, fog entries written before the current shape, and tasks and maps closed without a `Review` or a `Result`.

The baseline was written when the `split_as` assertion was indexed and not stated in `map/res/body.md`, so its row for that assertion read `split_as is X`, which the check never produced. The assertion is now stated, and the baseline holds the three findings it produces, in `wm-0166kgff304k`, `wm-0jc0gzrgv7z0`, and `wm-14tmxq9g2083` — each a `submap` whose only child is a task. Bringing `wm-qhd3twqjzhma`, five closed children all maps, to the current shape would add a fourth, so it is left for the migration.


## Where the pass is recorded

The review is a map of its own, `wm-09z3dt73e7t6`, hung under the root map and closed with a `passed` review that names this file. Its children are [Repair the contradictions the principle pass found between skill files](../../tickets/task/wm-42xfm5exd6zr.md), closed with `b90b22c` and `fe4187f` as its result; [Decide the questions the principle pass left open on the review map](../../tickets/task/wm-yb9eswa9esj6.md), open; and [Fix the six skill faults a rule-by-rule read found](../../tickets/task/wm-t2zhf370jy0j.md), open. The batch it found already open, [Walk every skill's paths](wm-5nz6m9f8n7a4.md), hangs under the existing batch map rather than a second one.

The record findings are the migration's, not the review's: the review wrote its own five records so that none of them adds a finding, and `npm run check:records` reads 213 known and 0 new across 154 records. The six faults in `wm-t2zhf370jy0j` are what a rule-by-rule read found and this pass did not repair, because each needs a decision about where a rule lives or which check should read it.
