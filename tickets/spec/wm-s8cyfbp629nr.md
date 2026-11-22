---
schema: 1
id: wm-s8cyfbp629nr
title: Add a router and an upstream feedback path to the set
category: spec
status: closed
owner: frank
creator: frank
created_at: 2026-11-20T13:40:14Z
updated_at: 2026-11-21T06:23:25Z
closed_at: 2026-11-21T06:23:25Z
---
## Problem Statement

Two situations have no skill to open.

A person holding the set does not remember which of its twelve skills fits the
situation in front of them. The README lists the mainline and the supporting
skills, but it is written to explain the set, not to place a person on it: it
answers "what is in the set", not "I have an idea and half a day, where do I
start". Nothing in the set answers the second question. A person who guesses
wrong runs a skill whose inputs they do not have, and finds out partway through.

A person who uses the set has no way to report how it went back to its author. A
step that cannot be followed, a command that fails, a rule that contradicts
another: each of those is found only by someone using the skill, and the finding
dies with the session that made it. A skill that worked better than expected
teaches the author which path to keep, and that also dies in the session. The
set is published for other people to use, and it has no channel for them to say
what happened.

Both skills existed before 2.0.0: `ask-me` was a router and
`feedback-me-please` sent a report upstream, and the 2.0.0 rebuild left both out.
The rebuild removed `ask-me` because it restated the set a second time beside
the skills it described. That objection stands, and it is answered by a router
that holds only the routes and reads each skill's own file before saying what it
does, not by leaving the question unanswered.

## Solution

Two user-invoked skills, added beside the twelve.

**`ask-me`** takes a description of the situation and names the skill, or the
sequence of skills, that fits, plus where the person's decisions sit in that
sequence. It recommends, then stops. It does not run the skill it names, write a
record, or open a file other than the skill files it reads to check what it is
about to say.

**`feed-me-back`** sends one report upstream to
`QiYueran-source/weave-your-work`: a bug, or a good word about a skill. It
checks the account, searches for a duplicate, drafts the issue in the
conversation, and sends it only after the person approves the actual text. When
the repository is not starred, it offers the star as its own question.

The README gains both skills in its table and names them as the two ways to get
into the set and out of it; the changelog records them as added.

## User Stories

1. As a person new to the set, I want to describe what I am trying to do and be
   told which skill to open, so that I do not have to read twelve skill files
   before I can start.
2. As a person with an idea and no working directory, I want the router to place
   me at the head of the mainline, so that I begin where the set expects to
   begin.
3. As a person working on a project without `setup` run in it, I want the router
   to name `setup` first, so that I do not run a skill whose runtime is missing.
4. As a person whose discussion has not produced a spec, I want the router to
   name `grilling` or `grill-with-docs` before `to-spec`, so that I do not hand
   `to-spec` an idea it is told not to interview.
5. As a person holding a settled spec, I want the router to choose between
   `implement` and `implement-spec`, so that I do not pick the whole-spec run
   for a one-ticket change.
6. As a person who has just finished a ticket, I want the router to name
   `review`, so that the result is judged against its acceptance.
7. As a person whose ticket is a person's to do, I want the router to name
   `hand-back`, so that the ticket is closed the way the set closes it.
8. As a person who needs another owner to answer something, I want the router to
   name `communicate-with-issue` and where its decision sits, so that I do not
   ask the agent to guess a login.
9. As a person who is not sure whether a term or a decision belongs in the
   records, I want the router to name `glossary` or `adr` with the gate that
   decides it, so that I record it or drop it on purpose.
10. As a person who has picked a skill already, I want the router to say it has
    nothing useful to add, so that it does not become a step I wait through.
11. As a person reading the router's answer, I want each claim about a skill to
    come from that skill's file, so that the answer cannot drift from the skill
    it describes.
12. As a person sending feedback, I want it to check for a duplicate first, so
    that I do not open a second issue for a symptom already reported.
13. As a person sending feedback, I want to see the exact text, label, and
    command before it is sent, so that I know what will carry my account's name.
14. As a person sending feedback, I want it to stop when the issue-create is
    refused or the account is wrong, so that no half-sent report is created.
15. As a person reporting something in a private repository, I want the skill to
    keep the repository's content out of the issue, so that I do not publish what
    I do not own.
16. As a person with a good experience, I want a channel for saying so, so that
    the author learns which paths are worth keeping.
17. As the author, I want both skills to be user-invoked only, so that an agent
    does not route work or file issues on its own.

