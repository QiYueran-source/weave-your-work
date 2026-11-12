---
"weave-your-work": major
---

Reorganise the set around records and actions, and shrink what each one states.

A record is now defined once, under the record's own skill in `res/`: `map/res/`, `task/res/`, `grill/res/` (a testimony), `adr/res/`, `glossary/res/`, `issue/res/`, `handoff/res/`, `stop-and-wait/res/`, and `waymark/res/` for what every record shares (fields, relations, categories, change dispositions). A resource states what a record must contain and the assertions that decide it; it never holds a step procedure.

The actions are grouped by the mainline in `MAINLINE.md`: `split`, `fog-explore`, `advance-task`, `task-review`, `map-review`. Everything else is auxiliary: `open-map`, `update`, `grill`, `adr`, `glossary`, `issue`, `handoff`, `wait-what`, `stop-and-wait`, `salvage-and-restart`, `feedback-me-please`, `setup`.

Every rule is an assertion with the check that decides it, indexed in `ASSERTIONS.md`: the tracker refuses it (`[waymark]`), a script over the tickets decides it (`[check-records]`), or a reviewer does (`[review]`). Two scripts enforce them: `scripts/check-records.mjs` (with a baseline for records written before an assertion existed) and `scripts/check-references.mjs` (no cross-skill path links; the router names every skill; the mainline names its actions; resources hold no procedure).

The install parts move out of the skills and under `setup/`: seven rules in `setup/rules/`, the setup tools in `setup/tools/`, and install guides in `setup/install.md`, `setup/install-glossary.md`, `setup/install-issue.md`. No other skill carries a `bundle/`.

Removed: `execute-one-task` and `execute-all` fold into `advance-task`; `task-design` and the `map` entry fold into the record references and `open-map`; `task` is now the task record reference rather than an entry that routes. The set still has 22 skills.
