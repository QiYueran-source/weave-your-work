---
schema: 1
id: wm-ygnttse5hd5k
title: Setup skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T12:52:39Z
updated_at: 2026-11-10T13:37:41Z
parent: wm-a08fwanmy5q6
---
## Target

Design the setup skill so a team can go from zero to a running work-weave project: install the dependencies (git, node, gh, waymark) and configure their auth, initialize a new waymark project or join an existing one, lay down rules (AGENTS.md pointing at .agents/rules/), and run every skill bundle's setup.
Why: without setup a new project has no tracker configuration, no rules, and no installed pieces; every later step assumes it ran.

## Acceptance direction

A fresh project and a clone each run setup end to end; the checklist passes, the installed pieces work, and the rules are discoverable from AGENTS.md.

## Decisions so far

- setup scope: check dependency configuration, initialize the project, initialize rules (user confirmed).
- Prefer instructions an AI executes over one script; mechanical pieces may be scripts (user confirmed).
- Installing a skill's pieces is a task under that skill's map, not under setup: the glossary install step lives under the glossary map (user confirmed).
- The future total setup explicitly lists the map and task bundles and reads each bundle setup; it does not discover bundles by scanning. The skill and its complete list are not implemented yet. Source: user confirmation.

- ~~Setup is a manual with a bundle that carries part of the initialization rules; it has no script and no tools.~~ Superseded on 2026-11-10: setup's bundle carries one read-only check script, `bundle/tools/check-setup.mjs`. The install flow stays a manual that names each step; the script runs the seventeen checks, prints the result, and repairs nothing. (user confirmed, 2026-11-10)
- Setup does not install the skills. It installs their dependencies and configures their auth: git, node, gh, waymark. (user confirmed, 2026-11-09)
- The bundle list is fixed and complete: map, task, glossary, issue. All four are installed, with no optional subset. Setup names which skills have a bundle and points at each bundle's setup; it does not restate the install steps. (user confirmed, 2026-11-09)
- The dependency step is a checklist. (user confirmed, 2026-11-09)
- Waymark init: storage root `tickets`; categories map, task, testimony; the six custom fields; operator asked once with `git config user.name` as the default; never `--force`. (user confirmed, 2026-11-09)
- The AGENTS.md prompt is written at the top of the file; absent creates it, identical skips, different asks the person. (user confirmed, 2026-11-09)
- Setup ends when the checklist passes. (user confirmed, 2026-11-09)

- Setup is model-invocable. Its description names the states that trigger it: no `.waymark/config.toml`, or an empty `.agents/rules/`. (user confirmed, 2026-11-10)
- The step that adds the AGENTS.md prompt belongs in an SOP document, not in a rule file. (user confirmed, 2026-11-10)
- Setup's bundle carries the team's git and GitHub rules; the person's examples are that the GitHub repository's default branch is protected and that work happens on your own branch. (user confirmed, 2026-11-10)
- The checklist covers configuration state, not only dependency versions: gh configured, git configured, whether the project uses a remote, the local listener, the glossary MCP, and similar items. (user confirmed, 2026-11-10)

