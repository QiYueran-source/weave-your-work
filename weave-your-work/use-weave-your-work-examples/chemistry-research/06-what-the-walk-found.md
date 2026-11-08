# What the walk found

The single-task path works. A reader can design a delivery or a probe, run it to `Result`, review it, and close it. The batch path has three rules that break against waymark, and the review path cannot see some of the sections task design calls required.

The findings below are ordered by what would go wrong in a real run, not by how easy they are to fix.

## Breaks the run

### 1. A batch can reopen closed tasks

`execute-all` says "Status does not filter" ([SKILL.md](../../execute-all/SKILL.md)). The sentence does not exclude closed tasks, and `waymark start` moves a closed task back to `in_progress`.

```
$ waymark start wm-wea2f4ywz4v1
set wm-wea2f4ywz4v1 closed -> in_progress
```

The screen map has two closed tasks and one open task at the point a batch would start. A run that selects by owner would claim the closed protocol task and send it out again. The rule needs to say that only `open` and `in_progress` are eligible, and that a closed task is never claimed.

### 2. A batch does not check the parent map

`execute-all` selects tasks under a map and never reads the map's dependency state. `waymark ready` ignores `parent`, so a task under a blocked map is reported ready. A scratch branch confirmed it: the map was `blocked` while its child task was `ready`, and `waymark start` accepted the task.

`execute-one-task` reads the map's `Target` and `Acceptance direction` but does not check that the map is ready either. The glossary says a task is ready when the map above it is ready, but the command does not enforce that, and the skills do not add the check.

### 3. Nothing clears `waiting_on` when the answer arrives

`properties.md` says `waiting_on` is cleared when the answer arrives, not when work resumes. `execute-all` excludes tasks with a `waiting_on` value, and says whoever advances the task clears it. The next run is the one that advances, but it only picks tasks whose value is already clear. No skill step breaks the loop.

In the walk a person cleared it by hand:

```
$ waymark field update wm-0jba45z3c75b --clear waiting_on
```

A run that follows only the skill text does not know to do that. The task stays out of every later batch.

## Rules that do not match the tool

### 4. Two task-layer rules are not machine-checked

`properties.md` says a task's `parent` is a map, never another task, and calls this "machine checkable". It is not. A task created with `--parent <task-id>` was accepted, and `waymark validate` reported no parent-type error; in the scratch copy it reported only `NOT_A_GIT_REPOSITORY`.

The same file says a task never sets a dependency edge. It is not checked either. `waymark dependency add` accepted an edge from one task to another, and `validate` stayed clean.

Both rules are still right. The sentence that calls the first one machine-checkable is wrong, and a reader who trusts it will not check the tree.

### 5. Order is carried by the tree

`task-design/SKILL.md` says "Order is carried by the tree, never by a link." The glossary says the opposite: "The tree carries structure, edges carry order." `map/frontmatter.md` says a dependency edge "is the only place ordering is expressed." The sentence should say order is carried by dependency edges between maps, never by a link.

The scenario depends on the correct version: the pilot waits on the screen through an edge between two sibling maps. If a reader follows "the tree carries order", the edge looks optional.

### 6. Only the owner advances, but anyone may review

`map/frontmatter.md` says one owner per item and only the owner advances it. `task-review` says anyone may review, and a non-owner reviewer acts with the owner's authority. Waymark warns but allows the write, so both statements describe what happens. They still disagree about who is allowed.

The scenario has one owner, so it does not pick a side. A cross-owner review would need the rule to name the exception or drop the claim.

### 7. `waymark owner` is not the command

`properties.md` says the owner is changed with `waymark owner`. The command is `waymark owner transfer`. Small, but a reader copying it gets a usage error.

## What the review cannot see

### 8. Required sections are not reviewed

`task-design/body.md` makes `Failure recovery` required for `one_way` work and `Next step` required for a probe. `task-review` reads `Action`, `Acceptance signal`, `Boundaries`, and `Result`; it never names either required section. A one_way task with no `Failure recovery`, or a probe with no `Next step`, can pass.

The pilot has its `Failure recovery`; the probe has its `Next step`. The fixture does not expose the gap, because both tickets were written with the required section. The rule and the review are simply not connected.

### 9. `needs_human` and `Person:` are not checked

`properties.md` says the field and the body must agree: `true` needs at least one `Person:` step, `false` needs none. `task-review` checks `Boundaries` and writes, not that agreement. A task with `needs_human: true` and no person step can pass, and `execute-all` will keep excluding it for no reason.

### 10. The incomplete-probe branch has no verdict

