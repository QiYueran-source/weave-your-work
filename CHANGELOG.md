# weave-your-work

## 1.0.0

### Major Changes

- [#23](https://github.com/QiYueran-source/weave-your-work/pull/23) [`e13d218`](https://github.com/QiYueran-source/weave-your-work/commit/e13d218a11953cf0e23f6b698c543acba92b2222) Thanks [@QiYueran-source](https://github.com/QiYueran-source)! - Reorganise the set around records and actions, and shrink what each one states.

  A record is now defined once, under the record's own skill in `res/`: `map/res/`, `task/res/`, `grill/res/` (a testimony), `adr/res/`, `glossary/res/`, `issue/res/`, `handoff/res/`, `stop-and-wait/res/`, and `waymark/res/` for what every record shares (fields, relations, categories, change dispositions). A resource states what a record must contain and the assertions that decide it; it never holds a step procedure.

  The actions are grouped by the mainline in `MAINLINE.md`: `split`, `fog-explore`, `advance-task`, `task-review`, `map-review`. Everything else is auxiliary: `open-map`, `update`, `grill`, `adr`, `glossary`, `issue`, `handoff`, `wait-what`, `stop-and-wait`, `salvage-and-restart`, `feedback-me-please`, `setup`.

  Every rule is an assertion with the check that decides it, indexed in `ASSERTIONS.md`: the tracker refuses it (`[waymark]`), a script over the tickets decides it (`[check-records]`), or a reviewer does (`[review]`). Two scripts enforce them: `scripts/check-records.mjs` (with a baseline for records written before an assertion existed) and `scripts/check-references.mjs` (no cross-skill path links; the router names every skill; the mainline names its actions; resources hold no procedure).

  The install parts move out of the skills and under `setup/`: seven rules in `setup/rules/`, the setup tools in `setup/tools/`, and install guides in `setup/install.md`, `setup/install-glossary.md`, `setup/install-issue.md`. No other skill carries a `bundle/`.

  Removed: `execute-one-task` and `execute-all` fold into `advance-task`; `task-design` and the `map` entry fold into the record references and `open-map`; `task` is now the task record reference rather than an entry that routes. The set still has 22 skills.

### Minor Changes

- [#23](https://github.com/QiYueran-source/weave-your-work/pull/23) [`87f465a`](https://github.com/QiYueran-source/weave-your-work/commit/87f465aa5d9508c80c2ece0cd808fe716bac1342) Thanks [@QiYueran-source](https://github.com/QiYueran-source)! - Make each action one job, and let `MAINLINE.md` hold the order and the checkpoints.

  `split` now decides the type and the count and writes nothing: it passes the parent with the call, and the writer hangs the child. `open-map` writes the target it is given, from a parent map's decision or from a grill, instead of settling the target itself, and its fog is written by the map resource's walk. `open-task` names the resource for every shape rule it used to restate. `grill` writes the testimony and nothing else: it names the terms it fixed and the decisions that beat a recorded ADR, and the caller writes them where `MAINLINE.md` says the line checks. `fog-explore` writes the clearing and sends a landing in the map's body through `update`. `advance-task` stays at execution, and `update` names `adr` when a change overturns a recorded decision.

  `MAINLINE.md` gains a table of the checkpoints where a term or an ADR is written, after each step of the line, with the action that writes it there.

  `PRINCIPLES.md` principle three is now a reference rather than a rule: Matt's set is read before inventing a shape, `docs/matt-methods/` records what it settled, and nothing requires a name.

- [#23](https://github.com/QiYueran-source/weave-your-work/pull/23) [`853cfd2`](https://github.com/QiYueran-source/weave-your-work/commit/853cfd2de22102a11b5a32b1beb92df4aadda6ea) Thanks [@QiYueran-source](https://github.com/QiYueran-source)! - Say each action's boundary once, and stop checking how it is worded.

  Twenty-two skill files carried a `## What this skill does not do` list, and most of the items restated the order `MAINLINE.md` already draws: `open-task` said it does not decide how many tasks a layer has, `split` said it does not clear fog, `map-review` said it does not accept a task. Nothing read those lists, and they grew because each file was proving it did not overstep. Each action now keeps one line naming the nearest action it is not, and the map holds the rest.

  `scripts/check-references.mjs` no longer fails a writer for how it phrases itself. A regular expression asking for "does not decide how many" passed a file that meant the opposite in other words and failed one that said it plainly, which is the decoration `PRINCIPLES.md` rule four names. The check keeps the part that is a behaviour: a writer says it writes one record per run. The 60-line cap on a resource is gone too; no rule said why 60.

  The tool paths are now relative. `adr`, `glossary`, `issue`, and `salvage-and-restart` said `docs/adr/`, `.work-weave/runtime/glossary/`, and so on, while the line hashes from the project root; the paths now start with `./` where the text means a project path.

- [#23](https://github.com/QiYueran-source/weave-your-work/pull/23) [`186851a`](https://github.com/QiYueran-source/weave-your-work/commit/186851a95027e7b6958dd7b04f6854dce8f14dcf) Thanks [@QiYueran-source](https://github.com/QiYueran-source)! - Make the checkpoints for a term and an ADR readings, not calls.

  `MAINLINE.md` said six times that one step "calls `glossary` or `adr`", while `grill`, `adr`, and `glossary` each deferred the decision back to "the caller". A rule whose subject, object, and verb sit in three files cannot be run by any of them, and none of those six was a call in the graph `PRINCIPLES.md` builds: they were references pretending to be edges.

  The table now names what a step leaves behind and where it may land, and says plainly that nothing here is a call and no step waits on one. Most of these are written by the action that produced them, because it read the thing the gates judge on; `grill` and the two openers hand their output to a caller, who decides, and `task-review` decides on what `Result` recorded.

- [#23](https://github.com/QiYueran-source/weave-your-work/pull/23) [`f253806`](https://github.com/QiYueran-source/weave-your-work/commit/f2538065918f335b92309ea7aa334dab7364df72) Thanks [@QiYueran-source](https://github.com/QiYueran-source)! - Turn `feedback-me-please` into steps

  The skill was 108 lines: an account check before any step, then five numbered
  steps, then a report and a list of six things it never does. The account check
  was a step in everything but name, and the list restated rules its own steps
  already gave. It is now six numbered steps, a report, and one paragraph saying
  that none of those rules gives way.

  The same run that shortened it costs nothing: every rule it states is still
  there, in the step that has to keep it.

- [#23](https://github.com/QiYueran-source/weave-your-work/pull/23) [`434613d`](https://github.com/QiYueran-source/weave-your-work/commit/434613d14a6c8ff0fc8a29a75e56dfca9737f046) Thanks [@QiYueran-source](https://github.com/QiYueran-source)! - Let the mainline run itself, and let a failed record stay failed.

  Every action on the line but `map-review` is now model-invoked, so a split that writes child maps keeps going on each of them and a split that writes tasks hands them to `advance-task` without a person restarting it. Closing a map stays the person's decision. `MAINLINE.md` says both.

  The task and the map review tables are rewritten so a verdict is read once, top to bottom: `wrong direction` on either axis fails the record and closes it, `needs discussion` holds it open, and anything else is repaired. A failed task or map leaves nothing to inherit; if the work still matters, the person settles it in `grill` and a new record is written from that.

  `README.md`, `README.zh-CN.md`, and `resplit` now describe `whole-review` as the pass a person runs, and `setup` says eight rules in all three places it counts them.

- [#23](https://github.com/QiYueran-source/weave-your-work/pull/23) [`8c530c0`](https://github.com/QiYueran-source/weave-your-work/commit/8c530c00d3306cd4d7b80211acef14369fd1b559) Thanks [@QiYueran-source](https://github.com/QiYueran-source)! - Read, decide, and write each stay one job; a change's status and its entries are decided in two places, not one.

  `waymark/res/disposition.md` no longer says how the entries inside a record change. It decides whether a change is carried and what happens to the record's status, and names the section rule that says how the entries change. That clears the contradiction where the table said "the text, replaced" and `map/res/body.md` said a new fact adds an entry.

  `map/res/body.md` says which sections hold entries and that `Target` and `Acceptance direction` are replaced where they stand. `update` no longer restates the section rule.

  `docs/adr/0004` records why an action writes the field it judged: `split` sets `split_as` and starts the map, `fog-explore` strikes the entry it cleared, `advance-task` writes `Result`. Reading, deciding, and writing answer for one decision and cannot be checked apart.

- [#23](https://github.com/QiYueran-source/weave-your-work/pull/23) [`259efc3`](https://github.com/QiYueran-source/weave-your-work/commit/259efc3b56e02bc4afaba906e8358450a1afe3ef) Thanks [@QiYueran-source](https://github.com/QiYueran-source)! - Add `open-a-map`, the pass that opens a map, and one rule for when a map's fog is written.

  `map/open-a-map.md` settles the target through grill, surveys it once at low resolution, and writes the map with the children the survey found. `setup/start-a-project.md` ends with it, so a configured project gets a root map; `ask-me`, `salvage-and-restart`, and `map/usage.md` point at it.

  `map/body.md` now defines fog and when it is written: fog gathers toward the target, a question that can be stated now is a child, an entry is larger than a child, and a map is written with its entries or the marker. `procedure.md`, `split`, `fog-explore`, and `update` cite it instead of restating it. A map with no children can now be reviewed, so the rule that a task is preferred over an empty map has somewhere to land.

- [#23](https://github.com/QiYueran-source/weave-your-work/pull/23) [`3ced8a9`](https://github.com/QiYueran-source/weave-your-work/commit/3ced8a9f06473df9d50b37bc4aa6e2df6fb46e2e) Thanks [@QiYueran-source](https://github.com/QiYueran-source)! - Point at the record for what it holds, instead of describing it a second time.

  Seventeen skill files carried a `## Transformation` block listing what the record looks like afterwards: `open-map` named the body sections `map/res/body.md` defines, `split` named the fields `waymark/res/fields.md` lists, `open-task` named the three the task skill defines. Those blocks were a second copy of the record, written in a different file, and `docs/principle-review.md` already recorded that nothing read them.

  Each is replaced by one line saying the record now exists and pointing at the file that says what it holds. Two carried a fact found nowhere else: `open-task`'s that a task is hung under its map, and `advance-task`'s that no section the designer wrote changed. Both move into the action's own steps, where the run reads them.

- [#23](https://github.com/QiYueran-source/weave-your-work/pull/23) [`d062d6f`](https://github.com/QiYueran-source/weave-your-work/commit/d062d6ffdcad874ef97986138a705e75f17d8bda) Thanks [@QiYueran-source](https://github.com/QiYueran-source)! - Add `resplit`, and let `fog-explore` write its own landing on a childless map.

  `resplit` handles the case where a map split into tasks and one task turns out to need another's output: it cuts the layer into two child maps, one that can run now and one that waits, adds the dependency edge between them, and re-hangs the tasks. A task keeps its content, status, and review, and order between tasks becomes order between maps. `advance-task` reports the case as a layer that needs a clearer split and sends the map to `resplit`; `split` and `update` point at it for their own overlaps.

  `fog-explore` now writes a landing into a map's body itself when the map is open and has no children, and sends it through `update` only when the map is closed or has already split.

  `whole-review` reads every child against itself, its siblings, and its parent, and reports where the set does not hold together.

- [#23](https://github.com/QiYueran-source/weave-your-work/pull/23) [`80bade8`](https://github.com/QiYueran-source/weave-your-work/commit/80bade8a2f2a85a533e79471e16b9c168ab38cfc) Thanks [@QiYueran-source](https://github.com/QiYueran-source)! - Give each review axis its own verdict, add `whole-review`, and write down how a record changes.

  `task/res/review.md` and `map/res/review.md` now carry the four verdicts per axis and a table for what the pair does to the record; a closed record needs both axes to pass, and when they disagree the worse verdict decides the next step. `task-review` and `map-review` read those rules instead of restating them.

  `whole-review` is new, on the mainline between the last `task-review` and `map-review`: it reads a map's closed children as a set and writes one dated paragraph naming both sides of every contradiction it finds, then changes nothing else.

  `map/res/body.md` gives every section one rule for a change: add an entry when the old one still holds, strike it with `Superseded on <date>: <why>` when it does not. `update` follows that rule, adds work to a reopened record before splitting it, and leaves a contradictory sibling to its owner.

- [#23](https://github.com/QiYueran-source/weave-your-work/pull/23) [`d31bb3d`](https://github.com/QiYueran-source/weave-your-work/commit/d31bb3d0980561a00d9a147f39675860600f6bb7) Thanks [@QiYueran-source](https://github.com/QiYueran-source)! - Add a `waymark` skill that is the set's single field reference and query guide.

  `waymark/fields.md` now defines every field a ticket carries — the core fields, the six custom fields the tracker is configured with, and `owner` — along with where each write lands, who may run it, and the list an accepting party checks. `waymark/queries.md` holds the reads the set uses: the tree, one item, the ready and blocked lists, filtered lists, search, and the archive, with the traps each one hides.

  The old `map/frontmatter.md` and `task-design/properties.md` are gone. Each had grown the other node's fields and repeated the same write rules in its own words. Their placement content moves to `map/placement.md` and `task-design/placement.md`, which keep only where a node sits: dependency edges, soft links, the parent rule, and what a node never carries.

  `setup` declares the six fields and points here for what they mean; `ask-me` lists the skill; the setup check now requires it.

- [#23](https://github.com/QiYueran-source/weave-your-work/pull/23) [`da01281`](https://github.com/QiYueran-source/weave-your-work/commit/da01281f99b8bab9576c9ff0ff6615c96ac6c19b) Thanks [@QiYueran-source](https://github.com/QiYueran-source)! - Make `whole-review` a check a person runs, not a step of the line.

  It was model-invoked and `map-review` implied it answered first, so every closed map was expected to carry its paragraph. It is now user-invoked and off the line: a person runs it when a map's children are worth reading as a set, `map-review` judges the map with or without the paragraph, and the assertion asks only that a paragraph, when there is one, names both sides of every finding.

### Patch Changes

- [#23](https://github.com/QiYueran-source/weave-your-work/pull/23) [`b90b22c`](https://github.com/QiYueran-source/weave-your-work/commit/b90b22c927134a113cc93dc61f49f0ef5128007f) Thanks [@QiYueran-source](https://github.com/QiYueran-source)! - Make the skills agree with each other where the checks could not see.

  `split` no longer says a writer never sets a child's parent while `open-map` passes `--parent` on its own command; the step that hangs the child is named once. `map` and `open-map` name `map/res/body.md` as the one place the fog walk is written instead of restating it. `setup` copies eight rules, not seven. `check-project.md` and `install.md` stop stating how many checks are starred and leave the list to `rules-checklist.md`. `stop-and-wait` names the file its walk lives in. `ask-me` sends a fresh project to `setup` rather than to three files inside it. `map/res/body.md` states the `split_as` freeze that `ASSERTIONS.md` already indexed, and `install.md` no longer mentions a copy test that `npm test` does not run.

  The review that produced these changes, with the questions left open, is `docs/principle-review.md`.

## 0.1.1

### Patch Changes

- [#18](https://github.com/QiYueran-source/weave-your-work/pull/18) [`4248854`](https://github.com/QiYueran-source/weave-your-work/commit/4248854257072605629694943abd06fc62f05227) Thanks [@QiYueran-source](https://github.com/QiYueran-source)! - Run the setup checks from one Node script and remove the POSIX-only shell from the checklist. Fix the review findings in the setup, issue, glossary, and feedback skills.

## 0.1.0

### Minor Changes

- [#12](https://github.com/QiYueran-source/weave-your-work/pull/12) [`a4dd072`](https://github.com/QiYueran-source/weave-your-work/commit/a4dd07263a308f7186a75fa091013450f168a64e) Thanks [@QiYueran-source](https://github.com/QiYueran-source)! - Initial release: 22 agent skills for running work through maps, tasks, evidence, and reviews, installed globally with each project's data kept under `.work-weave/`.
