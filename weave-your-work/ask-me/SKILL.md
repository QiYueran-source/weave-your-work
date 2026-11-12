---
name: ask-me
description: "Pick the skill that fits the situation in front of you: the mainline a project runs on, the auxiliary actions, the records, and the branch points. Use when a person does not know which skill to use now."
family: none
invocation: user
---

# Ask me

You do not remember every skill, so ask. This file names the one to open next. It invokes nothing, reads no record, and writes nothing; open the skill it names and let it run.

Before saying what a skill does, read its `SKILL.md`. The summaries here are for orientation.

## The mainline

The route a project travels from a settled map to a closed one, in order.

1. **`open-map`** when a target has no map: settle the target, survey it, write the map with its fog and exclusions. A project's first map is opened by the flow that configures the project.
2. **`fog-explore`** while the map carries entries the next layer cannot be written without. A decision inside one goes through **`grill`**.
3. **`split`** to turn a settled layer into child maps or tasks. It does not write them: it calls `open-map` once per child map, or `open-task` once per task.
4. **`advance-task`** to take one task, or a batch, to a written `Result`.
5. **`task-review`** to judge a finished task against its acceptance signal.
6. **`map-review`** when a map's children are all closed: accept it or send it back.

A child map re-enters at `split`; closing runs bottom-up. A record that turns out wrong is changed through **`update`**, not rewritten.

## Branch points

Each opens on a state, not on a position in the route.

- **`setup`** when the project is not configured: it routes to `configure-project`, `join-project`, or `check-project`.
- **`update`** when a closed record, or a map that has already split, has to change.
- **`issue`** when a decision or an ask has to reach another owner, or when the queue holds a message.
- **`wait-what`** when the person lost the thread; **`handoff`** when the work continues in another session.
- **`stop-and-wait`** when a person asks whether the whole project is still consistent; **`salvage-and-restart`** when the tree no longer describes the work.

## The records

Reached from the action that writes them, and named here so they can be found.

- **`waymark`**: what every record shares: the fields, the relations, the categories, and the change dispositions.
- **`map`** and **`task`**: the record definitions, for the map and the task bodies and their reviews.
- **`open-map`** and **`open-task`**: the actions that write one record of each kind. A root map, a child map, and a task written outside a split all go through them.
- **`grill`**: the discussion that settles decisions, and the testimony it writes.
- **`adr`**: a decision a future reader cannot reconstruct.
- **`glossary`**: one name for one thing.

## Standalone

Opened for their own sake, on no route: **`feedback-me-please`** sends a skill bug upstream, and **`use-weave-your-work-examples`** holds two worked examples.

## What this does not do

- Invoke a skill. The person opens the one it names.
- Read the records. `wait-what` does that.
- Restate a rule. Each skill owns its own, and this file only says which one.