`task-review/probe.md` says a check that could not be completed at all is recorded in `Result` with its reason and what happens instead. It says to read that first, then asks whether the reason and the retry match what the map can do. It never says which of the four verdicts to write. A reviewer has to guess between `needs changes` and `needs discussion`.

### 11. `Next step` confirmation is not checked

`task-design/body.md` says a probe's `Next step` is written at design time and the map's owner confirms both outcomes when the answer lands. Neither `execute-one-task` nor `task-review` reads that confirmation. The probe in the fixture closed with the two lines still written by the designer, and no owner confirmation recorded.

### 12. The three optional fields

`properties.md` opens by saying three fields are optional: `waiting_on`, `outcome`, and `needs_human`. It later says `needs_human` is "the only optional one." The scenario uses `needs_human` on all four tasks and leaves the other two unset; the first sentence is the accurate one. The second is either a typo or means "the only optional one at creation", which it does not say.

## Wording that sends a reader the wrong way

### 13. `Progress` starts when the work starts, or only when it stops

`body.md` says `Progress` is "set when the work starts, updated whenever the state changes, and removed before the ticket closes." `execute-one-task` never writes it at the start; it writes it when the run stops, and removes it at the end if a stop left one. The closed protocol and table carry no `Progress`, so the fixture cannot show whether one was written at the start. The reader still cannot tell which rule to follow while the work is running.

### 14. A re-run does not read the gap

`execute-one-task` does not read the existing `## Review` before a re-run. `execute-all` says a `needs changes` task goes to a fresh subagent "with the named gap", but `dispatch.md`'s list of what a subagent receives does not include the gap. The subagent gets the ticket id, the map, and the skill; it does not get the sentence that says what to fix.

### 15. A full-body replace can drop `Review`

`execute-one-task` says only `Result`, `Progress`, and `waiting_on` may be written, and that `## Review` stays as it is. The command it uses, `waymark body replace`, replaces the whole body. The executor has to include the old `## Review` in the new body to preserve it, and no step says so. A careful executor can do it; the skill does not tell them to.

### 16. The batch's write permission is wider than the run's

`dispatch.md` says a subagent may write "its own ticket: body sections, `waiting_on`, and the claim." `execute-one-task` limits the writes to `Result`, `Progress`, and `waiting_on`. "Body sections" would allow `Action` and `Acceptance signal`, which the execution skill forbids. The narrower rule is the intended one.

### 17. "Child maps" for a sequence

`task-design/SKILL.md` and `body.md` say a sequence is "one action with several steps, or the map splits into child maps that carry the edge." The scenario's screen and pilot are sibling maps under the root, not child maps of each other. The words can be read correctly, but they invite the wrong shape. Say "sibling maps under the same parent, with the edge between them."

### 18. The example task is stale

[task-example.md](../task-example.md) still shows `## Verifiable result`, `## Kind`, and `## Reversibility` as body sections. The task design skill puts the kind and reversibility in front matter and does not define a `Verifiable result` section. The file is linked from [the examples entry](../SKILL.md) as "one complete task", so a reader can copy a shape the skill no longer accepts.

## Flow that has no step

### 19. A hand-back has no route to a failed close

`execute-one-task` says a task that no longer holds is handed back to the owner with `Progress` and `waiting_on`, still `in_progress`. It does not write `Result`. `task-review` starts from a finished run and a `Result`. The `wrong direction` verdict closes a task as a failed attempt, but the hand-back never reaches the review. The owner can write `Result` and invoke the review by hand, as the scratch walk did; no skill says to.

## What held

- The probe's negative finding passed. Nickel missed the floor, the ticket closed, and no `outcome` was set.
- The `one_way` gate was honored: the confirmation was recorded before the charge, and the review found it in `Result`.
- `Person:` steps and `needs_human` agreed in the probe and the pilot, so the batch exclusion was correct even though the review does not check it.
- The root `submap`, screen `task`, and pilot `task` split produced the tree the scenario needed.
- In the scratch walk, `waiting_on` recorded the lab wait and kept the probe out of the batch.
- The `task` entry routed each question to the right skill without repeating their rules.
- `split_as` froze the child type of each map; the root's children stayed maps and the screen's children stayed tasks.

## What this walk did not do

No skill file was edited. This directory records the scenario and the findings; fixes need their own tickets under the task skill map.

The batch's subagent dispatch was not run. The selection, claim, and field states were checked with waymark commands. The review's `needs discussion` and `wrong direction` paths were checked in scratch copies, not in the committed fixture. The hand-back path that should lead to `wrong direction` was not exercised; the scratch task went from `execute-one-task` to a manual `Result`.
