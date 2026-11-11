---
name: stop-and-wait
description: "Step out of the record in front of you and read the whole project: report where two targets, a promise and its artifact, or two rules contradict each other, into a report, and change no record. Use when a person asks whether the project is still consistent, or before a large split or a restart."
family: method
invocation: user
---

# Stop and wait

Work advances one record at a time, and a record is read against what it needs: its parent, its dependencies, the skill it calls. That narrow view cannot see a project that contradicts itself. Two maps can promise the same outcome, a record can say a file exists that does not, and two rules can require opposite things.

This skill is the read that steps out. It stops the current advance, reads the project as a whole, writes what contradicts what, and waits. It decides nothing.

The six conflict classes and the report shape are `res/report.md`.

## When it runs

- The person asks to step back: "look at the whole project", "is this still consistent".
- A run hits the same friction twice: a record reopened for the same reason, a skill path that could not be followed, a repair that undid an earlier repair.
- Before a large split, or before deciding whether to restart.

One pass is one run. Do not keep it open across sessions.

## Steps

1. **Structure.** `waymark tree --root <root-id>`, then the front matter of every open map and task: id, title, status, owner, parent, dependencies, links, `split_as`, `outcome`.
2. **The promises.** `Target` and `Acceptance direction` of every map; `Action` and `Acceptance signal` of every open task.
3. **The artifacts.** Every place a record says something exists — a file, a command, a section, a skill — open it at the named location. The prose is the claim; the file is the evidence.
4. **The rules and the skills.** `.agents/rules/*.md`, `.waymark/config.toml`, and every `SKILL.md` with the references it names. A pointer that resolves from the wrong directory is a finding.
5. **The vocabulary.** `GLOSSARY.md` and `docs/adr/*.md`.
6. **Write the report** under `docs/stop-and-wait/`, one entry per conflict, each citable at both sides.

Deliberately skipped: testimony bodies, the worked examples, and `.inbox/`. They are history, not a current promise. Open one only when a finding needs its citation.

Above roughly forty open records, split the read by subtree and read each subtree in a separate pass, then verify the citations once, in one place.

## Transformation

```
before: a project whose records advance one at a time
after:
- one report under docs/stop-and-wait/, one entry per conflict, both sides citable
- no record changed
```

## What this skill does not do

- Judge a record. `task-review` and `map-review` do that.
- Change any record. It writes the report and stops.
- Decide which finding becomes work. The person reads the report and says.
