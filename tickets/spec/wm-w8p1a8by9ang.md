---
schema: 1
id: wm-w8p1a8by9ang
title: 'Glossary: office-ready names, pre-write lookup, per-operator sources'
category: spec
status: open
owner: frank
creator: frank
created_at: 2026-11-17T06:34:00Z
updated_at: 2026-11-17T06:34:00Z
---
## Problem Statement

The glossary in this set already solves the problem Matt's does not: each
operator writes only their own source file, and a merge builds one readable
`GLOSSARY.md` from all of them, so two people never edit the same file. What it
does not solve is the rule layer around the write.

A term written twice is two definitions nobody compared. The current skill says
to write a term the moment it resolves, one at a time, and never to edit another
operator's file. It never says to look the term up first. An operator who writes
a second definition of "客户" has broken nothing the tooling can see: the merge
takes the later line and the view shows one definition, while the sources hold
two that were never compared.

The `avoid` list is written but not read. The skill says one canonical name per
concept and lists the rejected words under `avoid`, but nothing tells a reader to
consult it, and `glossary_lookup` does not search it. So "甲方" and "客户" can both
live in a project, each in daily use, and neither the tool nor the rule notices.

The qualification test is a conclusion, not a move. "Only a term this project
coins or narrows" tells a person what the answer is, not how to reach it, so the
common case, a general office word treated as project language, goes unchecked.

Nothing says who may change the opening of the generated view. `_header.md` is
the only shared single file in an otherwise per-operator design, and every
operator needs it to describe the project, so it is the one place the pattern
fails.

## Solution

Keep the storage pattern, which is the part already better than Matt's: sources
per operator, a generated view, a hand edit of the view refused by rule. Add the
rules around the write that the pattern needs, and take from Matt the two pieces
the current skill states only as conclusions.

A term is looked up before it is written, and the rejected names are read
alongside it, because a lookup that misses them reports "new" for a word someone
else already ruled out. The qualification test becomes a question asked in the
moment. A definition changes by being written again, and the history stays in
the source file rather than in the view, as Matt's does in Git.

No part of the storage changes. This spec adds and sharpens rules, and records
two behaviours the tool already has that the rule layer must depend on.

## User Stories

1. As an operator settling a term in a discussion, I want to look it up before I
   write it, so that I do not define a word that is already defined.
2. As an operator, I want the lookup to tell me when a word I am about to use was
   already rejected for another term, so that one concept does not end up with
   two names.
3. As an operator meeting a word with two meanings, I want to be told to stop and
   ask, so that the project settles which meaning this word carries before a
   definition exists for either.
4. As a person deciding whether a word belongs in the glossary, I want to be
   asked whether it is project-specific or general office language, so that the
   glossary stays a vocabulary rather than a dictionary.
5. As an operator, I want to add a synonym to an existing term's `avoid` list in
   my own source, so that I can fix a naming gap without touching another
   person's file.
6. As an operator changing a definition, I want to write it again rather than
   edit the earlier line, so that the earlier wording stays readable in the
   source.
7. As a reader of `GLOSSARY.md`, I want one definition per term and the name of
   its source, so that I can see which operator to ask about it.
8. As a person maintaining the glossary structure, I want the opening of the view
   to be mine to change and everyone else's to leave alone, so that the one
   shared file does not become a place to argue.
9. As a person joining the project, I want the rules to name what a lookup does
   and does not find, so that I trust "not found" to mean what it says.

## Implementation Decisions

**Look up before writing.** The skill gains a section before `Writing it`. It
names three outcomes: no entry, an entry with the same meaning, an entry with a
different meaning. Same meaning means do not write a second definition; different
meaning means stop and ask which one the project means before either is written.

**The lookup's reach is stated, because the rule depends on it.**
`glossary_lookup` matches the canonical term and the part before a parenthetical
note, and it does not search `avoid` lists. The rule therefore requires reading
the `_Avoid_` line under every entry in `GLOSSARY.md` as part of the same check.
This is recorded as a fact about the tool, not a change to it: no code moves in
this spec.

