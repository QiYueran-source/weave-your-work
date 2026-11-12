---
name: fog-explore
description: "Clear a map's Not yet specified: settle each open entry into a decision, a target update, an exclusion, or a hand-off to split, one entry at a time. Use when a map's next layer is blocked by an open entry."
family: track
invocation: model
---

# Fog explore

A map's `Not yet specified` holds fog. This skill clears it, one entry at a time, and writes the clearing itself: the entry struck through with what it became. What fog is, how an entry is written, and where a cleared entry lands are the `map` skill's; this file covers the clearing: how to judge an entry, how to get the missing part, and how to mark it finished.

## When it runs

The section holds an open entry and the next layer cannot be written without it. That is the whole trigger.

It ends when no open entry remains. When that happens, the map's next move is a split, not another round of exploring.

## Steps

Run these four for one entry, then start again at the top for the next.

1. **Judge.** Can this be settled now? An assumption someone has already tested, a fact one page answers, a decision with nothing missing — go to step 3. The rest go to step 2.
2. **Act.** Get the missing part: read, measure, or ask. A decision only a person can make goes through `grill`; the rounds go into a testimony as they happen. An answer that needs to be seen rather than discussed becomes a probe task, handed to `split`.
3. **Land it** where `map/res/body.md`'s landings send it: a decision to `Decisions so far`, a sharpened goal to `Target` and `Acceptance direction`, a refusal to `Out of scope`, work to a child through the action that opens that record. On a map that is open and has no children, this step writes the landing itself, by the section rule `map/res/body.md` gives every section. A map that is closed, or that has already split, has a body others stand on: its landing goes through `update`. An `Assumption` is not settled by research alone: support it, refute it, or record that it is accepted as reasonable and say so.
4. **Strike the entry through** and add `Resolved on <date>: <what it became and where>`. An entry that turned out to be irrelevant is deleted instead.

## Transformation

```
before: one open entry in Not yet specified
after:
- the entry is struck through, or deleted when it was irrelevant
- a struck entry carries Resolved on <date> and what it became
- the result appears in exactly one of Decisions so far, Target, Out of scope, or a new child
- a result that changes the target changed Acceptance direction in the same pass, or through the same `update` when the map is closed or already split
```

## Hands off

- `split` when no open entry remains, or when an entry became work.
- `update` for a landing on a map that is closed or has already split.
- `grill` for a decision the owner has to make.

## What this skill does not do

- Decide what a cleared entry becomes; `map/res/body.md` does.
