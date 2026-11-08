---
schema: 1
id: wm-5b50wr2dkaxw
title: Initialize the glossary during setup
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-06T11:43:19Z
updated_at: 2026-11-08T13:18:50Z
parent: wm-rq3exm0m5563
custom_fields:
  task_kind: delivery
---
## What to do

Add a glossary initialization step to setup, instructions first and scripts second:

1. Create `glossary/` and add the root `GLOSSARY.md` ignore entry.
2. Register the glossary MCP server in the current harness configuration: install dependencies in `weave-your-work/glossary/bundle/` and point the stdio command at `node <skill>/bundle/server.js --project <root>`.
3. Install the git post-merge hook: replace `@GLOSSARY_SKILL@` in `bundle/post-merge.sh` with the skill's absolute path and install it as `.git/hooks/post-merge`.
4. Copy `glossary-rules.md` into `.agents/rules/`.
5. Add a system prompt to AGENTS.md that points the agent at the rules under `.agents/rules/`.

## Plan

The install step is owned by this branch: `setup.md` explains the steps; `bundle/install.sh` does the mechanical parts. The script creates `glossary/`, adds the `GLOSSARY.md` ignore entry, runs `npm install`, installs the post-merge hook from the template (refusing an existing hook), copies `glossary-rules.md` to `.agents/rules/`, and appends the AGENTS.md prompt. MCP registration stays an instruction because the harness config is environment-specific.

Test in a temp waymark project: run the script, write a term, merge, run the hook, and check the view. The MCP write is the server's existing path, tested before; the fresh-project install test covers the CLI and the hook.

Awaiting user confirmation before writing `setup.md`, `install.sh`, and the `SKILL.md` pointer.

## Acceptance signal

- On a fresh project after setup: `glossary/` exists, the MCP server writes a committed `glossary/<operator>.jsonl` source, the post-merge hook regenerates the ignored root `GLOSSARY.md`, rules are in place, and AGENTS.md has the prompt.
- Steps are instructions an AI can follow; mechanical parts may be scripts.

## Boundaries

- setup's other duties (dependency checks, waymark initialization, and so on) are not in this ticket.