- Setup covers three flows: first-time initialization, joining a cloned project, and the daily startup check. They are designed one at a time, starting with first-time initialization; the other two wait for it. The SOP is the whole initialization flow. (user confirmed, 2026-11-10; this replaces the earlier two-mode decision)
- The daily startup check is a rule, not a skill. The setup skill covers the two initialization flows only. (user confirmed, 2026-11-10)
- The first-time initialization document is `start-a-project`; the join document is `join-a-project`. (user confirmed, 2026-11-10)
- Join runs on a clone of a project already using waymark, and does not install skills: the clone carries them. It runs all seventeen checks, not only the starred ones, because a clone is the one moment when no local piece has been proven. (user confirmed, 2026-11-10)
- Join sets this clone's git identity and never edits `handles.toml`: the roster is a shared committed file, so a missing name goes through a branch and a pull request. (user confirmed, 2026-11-10)
- The operator and the GitHub login are asked as one pair, because neither derives the other: `git config user.name` is this machine's name and `gh api user` is whichever account is signed in. Check 11 proves the operator matches a `[handles]` key, folded for case the way the listener folds it. (user confirmed, 2026-11-10)
- The dependency step finds every `package.json` outside `node_modules` instead of assuming where the tools live, and reads each install's exit status: a partial `node_modules` and an import that exits 0 both look like success otherwise. (user confirmed, 2026-11-10)
- The post-merge hook ships as `sh` only. Git runs the file named `post-merge` and reads its shebang, so a PowerShell variant would never be called; Git for Windows supplies the shell. (user confirmed, 2026-11-10)
- The multi-agent question is settled by discovery, not by a list: any directory named `skills` holding `<name>/SKILL.md` is a root, so `.agents/skills` and an agent's own directory are both covered. Cursor reads `.agents/skills` itself; `.claude/skills`, `.kiro/skills`, and `.trae/skills` are written only by the CLI's other targets. (user confirmed, 2026-11-10)
- `start-a-project.md` carries no `npx skills add` line: the reader is running the flow, so the set is installed. The install command belongs in the repository's README. (user confirmed, 2026-11-10)
- Check 16 compares the listener unit's `WorkingDirectory` with the project root; `active` alone was true for a unit bound to a different checkout, whose queue can never grow. (user confirmed, 2026-11-10)
- Where a platform has no service step, the flow names the alternative instead of only reporting the gap: run the listener in a terminal, and say a launch agent or a scheduled task is the person's to write. (user confirmed, 2026-11-10)
- First-time initialization assumes the skill set is installed and nothing else exists. (user confirmed, 2026-11-10)
- First-time initialization does not create a remote and does not commit; it lists the files it changed and the person commits. (user confirmed, 2026-11-10)
- Setup's bundle carries several rules; the person named `rules-git` and `rules-checklist` among them. (user confirmed, 2026-11-10)
- The checklist's items in five groups are confirmed; without a remote, the protection and listener items are not applicable. The count settled at seventeen on 2026-11-10.

- Setup carries no `usage.md`: `SKILL.md` points at `start-a-project.md` and `join-a-project.md` directly. (user confirmed, 2026-11-10)
- The rule set is `rules-git` and `rules-checklist`. There is no language rule; the project's own language convention applies. (user confirmed, 2026-11-10)
- The rule set grows to three: `rules-install` states that a globally installed set still keeps the project's dependencies inside the project, and that the project root is resolved and confirmed before any step runs. The user asked for it as a bundle rule rather than a step, so that it constrains every install instead of one flow. (user confirmed, 2026-11-10)
- Setup's entry must direct the agent to read the bundled `rules-install.md` before initialization, so the project directory and installation boundaries are known before anything is written. (user requested, 2026-11-10)
- The rule also settles where a rule lands and where the pointer file lives: `<project>/.agents/rules/` and `<project>/AGENTS.md`, never under `~/.agents/`. A global install changes only where the skill files live. `~/.agents/rules/` has no reader, `<project>/.agents/AGENTS.md` is never read, and `~/.agents/AGENTS.md` would apply one project's rules to every project on the machine. (measured in `@deepseek-ai/dsh-agent-instructions` 2026-11-10)
- The project root has no single definition today. `waymark` walks up to the nearest `.waymark/config.toml`, the checks compare against `git rev-parse --show-toplevel`, the listener reads `process.cwd()`, the glossary server takes `--project` and only falls back to walking up, and `adr`, `salvage-and-restart`, `stop-and-wait` write relative paths under whatever directory they were started in. `waymark init` creates at the current directory while every read finds the nearest ancestor, so the two disagree when a stray `.waymark` sits above. The new rule settles one definition and one confirmation step. (measured 2026-11-10)
- The daily check also runs when a feature turns out to be unavailable, not only at session start. (user confirmed, 2026-11-10)

