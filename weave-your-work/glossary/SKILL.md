---
name: glossary
description: >-
  Keep one vocabulary for the project: look up a term, sharpen a fuzzy word into
  a canonical one, and write it to your own JSONL source so the generated
  GLOSSARY.md view stays whole.
---

# Glossary

A glossary keeps one name for one thing. Each operator writes only their own source file; the readable view is generated from all of them, so no two people edit the same file.

## When to use it

- A term is fuzzy, overloaded, or used two ways in one discussion.
- A word conflicts with the glossary.
- Someone asks what the project means by a term.
- A grill settles a term.

A grill decides when a term has resolved. This skill decides how it is written.

## The four moves

1. **Challenge the term against the glossary.** If the word in use conflicts with the recorded meaning, say so and ask which one is meant.
2. **Sharpen fuzzy language.** When a word covers two things, propose the precise term for each and pick one as canonical.
3. **Test the boundary with a concrete scenario.** Invent a case at the edge of the definition; if the term cannot decide the case, it is not sharp enough.
4. **Check the project's actual behavior, not just the word.** Read the ticket, the process, or the output. If the recorded definition and what the project does disagree, say so and fix one of them; searching for the word is not enough.

## Writing a term

Write one JSONL line to your own source with `glossary_write`:

```json
{"term":"map","definition":"A target node that answers what is wanted.","avoid":["goal","project"],"group":"target tree","created_at":"2026-11-08T10:00:00Z","updated_at":"2026-11-08T10:00:00Z"}
```

- `term` is the canonical name.
- `definition` says what it is, in one or two sentences.
- `avoid` lists the words that mean the same thing but should not be used.
- `group` is optional; use it when terms cluster.
- `created_at` and `updated_at` are ISO 8601 timestamps.

Write the term the moment it resolves, one term at a time. Do not batch a discussion's terms into one write at the end.

The source is `.work-weave/glossary/<operator>.jsonl`. Never write to another operator's file.

## Reading a term

`glossary_lookup` returns one term with its definition, avoid list, group, and source. `glossary_list` returns the terms. Read the generated view when you need the whole vocabulary at once.

## Running the tools

The MCP server and the CLI live in the project runtime at `.work-weave/runtime/glossary/`. `bundle/setup.md` copies the tools there and installs their dependencies; `usage.md` has the CLI commands, the stdio config shape, and troubleshooting. Read it when the tools are not running or when you need the CLI instead of the MCP.

## The generated view

`GLOSSARY.md` at the project root is generated from `.work-weave/glossary/*.jsonl`. Never edit it by hand; the next merge overwrites it. Rebuild it with `glossary_merge`, or let the post-merge hook do it after a pull.

The merge reads every source, keeps the latest `updated_at` for each term, and writes the view with a `_Source_` line per term. Same-name conflicts are not resolved in this version.

## The rules file

The rule at `bundle/rules/rules-glossary.md` carries the writing constraints and is installed under `.agents/rules/rules-glossary.md` by setup. Read it before writing a term; it holds the conventions this file does not repeat.

## What it does not do

- Record decisions. That is the `adr` skill.
- Record a discussion. That is the grill's testimony.
- Resolve a same-name conflict.
- Edit another operator's source or `GLOSSARY.md` by hand.
