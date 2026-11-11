---
name: fog-explore
description: "Clear a map's Not yet specified: settle each open entry into a decision, a target update, an exclusion, or a hand-off to split, one entry at a time. Use when a map's next layer is blocked by an open entry."
family: track
invocation: user
---

# Fog explore

A map's `Not yet specified` holds fog. This skill clears it, one entry at a time. What fog is, and how an entry is written, is the `map` skill's; this file only clears it.

## When it runs

The section holds an open entry and the next layer cannot be written without it. That is the whole trigger.

It ends when no open entry remains. When that happens, the map's next move is a split, not another round of exploring.

## Steps

Run these four for one entry, then start again at the top for the next.

1. **Judge.** Can this be settled now? An assumption someone has already tested, a fact one page answers, a decision with nothing missing — go to step 3. The rest go to step 2.
2. **Act.** Get the missing part: read, measure, or ask. A decision only a person can make goes through `grill`; the rounds go into a testimony as they happen. An answer that needs to be seen rather than discussed becomes a probe task, handed to `split`.
3. **Land it** where it belongs:

   | What was settled | Where it goes |
   |---|---|
   | a decision the map now holds | `Decisions so far`, in its concrete form, with its source |
   | a clarified goal | `Target`, and `Acceptance direction` with it when the bar moves |
   | something the map will not do | `Out of scope`, with the reason |
   | work that needs its own ticket | handed to `split`; the entry is struck through naming what was handed over |

   An entry whose kind is `Assumption` is not settled by research alone: support it, refute it, or record that it is accepted as reasonable and say so.

4. **Strike the entry through** and add `Resolved on <date>: <what it became and where>`. An entry that turned out to be irrelevant is deleted instead.

## Transformation

```
before: one open entry in Not yet specified
after:
- the entry is struck through, or deleted when it was irrelevant
- a struck entry carries Resolved on <date> and what it became
- the result appears in exactly one of Decisions so far, Target, Out of scope, or a new child
- a result that changes the target changed Acceptance direction in the same pass
```

## Hands off

- `split` when no open entry remains, or when an entry became work.
- `grill` for a decision the owner has to make.

## What this skill does not do

- Create a child of its own: it hands the work to `split`.
- Write a new fog entry. A thing that turns up while clearing either lands where it belongs or goes back to whoever opened the map.
- Settle a decision on a guess. A decision made on missing information is worse than fog, because it lands as settled.
