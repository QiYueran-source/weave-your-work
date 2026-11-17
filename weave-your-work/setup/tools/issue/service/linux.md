# Linux service

The setup generates one systemd user unit per checkout:

```text
.work-weave/local/work-weave-issue-<hash8>.service
```

The unit records the checkout's working directory, `.work-weave/local/issue-listener.env`, and the project runtime's `listener.mjs`. Do not copy a unit from another checkout; its paths and port belong to that checkout.

## Install

From the project root, after `configure.mjs` wrote the unit:

```sh
unit="<unit path printed by configure.mjs>"
systemctl --user link "$unit"
systemctl --user daemon-reload
systemctl --user enable --now "$(basename "$unit")"
systemctl --user is-active "$(basename "$unit")"
```

Use the path that `configure.mjs` printed rather than recomputing the hash: the hash is over the physical project root, which may differ from a symlinked path. The unit runs the Node binary that generated it, so a version manager's shell setup is not needed at boot.

Enable linger once so the user service survives logout:

```sh
loginctl enable-linger "$USER"
loginctl show-user "$USER" | grep Linger
```

## Inspect

```sh
systemctl --user status work-weave-issue-<hash8>.service
journalctl --user -u work-weave-issue-<hash8>.service -n 50 --no-pager
```

The log shows `listening on`, the Smee connection, and `Catch-up complete`. The Smee URL is redacted. A literal URL in the log means the redaction broke.

## Port conflicts

If `configure.mjs` reports the stored port occupied, stop the process using it or choose another port:

```sh
node .work-weave/runtime/issue/configure.mjs --project "$(pwd)" --port <new-port>
```

Then restart the service. The setup never changes a stored port silently.

## Stop, remove, or move

```sh
systemctl --user disable --now work-weave-issue-<hash8>.service
systemctl --user unlink work-weave-issue-<hash8>.service
systemctl --user daemon-reload
```

Unlinking removes the user-manager link; the generated file stays under `.work-weave/local/`. Removing a checkout does not remove another checkout's unit. Re-running setup for the same root rewrites the same unit name.