- `.agents/rules/rules-bundles.md` is amended: the skill root carries `SKILL.md` and its usage documents; a skill with one usage document names it `usage.md`, and one whose use splits by flow names each document after the flow. (user confirmed, 2026-11-10)
- The `.gitignore` step belongs in `start-a-project.md`, not in the checklist: the checklist is read-only, and the file must exist before the bundles run `npm install`, because a `node_modules` already staged is not removed by a `.gitignore` written afterwards. `waymark init` writes `.waymark/.gitignore` itself; the glossary and issue bundles append their own lines; no bundle covers `node_modules/`, so setup writes it. (user confirmed, 2026-11-10)
- The checklist carries seventeen checks, in the five groups, plus `curl`, which the issue bundle needs to build its smee channel. They are written for a new project, not for this repository. (user confirmed, 2026-11-10)
- The skills-and-rules checks discover their targets instead of naming them: a check for the skills themselves and one that walks every `<root>/<skill>/bundle/rules/` so a bundle can be added without editing setup. (user confirmed, 2026-11-10; the first no longer reads `skills-lock.json`, which listed two skills while 41 were installed, and now compares each skills root against what Git tracks)
- A 404 on the webhook read is not a failure on its own: the check reads `permissions.admin` first, and only an admin's 404 is a real failure. (user confirmed, 2026-11-10)
- ~~The checks live only in `bundle/rules/rules-checklist.md`, one line each with its command and expected result, starred where the session-start run covers them; session start runs the starred checks, a feature that turns out unavailable runs all of them; `start-a-project.md` references the rule and restates no check.~~ Superseded on 2026-11-10: the rule keeps each check's goal, pass condition, repair, and the two triggers; the executable part is `bundle/tools/check-setup.mjs`, a dependency-free Node script run from the project root. The rule names the script and the starred set. This replaces the POSIX-only shell in the always-loaded rule with one implementation that runs on Windows, macOS, and Linux. (user confirmed, 2026-11-10)

- Work-weave project data and project-local runtime files belong under `<project>/.work-weave/`, separate from `.agents/`. The user wants setup to generate an internal `.gitignore` for local artifacts. `AGENTS.md` and agent rules remain in their existing locations; Waymark's `.waymark/` and `tickets/` are not part of this move. Exact paths and tracked files are not yet settled. (user confirmed, 2026-11-10)
- Existing projects use test layouts; backward compatibility with those layouts is not required. This decision does not authorize discarding existing project data without inspection. (user confirmed, 2026-11-10)
- Keep the generated `GLOSSARY.md` at the project root. A Git test showed `.work-weave/.gitignore` cannot ignore the parent path, so the user accepted `/GLOSSARY.md` in the shared root `.gitignore` as an exception. Glossary sources move to `.work-weave/glossary/` and remain shared in Git. Update the project-layout ADR when implementing this change. (user confirmed, 2026-11-10)
- The issue roster belongs under `.work-weave/issue/` and is shared in Git; each checkout's pending queue is local and ignored. (user confirmed, 2026-11-10)
- Each checkout has its own listener configuration and queue. Checkouts of the same repository may share its Smee channel, but each listener needs an isolated service instance and port. The listener rejects an event whose repository is missing or does not match the configured repository, and logs the reason; this is isolation, not authentication. (user confirmed, 2026-11-10)
- Setup selects an available local port for each checkout and records it in local configuration. If a later start finds it occupied, report the conflict and ask for reconfiguration instead of silently changing ports; availability at setup is not a reservation. (user confirmed, 2026-11-10)
- `.work-weave/.gitignore` is shared and ignores `pending/`, `runtime/`, and `local/`. Shared `issue/handles.toml` and `glossary/` are tracked; per-checkout queue, issue and glossary tool copies and dependencies, and local service configuration are ignored. (user confirmed, 2026-11-10)
- ~~Setup installs missing tool copies and dependencies in a new clone. For updates it reports the old and new versions and asks before upgrading; it prepares and validates a new copy before switching, and restores the previous runtime if switch or verification fails. Restart a running listener through a controlled cutover and account for MCP reload. Daily checks report version drift without upgrading. The switch mechanism remains to be designed. (user confirmed, 2026-11-10)~~
  Superseded on 2026-11-10: first release installs missing project-local tools and dependencies, but version checks, updates and rollback are deferred.
- Initial automatic background service support targets Linux systemd user services. `issue/bundle/setup.md` routes to `service/linux.md`, `service/macos.md`, or `service/windows.md` for platform-specific steps. The macOS LaunchAgent template and manual install, inspection, and removal steps are marked unverified until tested on macOS; Windows describes foreground operation and the absence of background support. (user confirmed, 2026-11-10)
- Setup reads the checkout's `origin`, shows the parsed GitHub repository to the person, and asks for confirmation. A missing or non-GitHub `origin`, or a later change, stops automatic configuration for human review rather than selecting another remote. (user confirmed, 2026-11-10)
- ~~Upgrade issue and glossary runtimes separately. After an issue switch, verify the listener; on failure restore the previous runtime and service. For glossary, request an MCP reload and verify the new service; retain the old runtime until verification completes. Project data stays outside runtime copies. (user confirmed, 2026-11-10)~~
  Superseded on 2026-11-10: runtime upgrades, service cutover and rollback are deferred; project data remains outside runtime copies.