**`avoid` is a lookup table.** When a word appears that an entry already rejects,
the canonical name is used instead. When a word appears that means the same thing
as an existing term and is in no `avoid` list, it is added to that term's `avoid`
list, written to the operator's own source. The glossary is where names are
settled, so a synonym used without being recorded is the gap.

**The qualification test becomes a move.** The rule keeps Matt's question: before
adding a term, ask whether it is a concept unique to this project or a general
office word. Only the first belongs. The examples are office words: a meeting, a
report, an approval, do not belong even when the project uses them daily.

**A definition changes by being written again.** No superseding, unlike ADRs.
The operator appends a line with the new text; the merge shows the term at its
latest `updated_at`; the earlier line stays in the source file. The view shows one
definition, not its history. This is the same shape as Matt updating
`GLOSSARY.md` in place, with the source file standing where his Git history does.

**A same-term conflict is not resolved by the merge.** Two operators who define
the same term differently leave the later line in the view and both lines in the
sources. The rule from the lookup is what keeps this from happening; the tool does
not act as a second safeguard. This restates the current behaviour so the rule
can depend on it.

**`_header.md` is for the maintainer.** The generated view opens with
`.work-weave/glossary/_header.md` when present, otherwise a fixed line naming the
file as generated. Changing the header is the glossary maintainer's write. It is
the one shared file in the design, so a change to it is made when nobody else is
merging, and the merge follows immediately.

**The skill text is rewritten for office work.** The four moves stay: challenge
against the glossary, sharpen fuzzy language, test the boundary with a concrete
scenario, and check the project's actual behaviour rather than the word alone.
What changes is the vocabulary the rules are written in, and the addition of the
lookup section and the synonym rule.

**No change to the tool.** `glossary.js`, `server.js`, and the MCP registration
stay as they are. The lookup's reach and the merge's conflict behaviour are
recorded as constraints the rules are written against. A later spec may widen the
lookup to search `avoid`; this one does not.

## Testing Decisions

This spec changes prose, so the tests are the existing ones plus a reading.

The existing suite under `setup/tools/glossary/tests/` is the prior art and stays
green. It builds a temporary project, writes terms through the CLI, merges, and
reads the view. It already covers the per-operator write, the merge, and the
refusal of an empty view.

What is checked by reading:

- `glossary/SKILL.md` states the lookup before the write, names its three
  outcomes, and states that the lookup does not search `avoid`.
- `glossary/SKILL.md` states the qualification question in Matt's form.
- `glossary/res/entry.md` states that a definition changes by being written
  again, that the earlier line stays in the source, and that the view shows one
  definition.
- `glossary/res/entry.md` states that `_header.md` is the maintainer's write.
- Both files name office examples where they named code ones.

## Out of Scope

- Changing `glossary.js`, `server.js`, or the MCP registration. The lookup does
  not search `avoid` after this spec; the rule works around it by reading.
- Making the merge refuse or report a same-term conflict between two operators.
- Multiple contexts and `GLOSSARY-MAP.md`. An office project is organised by the
  work it does, not by a code directory tree, so one glossary per project holds.
- Superseding a definition. ADRs supersede; terms are rewritten.
- Concurrent writes: two sessions looking a term up at the same moment and both
  writing it. The rule reduces this case; nothing closes it.
- Migrating an existing `GLOSSARY.md` that was edited by hand.
- The mainline skills, the ADR, and the retired `map` and `task` categories.

## Further Notes

The rule added here and the ADR spec's decision to skip a pre-write search look
opposite, and they are. An ADR records a decision that was already made, so a
second entry for the same subject is a duplicate a person can merge by reading.
A term defines what a word means for everyone using it, so a second entry is two
answers to one question, and the reader has no way to tell which one the project
means. The lookup belongs where the cost of the second entry is paid by the next
reader rather than by the writer.
