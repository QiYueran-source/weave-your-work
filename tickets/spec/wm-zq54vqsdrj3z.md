---
schema: 1
id: wm-zq54vqsdrj3z
title: 'Work Weaver: hardware-signal agent chain from gateway to execution'
category: spec
status: open
owner: frank
creator: frank
created_at: 2026-11-20T12:26:48Z
updated_at: 2026-11-20T12:26:48Z
---
## Problem Statement

The bread oven decided in testimony `wm-5kt862spv4qv` needs to improve its own bakes with no dashboard and no conversation, and with a person who only presses a button. Today that decision exists only as settled answers and a handed-off list. Nothing says how a press of a button becomes an observation, a discussion, a spec, tickets, and a bake; nothing says what each step hands to the next; and no code exists that can be run to see the loop happen.

The person's shape is a chain: `gateway → observe → grill/testimony loop → spec → tickets → 实现`, one node per message, each node a fast-agent. It has not been written down anywhere, and the discussion that produced it is in chat.

## Solution

Write the chain down as a spec, then build it in the `work-weaver/` prototype as a mutable state machine over that chain, where each node is a fast-agent and the gateway is the one node that is not.

The oven speaks only through fixed controls that carry a small set of fixed signals. The gateway turns a press into one typed event. From that event the chain runs without a person: observe records what the last bake did and how it scored, the grill loop proposes the next recipe against the bread-type history and writes a testimony, spec states the recipe as a record, tickets cuts it into the steps of the bake, and implement bakes by it through the oven's control interface. The score of that bake is what the next round reads. One round is one bake, and the proof run is three rounds.

Implement cannot change the code: it can only choose how the existing tools are used, namely the temperature schedule, the proofing time, and the other parameters those tools accept.

The prototype keeps the chain's templates (prompts, record shapes, node order) apart from the custom tools written for this oven (the control interface, the simulator, the record store, the score).

## User Stories

1. As a person standing at the oven, I want a button press to be enough to start a round, so that I do not need a screen or a keyboard.
2. As a person standing at the oven, I want a round to finish without me, so that I can walk away while it bakes.
3. As a person who tastes the bread, I want the score of one bake to shape the next recipe, so that the device improves over bakes rather than repeating itself.
4. As a person who provides the base baking knowledge, I want the chain never to overwrite what I wrote, so that my knowledge stays the baseline it was meant to be.
5. As a person running the proof, I want three bakes of one bread type, so that I can see whether the score moves up rather than judging one loaf.
6. As a person running the proof, I want each round's records kept separately, so that I can read how round two learned from round one.
7. As a person reviewing the device later, I want every round to leave a testimony and a spec, so that I can read why a parameter changed.
8. As a person reviewing the device later, I want each spec and ticket set to name the round it came from, so that a change can be traced to the bake that caused it.
9. As the device's safety controller, I want implement to be unable to reach anything but the oven's control interface, so that an agent mistake cannot change the program.
10. As the device's safety controller, I want a parameter outside its range to be refused at the interface, so that the refusal does not depend on the agent noticing.
11. As a maintainer, I want the templates kept apart from the oven's tools, so that the chain can be read without the oven in it, and the oven replaced without touching the chain.
12. As an agent building this, I want one typed event per node boundary, so that each node can be tested on its own.
13. As an agent building this, I want each node to be a fast-agent whose output shape is fixed, so that a node can be swapped or graded without touching its neighbours.
14. As an agent building this, I want the chain defined as data (nodes, edges, one edge per event) rather than as nested code, so that the loop is visible in one place.
15. As an agent building this, I want a failing node to stop at the edge rather than pass a half-formed event, so that a failure is visible where it happened.
16. As an agent building this, I want the simulator to provide the oven behind the same interface as a real one, so that the chain does not know which it is driving.
17. As an agent building this, I want the models to come from any OpenAI-compatible endpoint, so that the device can run against a local model or a hosted one without changing the chain.

## Implementation Decisions

**One round is one bake.** A round solves the recipe from the last score and the bread-type history, runs the grill loop to reach a spec, cuts the spec into the bake's steps, and bakes by them. The score of that bake is the next round's input. The improvement is carried round to round, not inside one round: the recipe that was baked decides that bake, and nothing changes it afterwards.

**A proof run is three rounds of one bread type.** The three rounds run one after another, and their records sit side by side so the score of each can be compared. Bread types run separately; a proof of one type never reads another type's rounds.

**The chain runs as a mutable state machine.** The nodes and the event between each pair are settled shape; the prototype is where they become code. Round two and round three re-enter the same chain with the previous round's records in hand, rather than using a second set of nodes.

| Node | What it is | Input event | Output event |
| --- | --- | --- | --- |
| gateway | code, not an agent | a button press | `Intent` |
| observe | fast-agent | `Intent` | `Observation` |
| grill | fast-agent loop, two agents | `Observation` | `Testimony` |
| spec | fast-agent | `Testimony` | `SpecDraft` |
| tickets | fast-agent | `SpecDraft` | `Tickets` |
| implement | fast-agent | `Tickets` | `RunResult` |

