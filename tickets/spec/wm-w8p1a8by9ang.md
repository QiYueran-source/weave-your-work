---
schema: 1
id: wm-w8p1a8by9ang
title: 'Glossary: read the view before writing, office names, core/CLI/server split'
category: spec
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T06:34:00Z
updated_at: 2026-11-17T07:16:58Z
closed_at: 2026-11-17T07:16:58Z
---
## Problem Statement

The glossary in this set already solves the problem Matt's does not: each
operator writes only their own source file, and a merge builds one readable
`GLOSSARY.md` from all of them, so two people never edit the same file. What it
does not solve is the rule layer around the write, and its code is organised as
one file that mixes the store with the command line.

A term written twice is two definitions nobody compared. The current skill says
to write a term the moment it resolves, one at a time, and never to edit another
operator's file. It never says to read the glossary first. An operator who writes
a second definition of "客户" has broken nothing the tooling can see: the merge
takes the later line, the view shows one definition, and the sources hold two
that were never compared.

The `avoid` list is written but never read. The skill says one canonical name per
concept and lists the rejected words under `avoid`, but no rule tells a reader to
use them, and the lookup searches the term alone. So "甲方" and "客户" both stay in
daily use, and an operator who looks "甲方" up is told it is not there, which reads
as permission to define it.

Group names are free text with no rule. The merge keys on the exact string, so
two operators who file the same cluster under different names split the view into
two sections that never rejoin.

Nothing says who may change the opening of the generated view. `_header.md` is
the only shared single file in an otherwise per-operator design, and it is the
one place the pattern fails.

The code repeats what the ADR tool now separates. One file holds the source
reader, the merge, the write, the argument parser, and the command dispatch, so a
reader looking for the store finds a CLI and a reader looking for the CLI finds
the store. The tests import that file to reach internal functions, which couples
them to the layout.

## Solution

Keep the storage pattern, which is the part already better than Matt's: sources
per operator, a generated view, hand edits of the view refused by rule. Add the
rules around the write that the pattern needs. Split the code into a store, a
command line, and an MCP server, matching the ADR tool, without changing what any
command does.

The control on writing a term is reading the view. `GLOSSARY.md` already holds
every term, every rejected name, and every group in use, so one read answers the
three questions a write depends on. The lookup command goes, because it answered
those questions worse: it reported a rejected name as not found.

A definition changes by being written again, and the history stays in the source
file rather than in the view, as Matt's does in Git.

No behaviour changes. The same four commands keep their names and output, the
same four MCP tools keep their arguments, and the only new behaviour is the order
of terms inside a group in the view.

## User Stories

1. As an operator settling a term in a discussion, I want to read the glossary
   before I write, so that I do not define a word that is already defined.
2. As an operator, I want the rejected names of every term to be in the form I
   already read, so that one concept does not end up with two names.
3. As an operator meeting a word with two meanings, I want to be told to stop and
   ask, so that the project settles which meaning this word carries before a
   definition exists for either.
4. As a person deciding whether a word belongs in the glossary, I want to be
   asked whether it is project-specific or general office language, so that the
   glossary stays a vocabulary rather than a dictionary.
5. As an operator defining a term, I want to record its rejected names at the
   moment I define it, so that the judgement happens while the discussion is in
   front of me.
6. As an operator whose rejected-name list has to change later, I want to rewrite
   the term with its definition copied unchanged, so that I do not lose the
   wording.
7. As an operator adding a term, I want to see which groups are already in use, so
   that I file it under one that exists rather than creating a second name for the
   same cluster.
8. As an operator changing a definition, I want to write it again rather than
   edit the earlier line, so that the earlier wording stays readable in the
   source.
9. As a reader of `GLOSSARY.md`, I want one definition per term and the name of
   its source, so that I know which operator to ask about it.
10. As a reader of `GLOSSARY.md`, I want the most recently settled terms first
    inside a group, so that I can see what the project has been working on.
11. As a person maintaining the glossary structure, I want the opening of the
    view to be mine to change and everyone else's to leave alone, so that the one
    shared file does not become a place to argue.
12. As a person joining the project, I want one place to read the vocabulary, so
    that I do not have to learn which of several commands answers which part.
13. As a maintainer of this set, I want the store, the command line, and the MCP
    server in separate files, so that I can change one without reading the other.
14. As a maintainer, I want the command line and the MCP server to be thin
    wrappers over the same store, so that a change to a rule is one change.
15. As a maintainer, I want the tests to reach the store directly, so that they
    stop depending on what the command line happens to re-export.
16. As an operator, I want the three commands that remain to keep their arguments,
    so that the writes and merges I already run keep working.

## Implementation Decisions

**The control is a read of the view.** The skill gains a section before
`Writing it`. It says to read `GLOSSARY.md`, merging first when the view is older
than the sources, and it says what the view holds: every term, each term's
`_Avoid_` line, and the groups in use. It names three outcomes: no entry, an entry
with the same meaning, an entry with a different meaning. Same meaning means do
not write a second definition; different meaning means stop and ask which one the
project means before either is written.

