---
schema: 1
id: wm-5b50wr2dkaxw
title: Write the glossary setup guide
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-06T11:43:19Z
updated_at: 2026-11-09T00:21:20Z
closed_at: 2026-11-09T00:21:20Z
parent: wm-rq3exm0m5563
custom_fields:
  task_kind: delivery
---
## What to do

Write the glossary's install guide at `bundle/setup.md` and keep `usage.md` usage-only:

1. Update `bundle/setup.md`: the install guide in five sections; no `install.sh`; Unix and Windows commands where they differ; MCP registration as a JSON instruction; the post-merge hook recommended, not required; copy `bundle/rules/rules-glossary.md` to `.agents/rules/`; verify.
2. Update `usage.md`: after install, the CLI commands, the four MCP tools, files, merge behavior, and troubleshooting; no install or MCP-registration steps.
3. Keep `SKILL.md` pointing at `bundle/setup.md` for install, `usage.md` for use, and `bundle/rules/rules-glossary.md` for the writing rule.
4. Test in a temp waymark project: follow the guide, write a term, merge, install and exercise the hook once, and run the usage commands.

## Plan

The install guide is `bundle/setup.md`; there is no `install.sh`. The guide is cross-platform: neutral steps with Unix and Windows commands where they differ; MCP registration is a JSON instruction because the harness config is environment-specific. The post-merge hook is recommended; if it is skipped, the guide says to run `merge` after a pull. The glossary's own setup copies `bundle/rules/rules-glossary.md` to `.agents/rules/`; the total setup reads the guide and does not restate it. The AGENTS.md prompt belongs to the setup skill, not this task.

The test is a temp waymark project: follow the guide, write a term, merge, install the hook in the temp repo, simulate a pull, and run the usage commands.

Confirmed by the user on 2026-11-09.

## Acceptance signal

- A fresh project can follow `bundle/setup.md` to install: `glossary/` exists, the CLI and MCP server are installed, the MCP config is registered, the rule is in `.agents/rules/`, and the hook is offered as recommended.
- `usage.md` is usage-only; `SKILL.md` points at both; no `install.sh`.
- The guide gives Unix and Windows commands where they differ; the hook can be skipped with the manual merge fallback.

## Boundaries

- setup's other duties (dependency checks, waymark initialization, and so on) are not in this ticket.
- No install script and no AGENTS.md prompt; the prompt belongs to the setup skill.

## Result

`bundle/setup.md` is the install guide; `usage.md` is usage-only. The guide covers the project directory and `GLOSSARY.md` ignore, the tools in `bundle/tools/`, the rule copy, the MCP registration, the recommended post-merge hook, and verification. It gives Unix and Windows commands where they differ, refuses to overwrite an existing hook or rule, and has no `install.sh`.

Tested in a temp waymark project: followed the guide, wrote a term through the CLI, wrote another through the MCP server, merged, installed the hook, and pulled a changed JSONL from a clone; `GLOSSARY.md` updated. The `.gitignore` entry and the rule copy were idempotent.

## Review

passed

- Goal: the `Acceptance signal` asks for a fresh-project install, usage-only `usage.md`, and both pointers; the temp project and MCP test show the install, and the guide carries the MCP registration and the optional hook.
- Convention: no `install.sh`, no AGENTS.md prompt; the hook is recommended; the rules copy stays in the glossary setup.
