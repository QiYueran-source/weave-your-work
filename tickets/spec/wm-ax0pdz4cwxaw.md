---
schema: 1
id: wm-ax0pdz4cwxaw
title: 'Work Weaver: the single-button bread machine round'
category: spec
status: open
owner: frank
creator: frank
created_at: 2026-11-22T08:30:44Z
updated_at: 2026-11-22T08:30:54Z
dependencies:
  - wm-wgs66p03g76p
soft_links:
  - wm-wgs66p03g76p
---
## Problem Statement

Testimony `wm-wgs66p03g76p` settles how a single-button bread machine should improve its own bakes, but it is a discussion record: it says what was decided and why, not what gets built. Nothing yet names the round's nodes as software, the shape each node hands to the next, the two MCP servers the nodes reach through, or what the three-round proof leaves on disk. The prototype in `work-weaver/` holds empty packages and a dependency line.

A reader of the code today cannot answer: which process runs a round, which node may write which record, how the grill terminates without a person in it, and how a second process picks up what the first one learned.

## Solution

Build the round as a Python state machine whose nodes are `@fast.agent` definitions. One press runs one round. The round is `gateway → observe → grill → spec → tickets → implement`, and after implement returns, the round is over.

Two MCP servers carry everything the round touches:

- **records** — the only home of testimony, spec, tickets, the person's handbook, and the evolving handbook. Every tool is one operation with a narrow signature, so a node that holds no write tool cannot overreach.
- **machine** — the five knobs, the bake call, and the state read. The taste program lives behind it, and the chain never sees its parameters.

Between nodes, values are pydantic models checked by the gateway code, not by a model. The context each node sees is rebuilt from the records on every round, so restarting the process loses nothing that matters.

## User Stories

1. As the person at the machine, I want one press to run one whole round, so that I do not answer anything or watch anything while it runs.
2. As the person who wrote the base handbook, I want the chain unable to change it, so that my knowledge stays the baseline after any number of rounds.
3. As the person reading the results afterwards, I want three rounds of records side by side, so that I can see what each round did and why.
4. As the person restarting the process, I want the next round to pick up every earlier round's records, so that a restart costs nothing but time.
5. As the person studying whether the chain learns, I want each round to leave its knob values and its score, so that I can compare rounds without reading transcripts.
6. As a maintainer, I want each node to hold only its own write tool and the reads it needs, so that the split is visible in the registration instead of enforced by a model's judgement.
7. As a maintainer, I want the nodes still defined by `@fast.agent`, so that a node can be replaced, graded, or given a different model without touching the routing.
8. As a maintainer, I want routing and validation in plain Python, so that a failure stops at the edge where it happened.
9. As a maintainer, I want the taste program behind the machine server, so that a real device replaces one server and nothing else.
10. As a maintainer, I want the record tools to refuse a write the caller's node does not own, so that a mistaken prompt cannot rewrite history.
11. As the person running the experiment, I want the agent's history to die with the process, so that what I read as learning comes from records and not from a hidden transcript.
12. As a model implementer of the taste program, I want its design stated in one file, so that the score can be replaced without touching the chain.

## Implementation Decisions

**A round is one process run.** The switch starts the chain; the chain runs every node in order and exits. The next round is the next run. Nothing in the code tries to resume a round.

**The chain is code; the nodes are fast-agents.** Each node is an `@fast.agent` with a file instruction, a tool set filtered per server, and its own model. Routing, the edge models, the freeze rules, and the round's bookkeeping are plain Python. `@fast.chain`, `@fast.evaluator_optimizer`, `@fast.orchestrator`, and `@fast.router` are not used: they pass free text and choose no next node by type.

**Each edge carries a model, and the receiver checks it.** The chain validates every edge value before the next node runs and stops at that edge on a mismatch, recording the failure as the round's terminal state.

| Edge | Value | What it carries |
| --- | --- | --- |
| gateway → observe | `Intent` | the round id and the one signal, start-bake |
| observe → grill | `Observation` | every earlier round's knob values and scores, the current knob values, and this round's opening analysis |
| grill → spec | `GrillOutcome` | the agreed plan (knob values and the reasons for each change), the verdict, and the rounds it took |
| spec → tickets | `SpecDraft` | what this bake should reach and why |
| tickets → implement | `Plan` | three to six steps, each with its knob values |
| implement → result | `BakeResult` | the knob values sent, the features, the score, and any knobs the machine refused |

**The grill is a loop the chain writes.** A proposer drafts from the observation, the records, and both handbooks. A grill agent answers with one verdict: `accept`, `revise`, or `stop`. `revise` sends the grill's requested changes back to the proposer for another draft. `stop` or a reached round limit ends the loop with the last draft, marked as not agreed. The round limit is configuration. The proposer writes the evolving handbook and testimony during the loop; the grill agent only reads.

**The tool sets are fixed per node.** Each node's `tools=` filter declares its writes and reads; no node holds a write it has no job for.

| Node | records | machine |
| --- | --- | --- |
| observe | write this round's testimony; read testimony, base handbook, evolving handbook | — |
| proposer (in grill) | write this round's testimony, write evolving handbook; read everything | — |
| grill agent (in grill) | read testimony, spec, tickets, both handbooks | — |
| spec | write spec; read testimony, both handbooks | — |
| tickets | write tickets; read spec, both handbooks | — |
| implement | write this round's testimony | `get_state`, `set_knob`, `bake` |

