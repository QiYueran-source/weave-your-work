---
name: stop-and-wait
description: "Step out of the ticket in front of you and read the whole project: report the places where two targets, a promise and its artifact, or two rules contradict each other, into docs/stop-and-wait/, and change no ticket."
---

# Stop and wait

Work advances one ticket at a time, and a ticket is read against what it needs: its parent map, its dependencies, the skill it calls. That narrow view cannot see a project that contradicts itself. Two maps can promise the same outcome, a ticket can say a file exists that does not, and two rules can require opposite things. None of that fails a single ticket; each one costs work only later.

Stop-and-wait is the read that steps out. It stops the current advance, reads the project as a whole, writes what contradicts what, and waits. It decides nothing. The person reads the report and says which findings become work.

It is not `map-review` or `task-review`. Those judge one ticket against its own acceptance direction and record a verdict. This skill compares separate parts of the project to each other and to the repository, and records no verdict.

## When it runs

- The person asks to step back: "look at the whole project", "is this still consistent", "find the contradictions".
- A run hits the same friction twice: a ticket reopened for the same reason, a skill path that could not be followed, a repair that undid an earlier repair.
- Before a large split, or before deciding whether to restart. That decision needs to know what actually disagrees, and `salvage-and-restart` reads this report as its input.

One pass is one run. Do not keep it open across sessions.

## The read set

Read in this order, and stop when the next item cannot change a finding.

1. **Structure.** `waymark tree --root <root-id>` for the shape, then the front matter of every open map and task: `id`, `title`, `status`, `owner`, `parent`, dependencies, links, `split_as`, `outcome`.
2. **The promises.** `Target` and `Acceptance direction` of every map; `Action` and `Acceptance signal` of every open task. This is what each node claims will be true.
3. **The artifacts.** Every place a ticket says something exists — a file, a command, a section, a skill — open it at the named location. The prose is the claim; the file is the evidence.
4. **The rules.** `.agents/rules/*.md` and `.waymark/config.toml`.
5. **The skills.** `weave-your-work/*/SKILL.md` and every reference each one names. A pointer that resolves from the wrong directory is a finding.
6. **The vocabulary.** `GLOSSARY.md` and `docs/adr/*.md`.

Deliberately skipped: testimony bodies, the worked examples, and `.inbox/`. They are history, not a current promise, and reading them turns the report into a summary. Open one only when a finding needs its citation.

Above roughly forty open tickets, split the read by subtree and read each subtree in a separate pass, then verify the citations once, in one place. A report assembled from unverified passes is the failure this skill exists to avoid.

## Six conflict classes

The list is closed. A candidate that fits none of them is an opinion, and is dropped. Adding a class is a decision recorded on this skill's map, not something a report invents.

1. **Two targets.** Two nodes promise the same outcome, or one node's target is a subset of another's. The work will be done twice, or one of them will be accepted while the other silently duplicates it.
2. **Uncovered direction.** A map's acceptance direction names a result that no child reaches, or a child whose target is not needed for the parent's direction to hold. `map-review` finds this inside one map at review time; this class is for the gap that spans maps, where each map passes alone and the set still misses.
3. **Promise against artifact.** A ticket, a rule, or a skill says a file, section, command, or pointer exists; it does not, or it does something else. Read at the cited location, not from memory.
4. **Rule against rule.** Two rules require opposite things, or a skill's rule contradicts a rule file the project installed.
5. **Rule against practice.** The repository does something a rule forbids, or needs something no rule or skill provides. The practice is the evidence; a rule nobody follows is still a contradiction.
6. **Vocabulary drift.** One thing carries two names, or one name covers two things, across the glossary, the skills, and the tickets. Say which two places.

## A finding needs two sides

A finding is a claim about a relation, so it has to name both ends. One side alone — "this ticket is vague", "this file is long" — is a preference, not a conflict, and is dropped.

Before it goes in the report, open both sides again and cite them:

- a ticket: its id and the section, `wm-0jc0gzrgv7z0 ## Acceptance direction`;
- a file: its path and line, `weave-your-work/map/body.md:12`;
- a rule: its file and the sentence, `.agents/rules/02-english.md`.

If either side cannot be cited that way, the finding is not ready. Two findings about one contradiction are one finding: write it once, with both sides in it.

Deliberate differences are not findings. A struck-through entry with a `Superseded on` line is history that the ticket already explains; a rule that exempts itself in its own text is not in conflict with the thing it exempts. Read the whole entry before calling it a contradiction.

## The report

One file per run: `docs/stop-and-wait/YYYY-MM-DD-<topic>.md`. Commit it with the rest of the run.

The top says what the run read, what it skipped, and the date. Then one numbered finding per contradiction, in this fixed shape:

```markdown
## F3 — Promise against artifact

- **Class:** Promise against artifact
- **Side A:** `wm-25b3q7mg88c7 ## Acceptance direction` — says the listener queues a message for a recipient on another machine.
- **Side B:** `weave-your-work/issue/SKILL.md:154` — the listener routes by `to` against this machine's owner, so a message for another owner is never queued.
- **What contradicts:** A's check is "a message reaches the recipient"; B makes that impossible for the case A describes, so A cannot pass by the evidence it names.
- **What would settle it:** Change A to name a message for this machine's owner, or change B to accept another owner's message when the queue names it.
- **Likely repair:** `update` on the map, since the verdict it was accepted on counted this sentence.
```

Close the file with `## Not checked`: what the run did not open, so the next run knows where the boundary was. An empty section is not allowed; say what was skipped and why.

Numbers are stable only inside one file. Refer to a finding as `<file> F3`.

`report.md` beside this file shows a whole report with two findings.

## What the run ends with

The report committed, then three lines: the path, the count per class, and which findings block work that is happening now. Nothing else.

Then ask which findings become tickets. The person picks; the run does not open them, and it does not fix what it found. `execute-all` or `split` takes the chosen ones afterward, under the map that should own each.

## What it never does

- Write, open, close, archive, or reopen a ticket. The report is the only file it adds.
- Fix the conflict it found, in any amount.
- Grade the project. There is no score, badge, or coverage number; the output is specific contradictions with two cited sides.
- Report a style preference, a long file, a vague title, or a ticket it merely disagrees with. Those fit no class, or have one side.
- Judge one ticket against its own acceptance direction. That is `map-review` and `task-review`.
- Run as a background habit. It starts when the person asks or when the triggers above fire, and it is one pass.