**`lookup` is removed.** The command and the `glossary_lookup` tool both go, and
the exact-match search they shared goes with them. The view already holds every
fact a lookup could return, and a lookup that reported "not found" for a rejected
name was worse than no lookup: it answered a question the view answers correctly.
What remains is reading the view and writing.

**`avoid` is recorded when the term is defined.** The rule says to write the
rejected names while the discussion is in front of you, not after. When the list
has to change later, the term's line is read from the operator's own source and
written back with its `definition` unchanged, because a write replaces the term
and a re-typed definition is how the earlier wording is lost.

**Groups are named from the view.** The rule says to put a term in an existing
group when one fits, and that a new group name is a new cluster which splits the
view.

**The qualification test becomes a question.** The rule keeps Matt's move: before
adding a term, ask whether it is a concept unique to this project or a general
office word. Only the first belongs. A meeting, a report, and an approval do not,
even when the project uses them daily.

**A definition changes by being written again.** No superseding, unlike ADRs. The
operator appends a line with the new text; the merge shows the term at its latest
`updated_at`; the earlier line stays in the source file. The view shows one
definition, not its history.

**A same-term conflict is not resolved by the merge.** Two operators who define
the same term differently leave the later line in the view and both lines in the
sources. The rule from the read is what keeps this from happening; the merge does
not act as a second safeguard. This restates current behaviour so the rule can
depend on it.

**`_header.md` is for the maintainer.** The view opens with
`.work-weave/glossary/_header.md` when present, otherwise a fixed line naming the
file as generated. Changing it is the glossary maintainer's write, made when
nobody else is merging, followed immediately by a merge.

**The code splits into three files, as the ADR tool does.** One file holds the
store: the project root resolver, the operator reader, the source-file reader,
the merge, the write, and the view builder. One is the command line: argument
parsing and dispatch over the store. One is the MCP server: tool definitions over
the same store. The project root resolver stays shared as it is today.

**Three commands remain.** `list`, `write`, and `merge` keep their names, their
arguments, and their output. `glossary_list`, `glossary_write`, and
`glossary_merge` keep their arguments. The store's exports change shape; what a
person or an agent runs does not, except that `lookup` is gone.

**No validation is added to the write.** A definition longer than two sentences
is refused by rule, not by the tool, because a term that needs a third sentence
is a judgement the writer makes and a hard refusal makes them cut the sentence
short. A definition that looks too long is a review finding.

**Terms inside a group are ordered by `updated_at`, newest first.** This is the
one behaviour that changes. The groups themselves keep the order they are
discovered in. A reader sees what the project has settled most recently at the
top of each section.

**The tests move to the store.** They import the store rather than the command
line, and they keep reaching it through the command line where they already do,
because the command line is the seam they were written against.

## Testing Decisions

Tests assert what an operator or a reader observes. The existing suite is the
prior art: it builds a temporary project, writes terms through the command line,
merges, and reads the view.

One seam. The command line and the view. The suite already uses it and the
refactor keeps it, because the three remaining commands keep their arguments.

The test to add: terms inside one group render with the most recently written
first, asserted on the view the merge writes rather than on a sort function.

Tests that must keep passing: the per-operator write, the merge across sources,
the refusal of an empty view, the header read, the root resolution, the two-roots
isolation, and the run from a `type=module` runtime.

Two setup changes, neither of which changes what a test asserts. The suite imports
the store instead of the command line. The `type=module` test copies the store
beside the command line it already copies.

## Out of Scope

- Any lookup at all. The view is the only place the vocabulary is read.
- Refusing a definition by length, by a rejected name equal to the term, or by any
  other content check.
- Making the merge refuse or report a same-term conflict between two operators.
- Superseding a definition. ADRs supersede; terms are rewritten.
- Multiple contexts and `GLOSSARY-MAP.md`. An office project is organised by the
  work it does, not by a code directory tree.
- Concurrent writes: two sessions reading the view and writing the same term. The
  rule reduces this case; nothing closes it.
- Showing a per-term timestamp in the view beyond the ordering it now drives.
- Migrating an existing `GLOSSARY.md` that was edited by hand.
- The mainline skills, the ADR, and the setup install steps.

## Further Notes

The spec went through three shapes of the same control. It first made the lookup
search `avoid`; reading the code showed the view already carries every fact a
lookup would be asked about, so the control became one read instead of a search
plus a read. The lookup then survived as a convenience for a writer who wanted one
term without reading a long view. It was removed last: a command that answers
"not found" for a name the view lists as rejected is worse than no command, because
a reader treats the answer as complete.

The split into three files follows the ADR tool, which reached the same shape for
the same reason: the store is what a rule is written against, and a rule written
against a file that also parses arguments is a rule that changes when the
arguments do.

## Shipped

All six tickets under this spec are closed. The store, command line, and MCP
server are split; the lookup is gone; terms inside a group render newest first;
the ordering has a test; and both the skill and its definition file carry the
rules the spec settled.

The suite reports twelve tests, zero failures. An end-to-end run in a fresh
project writes a term, merges, and reads the expected view.
