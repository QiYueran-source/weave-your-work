---
schema: 1
id: wm-bm3d6g8d3ahj
title: Write the setup skill entry
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T00:47:48Z
updated_at: 2026-11-10T01:39:34Z
closed_at: 2026-11-10T01:39:34Z
parent: wm-ygnttse5hd5k
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/setup/SKILL.md` as the entry to the setup skill.

1. Front matter: `name: setup`; a quoted description naming the two states that trigger it — the project has no `.waymark/config.toml`, or `.agents/rules/` is empty — and no `disable-model-invocation` field.
2. The body names what setup does: install the four tools and configure their auth, initialize a new project, write the AGENTS.md prompt, and run the listed bundles' setups. It names `start-a-project.md` as the first-time flow and `bundle/setup.md` as the install guide for setup's own rules.
3. The body names what setup does not do: it installs no skills, creates no remote, and commits nothing.
4. It states the contract: setup is done when the check in `.agents/rules/rules-checklist.md` passes for every item or marks it not applicable.

## Acceptance signal

`npx skills add ./weave-your-work --list` lists `setup` with no skip. Its description contains both trigger states. The file points at `start-a-project.md` and `bundle/setup.md`, both inside the skill directory. It names the three things setup does not do.

## Boundaries

- No flow document and no bundle file.
- No reference to `join-a-project.md` until that file exists; the join task adds it.
