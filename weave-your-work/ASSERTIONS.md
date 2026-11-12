# Assertions

Every rule this set states about a record is an assertion: one line, decidable, with the check that decides it named beside it. This file indexes them by the check, so a change to a rule is one edit here and one in the resource or action that states it.

Three kinds of check:

| Tag | Decided by | Where |
|---|---|---|
| [waymark] | the tracker itself; it refuses the write | `waymark` CLI |
| [check-records] | a script over the project's tickets | `scripts/check-records.mjs` |
| [review] | a person, at the review of the record | `task-review`, `map-review` |

## Fields

- A custom field the config does not declare is refused. [waymark]
- A status outside the three live values is refused. [waymark]
- A custom value outside the table in `waymark/res/fields.md`. [review]
- `needs_human` absent on a task. [check-records]

## Relations

- More than one parent, or a parent that is gone. [waymark]
- A task whose parent is not a map. [check-records]
- A dependency edge between a parent and its child. [check-records]
- A dependency edge on a task. [check-records]
- A dependency cycle, or a direction where the blocker needs the waiter. [review]

## Map

- `Target` or `Acceptance direction` missing. [check-records]
- `Target` without its `Why:` line. [check-records]
- `Target` without its `Why:` line. [check-records]
- `Acceptance direction` without a `Review point:` line. [check-records]
- A body listing its children. [check-records]
- `Not yet specified` missing. [check-records]
- A fog entry without its second line. [check-records]
- A resolved entry not struck, or a struck entry without `Resolved on <date>`. [check-records]
- `split_as` changed after children exist. [check-records]
- A closed map without `## Review`, or with a non-passing verdict. [check-records]
- A decision bullet with no source. [review]
- A map whose `Not yet specified` was never walked: every part of its target is already a child, a decision, or an exclusion, and no entry was ever struck. [review]
- A `Review` that merges the two axes into one verdict. [review]

## Task

- `Action` or `Acceptance signal` missing. [check-records]
- `task_kind`, `reversibility`, or `needs_human` missing or outside its values. [check-records]
- A `one_way` delivery without `Failure recovery`, or a probe without `Next step`. [check-records]
- A closed task with no `Result`. [check-records]
- `outcome=failed` with a verdict other than `wrong direction`. [check-records]
- An `Acceptance signal` that names no evidence, or two readings of it disagree. [review]
- A `Result` claiming a deliverable that cannot be found. [review]

## Testimony

- No `Subject`. [check-records]
- A map or task field on a testimony. [check-records]
- A settled line with no destination. [review]
- A closed testimony with a round that records a question and no answer. [review]

## Other records

- An entry without `term` or `definition`. [check-records]
- A definition over two sentences, or one holding a command or a path. [review]
- A hand edit to `GLOSSARY.md`. [check-records]
- A handoff document inside the workspace. [review]
- A secret or another person's data in a handoff. [review]
- A queue line that is not one JSON object per line. [check-records]
- An ADR that skips or repeats a number. [check-records]
- A new ADR that edits an old one instead of superseding it. [review]
- A patrol finding that names one side only, or a class outside the six. [review]

## The set itself

- A skill file linking into another skill's folder. `[check-references]`
- A resource naming a skill. `[check-references]`
- A skill missing `family` or `invocation`, or a value outside the allowed set. `[check-references]`
- A skill the router does not name, or a name in the router that is not a skill. `[check-references]`
- A mainline action missing from `MAINLINE.md`. `[check-references]`

## Running them

```sh
node scripts/check-records.mjs .        # tickets
node scripts/check-references.mjs .     # skills, resources, router
node weave-your-work/setup/tools/check-setup.mjs --all   # the project's configuration
```

The three are independent. A failure in the first two is a finding in the set or in a record; a failure in the third is a project that is not configured.
