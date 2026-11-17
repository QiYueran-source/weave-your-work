---
schema: 1
id: wm-mdmbn4zhcyt2
title: test-check
category: ticket
status: open
owner: frank
creator: frank
created_at: 2026-11-17T07:23:24Z
updated_at: 2026-11-17T07:23:24Z
parent: wm-14axybwpn8xa
dependencies:
  - wm-xap1hkbv3pe0
archived_at: 2026-11-17T07:23:32Z
archive_reason: Created while probing the ticket command; superseded by the real ticket for this slice.
---
## What to build

Facts are found in an order rather than wherever the agent happens to look. A frontier question that needs a fact is answered from the project first (its records, documents, glossary, ADRs), then from outside it through the MCP servers and web tools the project provides, then from the person, and only there.

Every fact carried into the discussion names its source. A source that answers only partly, or two sources that disagree, is not an answer: both readings go to the person with the round's questions, and neither is taken by default. Whether a source outside the project is reachable is left to the agent, judged against the tools the project provides; the skill states no tool list.

The sub-agent dispatch is kept, so a running lookup blocks only the questions downstream of it.

## Acceptance criteria

- [ ] The three sources appear in order, each with the condition for stopping at it
- [ ] Every fact names its source
- [ ] A disagreement between sources is put to the person, and no side is taken by default
- [ ] The skill names no specific tool and leaves reachability to the agent
- [ ] The lookup still runs in a sub-agent with a fresh context window
