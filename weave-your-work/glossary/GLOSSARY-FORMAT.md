# Glossary entry

One term, in one operator's own source file; the readable view is generated.

## The entry

One JSONL line in `.work-weave/shared/glossary/<operator>.jsonl`:

```json
{"term":"map","definition":"A target node that answers what is wanted.","avoid":["goal","project"],"group":"target tree","created_at":"2026-11-08T10:00:00Z","updated_at":"2026-11-08T10:00:00Z"}
```

- `term` — the canonical name.
- `definition` — what it is, in one or two sentences. Not what it does.
- `avoid` — the words that mean the same thing and should not be used.
- `group` — only when terms cluster.
- `created_at`, `updated_at` — ISO 8601.

## What belongs

Only a term this project coins or narrows. General vocabulary stays out. A definition that needs a command, a path, or more than two sentences is a spec; it belongs in a record, not here.

One canonical name per concept. When two names exist, pick one and list the other under `avoid`.

## Changing a definition

A definition changes by being written again. The operator appends a line with the new text; the merge shows the term at its latest `updated_at`; the earlier line stays in the source file. The view shows one definition, not its history.

There is no superseding, unlike an ADR. A term defines what a word means now, and a reader who needs the earlier wording opens the source file or the repository's history behind it. This is the same shape as editing `GLOSSARY.md` in place, with the source file standing where the edit history would.

A write replaces the whole term, so the definition in the new line is the definition that survives. When only `avoid` or `group` changes, copy the `definition` from the source unchanged.

## The view

`GLOSSARY.md` at the project root is generated from every source and is never edited by hand; the next merge overwrites it. The merge keeps the latest `updated_at` for each term and writes a `_Source_` line per term. Inside a group, terms render newest first.

Two operators who define the same term differently leave the later line in the view and both lines in the sources; the merge does not report it. What keeps this from happening is the read that comes before the write, in `SKILL.md`: the view already carries every term and every rejected name.

## The header

The view opens with `.work-weave/shared/glossary/_header.md` when present, otherwise a fixed line naming the file as generated.

Changing the header is the glossary maintainer's write. It is the one shared single file in an otherwise per-operator design, so a change to it is made when nobody else is merging, followed immediately by a merge.

## Assertions

- An entry without `term` or `definition`. [check-records]
- A definition over two sentences, or one containing a command or a path. [review]
- A hand edit to `GLOSSARY.md`. [check-records]
- A write to another operator's source file. [review]
- A changed `avoid` or `group` whose line carries a re-typed `definition`. [review]
