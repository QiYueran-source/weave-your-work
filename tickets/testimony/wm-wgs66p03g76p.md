---
schema: 1
id: wm-wgs66p03g76p
title: Work Weaver bread-machine design discussion
category: testimony
status: open
owner: frank
creator: frank
created_at: 2026-11-22T07:12:58Z
updated_at: 2026-11-22T07:12:58Z
---
## Subject

How Work Weaver should let a single-button bread machine improve its own bakes: the chain's nodes, the fixed target of the chain, the evaluator the chain argues against, and the controls it may set.

## Rounds

### Round 1

- **Q1** What this discussion covers
  - Question: Testimony `wm-5kt862spv4qv` and draft spec `wm-zq54vqsdrj3z` already fix a bread oven with bread-type buttons, a six-node chain with tickets, a per-bake round, a three-bake proof, and a simulator score. The person's new description says a bread machine whose only input is a start-bake button, and a chain of observe → grill loop → spec → implement. Is this discussion built on the earlier records? (a) yes, keep them as the baseline; (b) partly: the device changes to a bread machine with no bread-type input, the rest stays; (c) no, start again and treat the earlier records as input only.
  - Recommended: No, start again; the earlier spec stays open and unamended, and this testimony is the record the new design rests on.
  - Answer: 不是，全部重来，不受上一轮 testimony/spec 约束。
  - Parent: none

- **Q2** Whether a tickets node stays in the chain
  - Question: The new description names four steps: observe → grill loop → spec → implement. The earlier chain had six nodes, including tickets, which cut the spec into the steps of one bake. Should tickets stay, be dropped with implement reading the spec directly, or become an internal step of implement rather than a node?
  - Recommended: Keep tickets as a node: the spec says what this bake should reach, the tickets say how this bake does it, and implement gets an explicit list to follow.
  - Answer: 分析分析。
  - Parent: Q1

- **Q3** What the bread machine's input can carry
  - Question: Does the person press anything besides start-bake? The new description says the only input is a button carrying a fixed signal such as start-bake. The earlier records had bread-type buttons, a stop signal, and an acknowledge signal. Which signals exist on this machine?
  - Recommended: Start bake is the only press; the person has no way to name a bread type, stop a bake, or acknowledge anything, and every round bakes without a person in it.
  - Answer: (no answer yet)
  - Parent: Q1

- **Q4** What the machine's controls accept
  - Question: The earlier records gave implement a temperature set point, a hold duration, a proofing time, and start and abort. With one start button and no bread-type input, which of these can implement set, and which are fixed by the machine? The answer settles whether implement's output is a schedule in time or a fixed set of values.
  - Recommended: A named set of numeric controls with declared ranges, the same shape as before; the machine decides which exist, and implement may set only those.
  - Answer: (no answer yet)
  - Parent: Q1

- **Q5** What the taste model is
  - Question: The score is to come from a linear-programming-style program, and the person will supply its design. Should this testimony wait for that design, or record the requirement that the score arrives as one number per bake and leave the program's shape to the spec that follows?
  - Recommended: Record the requirement the score has to satisfy and wait for the person's design before the score's shape is fixed.
  - Answer: 用一个类似线性规划的程序去做，我等下给你设计细节。
  - Parent: Q1

- **Q6** How a failed proof is recognised
  - Question: The proof is three bakes. Should the standard for failure be settled now, or after the runs, from the kind of result a three-bake proof can actually show?
  - Recommended: Settle it now, from things a reader can see in the records: the third score is not above the first, the three recipes are nearly the same, the closing score is below a baseline recipe, or the chain crashes or acts beyond its controls.
  - Answer: 先记录，标准后面再说。
  - Parent: Q1

## Settled

- This design starts again: the earlier testimony and draft spec are input only and do not constrain it (from Q1)
- The score of a bake comes from a linear-programming-style program the person supplies; its details are still to be given (from Q5)
- The criterion for a failed proof is deferred until after the runs have shown what a three-bake result looks like (from Q6)

## Open

- Whether tickets stays a node in the chain (from Q2)
- Which signals the single-button machine carries besides start-bake (from Q3)
- Which controls implement may set, and which the machine fixes (from Q4)
- What the taste program computes and what its inputs and outputs are (from Q5)
- What evidence counts as a failed proof (from Q6)

## Handed off

- work: Write the chain from observe to implement as a fast-agent workflow the prototype can run.
- work: Build the taste program once the person gives its design.
