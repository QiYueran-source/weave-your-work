# Smee setup

The listener that receives communicate issues and queues them for the next session. Run it once per repository. The setup skill points here; this file is the whole installation.

## What it sets up

- A smee.io channel, which gives the repository a public webhook URL.
- A GitHub webhook for `issues` and `issue_comment`.
- The local listener behind the smee client, with a signature check.
- The pending queue path in `.waymark/handles.toml`.
- The session rule at `.agents/rules/06-pending-communications.md`.
- The catch-up query for the sessions where the listener was off.

## 1. The channel

Open `https://smee.io`, create a channel, and copy its URL, `https://smee.io/<id>`. The channel id is the secret; anyone who has it can post events to the client, so keep it out of the repository.

## 2. The webhook

In the repository: Settings → Webhooks → Add webhook.

- **Payload URL**: the smee channel URL.
- **Content type**: `application/json`.
- **Secret**: a random string. Keep it as `WEBHOOK_SECRET` for the listener; it is not committed.
- **Events**: Issues, Issue comments.
- **Active**: yes.

GitHub needs no public endpoint of its own; smee holds the public URL and forwards to the local client.

## 3. The listener

The listener is `listener.py` in this skill's directory. It needs Python 3.10+ and `tomli` (Python 3.11 has `tomllib`).

```bash
cd <repo>
WEBHOOK_SECRET=<secret> python3 <skill-dir>/listener.py --port 8765
```

The smee client forwards the webhook to it:

```bash
npx smee-client --url https://smee.io/<id> --target http://127.0.0.1:8765/webhook
```

The client keeps the long connection and forwards the original headers, so the listener can verify `X-Hub-Signature-256` before it writes anything. `npx` fetches the client; Node must be installed.

## 4. The service

Run the two processes at login. A user service with an environment file outside the repository:

`~/.config/work-weave/smee.env` (mode 600):

```
WEBHOOK_SECRET=<secret>
```

`~/.config/systemd/user/issue-listener.service`:

```ini
[Unit]
Description=Queue communicate issues for waymark
After=network-online.target

[Service]
WorkingDirectory=<repo>
EnvironmentFile=%h/.config/work-weave/smee.env
ExecStart=/usr/bin/env python3 <skill-dir>/listener.py --port 8765
Restart=on-failure

[Install]
WantedBy=default.target
```

`~/.config/systemd/user/smee-client.service`:

```ini
[Unit]
Description=Forward smee events to the issue listener
After=issue-listener.service

[Service]
WorkingDirectory=<repo>
ExecStart=/usr/bin/env npx smee-client --url https://smee.io/<id> --target http://127.0.0.1:8765/webhook
Restart=on-failure

[Install]
WantedBy=default.target
```

```bash
systemctl --user daemon-reload
systemctl --user enable --now issue-listener smee-client
```

Without a service, run both commands in a terminal while you work. The catch-up in step 7 covers the sessions where neither was running.

## 5. The queue path

`.waymark/handles.toml`:

```toml
[handles.github]
frank = "QiYueran-source"
hanjiang = "hanjiang-gh"

[pending]
path = "../pending/pending-communications.md"
```

The path is resolved from `.waymark/`, so the default is `<repo>/pending/pending-communications.md`. The directory is local state: add `pending/` to `.gitignore`. `handles.toml` is shared and tracked.

## 6. The session rule

`.agents/rules/06-pending-communications.md`:

```markdown
# Read Pending Communications at Session Start

1. Read the `[pending].path` in `.waymark/handles.toml`, resolved from `.waymark/`. When the file or the key is absent, read `pending/pending-communications.md`.
2. If the queue has entries, open the session with one line: how many, and their titles.
3. Do not act on an entry until the person asks.
```

The setup skill installs this rule; the copy in this repository is the sample. The rule is what turns the queue into a session-opening line without a harness hook.

## 7. The catch-up

The listener only receives while it runs. When a session starts after the machine was off, run:

```bash
gh search issues --mentions @me --state open --limit 50 \
  --json number,title,repository,url
```

Keep the issues whose body opens with `kind: communicate` and whose `tickets` are local; append the missing ones to the queue. This is a start-of-session check, not a polling loop.

## 8. The test

1. File a communicate issue addressed to yourself.
2. Watch the listener log; the queue should gain one line.
3. Open a new session; the rule should surface the count and title.
4. Reply and close the issue; the queue line stays as the record of what arrived.

If the queue stays empty, check the webhook's Recent Deliveries, the smee client's connection, the listener's signature check, and the frontmatter's `kind: communicate`.
