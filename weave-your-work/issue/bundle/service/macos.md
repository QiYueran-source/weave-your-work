# macOS service

The LaunchAgent template below is unverified. It has not been tested on a Mac, so treat it as a starting point and check it on the machine before relying on it. Until then, run the listener in the foreground with the command in [windows.md](windows.md); that command is the same on macOS.

## Template

Create `~/Library/LaunchAgents/com.work-weave.issue.<hash8>.plist`, where `hash8` is the first eight hex characters of the SHA-256 of the physical project root (the name `configure.mjs` uses for the Linux unit). Replace every `<...>` value.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.work-weave.issue.<hash8></string>
  <key>ProgramArguments</key>
  <array>
    <string><absolute-node></string>
    <string><project-root>/.work-weave/runtime/issue/listener.mjs</string>
  </array>
  <key>WorkingDirectory</key>
  <string><project-root></string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>REPOSITORY</key>
    <string><owner>/<repo></string>
    <key>SMEE_URL</key>
    <string><smee-url></string>
    <key>PORT</key>
    <string><port></string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string><project-root>/.work-weave/local/issue-listener.log</string>
  <key>StandardErrorPath</key>
  <string><project-root>/.work-weave/local/issue-listener.err.log</string>
</dict>
</plist>
```

The listener also reads `.work-weave/local/issue-listener.env`; the plist can omit the `EnvironmentVariables` block when the file is complete. Keep the Smee URL out of any committed file and out of logs.

## Load and inspect

```sh
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.work-weave.issue.<hash8>.plist
launchctl kickstart gui/$(id -u)/com.work-weave.issue.<hash8>
launchctl print gui/$(id -u)/com.work-weave.issue.<hash8>
```

Stop and remove:

```sh
launchctl bootout gui/$(id -u)/com.work-weave.issue.<hash8>
rm ~/Library/LaunchAgents/com.work-weave.issue.<hash8>.plist
```

Check the log files under `.work-weave/local/` for `listening on` and `Catch-up complete`. If the agent does not start, check `launchctl print` for the exit reason and confirm the Node path and project paths exist.

## Status

Unverified. Do not claim the LaunchAgent works until it has been run on macOS and the live-issue and offline-recovery checks in `setup.md` pass.
