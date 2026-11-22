---
schema: 1
id: wm-14axybwpn8xa
title: 'Grilling: keep Matt''s rounds, add a testimony and a source order'
category: spec
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T07:23:06Z
updated_at: 2026-11-21T06:23:25Z
closed_at: 2026-11-21T06:23:25Z
---
# Grilling

## Problem Statement

The mainline needs a discussion skill that carries Matt's interview method, but
that method assumes the discussion leaves no record. In real work a decision is
revisited weeks later by someone who was not in the room, and a conversation
that exists only in a chat log cannot be read back. The discussion also assumes
facts live in a repository; in real work roughly half of them live in an email,
a purchase order, or someone's memory, and the skill says nothing about reaching
those sources or about what to do when two of them disagree.

## Solution

A discussion skill that keeps Matt's rounds and frontier unchanged, and adds two
things: a testimony written as the discussion happens, and an order in which
facts are found. The testimony records each round with a parent question, so the
design tree is reconstructed from the rounds rather than kept as a second
structure. Facts are searched for in a fixed order, starting with the project
itself, and any disagreement between sources is surfaced to the person rather
than silently resolved.

## User Stories

1. As a person settling a plan, I want the discussion to ask the whole frontier in one round, so that I am not answering one question at a time.
2. As a person settling a plan, I want each question to carry a recommended answer, so that a yes is enough when I agree.
3. As a person settling a plan, I want to see later questions only after their prerequisites are answered, so that I never guess at an answer I have not given.
4. As a person settling a plan, I want a fact looked up rather than asked of me, so that I spend my attention on decisions.
5. As a person settling a plan, I want the lookup to start in the project's own records, so that I am not asked what the project already says.
6. As a person settling a plan, I want the lookup to reach outside the project with the tools the project has, so that an email or a purchase order is found without me relaying it.
7. As a person settling a plan, I want a disagreement between two sources put to me, so that I decide which one holds.
8. As a person settling a plan, I want the discussion to say when it has no tool for a source, so that I know why a fact was asked of me.
9. As a person returning to a decision weeks later, I want a testimony that records the rounds, so that I can read how the decision was reached.
10. As a person returning to a decision weeks later, I want each settled decision to name the question it came from, so that I can trace it back.
11. As a person returning to a decision weeks later, I want the questions that were still open when the discussion closed, so that I know what was left unresolved.
12. As a person returning to a decision weeks later, I want the work the discussion handed off, so that I know what it produced besides decisions.
13. As a person reading a testimony, I want the design tree to come out of the rounds, so that I do not read two structures that disagree.
14. As a person reading a testimony, I want the body written as the discussion moves, so that an interrupted discussion still leaves what it reached.
15. As a project owner, I want a discussion to produce a testimony and nothing else, so that terms and decisions are written by the skills that own them.
16. As a project owner, I want the testimony to name the record the discussion serves, so that a later reader knows why it exists.
17. As a project owner, I want the testimony to be a record rather than a work item, so that no one accepts it as done.
18. As a person in a discussion that settles nothing, I want a testimony that says why, so that the discussion is not repeated from the start.
19. As a person interrupting a discussion after one round, I want the first round already written, so that the next session resumes from it.
20. As a person working a long plan over several sessions, I want the testimony to survive between them, so that the tree is not rebuilt from memory.

## Implementation Decisions

- The skill keeps Matt's rounds, frontier, recommended answers, and the rule that a question depending on an open question belongs to a later round. Its wording is reused rather than rewritten.
- The format example stays as Matt wrote it, with its numbering and markers. It is a presentation, and it works.
- The design tree is not recorded as its own structure. Each question in the testimony carries a parent question id, and the tree is reconstructed from those ids.
- The testimony is created with `waymark create --category testimony` once the subject can be named in one sentence, which is after the first round is planned and before the first answer is recorded.
- The testimony body is written as each round happens, never batched to the end.
- The body has six sections: `Subject`, `Rounds`, `Settled`, `Open`, `Handed off`. `Settled` carries one line per decision with the question id it came from and the record it lands in.
- The subject names the record the discussion serves when there is one, and states only what is being decided when there is not.
- Facts are found in a fixed order: the project's records, documents, glossary and ADRs first; then outside the project through the MCP servers and web tools the project provides; then the person.
- The lookup is dispatched to a sub-agent with a fresh context window, so a running lookup blocks only the questions downstream of it.
- Whether a source outside the project can be reached is not decided by this skill. It depends on the tools the project provides, and the agent judges it.
- A source that answers partly, or two sources that disagree, is not an answer: the disagreement is stated to the person with the round's questions.
- The skill writes the testimony and nothing else. Terms go to the glossary and decisions to ADR, run by the caller.
- The skill is model-invoked. Nothing in it decides how many discussions a project holds.

## Testing Decisions

What makes a test here: a conversation the skill runs, read back against what it wrote. The external behaviour is the testimony, not the questions.

- A run that settles a term and a decision yields a testimony whose `Settled` section names both, each with its question id and its landing record.
- A run whose second-round question depends on an unanswered first-round question asks it in a later round, and the testimony records the dependency as the parent id.
- A run that finds a fact in the project's records asks the person nothing about it.
- A run whose two sources disagree puts both readings to the person and records the disagreement; the settled line appears only after the person picks one.
- A run interrupted after one round has the first round in the testimony and a closed testimony that says so.
- A testimony whose round has a question and no answer, while closed, is a finding.
- A testimony carrying a map or task field is a finding.

Prior art: the testimony format and its four assertions are the ones the set shipped before v2. The acceptance signal shape is the one a task carries.

## Out of Scope

- Renaming `to-spec`, or changing what a spec is. The mainline's second step is untouched by this spec.
- The parent or link relation between a testimony and the spec a later step writes. It is not settled, and this skill does not need it: the subject names the record the discussion serves.
- The glossary and ADR skills. Other work owns them; this skill marks in the testimony where a term or decision must land, and writes neither.
- Deciding which tools a project provides. The skill states the order of sources and leaves reachability to the agent.
- Rewriting the round format or the frontier rules.

## Further Notes

Matt's `grilling` is one of the six skills imported verbatim from commit `5863806`. The testimony and the source order are the two additions; everything else is his text.

The emoji round format was kept after review: it is a presentation, and changing it buys nothing.

The sub-agent dispatch was kept on the same grounds: it is the harness's own capability, and dropping it would remove parallelism the discussion already relies on.
