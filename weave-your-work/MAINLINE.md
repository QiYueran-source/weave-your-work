# weave-your-work v2: the mainline and the auxiliary actions

Eight actions carry a project from a settled map to a closed one, `open-map` and `open-task` among them, because an action that only decides still needs the write it calls. Everything else is auxiliary: it can change what the line reads, but it never adds a step to the line. This file is the one place the order, the hand-offs, and the checkpoints between them are written; an action file says what one action does and stops at that action's own end.

## The mainline

```
open-map ─▶ split ─▶ open-map / open-task ─▶ advance-task ─▶ task-review ─▶ whole-review ─▶ map-review
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
| `task-review` | judges one task against its acceptance signal | the owner, or `advance-task` for a named gap |
| `whole-review` | reads a map's closed children together and reports where two of them contradict each other | `map-review` |
| `map-review` | judges one map against its acceptance direction, one verdict per axis | the owner |

`whole-review` runs once per map, after its last child closes and before `map-review` judges it. A map that is its parent's child gets the same pass before that parent is judged.

Each of them is one job and stops where it ends. `open-map` writes and decides nothing; `split` decides and writes nothing; `fog-explore` clears an entry and writes no body; `advance-task` executes and judges nothing; `whole-review` reads the set; `task-review` and `map-review` judge one record each and execute nothing. An action that meets a record it may not write calls the action that writes it: `split` decides a layer and `open-map` or `open-task` writes what it decided, which is why both stand on the line.

`grill` is not a step of the line. A step that cannot settle a question calls it, waits for the testimony, and carries on; the arrow into it is a return path, and the table row that says which step sends work to it is the action's own `Hands off`.

Recursion is the line itself: a child map re-enters at `split`. A map takes children while its acceptance direction holds something one task cannot show, and no depth is set in advance; that condition is also the stop, because a layer whose every part fits one action and one standard is written as tasks. Closing is bottom-up, because a parent's `Acceptance direction` counts its children. There is no separate close action.

## The auxiliary actions

| Action | Produces | Called when |
|---|---|---|
| `update` | a changed record, carried to what relies on it | a record that others rely on has to change |
| `grill` | a testimony | a decision needs a person |
| `adr` | an ADR | the line reaches a checkpoint where a settled decision passes the three gates |
| `glossary` | a glossary entry | the line reaches a checkpoint where a term resolved |
| `issue` | a remote issue and a queue line | a message has to reach another owner |
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

The discussion itself writes no glossary entry and no ADR. `grill` keeps what the person said, the terms the discussion fixed, and the decisions that a recorded ADR no longer matches, and the line writes the rest here.

| After the step | Check | Written by |
|---|---|---|
| `grill` returns to its caller, whichever step sent it | each term the testimony fixed; each settled decision that passes the three gates | the caller calls `glossary` or `adr` |
| `split` has opened a layer | a decision that becomes a child's part and is hard to reverse, surprising, and a real trade-off | `split` calls `adr` before it calls the writer |
| `open-map` or `open-task` has written a record | a word that conflicts with the glossary, or a decision that contradicts a recorded ADR | the writer hands the word or decision to its caller, which calls `glossary` or `adr` |
| `fog-explore` lands an entry | a landed decision that passes the three gates | `fog-explore` calls `adr` after `update` has written the landing |
| `advance-task` hands over its `Result` | a term the work coined, or a decision it made on the way | the run writes both in `Result`; `task-review` calls `glossary` or `adr` for them |
| `update` has carried a change | a decision the change overturns | `update` calls `adr`, which supersedes the old one |

A checkpoint with nothing to write writes nothing, and says so in one line. The three gates are `adr/res/format.md`'s; the shape of an entry is `glossary/res/entry.md`'s.

## Records and their writers

Three record kinds, one writer each: `open-map` writes a map, `open-task` writes a task, `grill` writes a testimony. A writer never decides how many records there are or where they hang; `split` decides that and calls the writer once per record, with the parent. A map opened on its own, with no split above it, is the one call a person makes directly; `fog-explore` sends a landing in a map's body through `update`, and an entry that became work through `split`. The definitions those writers read are `waymark`'s and the record skill's (`map`, `task`); a write that changes a map's body after it exists is `update`'s, and an append to a record that exists is `advance-task`'s or a review's.

Neither writer calls `split`, and `split` calls only writers. That single direction is what keeps a root map and a child map from growing two different opening paths, which is how the first set ended up with a rule written twice.

Every writer and every step of the line points at the record skill for what a record holds: `map`, `task`, `grill`, `adr`, `glossary`. None restates it, and a rule that two of them would otherwise share goes into the record skill's `res/` once.

## Resources

No action defines a record. Every record is defined once, in `waymark/res/`. An action that needs a definition calls `waymark`; it never links into another action's folder, and it never restates what a record contains.
