# Windows service

There is no bundled background service for Windows. Run the listener in the foreground in a terminal while you work; it stops when the terminal closes.

From the project root in PowerShell:

```powershell
node .work-weave\runtime\issue\listener.mjs
```

The listener reads `.work-weave\local\issue-listener.env`, so it does not need `REPOSITORY`, `SMEE_URL`, or `PORT` in the shell. If the settings file is absent, run `configure.mjs` first:

```powershell
node .work-weave\runtime\issue\configure.mjs --project (Get-Location) --repository "<owner>/<repo>" --smee-url "<channel>"
```

The startup scan and live webhook path work the same as on Linux. A second listener on the same queue exits with `Another listener holds the queue lock`; close the first one before starting another.

To stop the listener, press Ctrl+C in its terminal. The lock is released on a normal exit and recovered on the next start after a crash.

Task Scheduler and Windows Service wrappers are not part of this bundle. If you add one, keep the checkout's paths and settings file; do not copy a unit from another checkout.
