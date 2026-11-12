# weave-your-work v2: the mainline and the auxiliary actions

Seven actions carry a project from a settled map to a closed one, `open-map` and `open-task` among them, because an action that only decides still needs the write it calls. Every one of them but `map-review` is model-invoked, so the line runs from its first step to its last without a person restarting it; the map's close is the one decision left to a person. Everything else is auxiliary: it can change what the line reads, but it never adds a step to the line. This file is the one place the order, the hand-offs, and the checkpoints between them are written; an action file says what one action does and stops at that action's own end.

## The mainline

```
open-map ─▶ split ─▶ open-map / open-task ─▶ advance-task ─▶ task-review ─▶ map-review
             │                                                                          ▲
             ├─▶ fog-explore ─▶ split    (the layer still has fog: clear it first)
             │                                                              │
             └─ a child map re-enters at split; its own map-review joins above

split, fog-explore ─▶ grill    (the step that met the question cannot settle it)
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

A person may run `whole-review` before this last step; see the note below the table.

Each of them is one job and stops where it ends. `open-map` writes and decides nothing; `split` decides a layer and writes no record; `fog-explore` clears an entry and writes no body; `advance-task` executes and judges nothing; `task-review` and `map-review` judge one record each and execute nothing. An action that meets a record it may not write calls the action that writes it: `split` decides a layer and `open-map` or `open-task` writes each child it decided, which is why both stand on the line. What `split` writes itself is the field only it can judge, `split_as`, and the status the first cut starts; `docs/adr/0004-the-writer-is-the-action-that-decided.md` says why.

`grill` is not a step of the line. A step that cannot settle a question calls it, waits for the testimony, and carries on; the arrow into it is a return path, and the table row that says which step sends work to it is the action's own `Hands off`.

`whole-review` is off the line: a person runs it when a map's children are worth reading as a set, and `map-review` judges the map with or without the paragraph it writes. It is the one pass in the set that nobody calls by itself.

`resplit` is a return path too, and rarer: a task that waits on a sibling's output means the layer was cut wrong, and `advance-task` sends that case to `resplit`, which turns the wait into a dependency edge between two child maps. A task runs alone, or its order is the order of two maps; nothing in between.

Recursion is the line itself: a child map re-enters at `split`. A map takes children while its acceptance direction holds something one task cannot show, and no depth is set in advance; that condition is also the stop, because a layer whose every part fits one action and one standard is written as tasks. A split that writes child maps keeps going on each of them the same way, and one that writes tasks hands them to `advance-task`; nothing between the two needs a person to restart it. Closing is bottom-up, because a parent's `Acceptance direction` counts its children. There is no separate close action.

## The auxiliary actions

| Action | Produces | Called when |
|---|---|---|
| `update` | a changed record, carried to what relies on it | a record that others rely on has to change |
| `grill` | a testimony | a decision needs a person |
| `adr` | an ADR | the line reaches a checkpoint where a settled decision passes the three gates |
| `glossary` | a glossary entry | the line reaches a checkpoint where a term resolved |
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

The discussion itself writes no glossary entry and no ADR. `grill` keeps what the person said, the terms the discussion fixed, and the decisions that a recorded ADR no longer matches. Everything below says what a step leaves behind worth writing; which action writes it is decided by whoever holds the context, since these are readings, not calls.

| A step leaves behind | Where it may land |
|---|---|
| a discussion that fixed a term, or settled a decision the three gates pass | a glossary entry, or an ADR |
| a split whose decision becomes a child's part, hard to reverse, surprising, and a real trade-off | an ADR |
| a record whose word conflicts with the glossary, or whose decision contradicts a recorded ADR | a glossary entry, or an ADR that supersedes the old one |
| a landed fog entry whose decision passes the three gates | an ADR |
| a `Result` that coined a term or made a decision on the way | a glossary entry, or an ADR |
| a change that overturns a recorded decision | an ADR that supersedes the old one |

Most of these are written by the action that produced them, because it read the thing the gates judge on: `split`, `fog-explore`, and `update` each reach their own. `grill` and `open-map`/`open-task` do not: what they produce is a decision or a word their caller went looking for, so the caller decides whether it earned a file. `advance-task` writes the term or the decision into `Result`, and `task-review` reads that and decides.

Nothing here is a call, and no step waits on one. A step that finds nothing worth writing writes nothing, and says so in one line. The three gates are `adr/res/format.md`'s; the shape of an entry is `glossary/res/entry.md`'s.

## Records and their writers

Three record kinds, one writer each: `open-map` writes a map, `open-task` writes a task, `grill` writes a testimony. A writer never decides how many records there are or where they hang; `split` decides that and calls the writer once per record, with the parent. A map opened on its own, with no split above it, is the one call a person makes directly; `fog-explore` sends a landing in a map's body through `update`, and an entry that became work through `split`. The definitions those writers read are `waymark`'s and the record skill's (`map`, `task`); a write that changes a map's body after it exists is `update`'s, and an append to a record that exists is `advance-task`'s or a review's.

Neither writer calls `split`, and `split` calls only writers. That single direction is what keeps a root map and a child map from growing two different opening paths, which is how the first set ended up with a rule written twice.

Every writer and every step of the line points at the record skill for what a record holds: `map`, `task`, `grill`, `adr`, `glossary`. None restates it, and a rule that two of them would otherwise share goes into the record skill's `res/` once.

## Resources

No action defines a record. Every record is defined once, in `waymark/res/`. An action that needs a definition calls `waymark`; it never links into another action's folder, and it never restates what a record contains.