## Implementation Decisions

**Both skills are user-invoked, like `ask-matt` and the old `feedback-me-please`.**
The router is a question the person asks, not a step the agent takes, and a
feedback issue carries the person's account. Both carry
`disable-model-invocation: true` and an `agents/openai.yaml` with
`allow_implicit_invocation: false`, the shape `communicate-with-issue` and
`hand-back` use.

**The router does not restate the set.** It holds the routes and the branch
tests, and it reads a skill's `SKILL.md` before saying what that skill does or
recommends skipping it. Its summary lines are for orientation only, and it says
so in its own text. This answers the objection that removed the v1 `ask-me`.

**The router has one mainline and the branches that leave and rejoin it.** The
mainline is the four steps the README promises: `to-spec`, `to-tickets`,
`implement` or `implement-spec`, then `review`. Before the mainline there is the
discussion that produces a spec, run by `grilling` or `grill-with-docs`; beside
it are `setup`, `hand-back`, `communicate-with-issue`, `glossary`, `adr`, and
`feed-me-back`, each opened on a state rather than a position in the line. The
router is not itself on the line.

**The branch tests are facts, not taste.** Where two skills look
interchangeable, the router gives the one test that separates them and says why
it separates them: whether the project has `setup` run, whether the discussion
has produced a spec, whether the spec has more than one batch of the frontier,
whether the ticket's `needs_human` is true, whether a term passed the glossary's
check, whether a decision passed the three gates.

**The router recommends and stops.** It does not run the skill it names, write a
record, or read the project's records. Its answer names the next thing the
person types.

**`feed-me-back` reports a problem with a skill, and only that.** It reports a
step that cannot be followed, a command that fails, a rule that contradicts
another, a path that does not exist, or a skill that did better than expected.
A problem in a project's own records is that project's to fix, and this skill
leaves it alone.

**`feed-me-back` sends to one repository:
`QiYueran-source/weave-your-work`.** It is the set's public home, and both a
bug and a good word go there.

**Every `gh` call in `feed-me-back` names `--repo
QiYueran-source/weave-your-work`.** `communicate-with-issue` takes the
repository from the directory it runs in; `feed-me-back` runs inside whatever
project the person is working in, so it names the repository on every create,
search, list, and view. (confirmed by the person, 2026-11-20)

**Nothing is sent without an explicit yes for the exact text.** The skill shows
the draft, the label, and the command, and one yes buys one issue at that title
and label. A corrected draft asks again.

**`feed-me-back` takes a good word as a welcome report.** A skill that worked
better than expected tells the author which path to keep. The skill asks once
whether the report is a bug or a good word; a bug runs the full path, a good
word skips the label choice and uses `enhancement` only when the person asks for
a label at all.


**The star is a separate question, asked once.** When the repository is not
starred, the skill offers it; a person who declines is not asked again.

**Both skills go in `weave-your-work/` and nowhere else**, and both are
described in `README.md`, `README.zh-CN.md`, and `CHANGELOG.md`, with the count
of skills updated from twelve to fourteen. (confirmed by the person,
2026-11-20)

## Acceptance

The delivery is two skills and three documents, and a reader can tell it was
delivered when `npx skills add ./weave-your-work` lists fourteen skills with no
`Skipped` line, when `ask-me` and `feed-me-back` appear in the README tables
with a one-line description each, when the changelog records both as added,
and when neither skill can be reached without the person invoking it.

The reading is the check: the install output lists both, the reference and
record checkers report no new finding, and each route the router names matches
what the named skill's own `SKILL.md` says it does.

## Out of Scope

- Changing the twelve existing skills. Both new skills read them; neither edits
  them.
- A glossary entry for "router" or "feedback". The terms are defined in the
  skills that use them; a glossary entry is its own decision.
- A phase-boundary guide (`PHASE-BOUNDARIES.md`) or any other document the
  router might later point at.
- The retry path after a rejected label. The skill says to read `gh label list`
  and stop; adding a retry loop is its own decision.
- Any change to the issue listener or the pending-communications queue.

## Further Notes

The v1 `ask-me` and `feedback-me-please` are in `.inbox/v1-weave/`, which Git
ignores. They are the starting text for both skills; they are not the source,
and neither is edited in place.

`ask-matt` from upstream is in `.inbox/upstream-matt/` and carries a phase
boundary guide. That guide describes a code session's context decisions more
than an office project's, and the router does not carry it.