**The input is fixed controls, never a conversation.** A press produces one of a fixed set of signals: select a bread type, start a round, stop, or acknowledge. The gateway maps a press to one signal and validates it; anything it does not recognise becomes `UNKNOWN` and stops the chain at the gateway. No node asks a person a question and waits for an answer.

**The templates and the custom tools are stored apart.** The templates are the chain's own parts: the node order, the prompt for each agent, the shape of each event, and the record shapes. The custom tools are this oven's: the control interface, the simulator, the record store, and the score. A template never names a tool's internals, and a tool never holds a prompt. The split is by directory, so a reader of either one can tell which side a file is on.

**Only the implement node writes through the oven's tools.** Its tool set is the control interface and nothing else: set a temperature, hold a temperature for a duration, set a proofing time, start a bake, abort a bake. It cannot read or write files, run a shell, or reach any other MCP server. The interface refuses a value outside the range the simulator or device declares, and the refusal is recorded as part of the run result.

**Implement adjusts how the tools are used, not the code.** The node chooses the parameters and the schedule. Any change to the chain's own program is out of reach by construction: the node has no tool that could make one.

**The grill loop is two fast-agents behind one node.** A proposer agent drafts the next recipe from the last score and the history; a grill agent challenges it and returns one of accept, ask-for-revision, or stop. Nothing outside the node answers the grill: it argues from the records, and it bounds the revisions, after which it stops and records why.

**The score is the simulator's, and it is what the next round reads.** The simulator scores each bake from its own model of the loaf; a person's taste is a later adapter and is not part of this proof.

**Records stay local to the device.** Each round writes its testimony, spec, and tickets as Markdown files under the round's own directory, each naming the round it belongs to and its bread type. Nothing syncs with the workstation tracker in this version; copying a proof back for reading is a manual act.

**Agent output that changes a record must parse.** Each node's output has a fixed shape; text outside that shape fails the node, and a failed node stops the chain at its edge instead of handing on a half-formed event.

**The models come from any OpenAI-compatible endpoint.** Provider, model, and endpoint are configuration, and no template names a vendor.

**The mechanical fallback is a stub behind an interface.** The chain can hand a bake to it and read back only whether the handoff was accepted. The stub records that a handoff happened and returns at once; it does not run a mechanical program, because there is no device to run one on. The real fallback and the safety controller stay the testimony's to specify.

**The tests run without a model.** Each node is tested with a recorded input and its output shape; the state machine is tested with scripted model outputs, so the loop, the bounds, and the stop conditions are checked before any model is called.

## Acceptance

The delivery is a spec in this project and a prototype in `work-weaver/` that runs a proof of three bakes of one bread type against the simulator, and leaves three rounds of records on disk with the score of each accordingly.

A reader tells it was handed over by reading the proof's directory: three round directories sit side by side, each holding a testimony, a spec, and tickets, each naming its round and bread type; each round's recipe states what it took from the round before it; the parameters each round chose appear in the simulator's log; and the three scores are listed in one place so a reader can see whether they moved. The chain's shape is stated in one place, and the templates and the tools sit in separate directories. Changing the model endpoint in configuration changes the answer without changing the chain, and the refusal test passes when a node asks for a temperature outside the declared range.

## Out of Scope

- The safety controller that stops the device on a hardware fault. Its interface is assumed, not built here; testimony `wm-5kt862spv4qv` (Q8) owns it.
- The mechanical fallback flow and the mid-bake handoff, beyond a stub. They are assumed to exist on the device; testimony Q3–Q7 own them. This proof assumes they work, so what it builds is a stub the chain can call, not the fallback itself.
- A dashboard, a screen, or any conversational interface.
- Changing the program by the agent, in any form.
- Syncing records with the workstation tracker, or a wayfinder map over them.
- A real oven. The simulator stands in, and the real device adds a second implementation of the same interface.
- Rating a loaf by a person. The simulator scores; a human rating is a later adapter.
- How many bakes an improvement needs, or what score counts as a good loaf. Three rounds show whether the loop moves; the value of the bread is not this proof's question.
- Which bread is selected by which physical button.

## Further Notes

The chain's node list comes from the person's own description, in their words: "gateway → observe → grill 和 testimony 循环 → spec → tickets → 实现 … 每个节点是一个 fast agent". The grill-and-testimony step is the loop; the other five are single passes. Round four of the testimony adds the unit: "每烤完一轮，根据评分和历史做优化，下一轮烤面包，通过 grill 循环得到 spec 后执行烤制过程", and the proof: "跑若干轮测试（烤3轮面包）".

An earlier draft of this spec treated one chain run as one bake and left the improvement inside that bake. The person pointed out that a bake cannot change the recipe it is already baking; the unit is one bake, and the learning shows in the next one.

The choice of a mutable state machine over fast-agent's declared workflows is this spec's decision. The declared workflows (`chain`, `evaluator_optimizer`, `orchestrator`) pass a message between agents and keep no state, and the neighbour list is fixed per call; this chain needs edges chosen by the event, a loop with a bound, and a proof whose rounds a person can read afterwards. The trade is that the state machine owns the routing, and each agent's output shape has to be enforced by the code that reads it.
