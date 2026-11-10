# The shape of a whole report

An example report, written to show the file's skeleton. Its findings are invented: the ids and paths stand in for real ones, and no run of this skill produced this file. A real report uses the same headings and the same fixed fields, fills them from the repository, and cites both sides of every finding.

Read: 12 open maps, 41 open tasks, the six rule files, `GLOSSARY.md`, two ADRs, and the `SKILL.md` of every delivered skill.
Skipped: the testimony records, the worked examples, and `.inbox/`. None of them makes a current promise.

## F1 — Two targets

- **Class:** Two targets
- **Side A:** `wm-example-a ## Target` — the entry skill routes a question to the execution, communication, or environment skill.
- **Side B:** `wm-example-b ## Target` — the setup skill decides which skill answers a startup question.
- **What contradicts:** both name the step "choose the skill that answers this". A splits it across three categories; B answers it for the startup case only and never points at A. Whichever runs second overrides the other's choice.
- **What would settle it:** B hands the choice to A with the startup case named as its input, or A excludes the startup case and points at B.
- **Likely repair:** `update` on B, adding the pointer to A.

## F2 — Promise against artifact

- **Class:** Promise against artifact
- **Side A:** `wm-example-c ## Acceptance direction` — a message for another owner reaches that owner's queue.
- **Side B:** `weave-your-work/issue/SKILL.md` (the routing section) — the listener matches `to` against this machine's owner, and a message naming anyone else is not queued.
- **What contradicts:** A's review point is "the message appears in the recipient's queue". B makes that impossible whenever the recipient is not this machine, so A can pass only on a case narrower than what it promises.
- **What would settle it:** A names a message for this machine's owner, or B accepts another owner's message and records where it goes.
- **Likely repair:** `update` on the map, since the verdict counted this sentence.

## F3 — Rule against rule

- **Class:** Rule against rule
- **Side A:** `.agents/rules/01-use-git.md` — a task is done only after its changes are committed.
- **Side B:** the `execute-all` skill's dispatch reference — a subagent does not commit, and the main agent commits after the report comes back.
- **What contradicts:** A puts the commit inside the task; B puts it after the task's run has returned. Read literally, A makes every subagent's task unfinished.
- **What would settle it:** A says who commits in a batch, or B names committing as the run's step rather than the task's.
- **Likely repair:** edit B, which is the narrower rule.

## Not checked

The `issue` listener's Node tools were read for their file names only; whether they behave as `usage.md` says was not tested. The chemistry example's ticket fixtures were not compared with the skill text they claim to walk, because the example states they are fictional.
