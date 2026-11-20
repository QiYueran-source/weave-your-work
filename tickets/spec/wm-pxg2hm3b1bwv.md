---
schema: 1
id: wm-pxg2hm3b1bwv
title: 'Layout: .work-weave splits into shared, which is committed, and personal, which is not'
category: spec
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-20T02:37:04Z
updated_at: 2026-11-20T03:54:07Z
---
## Problem Statement

The `.work-weave` directory mixes two kinds of state that behave differently, and its names do not say which is which.

Some of what it holds is shared: the tracker settings, the roster, the glossary sources, and the ADR sources. It must be committed, reviewed, and carried to every clone. The rest is this machine's alone: the installed tool copies, the listener settings, the generated service unit, and the queue. It must never be committed, and it is thrown away and rebuilt by an install.

The names blur the boundary. `issue/` holds the shared roster beside nothing else shared. `local/` holds settings a checkout needs, not only things that are local to a person. `runtime/` holds the installed copies, but a reader cannot tell from the name whether settings go there too.

The result is maintenance friction. A new file's home has to be decided by reading the ignore file and inferring. The ignore file lists three separate directories, so a fourth arrival is a fourth line, and a line forgotten is a personal file committed by accident. The two specs already agreed — the message queue and the event file — both name a location that does not exist in this shape yet.

## Solution

**Two halves, named for who shares them.** `.work-weave/shared/` holds everything a clone must carry: the tracker settings, the roster, the glossary sources, and the ADR sources. `.work-weave/personal/` holds everything that belongs to one checkout and this machine: the installed tool copies, the listener settings, the generated service unit, and the queue files.

**The name says it.** A file under `shared/` is reviewed and committed. A file under `personal/` is rebuilt by an install and never leaves the machine. Nobody has to consult a second document to know which.

**One ignore line.** The directory's ignore file names `personal/` and nothing else. Anything a person produces lives under it by definition, so a new personal file cannot be committed by forgetting to add a line.

**`local/` disappears.** Its contents move into `personal/`, one level up: the settings file, the service unit, and the queue directory sit directly under `personal/`. A layer that only ever held "checkout-specific" is the same thing as `personal/`, so it is not kept as a subdirectory.

**The directory keeps its name.** `.work-weave` stays. Renaming it would break the marker every installed tool resolves a project by, in every existing checkout at once, and it would collide with this set's own source directory. The change here is the shape inside it, not the path.

## User Stories

1. As a person committing a change, I want to know from a directory's name whether its files belong in Git, so that I do not have to read the ignore file to decide.
2. As a person committing a change, I want the ignore file to name one directory, so that a new personal file cannot be committed because nobody added a line.
3. As a person cloning the repository, I want the roster, the tracker settings, the glossary sources, and the ADR sources to arrive with the clone, so that I can start working.
4. As a person cloning the repository, I want not to receive another machine's settings, service unit, or queue, so that my checkout starts clean.
5. As a person reinstalling a tool, I want its files in one directory, so that a reinstall replaces one thing rather than touching several.
6. As a person reading the layout, I want the directory for personal state to be called by what it is, so that "personal" is not confused with "local".
7. As a person reading the layout, I want no directory that exists only to mean "not shared", so that there is one boundary rather than two nesting.
8. As an agent writing a queue file, I want one stated path, so that I do not guess where it goes.
9. As an agent writing a record, I want the roster's path stated once, so that moving it changes one place.
10. As a person running setup on an existing checkout, I want the move done for me, so that an upgrade needs no manual file juggling.
11. As a person with an existing service unit, I want its new path written and relinked, so that the listener keeps running after the move.
12. As a person reading an error about the roster, I want the message to name the file's new path, so that I can find it.

## Implementation Decisions

**The shape.** Under `.work-weave`, two directories: `shared/` holds `tracker.md`, `handles.toml`, `glossary/`, and `adr/`; `personal/` holds `issue/`, `adr/`, the listener settings file, the generated service unit, and `communication/`. The `communication/` directory holds the message queue and the event file from the two specs that precede this one.

