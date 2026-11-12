# weave-your-work v2: the mainline and the auxiliary actions

Five actions carry a project from a settled map to a closed one. Everything else is auxiliary: it can change what the line reads, but it never adds a step to the line.

## The mainline

```
split ──▶ fog-explore ──▶ split ──▶ advance-task ──▶ task-review ──▶ map-review
   ▲                                        │                        │
   └──────────── a child map re-enters ─────┴── map-review per map ───┘
```

| Action | Does one thing | Hands off |
|---|---|---|
| `split` | turns a settled layer into child maps or tasks; it decides the type and the count, then calls the action that writes each record | `advance-task` for a task, `split` for a child map |
| `fog-explore` | clears one open fog entry | `split` when no entry remains |
| `advance-task` | takes one task, or a batch, to a written `Result` | `task-review` |
| `task-review` | judges one task against its acceptance signal | the owner, or `advance-task` for a named gap |
| `map-review` | judges one map against its acceptance direction | the owner |

Recursion is the line itself: a child map re-enters at `split`. A map takes children while its acceptance direction holds something one task cannot show, and no depth is set in advance; that condition is also the stop, because a layer whose every part fits one action and one standard is written as tasks. Closing is bottom-up, because a parent's `Acceptance direction` counts its children. There is no separate close action.

## The auxiliary actions

| Action | Produces | Called when |
|---|---|---|
| `open-map` | one map, `open`, with its fog; a root map and a child map alike | a target has no map yet, or a split is writing child maps |
| `open-task` | one task | a split is writing tasks, or a person records one task |
| `update` | a changed record, carried to what relies on it | a record that others rely on has to change |
| `grill` | a testimony, and the records that settle from it | a decision needs a person |
| `adr` | an ADR | a decision passes the three gates |
| `glossary` | a glossary entry | a term resolves |
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

## Records and their writers

Three record kinds, one writer each: `open-map` writes a map, `open-task` writes a task, `grill` writes a testimony. A writer never decides how many records there are or where they hang; `split` decides that and calls the writer once per record. The definitions those writers read are `waymark`'s and the record skill's (`map`, `task`).

```
person ──▶ open-map            (a root map, or any map opened on its own)
split  ──▶ open-map ── (one per child map)
       ╚═▶ open-task ── (one per task)
```

Neither writer calls `split`, and `split` calls only writers. That single direction is what keeps a root map and a child map from growing two different opening paths, which is how the first set ended up with a rule written twice.

## Resources

No action defines a record. Every record is defined once, in `waymark/res/`. An action that needs a definition calls `waymark`; it never links into another action's folder, and it never restates what a record contains.
