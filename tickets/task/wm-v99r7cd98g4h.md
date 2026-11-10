---
schema: 1
id: wm-v99r7cd98g4h
title: Run the initialization flow in an empty directory
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T00:48:01Z
updated_at: 2026-11-10T06:24:00Z
closed_at: 2026-11-10T06:24:00Z
parent: wm-ygnttse5hd5k
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: probe
---
## Action

Find out whether `start-a-project.md` takes an empty directory to a passing checklist.

1. Create an empty directory outside the repository.
2. Install the skill set into it with the skills CLI.
3. Follow `start-a-project.md` from its first step to the result table, recording every command that fails and every check that cannot pass.
4. Record each of the seventeen checks with its state and, for a failure, the command and its output.

## Acceptance signal

The run reaches the result table, and the record lists all seventeen checks with a state each; every failure names the command and its output.

## Result: the flow runs, four steps were wrong

The probe ran in `/tmp/probe`, a new empty directory, with the set installed by `skills add ... -y` (19 skills). Every step ran as written. The flow reaches its result table; four steps told the reader to do something that cannot work, and each one is now corrected in the two files this task changed.

1. **Step 1 ran check 13, which cannot pass there.** On a fresh install check 13 reports all six rules unregistered, because the rules arrive in step 2 (setup's two) and step 8 (the four bundles). Step 1 now runs check 12 only and says why, and step 8 runs 13.
2. **Check 12 counted the same skills twice.** `skills add` without `-a` writes copies into `.agents/skills` and symlinks into `.claude/skills`; the walk found both roots and printed the second as a set with no manifest, which reads like a broken install. It now compares real paths and prints `all reached again through another root`.
3. **Check 8 overstated what a missing remote covers.** It named checks 9, 16, and 17; 17 answers either way, because `git check-ignore` is local. Verified in an empty repository with no remote and no commit: it printed `3`. Check 8 and the rule's preamble now name two, 9 and 16.
4. **Step 8 said to skip the issue bundle when there is no remote.** Skipping it leaves check 13 failing for the life of the project, since the rule copy is what 13 compares. Verified: with the other three copied and issue skipped, 13 printed `NOT REGISTERED: .../issue/bundle/rules/rules-pending-communications.md`. The step now says to skip the external steps and still copy the rule.

Two smaller corrections: the rule said `<skill>` appears in two commands when only check 15 has it, and step 8 now records that a failed `npm install` still leaves a partial `node_modules`, so the exit status is the only signal. The probe hit this: `npm install` in the issue tools exited 243 with `~/.npm` unwritable and left the directory behind.

## The seventeen checks

Run in `/tmp/probe` after step 10, against waymark 0.1.2 and `skills` 1.7.6.

| # | State | Output |
| --- | --- | --- |
| 1 | done | `git version 2.34.1` |
| 2 | done | `waymark 0.1.2` |
| 3 | done | `ok`, npm 10.9.9 on node v22.23.4 |
| 4 | done | signed in as `QiYueran-source` |
| 5 | done | `curl 7.81.0` |
| 6 | done | `/tmp/probe` |
| 7 | done | `Frank` |
| 8 | done | `error: No such remote 'origin'`, exit 2, expected: this flow creates no remote |
| 9 | not applicable | no remote |
| 10 | done | `healthy= True errors= 0`, `['map', 'task', 'testimony']`, six fields, `storage_root: tickets` |
| 11 | done | `operator: frank`, `handles: absent, nothing to match` |
| 12 | done | `19 skills, missing: none` and `19 skills, all reached again through another root` |
| 13 | done | printed nothing |
| 14 | done | `1` |
| 15 | done | `4` |
| 16 | not applicable | no remote. Without the new condition it would have passed falsely: it printed `active` with `WorkingDirectory=/home/frank/projects/work-weave` while the project is `/tmp/probe` |
| 17 | done | `3` |

## What the probe also showed

- `waymark init` without `--operator` adopts `git config user.name` and writes it to `.waymark/user.toml` as a `local_document` source, so step 6's `config set operator` is a confirmation, not a first write. With no git identity at all the file has no `operator` line and the source reports `git`.
- Re-running `waymark init` without `--force` keeps the categories, the six fields, and `user.toml` byte for byte.
- `.waymark/user.toml` is gitignored by waymark itself; a first commit carries `.waymark/config.toml` only.
- Step 7's order matters: the bundle setups' `npm install` would otherwise leave a `node_modules` already staged.
- `handles.toml` is not part of the installed set, so a new project starts with none and check 11 reports it absent rather than failing.

## Next step

- The two defects this probe could not settle are someone else's decision: macOS and Windows have no listener service step, and the set is published from a checkout that still has no README.
