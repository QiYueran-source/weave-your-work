---
schema: 1
id: wm-yvx5n29gxdgp
title: Implement the glossary merge hook
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-08T11:24:43Z
updated_at: 2026-11-08T11:24:43Z
parent: wm-rq3exm0m5563
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Install a post-merge hook that rebuilds `GLOSSARY.md` after a pull, so the generated view follows the JSONL sources.

1. Write the hook script that calls `glossary_merge` and exits cleanly when the glossary directory is absent.
2. Register it as a git post-merge hook; the setup task installs it.
3. Keep the script idempotent: a merge that changes nothing leaves the view unchanged.

## Acceptance signal

After a simulated pull that changes one line in a `glossary/*.jsonl` source, the post-merge hook runs and `GLOSSARY.md` contains the new definition. A pull that changes nothing leaves the file unchanged.

## Boundaries

- No server changes.
- No conflict resolution.
