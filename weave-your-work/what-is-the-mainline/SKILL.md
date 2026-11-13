---
name: what-is-the-mainline
description: "What the order of the set is: the seven actions from a settled map to a closed one, what each hands to, the auxiliary actions that change a record without adding a step, and who writes which record kind. Read it to see what runs next and where a step stops; it describes the order and runs nothing."
family: track
invocation: model
---

# What is the mainline

Seven actions carry a project from a settled map to a closed one, `open-map` and `open-task` among them, because an action that only decides still needs the write it calls. Every one of them but `map-review` is model-invoked, so the line runs from its first step to its last without a person restarting it; the map's close is the one decision left to a person. Everything else is auxiliary: it can change what the line reads, but it never adds a step to the line.

This skill is the one place the order and the hand-offs between them are written; an action file says what one action does and stops at that action's own end. Read it before starting a step you cannot place.

## The mainline

```
open-map ─▶ split ─▶ open-map / open-task ─▶ advance-task ─▶ task-review ─▶ map-review
             │                                                                          ▲
             ├─▶ fog-explore ─▶ split    (the layer still has fog: clear it first)
             │                                                              │
             └─ a child map re-enters at split; its own map-review joins above

split, fog-explore ─▶ grill-and-records    (the step cannot settle the question)
                         │
                         └─ the testimony comes back to the caller, which carries on
```

| Action | Does one thing | Hands off |
|---|---|---|
| `open-map` | writes one map from the target it is given: the root, or one child of a split | `split`, once the map has a layer to cut |
| `open-task` | writes one task from the part, action, and signal the split gives it | `advance-task` |
| `split` | turns a settled layer into child maps or tasks: it decides the type and the count, then calls `open-map` or `open-task` once per child | `advance-task` for a task, `split` for a child map |
| `fog-explore` | clears one open fog entry | `update` for a landing in the map's body, `split` when no entry remains |
| `advance-task` | takes one task, or a batch, to a written `Result` | `task-review` |
| `task-review` | judges one task against its acceptance signal, one verdict per axis | the owner, or `advance-task` for a named gap |
| `map-review` | judges one map against its acceptance direction, one verdict per axis | the owner |

A person may run `whole-review` before this last step.

Each of them is one job and stops where it ends. `open-map` writes and decides nothing; `split` decides a layer and writes no record; `fog-explore` clears an entry and writes no body; `advance-task` executes and judges nothing; `task-review` and `map-review` judge one record each and execute nothing. An action that meets a record it may not write calls the action that writes it: `split` decides a layer and `open-map` or `open-task` writes each child it decided, which is why both stand on the line. What `split` writes itself is the field only it can judge, `split_as`, and the status the first cut starts.

`grill-and-records` is not a step of the line. A step that cannot settle a question calls it, waits for what it settled and wrote, and carries on; the arrow into it is a return path, and the table row that says which step sends work to it is the action's own `Hands off`.

`whole-review` is off the line: a person runs it when a map's children are worth reading as a set, and `map-review` judges the map with or without the paragraph it writes. It is the one pass in the set that nobody calls by itself.

`resplit` is a return path too, and rarer: a task that waits on a sibling's output means the layer was cut wrong, and `advance-task` sends that case to `resplit`, which turns the wait into a dependency edge between two child maps. A task runs alone, or its order is the order of two maps; nothing in between.

Recursion is the line itself: a child map re-enters at `split`. A map takes children while its acceptance direction holds something one task cannot show, and no depth is set in advance; that condition is also the stop, because a layer whose every part fits one action and one standard is written as tasks. A split that writes child maps keeps going on each of them the same way, and one that writes tasks hands them to `advance-task`; nothing between the two needs a person to restart it. Closing is bottom-up, because a parent's `Acceptance direction` counts its children. There is no separate close action.

## The auxiliary actions

| Action | Produces | Called when |
|---|---|---|
| `update` | a changed record, carried to what relies on it | a record that others rely on has to change |
| `grill-and-records` | a testimony, the glossary entries and ADRs the discussion settled | a decision needs a person |
| `adr` | an ADR | a settled decision passes the three gates |
| `glossary` | a glossary entry | a term resolves, or someone asks what the project means by a word |
| `issue` | a remote issue and a queue line | a message has to reach another owner |
| `resplit` | a task layer recut into child maps with a dependency edge between them | a task cannot start because a sibling task has not finished |
| `handoff` | a handoff document | the work continues in another session |
| `wait-what` | a four-column table, changing nothing | the person lost the thread |
| `stop-and-wait` | a patrol report, changing nothing | the project may contradict itself |
| `salvage-and-restart` | a salvage record and a new root | the tree no longer describes the work |
| `feedback-me-please` | an issue upstream | a skill misbehaved, or worked well |
| `setup` | a configured project | the project has no tracker, or a clone cannot run the set |

## The one rule between them

An auxiliary action stops at the record. It writes the field, the body, or the status; it does not take over the line, and the line resumes where it stopped.

When the line needs something an auxiliary action produces, it names the state it waits on, not the action: `advance-task` stops on `waiting_on`, and the answer arrives through `issue` and clears it. The next run picks the task up by the same rule as any other.

## Where a term and an ADR are written

A discussion writes them itself: `grill-and-records` runs `grilling` for the words and the decisions, then `glossary` for each term and `adr` for each decision whose three gates pass. Nothing else in the line keeps a checkpoint list, because nothing else needs one: the action that settles a decision is the action that reaches `adr`.

A decision made anywhere else stays where it was made, in a map's `Decisions so far` or in a `Result`, until someone decides it earned a file. That is a person's call, not a step's.

## Records and their writers

Three record kinds, one writer each: `open-map` writes a map, `open-task` writes a task, `grilling` writes a testimony. A writer never decides how many records there are or where they hang; `split` decides that and calls the writer once per record, with the parent. A map opened on its own, with no split above it, is the one call a person makes directly; `fog-explore` sends a landing in a map's body through `update`, and an entry that became work through `split`. The definitions those writers read are `waymark`'s and the record skill's (`map`, `task`); a write that changes a map's body after it exists is `update`'s, and an append to a record that exists is `advance-task`'s or a review's.

Neither writer calls `split`, and `split` calls only writers. That single direction is what keeps a root map and a child map from growing two different opening paths, which is how the first set ended up with a rule written twice.

Every writer and every step of the line points at the record skill for what a record holds: `map`, `task`, `grilling`, `adr`, `glossary`. None restates it, and a rule that two of them would otherwise share goes into the record skill's `res/` once.

## What this skill does not do

- Run a step. The actions run; this file only says what order they go in.
