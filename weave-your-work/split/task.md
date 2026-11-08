# Task reference

How a settled layer becomes tasks.

A map's layer splits into tasks when each part can be written as one complete action with one clearly auditable standard. This file is the judgment: whether the layer is ready, how many tasks it makes, and what each task has to pass before it is written. The writing itself belongs to task design — `body.md`, `kind.md`, and `properties.md` — which this file names and never repeats.

The criterion that sent the layer here lives in `SKILL.md`. This file applies it.

## Read the parent first

Read the parent map's `Acceptance direction` line by line. Every line has to be produced by some task in this layer. A line that nothing produces is either a missing task or a direction the map no longer means; decide which before writing anything.

## The five gates

Every task passes all five. A gate that fails sends the part back to grill, because a missing answer here is a missing discussion, not a writing problem.

1. **One action, one standard.** The action ends at a result that can be handed over whole, and the standard reads that result. When either half is missing, the part is not ready.
2. **Evidence someone else can read.** The acceptance signal names a file, a page, a number, an answer — something a reader who did not do the work can open. "Done properly" names nothing.
3. **Who does it.** The action marks every step a person has to perform, and `needs_human` agrees with what the action says.
4. **What breaks if it goes wrong.** The answer sets `reversibility`: work that cannot be undone is `one_way` and carries `Failure recovery`.
5. **Whether the output can be named.** Yes is a delivery. No is a probe: a question to answer, with both `Next step` lines written before it runs.

Gates 3, 4, and 5 each decide a field, which is why a layer settles them before the ticket exists rather than during the work.

## The plan

Write the count and one line per task into the parent map's `Decisions so far`, as one entry, before the first ticket is created. That entry is the only record of what this layer is meant to contain; the children themselves, read back with `waymark tree --root <map>`, show what was actually written.

The count comes from the grill discussion, not from the number of decisions. One decision may become three tasks, and three decisions may become one.

## What the split writes

Each task's whole body, against task design. A task is a leaf: nothing later comes along to write its `Action` or its acceptance signal, so the split writes them, or the task never has them.

The fields it sets at creation:

- `task_kind`, `reversibility`, and `needs_human`, all written explicitly;
- `owner`, defaulting to the parent map's owner;
- `parent`, given through `waymark create --parent`.

It writes no `Result`, no `Progress`, no `Review`, no `waiting_on`, and no `outcome`. Those belong to the run that does the work and to the review that judges it.

## Hanging them

At the map's first split, record the child type on the map itself:

```
waymark field update <map> --set split_as=task
```

Then create every ticket before reading anything back:

```
waymark create --category task --title "<the task's result>" --owner <parent owner> \
  --parent <map> \
  --field task_kind=delivery \
  --field reversibility=two_way \
  --field needs_human=false \
  --body-file <the body>
```

Finally read the shape back:

```
waymark tree --root <map>
```

Writing all the tickets first leaves nothing half-done on the parent, and the tree read shows any ticket whose parent is wrong. The map's body is not edited: it holds no children list.

Once `split_as` is `task`, every later child of that map is a task too. A part that needs a map of its own opens a sibling map, not a child of this one.

## Going back to grill

Two situations send a part back instead of producing a ticket: the discussion gives no evidence the acceptance signal could name, or it gives no single action that ends at one result. Guessing either one produces a task that cannot be judged, and a task that cannot be judged is worse than no task, because the map's acceptance will wait on it.

## What this reference does not do

- Choose between tasks and child maps. That is `SKILL.md`.
- Define a body section, a kind, or a field. Those are task design's `body.md`, `kind.md`, and `properties.md`.
- Advance a task. That is the execution skills.