**The ignore rule.** `.work-weave/.gitignore` names `personal/` and nothing else. The three existing lines are replaced, not extended.

**Shared sources move into `shared/`.** The glossary sources and the ADR sources move from their current directories to `shared/glossary/` and `shared/adr/`. The generated views stay where they are, at the project root, and stay ignored there.

**The roster moves.** `handles.toml` moves from the issue directory to `shared/handles.toml`, because it is shared while the tool copies beside it are not. Everything that reads it names the new path: the listener, the pending checker, the configurator, and the tests.

**The settings and the unit move.** The listener settings file and the service unit move from `local/` to directly under `personal/`. The `local/` directory is removed rather than kept empty.

**The installed copies move.** The per-tool runtime copies move under `personal/`, one directory per tool, replacing the current `runtime/` directory. A reinstall replaces the tool's directory and nothing else.

**A migration step moves an existing checkout.** Setup moves the files, writes the new paths into the settings and the unit, relinks the service, and reports what it moved. It runs on a checkout written under the old shape and on none of the new one; a checkout already in the new shape is left alone. The migration refuses to overwrite an existing destination and stops with the two paths named.

**The names in messages follow the files.** An error naming the roster names `shared/handles.toml`. A document naming the settings names the path under `personal/`.

**Documents that state a path are updated once.** The install guides, the session-start rule, and the skill that defines a message's format carry the new paths. No document keeps the old path as an alternative.

**The directory keeps its name.** No rename of `.work-weave` is part of this change, and no compatibility alias for the old internal paths is kept.

## Testing Decisions

**What a good test is here.** It sets up a checkout in the old shape with a file in every old directory, runs the migration, and reads the result: where each file now lives, what the ignore file says, and whether a second run is a no-op. The assertions are about files a person would open, not about the code paths taken to move them.

**The seam.** The migration is the entry point, and it takes the project root. It is tested by running it, not by calling its internals.

**What is tested.**

- Old-shape checkout: after the migration, the tracked files are under `shared/` and the personal ones under `personal/`, and no old directory remains.
- The ignore file after the migration names `personal/` and does not name the old three directories.
- A file that already exists at a destination stops the migration with both paths in the message, and nothing is overwritten.
- Running the migration on a checkout already in the new shape changes nothing.
- The listener, the checker, and the configurator start against the new shape and read the roster from its new location.
- A service unit written under the old path is rewritten to the new path and linked again, and the two unit files are not both left behind.

**Prior art.** The listener tests already build a temporary checkout with a marker directory and a roster; they gain the new layout. The configurator's tests already assert what it writes; they gain the new settings path.

## Acceptance

The delivery is a `.work-weave` with two directories — `shared/`, which is committed, and `personal/`, which is ignored — and a migration that moves an existing checkout into that shape without losing a file.

A reader can tell it was handed over by opening a fresh clone and finding the tracker settings, the roster, the glossary sources, and the ADR sources under `shared/` and nothing under `personal/`; by running setup on a checkout written under the old shape and finding every file moved, one ignore line, and the listener still running; and by running the migration tests and seeing every case above pass.

## Out of Scope

- Renaming `.work-weave`.
- Any compatibility alias that resolves the old internal paths.
- Changing what any file contains, beyond a path written inside it.
- Moving the generated views at the project root.
- The two specs the queue paths belong to. This spec moves the directories they name; it does not change what they hold.

## Further Notes

The migration lives with the setup, not with the listener, because it is a one-time act on a checkout rather than something a running service does. That also keeps it out of the path of a service that starts before anyone runs setup.

The ordering matters between this change and the two before it. The queue and event files exist only after their specs are delivered, so this migration runs with them: it creates `communication/` under `personal/` and moves what is already there. A checkout that has neither yet gets the new directories and no queue files, which is the same state a fresh clone is in.
