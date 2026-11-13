---
name: glossary
description: "Keep one vocabulary for the project: look a term up, sharpen a fuzzy word into a canonical one, and write it to your own source file so the generated view stays whole. Use when a term is fuzzy or overloaded, when a word conflicts with the glossary, or when a discussion settles a term."
family: method
invocation: model
---

# Glossary

A glossary keeps one name for one thing. Each operator writes only their own source file; the readable view is generated from all of them, so no two people edit the same file.

## When it runs

- A term is fuzzy, overloaded, or used two ways in one discussion.
- A word conflicts with the glossary.
- Someone asks what the project means by a term.
- A discussion settles a term, and it reaches the checkpoint the `mainline` skill names for it. Whoever holds that term writes the entry; the table is a list of what a step leaves behind, not a call.

A discussion decides when a term has resolved. This skill decides how it is written.

## The four moves

1. **Challenge the term against the glossary.** If the word in use conflicts with the recorded meaning, say so and ask which one is meant.
2. **Sharpen fuzzy language.** When a word covers two things, propose the precise term for each and pick one as canonical.
3. **Test the boundary with a concrete scenario.** Invent a case at the edge of the definition; if the term cannot decide the case, it is not sharp enough.
4. **Check the project's actual behavior, not just the word.** Read the record, the process, or the output. If the definition and what the project does disagree, say so and fix one of them.

## Writing it

Write one line to your own source with `glossary_write`, in the shape `res/entry.md` defines. Write it the moment it resolves, one term at a time; do not batch a discussion's terms into one write at the end.

Never write to another operator's file, and never edit `GLOSSARY.md` by hand: the next merge overwrites it.

## The tools

The MCP server and the CLI live in the project runtime at `.work-weave/runtime/glossary/`, installed by `setup`. Use `glossary_lookup`, `glossary_list`, `glossary_write`, and `glossary_merge` when they are running; use the CLI when they are not.

One line is in the operator's own source file, in the shape `glossary/res/entry.md` defines.

## What this skill does not do

- Record decisions. That is `adr`.
- Record a discussion. That is `grill`.
- Resolve a same-name conflict between two sources.