- Setup checks the remote repository's existing webhook first and reuses its Smee channel when found. When it cannot find or read the webhook, ask the responsible person before creating or changing anything; do not assume that a failed read means no webhook. Channel URLs stay out of Git, tickets, and logs. (user confirmed, 2026-11-10)
- Only one listener may write a checkout's pending queue at a time. An exclusive per-checkout lock rejects a second instance and must be recoverable after abnormal exit; implementation and platform behavior remain to be designed. (user confirmed, 2026-11-10)
- When both project-local and globally installed skills are present, the harness decides which skill it loads; work-weave does not impose a precedence. The selected skill uses the current project's `.work-weave/`. (user confirmed, 2026-11-10)
- First release focuses on global installation and project directory isolation. Version-lock enforcement, runtime upgrades, service cutover and rollback are deferred. (user confirmed, 2026-11-10)
- On first setup, before `.work-weave/` exists, show the current directory and ask the person to confirm or specify the project root; do not silently select an enclosing Git repository. During normal use, search upward from the working directory for the nearest `.work-weave/`; when absent, stop and ask for setup or an explicit project. Nested projects use the closest marker. Services and MCP registrations use the project path confirmed at setup. (user confirmed, 2026-11-10)
- Setup requires `.git`, `.waymark/`, and `.work-weave/` to belong to the same project root, not different ancestor directories. First-time setup may create missing markers after the root is confirmed; it must not silently use an enclosing repository or tracker. Validate the Git worktree root rather than requiring `.git` to be a directory. (user confirmed, 2026-11-10)
- An explicit project path must itself be the project root with all three markers; it is not searched upward. First-time setup is the exception while creating missing markers. If the chosen directory is inside an enclosing Git repository without its own Git root, stop and ask the person to choose the enclosing root or create an independent repository; do not run nested `git init` automatically. (user confirmed, 2026-11-10)
- If the selected root has no local Waymark configuration but an ancestor does, setup stops and asks the person whether to use the enclosing project or initialize an independent tracker in the selected root. It does not silently use the ancestor. (user confirmed, 2026-11-10)
- Check 9 reads `false` as two different states. A private repository on a free plan cannot have server protection: the branch prints `false` and `/protection` answers 403 with `Upgrade to GitHub Pro or make this repository public`. The check probes that endpoint once, reports the plan gate as not applicable, and names the local fallback, `rules-git.md` plus the project's own hook if it has one. A `false` while the feature is available is still a failure. (user confirmed, 2026-11-10)

## Not yet specified

- **Project-local directory layout:** Choose exact filenames and paths for the pending queue and local configuration. A nested `.gitignore` does not untrack files already committed.
- **Project discovery:** Specify the exact validation commands for Git worktrees and Waymark configuration.
- **Listener isolation:** Design service instance identity, local configuration, channel handling and the exclusive lock's implementation and recovery; specify repository matching and missing-field behavior. Verify the macOS LaunchAgent on a real Mac.
- **Transition and integration:** No legacy compatibility is required; decide how to switch this development checkout without losing data the user wants to retain. Inventory existing roster, pending queue, glossary sources, generated view, rules, hooks, MCP registration, listener service and checklist paths. Verify project isolation, repeat setup, dependency failure and the initial service setup. The existing roster separation task `wm-ssfcjp9hxbxh` predates this decision. Issue and glossary bundle work belongs to their owning maps; setup coordinates the entry flows and checks.
- **Current global-install limitations:** Checklist items 11–13 assume project-local skill paths or discovery and do not prove global installs work. The current issue and glossary bundle guides install dependencies in the skill directory; the listener and checker read the roster beside their tools, and glossary reads the root `glossary/` directory. The installed `rules-install.md` also needs its path and dependency-resolution claims reviewed against the chosen design.
- Whether a joined clone that finds a missing roster entry gets a task of its own to track the pull request.

## Out of scope

- Software-specific configuration (build tooling, CI, and so on).
- External connectors.
