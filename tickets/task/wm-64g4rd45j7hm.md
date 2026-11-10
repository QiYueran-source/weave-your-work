---
schema: 1
id: wm-64g4rd45j7hm
title: Make setup flows and checks work from a global install
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T11:50:13Z
updated_at: 2026-11-10T11:50:13Z
parent: wm-xgvfgs1mz7jd
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Deliver setup flows and checks that work when the skill set is installed globally and each bundle keeps its runtime in the project.

1. In `weave-your-work/setup/start-a-project.md`, replace the root inference with the confirmed first-time rule: show the current directory and ask the person to confirm it or name the root; create missing `.work-weave/`, `.waymark/`, or Git only after confirmation; stop when the chosen directory is inside an enclosing Git repository without its own root, and stop when an ancestor Waymark configuration would be used. Keep the rest of the flow.
2. In `start-a-project.md`, update the bundle and ignore text: `.work-weave/.gitignore` for `pending/`, `runtime/`, and `local/`; root `/GLOSSARY.md`; glossary `npm ci --omit=dev` in `.work-weave/runtime/glossary`; issue `npm ci --omit=dev` in `.work-weave/runtime/issue` with its generated settings and unit. Remove the stale claim that the issue bundle appends `pending/`.
3. In `weave-your-work/setup/join-a-project.md`: skip `.work-weave` when finding `package.json` files; run the glossary and issue bundle setups before installing the hook or building the view; install the hook from the project runtime; run merge from the runtime; read the channel from `.work-weave/local/issue-listener.env`; name the generated unit under `.work-weave/local/`.
4. In `weave-your-work/setup/bundle/rules/rules-checklist.md`: checks 11–13 scan `.agents/skills` and `$HOME/.agents/skills`, deduplicate by real path, and compare every bundle's rules; check 16 derives the unit from `.work-weave/local/work-weave-issue-*.service`, compares `WorkingDirectory` with the physical root, and reads the channel from the local settings file; check 17 uses the new paths. Keep seventeen checks.
5. Add `weave-your-work/setup/bundle/tools/project-root-copies.test.cjs` comparing the setup, issue, and glossary `project-root.cjs` copies byte for byte, naming the differing copy on failure. Run `node --test` in the setup tools.

## Acceptance signal

`node --test` in `weave-your-work/setup/bundle/tools/` passes, including the copy test. The three documents contain no `git rev-parse --show-toplevel || pwd` root inference, no fixed `issue-listener.service`, no `~/.config/work-weave/smee.env`, and no `npm install` under a skill directory. The checks name both skill roots and the project-local runtime paths.

## Boundaries

- No service installation, webhook creation, or macOS verification.
- No new checklist item; keep seventeen.
- No change to the bundle install guides except references these flows need.
