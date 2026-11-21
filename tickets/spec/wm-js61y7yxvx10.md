---
schema: 1
id: wm-js61y7yxvx10
title: 'Release 2.0.0: ship the Matt-shaped set'
category: spec
status: closed
owner: frank
creator: frank
created_at: 2026-11-20T11:15:37Z
updated_at: 2026-11-21T06:23:25Z
closed_at: 2026-11-21T06:23:25Z
---
## Problem Statement

The set on this branch is not 1.0.1, and the repository has no way to say so.
Twelve skills were rebuilt on Matt's: `grilling` gained a testimony and a
source order, `grill-with-docs` assembles `glossary` and `adr`,
`communicate-with-issue` replaced `issue`, and `review` replaced the two
per-record review passes. Twelve of the twenty-three v1 skills are gone.

A person installing today gets something different from 1.0.1 with no release
that says so, and the installed copies on this machine are stale: the scanner
counted never-tracked skills under `.agents/skills` and a 29-skill global set
from November 9.

The documents describe the set before the rebuild. `README.md` and
`README.zh-CN.md` name `ask-me`, `waymark`, `map`, `task`, `res/`,
`what-is-the-mainline`, and `ASSERTIONS.md`, none of which this branch has.
`docs/v2-conformance.md` reports 25 skills and 22 installed; there are twelve.
No check reads either document, so both stayed wrong through every commit since.

`communicate-with-issue` and the session-start rule are finished on a side
branch, `integrate-communicate`, thirteen commits ahead of `main` and not
merged.

## Solution

Ship 2.0.0 from `main` with the rebuild and the communicate work in it, and with
documents that describe what ships.

The mainline this release promises is **spec, then tickets, then delivery, then
review**. Four skills run it: `to-spec` writes the spec, `to-tickets` cuts it
into whole tasks, `implement` or `implement-spec` does the work, and `review`
reads the results on two axes and closes the tickets. `grilling` and
`grill-with-docs` sit before the spec, so a discussion that produces the spec is
already inside the set; what is outside it is a discussion with no goal to work
from. The goal enters the set as a spec, and a skill that opens one from an
unsettled goal is not part of this release.

## Implementation Decisions

- The version is 2.0.0, a major bump: twelve skills were removed and several
  changed what they ask of their caller. The changeset is written by hand,
  because `.changeset/config.json` sets `commit: false` and the version command
  is the only step that reads it.
- The line is released from `main`, not from `integrate-communicate`, because
  `main` is the default branch and an install reads it. The branch is merged
  through a pull request reviewed by a person, per `rules-git.md`.
- The version bump is its own branch off the merged `main` and its own pull
  request. What ships is decided in one review and what it is called in another.
- `package.json` version and the changelog are written by `changeset version`,
  not by hand. The tag is pushed after that commit lands on `main`.
- The install command is settled once, in `INSTALL.md`, and the two READMEs and
  the rules point at it rather than carrying their own copy.
- The set qualifies its comparison to Matt's work: his set is for software
  engineering, this one for any office work, and the skills taken from it are
  adapted rather than copied.
- The README describes the skills this branch has. A skill list is not kept in
  two versions of the text; the Chinese README carries the same list, kept in
  step in the same commit.
- `docs/v2-conformance.md` is marked as a record of the rebuild branch rather
  than corrected to the current tree: it was written against a set with
  resources and assets, and rewriting it into a description of today's set is a
  new document, not a fix.
- `UPSTREAM.md` records the commit this branch was last compared against, and
  names `grill-with-docs` as a deliberate departure: it was removed upstream in
  1.3.0 and kept here because assembling `glossary` and `adr` is this set's job.

## Acceptance

Delivery: the set installs as 2.0.0 from the default branch, and the two
READMEs and the rules describe the twelve skills it contains.

How a reader tells it was: `package.json` reads `2.0.0`, `CHANGELOG.md` opens on
a 2.0.0 entry, the pushed tag `v2.0.0` points at the commit `main` holds, and
every skill name in either README resolves to a `SKILL.md` in
`weave-your-work/`.

## Out of Scope

- A skill that opens a map from a goal and splits it into tasks, and a router
  that replaces the removed `ask-me`. Both are 2.1 work.
- Migrating the two worked examples and the legacy records the baseline covers.
- The nine defects the Matt comparison found in `to-spec`, `to-tickets`,
  `grilling`, `implement`, `review`, and `setup`.
- A `retro` skill. What this release takes from it is stated in the v2.1 spec.
- The two failing setup checks (`gh` not signed in, the `needs_human` field),
  which are this machine's state, not the set's.

## Further Notes

The release changes what a person installs, so the tag is the moment a stale
install becomes visible. Nothing in the repository checks an installed copy
against the source; that is the missing guardrail the v2.1 spec takes from
Matt's `retro`.

## User Stories

1. As a person who installed 1.0.1, I want a release that says what changed, so
   that I can tell the set is not the one I installed in November.
2. As a person opening the repository for the first time, I want a README that
   names the skills the default branch has, so that the first command I run
   points at a skill that exists.
3. As a person cutting a branch off `main`, I want the communicate work already
   merged, so that my branch and the release differ by the release, not by an
   unfinished feature.
4. As a reviewer of the release, I want the version bump in its own pull
   request, so that I review what ships and what it is called separately.
5. As the person who writes `INSTALL.md` or corrects it later, I want one place
   that holds the install command, so that the two READMEs cannot drift from it.
6. As a person reading the changelog a year later, I want it to say which
   skills were removed and why, so that I can find the skill that replaced the
   one I remember.
7. As a person comparing this set with Matt's, I want the comparison to say what
   it is (office work, adapted skills), so that I do not read it as a claim of
   parity with a software engineering set.
8. As a person who lands on `docs/v2-conformance.md`, I want it to say which
   branch it describes, so that I do not read its numbers as the current tree.
9. As a person cutting a 2.1 spec, I want the parts this release leaves out
   listed, so that I start from what was decided rather than from a fresh
   discussion.
10. As an operator of this repository, I want the ticket's acceptance to name
    what a merge is blocked on, so that a review does not wait on a version
    agreement that has not happened.