**A record freezes when its node ends.** The records server owns the rule: while a node holds the pen, its record is writable; once the chain hands the round to the next node, the record is closed to every caller. A node reading a record sees what earlier rounds wrote and what this round has already produced up to its own boundary.

**The records server is a thin store with typed tools.** It holds the round directory on disk and exposes one tool per operation: write this round's testimony, read a testimony, list testimonies, write and read a spec, write and read tickets, read the base handbook, read and write the evolving handbook. The evolving handbook holds at most thirty entries, each tagged with the round that produced it. The base handbook is readable and never writable through any tool.

**The machine server hides the taste program.** It exposes the current knob values, the knob names and ranges, and the last bake's features and score; it accepts a knob value or a list of knob values inside the declared range and refuses anything outside it with a typed refusal; and it bakes once and returns the result. The taste program computes the features and the score behind the server. No tool returns a simulator parameter, and no file the chain reads contains one.

**The taste program follows a recorded outline until its author supplies the design.** Five features (crispness, moistness, softness, chewiness, sweetness) are scored from 0 to 1; five knobs (oven temperature, bake time, proofing time, water amount, sugar amount) each lead two or three of those features through a single-peaked curve and only nudge the rest, and every feature is led by two or three of the knobs. Each knob's declared range stops at the ends where the loaf would be raw or scorched, so every accepted bake is bread and the score stays continuous in every knob. The knobs do not interact; each feature's output carries a perturbation of about three percent of its own value; the features are weighted by weights drawn once per bake from independent distributions and passed through a softmax, with the average taste deviating clearly toward one feature in about three bakes out of ten; and the score is the weighted mean of the features with no offset, so an untuned recipe lands near 0.5 and a loaf right at every knob approaches 1. Scores are comparable across a run because the deviation is drawn from a fixed seed. The author's exact formulas replace this outline in the taste program's own file and nowhere else.

**Revised 2026-11-23: knobs lead two or three features.** The first outline gave every knob one feature of its own and a small nudge elsewhere. Five rounds of the example showed a step's owner could be read straight off one number, which turned the task into a per-knob lookup instead of a read across the bake. Each knob now leads two or three features and each feature answers to two or three knobs, so saying which knob moved means matching a pattern across several features.

**Revised 2026-11-23: no floor at the score.** An earlier draft of this outline gave the curves a hard floor on both sides and put the score on a 0.5-to-1 scale. The floor made the score jump at a boundary the chain could not see, and the offset hid the headroom a bake had: ten rounds showed the chain learning slopes on the crushed side of that jump and then throwing them away. The declared range now carries the limit, the score runs from 0 to 1, and the perturbation is a fraction of each feature rather than a fixed amount.

**The chain reads the goal and the rules from an immutable system prompt.** Every node's instruction carries the same goal and self-evolution limits, written in the template directory. It changes no record, holds no simulator parameter, and composes the node's own job description. Both handbooks reach the nodes through the records server; neither is inlined into the system prompt, so a round's behaviour can be traced to the records it read.

**fast-agent's own persistence is off.** Session snapshots, trajectory saving, and automatic compaction are disabled. `use_history` stays on only so one agent's tool loop sees its own earlier steps. Every round's context is rebuilt from the records when the process starts.

**The gateway logs what it validated.** Each round writes its edge values and validation results to a file beside the round's records, so a failed round names the edge that failed.

## Acceptance

A run of three rounds against the machine server leaves, on disk, one directory per round holding the round's testimony, spec, and tickets, and a summary that lists for each round its knob values, its features, and its score.

A reader tells the work was done by opening the summary: three rounds are visible, each names the knob values it sent, and each spec states what it took from the round before it.

The tool sets are checked by starting the chain with a node registration that omits the write tool and watching the chain refuse that node's write at the records server. A knob outside its declared range is refused by the machine server and the refusal appears in that round's bake result. A restart between round two and round three changes nothing in what round three reads.

A fake model that returns scripted values drives the same chain through all six nodes with no network, so the routing, the freeze rules, and the grill's three verdicts are tested without a model.

## Out of Scope

- A real machine. The machine server's backend is a simulation; a device replaces that backend and nothing else.
- The taste program's exact formulas: the outline above is what this spec commits to, and its author supplies the precise design separately.
- A criterion for a failed proof. The run records; it judges nothing.
- Any change to the knob set, the node set, or the bake's structure. The chain adjusts values only.
- A dashboard, a panel, or any view into a running round. Results are files a person opens afterwards.
- Session snapshots, trajectory export, and conversation compaction, all switched off.
- A real button. The switch is a process invocation with one signal.

## Further Notes

The chain's node list and the grill's two-agent shape come from the person's words in testimony `wm-wgs66p03g76p` (Q17, Q39, Q40, Q41). The single start-bake signal is Q3, the two servers and the narrow write tools are Q19–Q24 and Q38, the taste program's outline is Q7–Q9 and Q31–Q33, and the process rules are Q42.

The earlier testimony `wm-5kt862spv4qv` and draft spec `wm-zq54vqsdrj3z` describe a bread oven with bread-type buttons and a six-node chain including a verification step. The person restarted the design (this testimony's Q1); those two records stay open as input and are not amended by this spec.
