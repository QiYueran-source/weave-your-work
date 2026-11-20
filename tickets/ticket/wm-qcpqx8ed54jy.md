---
schema: 1
id: wm-qcpqx8ed54jy
title: Move a checkout to shared and personal, and update every path that names the old layout
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-20T02:38:15Z
updated_at: 2026-11-20T02:49:04Z
closed_at: 2026-11-20T02:49:04Z
parent: wm-pxg2hm3b1bwv
---
Part of wm-pxg2hm3b1bwv

## What to do

A checkout can be moved from the old `.work-weave` internal layout to the new one
by running setup's migration: every shared file ends up under `shared/`, every
personal file under `personal/`, `local/` is gone, and the ignore file names one
directory.

## Acceptance criteria

- [x] The migration moves `tracker.md`, `handles.toml`, `glossary/`, and `adr/`
      under `shared/`, and the installed tool copies, the listener settings, the
      service unit, and the queue directory under `personal/`.
- [x] The ignore file after the migration names `personal/` only.
- [x] A destination that already exists stops the migration with both paths in
      the message, and nothing is overwritten.
- [x] A checkout already in the new shape is left unchanged.
- [x] The migration is described in the setup install guide.

## The result

`weave-your-work/setup/tools/migrate-layout.cjs` moves a checkout from the old
`.work-weave` layout into `shared/` and `personal/`, and
`migrate-layout.test.cjs` covers it with 14 tests, including the old ignore
comment whose own rule goes with the directory it explained.

This checkout is migrated: `.work-weave/shared/` holds the tracker settings, the
roster, and the glossary and ADR sources; `.work-weave/personal/` holds the
installed tool copies, the listener settings, the service unit, and
`communication/`; `.work-weave/.gitignore` names `personal/` only.

The service unit was relinked to its new path and the listener restarted. The
path rewrites in tool source and guides are wm-0p0kkcgykds0's.

## Blocked by

- None (can start immediately).
