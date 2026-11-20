---
schema: 1
id: wm-py6jm3b3cvae
title: 'Write hand-back: a person''s finished work returns to the tickets'
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T13:57:14Z
updated_at: 2026-11-20T07:40:00Z
closed_at: 2026-11-17T13:58:27Z
dependencies:
  - wm-zfsekc3kqk47
---
Part of wm-qmar7z6vvbyn

## What to do

A person who has done a ticket's work runs `hand-back`, says what they did in
their own words, and comes out the other side with the result written into the
ticket, the ticket closed, and the next ticket named.

The skill works out which ticket is meant by reading what the tickets ask for and
judging by meaning, not by matching words. One match is stated back; several are
listed for the person to pick; none is said plainly. It then reads the ticket's
acceptance and asks the person what the ticket needs to know, so the person is
told what to answer rather than left to guess how much to write. At least one
round of questions.

One ticket per run. The skill is for a person to run, and says so.

## Acceptance criteria

- [x] The skill is new, and its front matter marks it as run by a person rather
      than reached for by a model.
- [x] Its description says a person runs it after doing the work.
- [x] The steps are: find the ticket, read its acceptance, ask what the ticket
      needs to know, write the result, close the ticket, name the next one.
- [x] Finding the ticket judges by meaning, with a worked example contrasting a
      person's words with the ticket's words.
- [x] One match is stated back for confirmation, several are listed for the person
      to choose, and no match is said plainly.
- [x] The questions are derived from the ticket's acceptance, and when the
      acceptance is too vague the skill asks what the ticket was meant to achieve.
- [x] At least one round of questions is required.
- [x] The result is written where the ticket asks for it.
- [x] The skill takes one ticket per run and says so when a person describes two.
- [x] The skill says nothing enforces the person-runs-it rule beyond the wording.

## The result

`weave-your-work/hand-back/SKILL.md` is a new skill. Its front matter carries
`name`, `description`, and `disable-model-invocation: true`, so a model does not
reach for it on its own; the description says a person runs it after doing the
work. The steps are numbered 1 to 5: find the ticket, read what the ticket wants,
ask what the ticket needs to know, write the result, close it and say what is
next.

Finding the ticket judges by meaning, with a worked example: someone says "I asked
the supplier" and the ticket says "confirm the quote". One match is said back for
confirmation, several are listed for the person to pick, and no match is said
plainly. The questions come from the ticket's acceptance, at least one round is
required, and two pieces of work in one description are told to be taken one at a
time. A closing section says nothing enforces the person-runs-it rule beyond the
wording.

Verified by reading back the file committed in `6a09dc4`: the three front matter
keys and the five numbered headings exist, and the worked example is present.

## Blocked by

- wm-zfsekc3kqk47
