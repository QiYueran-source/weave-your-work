---
schema: 1
id: wm-en5qsgr58y0g
title: Global setup integration task split
category: testimony
status: open
owner: frank
creator: frank
created_at: 2026-11-10T11:50:02Z
updated_at: 2026-11-10T11:50:02Z
---
## Discussion

The owner confirmed the setup integration plan: checks 11–13 scan the project and global skill roots; check 16 reads the generated checkout unit and settings; the start and join flows are updated for the project-local bundles; a consistency test compares the three resolver copies; the old clone probe is revised and a fresh-project probe is added.

## Split plan

Two delivery/probe tasks under the setup integration map:

1. Make setup flows and checks work from a global install: update start-a-project, join-a-project, and the checklist; add the resolver-copy consistency test.
2. Run a fresh project from a globally installed skill set: install globally under a temporary HOME, follow setup, and record every check and failure without fixing them in the probe.

The old clone probe `wm-j3ed13ejn8cy` is revised in place for the join flow under the global install.
