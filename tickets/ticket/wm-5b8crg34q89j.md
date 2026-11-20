---
schema: 1
id: wm-5b8crg34q89j
title: Rewrite glossary SKILL.md for office work
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T07:06:51Z
updated_at: 2026-11-17T07:16:42Z
closed_at: 2026-11-17T07:16:42Z
parent: wm-w8p1a8by9ang
---
## Action

Rewrite `glossary/SKILL.md` so its rules are the ones the spec settles, in the words an office project uses.

Add a section before the writing step: read `GLOSSARY.md` before writing, merging first when the view is older than the sources, and what the view holds. Name the three outcomes of that read: no entry, an entry with the same meaning, an entry with a different meaning. Same meaning means do not write a second definition; different meaning means stop and ask which one the project means.

Add the rule that `avoid` is written when the term is defined, not after. When the list changes later, the term's line is read from the operator's own source and written back with its `definition` unchanged.

Add the rule that a term goes into an existing group when one fits, and that a new group name splits the view.

Change the qualification test from a conclusion to a question: before adding a term, ask whether it is a concept unique to this project or a general office word. A meeting, a report, and an approval do not belong even when the project uses them daily.

Remove the reference to `lookup`. It no longer exists.

Keep the four moves that are already there: challenge against the glossary, sharpen fuzzy language, test the boundary with a concrete scenario, check the project's actual behaviour rather than the word alone.

## Acceptance signal

A reader of `SKILL.md` alone can answer all of these without opening another file:

- whether to write a new term (the read comes first, with its three outcomes)
- when to record the rejected names (at definition, rewritten from the source later)
- which group to use (an existing one from the view)
- whether a word belongs at all (the question, not the conclusion)
- what to do when a word has two meanings (stop and ask)

And no sentence in the file names `lookup`, which no longer runs.

## Result

Done. `glossary/SKILL.md` was rewritten.

The file gained a `Does this word belong?` section that asks the qualification question instead of stating the conclusion, a `Read before you write` section that names the merge, the three facts the view carries, and the three outcomes of the read, and a `Names and synonyms` section that records `avoid` at definition time, says how to change it later, and files a term under an existing group.

The four moves stayed. The `glossary_lookup` reference was removed: the tools section now names `glossary_list`, `glossary_write`, and `glossary_merge`, and says the view is where the vocabulary is read.

Checked against the five questions in the acceptance signal: each is answered by a section of this file alone.
