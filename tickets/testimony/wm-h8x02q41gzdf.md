---
schema: 1
id: wm-h8x02q41gzdf
title: Issue and glossary isolation task split
category: testimony
status: open
owner: frank
creator: frank
created_at: 2026-11-10T11:23:58Z
updated_at: 2026-11-10T11:23:58Z
---
## Discussion

The owner confirmed five design choices on 2026-11-10: each bundle carries a byte-identical resolver copy with a consistency check in setup integration; runtime paths are `.work-weave/runtime/`, local configuration is `.work-weave/local/`, and the queue is `.work-weave/pending/`; the roster task is revised in place; the service name uses a hash of the physical project root with settings in `.work-weave/local/issue-listener.env`; the queue uses an exclusive lock with stale recovery.

## Split plan

Issue map, three delivery tasks:

1. Isolate the issue listener and checker per project: resolver copy, roster and queue paths, repository validation, tests.
2. Guard the pending queue with one listener: exclusive lock, stale recovery, tests.
3. Install the issue listener per checkout: project runtime, local settings, hashed systemd unit, platform limits, tests.

Glossary map, two delivery tasks:

1. Run glossary tools against project-local sources: resolver copy, `.work-weave/glossary/`, root view, hard errors, two-project tests.
2. Install and migrate the glossary runtime: project runtime, MCP and hook wiring, documentation, retained-data migration, ADR update, verification.

The existing roster task `wm-ssfcjp9hxbxh` is revised in place for the data and template move; listener code changes stay in the issue map.
