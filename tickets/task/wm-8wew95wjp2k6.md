---
schema: 1
id: wm-8wew95wjp2k6
title: Install the issue listener per checkout
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T11:24:47Z
updated_at: 2026-11-10T11:24:47Z
parent: wm-zhxe0hsnpf34
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Deliver a setup flow that installs the listener into a checkout's project-local runtime and generates one service per checkout.

1. Rewrite `weave-your-work/issue/bundle/setup.md` so it copies `package.json`, `package-lock.json`, `listener.mjs`, `check-pending.mjs`, and `project-root.cjs` into `<root>/.work-weave/runtime/issue/` and runs `npm install` there. Do not install dependencies under the skill directory.
2. Add a generator that writes `<root>/.work-weave/local/issue-listener.env` with `REPOSITORY=<owner/repo>`, `SMEE_URL=<channel>`, and `PORT=<available port>`; keep the file ignored and out of logs. Read the checkout's `origin`, show the parsed repository, and require the person's confirmation; a missing or non-GitHub origin stops for review.
3. Generate `work-weave-issue-<hash8>.service`, where `hash8` is the first 8 hex characters of sha256 of the physical root path. The unit sets `WorkingDirectory`, `EnvironmentFile`, and `ExecStart` to the checkout runtime. Add tests for two roots producing distinct unit names and env files, an occupied port being reported rather than changed, and a missing origin stopping before any write.
4. Split platform guidance into `service/linux.md`, `service/macos.md`, and `service/windows.md`, with `setup.md` routing to them. Linux uses a systemd user service and checks the unit with `systemd-analyze` where available; macOS carries an unverified LaunchAgent template; Windows documents foreground operation only.
5. Read the repository's existing issue webhook before creating anything and reuse its Smee channel. When the read is unavailable, ask the responsible person instead of assuming no webhook. Keep the channel URL out of Git, tickets, and logs.

## Acceptance signal

The generator tests pass and show two checkouts receiving different service names and env files. `systemd-analyze verify` accepts the generated unit on this machine when it is available. The setup guide names the project runtime, the local env file, and the three platform files, and contains no `npm install` under the skill directory. A second run reuses the existing webhook and port instead of creating another.

## Boundaries

- No macOS real-machine verification; the guide marks the LaunchAgent unverified.
- No Windows background service; foreground only.
- No runtime upgrade, cutover, or rollback.
- No webhook creation without reading the existing one first.
