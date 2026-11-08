---
schema: 1
id: wm-yvx5n29gxdgp
title: Implement the glossary merge hook
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T11:24:43Z
updated_at: 2026-11-08T14:33:31Z
closed_at: 2026-11-08T14:33:31Z
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

## Result

`weave-your-work/glossary/bundle/post-merge.sh` is in place. It resolves the project root with `git rev-parse --show-toplevel`, exits 0 when `glossary/` is absent, and runs the bundle's `merge` command. `@GLOSSARY_SKILL@` is the install placeholder the setup replaces with the skill's absolute path; the setup task installs the result as `.git/hooks/post-merge`.

Tested in a temp git remote and two clones:

- a pull that changed one `glossary/*.jsonl` definition ran the installed hook and put the new definition in `GLOSSARY.md`;
- a second pull with no change left the view's hash unchanged;
- a direct run in a repo without `glossary/` exited 0.

## Review

passed

- Goal: the `Acceptance signal` asks for the new definition after a changed pull and no change on a no-op; the two-clone pull test shows both. The no-glossary run exits cleanly.
- Convention: no server change and no conflict resolution; the task wrote the hook template and this result/review only.
