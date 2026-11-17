# Glossary entry

One term, in one operator's own source file; the readable view is generated.

## The entry

One JSONL line in `.work-weave/glossary/<operator>.jsonl`:

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

## The view

`GLOSSARY.md` at the project root is generated from every source and is never edited by hand; the next merge overwrites it. The merge keeps the latest `updated_at` for each term and writes a `_Source_` line per term. Same-name conflicts are not resolved.

## Assertions

- An entry without `term` or `definition`. [check-records]
- A definition over two sentences, or one containing a command or a path. [review]
- A hand edit to `GLOSSARY.md`. [check-records]
- A write to another operator's source file. [review]
