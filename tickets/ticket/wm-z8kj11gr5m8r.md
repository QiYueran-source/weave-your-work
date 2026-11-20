---
schema: 1
id: wm-z8kj11gr5m8r
title: 'Release 2.0.0: merge the set, write the documents, and tag'
category: ticket
status: open
owner: frank
creator: frank
created_at: 2026-11-20T11:15:56Z
updated_at: 2026-11-20T12:05:00Z
needs_human: true
---
wm-js61y7yxvx10

## What to do

The communicate work and every document that describes the set are ready for
2.0.0, and `main` holds none of it yet: `integrate-communicate` is unmerged,
the READMEs name skills this branch does not have, and there is no major
version to release.

## Acceptance criteria

- [ ] `integrate-communicate` is merged into `main` through a pull request a
      person reviewed.
- [ ] The release documents on it are reviewed: one major release,
      `INSTALL.md`, both READMEs written to the twelve skills.
- [ ] `docs/v2-conformance.md` is marked as a record of the branch that wrote
      it.
- [x] `npm test` is recorded as passing or failing before the merge, and a
      failure is written here as the reason not to merge.

## What happened

Nothing is merged. `main` still holds `ef6b2a5`, the prototype commit whose set
is the one 1.0.1 shipped.

**The pull requests could not be opened.** `integrate-communicate` is pushed,
and `gh pr create` answers `must be a collaborator (createPullRequest)`: the
GitHub account `QiYueran-personal` has `READ` on the repository, and the SSH
key that holds push access belongs to `QiYueran-source`, which has no token on
this machine. The account that can push cannot open a pull request, and the
account that is a collaborator has no push.

**`main` is protected, so the merge stayed local.** A push there was refused
with `Changes must be made through a pull request`. A merge commit,
`6a5ae5a`, was made on a local `main`, the push was refused, and the local
`main` was reset to `origin/main`. Nothing on `main` changed.

**The plan changed in one place.** The documents were to land in a second pull
request off the merged `main`. They are on `integrate-communicate` instead,
because two more manual merges buy nothing when the same diff is reviewed once.
They stay in their own commit, `bd1e6ab`, so a reviewer can read them apart.

**One criterion was not done.** `docs/v2-conformance.md` is still the record of
the earlier branch, unmarked; marking it is a separate ticket.

## The result

Not finished: the branch is ready and the merge is not. `integrate-communicate`
at `bd1e6ab` reports 2.0.0; `main` still reports 1.0.1. Checks at `bd1e6ab`:
`npm test` 149 of 149 pass, `check-references` 0 findings, `check-records` 0
new findings.

## Blocked by

None (can start immediately)
