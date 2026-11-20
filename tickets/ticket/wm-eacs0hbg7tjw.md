---
schema: 1
id: wm-eacs0hbg7tjw
title: 'Rewrite the glossary definition file: changing a definition and the header'
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

Add two sections to `glossary/GLOSSARY-FORMAT.md`, and correct the one that states what the merge does with two definitions of the same term.

**Changing a definition.** A definition changes by being written again. The operator appends a line with the new text; the merge shows the term at its latest `updated_at`; the earlier line stays in the source file. The view shows one definition, not its history. No superseding, unlike ADRs. This is the same shape as Matt updating `GLOSSARY.md` in place, with the source file standing where his Git history does.

**The header.** The view opens with `.work-weave/glossary/_header.md` when present, otherwise a fixed line naming the file as generated. Changing the header is the glossary maintainer's write. It is the one shared single file in the design, so a change to it is made when nobody else is merging, followed immediately by a merge.

**The view section.** It currently says the merge keeps the latest `updated_at` and that same-name conflicts are not resolved. Keep both facts and add what keeps the conflict from happening: the read before the write. Also record that terms inside a group render newest first.

## Acceptance signal

A reader of `entry.md` alone can answer:

- what happens to the earlier wording when a definition changes (it stays in the source; the view shows one)
- who may change the header (the maintainer, alone, merge after)
- what the view does when two operators define the same term (later line wins, both lines stay)
- what keeps two definitions from being written in the first place (the read before the write, named in `SKILL.md`)
- what order terms appear in inside a group (newest first)

## Result

Done. `glossary/GLOSSARY-FORMAT.md` was rewritten.

Two sections were added: `Changing a definition`, which records that a definition changes by being written again with the earlier line staying in the source and no superseding, and `The header`, which records that `_header.md` is the maintainer's write made with nobody else merging.

`The view` now records the ordering (newest first inside a group), the behaviour on two definitions of one term (later line wins, both lines stay), and what keeps that from happening (the read in `SKILL.md`).

One assertion was added: a changed `avoid` or `group` whose line carries a re-typed `definition`.

Checked against the five questions in the acceptance signal: each is answered by this file, or by the named section in `SKILL.md`.
