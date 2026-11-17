---
name: glossary
description: "Keep one vocabulary for the project: decide whether a word belongs, check it against what the project already calls things, and write it to your own source so the generated view stays whole. Use when a term is fuzzy, overloaded, or used two ways, or when a discussion settles a term."
family: method
invocation: model
---

# Glossary

A glossary keeps one name for one thing. Each operator writes only their own source file; the readable view is generated from all of them, so no two people edit the same file.

## When it runs

- A term is fuzzy, overloaded, or used two ways in one discussion.
- A word conflicts with the glossary.
- Someone asks what the project means by a term.
- A discussion settles a term. Whoever holds that term writes the entry.

A discussion decides when a term has resolved. This skill decides how it is written.

## Does this word belong?

Before adding a term, ask: is this a concept unique to this project, or a general office word? Only the first belongs.

A meeting, a report, an approval, and a deadline are general office words. They stay out even when the project talks about them every day. A word the project uses with a narrower or different meaning than the office does is where the glossary earns its place.

## The four moves

1. **Challenge the term against the glossary.** If the word in use conflicts with the recorded meaning, say so and ask which one is meant.
2. **Sharpen fuzzy language.** When a word covers two things, propose the precise term for each and pick one as canonical.
3. **Test the boundary with a concrete scenario.** Invent a case at the edge of the definition; if the term cannot decide the case, it is not sharp enough.
4. **Check the project's actual behavior, not just the word.** Read the record, the process, or the output. If the definition and what the project does disagree, say so and fix one of them.

## Read before you write

Read `GLOSSARY.md` before writing. It is generated from the sources, so merge first when it is older than them.

The view holds everything a write depends on: every term, each term's `_Avoid_` line, and the groups already in use. A word that looks new may already be listed there as a rejected name for a term someone else defined.

Three outcomes, and only three:

- **No entry.** Write it.
- **An entry with the same meaning.** Do not write a second one. Use the name that is already there.
- **An entry with a different meaning.** The word is overloaded. Do not write until the conflict is settled: say what the two meanings are, and ask which one the project means. The smaller meaning gets its own term, and the other goes under `avoid`.

A term written twice is two definitions nobody compared.

## Names and synonyms

`avoid` is written when the term is defined, not after. List the names the project should not use for this concept while the discussion is still in front of you; a word nobody recorded as rejected is a word the next person will use.

When the list has to change later, read the term's line from your own source and write it back with its `definition` unchanged. A write replaces the term, so a re-typed definition is how the earlier wording is lost.

Put a term in an existing group when one fits. A new group name is a new cluster, and it splits the view.

## Writing it

Write one line to your own source with `glossary_write`, in the shape `GLOSSARY-FORMAT.md` defines. Write it the moment it resolves, one term at a time; do not batch a discussion's terms into one write at the end.

Never write to another operator's file, and never edit `GLOSSARY.md` by hand: the next merge overwrites it.

## The tools

The MCP server and the CLI live in the project runtime at `.work-weave/runtime/glossary/`, installed by `setup`. Use `glossary_list`, `glossary_write`, and `glossary_merge` when they are running; use the CLI when they are not. The view is where the vocabulary is read; no command answers a single word.

One line is in the operator's own source file, in the shape `glossary/GLOSSARY-FORMAT.md` defines.

## What this skill does not do

- Record decisions. That is `adr`.
- Record a discussion. That is `grilling`.
- Resolve a same-name conflict between two sources.
