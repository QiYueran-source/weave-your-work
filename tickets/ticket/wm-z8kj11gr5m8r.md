---
schema: 1
id: wm-z8kj11gr5m8r
title: 'Release 2.0.0: merge the set, write the documents, and tag'
category: ticket
status: open
owner: frank
creator: frank
created_at: 2026-11-20T11:15:56Z
updated_at: 2026-11-20T11:16:52Z
---
wm-js61y7yxvx10

## What to do

The communicate work and every document that describes the set are ready for
2.0.0, and `main` holds none of it yet: `integrate-communicate` is unmerged,
the READMEs name skills this branch does not have, and there is no changeset
for the major version.

## Acceptance criteria

- [ ] `integrate-communicate` is merged into `main` through a pull request a
      person reviewed.
- [ ] A branch off the merged `main` carries one major changeset,
      `INSTALL.md`, both READMEs rewritten to the twelve skills, and
      `docs/v2-conformance.md` marked as a record of the earlier branch.
- [ ] That branch is reviewed and merged.
- [ ] `npm test` is recorded as passing or failing before each merge, and a
      failure is written here as the reason not to merge.

## The result

Left empty when the ticket is published. Whoever finishes the ticket fills it
in: one or two lines naming what was left behind, in a form a later reader can
point at.

## Blocked by

None (can start immediately)
