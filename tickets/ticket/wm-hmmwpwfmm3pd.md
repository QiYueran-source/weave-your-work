---
schema: 1
id: wm-hmmwpwfmm3pd
title: Write an ADR to your own source file
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T06:13:01Z
updated_at: 2026-11-17T06:19:10Z
closed_at: 2026-11-17T06:19:10Z
---
## Parent

Spec `wm-ms5r0fftcva8`: ADR: office-ready, per-operator sources, millisecond ids.

## What to build

An operator settles a decision that passes the three gates and writes it down in
one command. The command writes one line to that operator's own source file and
touches nothing else.

This ticket also carries work already done before it was filed: `adr/SKILL.md`
and `adr/ADR-FORMAT.md` were rewritten for office work in the same session the
spec was published. Both files are in the working tree. Read them against the
spec before starting; what is left is the tool they describe.

## Acceptance criteria

- [ ] `adr.js write --title <t> --decision <d>` appends one JSONL line to
      `.work-weave/adr/<operator>.jsonl`, creating the directory on the first write
- [ ] The line carries `id`, `title`, `decision`, `status`, `supersedes`,
      `record`, and `created_at`
- [ ] `id` is shaped `<operator>-<YYYYMMDD>T<HHMMSS>.<mmm>`
- [ ] `status` defaults to `accepted`
- [ ] `supersedes` and `record` are `null` when not given
- [ ] Two writes in the same second get two different ids
- [ ] A write touches no file other than the operator's own source
- [ ] `adr.js list` prints every entry across sources
- [ ] `adr.js show <id>` prints one entry
- [ ] The operator name comes from `.waymark/user.toml`, falling back as the
      glossary tool does
- [ ] A test covers each behaviour above against a temporary project

## Blocked by

None (can start immediately).
