---
schema: 1
id: wm-q39pvx5245kd
title: Give the repo a front page and a license
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T05:17:22Z
updated_at: 2026-11-10T12:41:31Z
closed_at: 2026-11-10T12:41:31Z
parent: wm-10np2bs10s0e
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Give the repository the two files a stranger looks for first: what the set is and how to install it, and what they are allowed to do with it.

1. Write `README.md` and `README.zh-CN.md` at the repo root, linking to each other. Explain that the set generalizes Matt's software engineering skills for work in any domain, explores AI-native work through natural language with waymark, Git and GitHub CLI, and supports collaboration through GitHub issue messages and waymark ownership. Include the install command, the setup entry, and a pointer to `weave-your-work/`; do not restate the skills' instructions.
2. Write `LICENSE` carrying the full Apache License 2.0 text with the copyright line `Copyright 2026 frank` and the appendix filled in. Add a `## License` section to `README.md` naming Apache-2.0 and linking the file.

The install command in the README is global: `npx skills add qiyueran-source/weave-your-work -g`. The set is meant to be installed once per machine, with each project's data kept under its own `.work-weave/`. Add one sentence saying that dropping `-g` installs into the project instead.

## Acceptance signal

Both README versions explain the three characteristics and link to each other. They include the global install command and the setup instructions, name the project-local alternative, and link to `LICENSE`. `LICENSE` holds the Apache License 2.0 text, its appendix reads `Copyright 2026 frank`, and GitHub's repository page shows `Apache-2.0` in the license slot. Check local links and the install discovery output; the GitHub license display requires the changes to reach the remote.

## Boundaries

- No `CONTRIBUTING.md`, no code of conduct, no issue templates.
- No docs site, no screenshots, no badges.

## Result

`README.md` and `README.zh-CN.md` install globally with `npx skills add qiyueran-source/weave-your-work -g` and name dropping `-g` as the project-local alternative; they link each other and `LICENSE`. `LICENSE` carries the full Apache License 2.0 text with `Copyright 2026 frank`. GitHub reports `Apache-2.0` in the repository's license slot.

The install command was exercised against the public repository: 22 skills, all `installed`, no skipped entries.

## Review

passed

- Goal: both READMEs explain the set, link each other, carry the install and setup instructions with the global command and the project-local alternative, and link Apache-2.0; GitHub displays Apache-2.0.
- Convention: no badges, docs site, contributing guide, or issue templates were added.

## Next step

- None.
