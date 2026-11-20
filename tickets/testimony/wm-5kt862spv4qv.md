---
schema: 1
id: wm-5kt862spv4qv
title: Work Weaver edge-agent design discussion
category: testimony
status: open
owner: frank
creator: frank
created_at: 2026-11-20T07:59:28Z
updated_at: 2026-11-20T07:59:28Z
---
## Subject

How Work Weaver should run a self-evolving fast-agent workflow for a bread oven, using the existing Spec, Ticket, and Testimony Issue model.

## Rounds

### Round 1

- **Q1** First workflow
  - Question: Should v1 focus on a concrete workflow with Observe, Proposer, Grill, Spec Writer, Ticket Writer, Executor, and Verifier, rather than tool package lifecycle features?
  - Recommended: Yes; validate a concrete workflow first.
  - Answer: We should implement concrete functionality first.
  - Parent: none

- **Q2** Initial human interface
  - Question: Should v1 omit a dashboard and conversational human interaction, use local disk for knowledge, and use physical buttons as the run trigger and bread-type input?
  - Recommended: Yes; buttons provide simple signals, and local files provide knowledge.
  - Answer: Yes. The bread machine has hardware controls such as buttons for bread type; these provide the start signal.
  - Parent: none

- **Q3** Failure fallback
  - Question: Should recoverable Agent failures fall back to the bread machine's mechanical baking flow, while serious hardware safety faults stop the device?
  - Recommended: Yes; do not stop for every software problem.
  - Answer: Yes. Avoid stopping except for serious errors; provide a fallback to the mechanical flow.
  - Parent: Q2

- **Q4** Who controls a bake
  - Question: When available, should the Agent have full control of a bake, with the mechanical flow taking over only when the Agent is unavailable?
  - Recommended: Yes; the Agent owns the bake while usable.
  - Answer: If the Agent can be used, it should be fully responsible. Fall back when it is unavailable.
  - Parent: Q3

- **Q5** Agent unavailability
  - Question: Do network loss and repeated model/runtime failures count as Agent unavailability?
  - Recommended: Yes, after bounded retries.
  - Answer: Yes; network loss counts too.
  - Parent: Q4

- **Q6** Mid-bake handoff
  - Question: On mid-bake failure, should the device read current state and transfer the remaining bake to the mechanical flow; stop if safe state cannot be confirmed?
  - Recommended: Yes.
  - Answer: Yes.
  - Parent: Q4

- **Q7** Handoff ownership
  - Question: Once the mechanical flow takes over, should it finish this bake without the Agent re-entering during the same run?
  - Recommended: Yes.
  - Answer: Yes.
  - Parent: Q6

- **Q8** Safety control
  - Question: Should an independent device safety controller reject out-of-range Agent actions, with serious hardware safety faults stopping the device?
  - Recommended: Yes.
  - Answer: Yes.
  - Parent: Q4

### Round 2

- **Q9** Record model
  - Question: Should the prototype reuse `weave-your-work` Issue types: Testimony for Grill discussion, Spec for goals and plans, and Ticket for concrete work?
  - Recommended: Yes; keep the existing meanings.
  - Answer: Yes. Testimony records Grill, Spec records goals, Tickets record concrete work, consistent with `weave-your-work`.
  - Parent: none

- **Q10** Bake observations
  - Question: Should bake observations and results be recorded as Testimony Issues linked to the relevant Spec and Ticket?
  - Recommended: Yes.
  - Answer: Yes.
  - Parent: Q9

- **Q11** Local storage and tooling
  - Question: Should these Issues be Markdown files on local disk, managed by a small Python tool rather than a complex issue tracker?
  - Recommended: Yes.
  - Answer: Yes. Do not introduce a complex issue tracker; a Python Issue-writing tool is enough.
  - Parent: Q9

- **Q12** Base knowledge
  - Question: Should Agent-generated learning be saved as new Specs, without overwriting human-provided base knowledge?
  - Recommended: Yes.
  - Answer: Knowledge should temporarily be saved as Spec and must not overwrite the base knowledge provided by people.
  - Parent: Q11

- **Q13** Improvement cycle
  - Question: Should each completed bake produce a candidate next Spec, which is read with the relevant history when the next button-triggered run begins?
  - Recommended: Yes.
  - Answer: Yes.
  - Parent: Q12

- **Q14** Per-bread history
  - Question: Should improvement history be kept separately by bread type?
  - Recommended: Yes; avoid mixing results across recipes.
  - Answer: Yes.
  - Parent: Q13

- **Q15** Mechanical-run records
  - Question: Should a mechanical fallback bake record its handoff cause and result, clearly distinguished from an Agent-controlled experiment?
  - Recommended: Yes.
  - Answer: Yes.
  - Parent: Q7

- **Q16** Evaluation in v1
  - Question: Should the simulator provide taste evaluation in v1, while a real device can add user ratings later?
  - Recommended: Yes; device measurements alone do not establish taste.
  - Answer: Yes.
  - Parent: Q10

### Round 3

- **Q17** The chain, and where it lives
  - Question: The chain is `gateway → observe → grill and testimony loop → spec → tickets → 实现`, one node per message with each node a fast-agent. Which three points settle it: (a) is each node a real fast-agent and the chain software that runs on the device; (b) where does the code and the written design go, the `work-weaver/` prototype or a new skill in `weave-your-work/`; (c) what does 实现 act on?
  - Recommended: Yes, each node is a real fast-agent and the chain is software that runs on the device. Code goes in `work-weaver/`. 实现 acts on the oven's control interface and changes nothing in the program.
  - Answer: Yes to all three. Also: 我之前的输入，你可以记录一下 — the sentences about the chain are the person's earlier input, to be recorded here; `raw` means the person's input, not a named module.
  - Parent: none

- **Q16 (Round 3)** What a press can carry
  - Question: When does the person give input, and what does it carry? The person answered the first half: the hardware offers only a few simple buttons carrying a limited set of signal types. The second half, who is in the grill loop, is still open.
  - Recommended: The gateway turns a press into one typed signal out of a fixed set; the grill loop runs without a person in it.
  - Answer: 只有硬件的一些简单按钮，传递有限类型信息。
  - Parent: Q17

- **Q18** What 实现 may change
  - Question: Does 实现 change the device's own program, or only the way it uses existing tools?
  - Recommended: Only the way it uses existing tools; changing the program is a different risk and a different spec.
  - Answer: 提供如调控炉温、醒面时间等的接口，不能改代码，只能调整工具使用的方式。
  - Parent: Q17

- **Q19** When one chain run ends
  - Question: Does a run end after one pass, after every ticket is closed, or at a time or count bound?
  - Recommended: A run ends when the 实现 node writes its result, with a count bound as the backstop.
  - Answer: (no answer yet)
  - Parent: Q17

### Round 4

- **Q20** Should the chain change a recipe or probe it
  - Question: A run that bakes once has nothing to improve: the only recipe it could change is the one it is about to bake, and the score arrives after. Should one round mean solve the recipe from history, bake it once, and score it, with the improvement landing in the next round?
  - Recommended: Yes; the loop unit is one bake, and the learning is carried by the score and history into the next round.
  - Answer: 每烤完一轮，根据评分和历史做优化，下一轮烤面包，通过 grill 循环得到 spec 后执行烤制过程。
  - Parent: Q19

- **Q21** How many rounds the proof covers
  - Question: What does one proof run consist of, and what does passing mean?
  - Recommended: A fixed number of rounds, bread types run separately, and passing means the score trends up rather than any single loaf.
  - Answer: 跑若干轮测试（烤3轮面包），看是否能通过 spec → tickets 的方式不断优化烤面包的效果。
  - Parent: Q20

- **Q22** Where the agent ends and the tools begin
  - Question: Which parts of the chain are fixed as templates (prompts, record shapes, node order), and which are custom tools written for this oven?
  - Recommended: The chain's nodes and their contracts are templates; the oven interface, the simulator, the record store, and the score come from the tools, and the two are kept in separate places.
  - Answer: 将模板和自定义工具分开存放。
  - Parent: Q17

- **Q23** How far the mechanical fallback is built
  - Question: The handoff to the mechanical flow is settled, but this proof runs against a simulator with no device behind it, so a full mechanical program would be simulated twice over. Should the prototype build only the interface the chain calls, and leave the fallback itself unimplemented?
  - Recommended: Yes; the chain gets a stub it can hand a bake to, the stub records the handoff, and the real fallback stays the device's.
  - Answer: 机械兜底层目前可仅做一个接口，模拟测试不具体实现，因为反正也不是具体场景。
  - Parent: Q7

## Settled

- Build and validate a concrete Agent workflow before expanding tool deployment features (from Q1)
- The first version has no dashboard or conversational human interface; buttons start a run and select bread type, while local disk supplies knowledge (from Q2)
- The Agent controls a bake when available; network loss or repeated failures trigger handoff to the mechanical flow (from Q4 and Q5)
- On handoff, the mechanical flow reads current state and completes the bake; the Agent does not re-enter during that run (from Q6 and Q7)
- Independent device safety control rejects unsafe actions, and serious hardware safety faults stop the device (from Q8)
- Use the existing Issue model: Testimony for Grill and observations, Spec for goals and plans, and Ticket for concrete work (from Q9 and Q10)
- Store Issues as local Markdown and use a small Python tool to read and write them (from Q11)
- Keep human-provided base knowledge unchanged; save Agent learning as Spec Issues (from Q12)
- After each bake, create a candidate next Spec; read the relevant Spec history when the next button-triggered run starts (from Q13)
- Keep improvement history separate by bread type (from Q14)
- Record mechanical handoff cause and results, distinguishing them from Agent-controlled results (from Q15)
- Use simulated taste evaluation in v1; real-device user ratings are deferred (from Q16)
- The device's hardware offers only simple buttons carrying a limited set of signal types (from Q16, Round 3)
- The chain runs as fast-agent nodes: `gateway → observe → grill and testimony loop → spec → tickets → 实现`, with the code and the written design in `work-weaver/` (from Q17)
- 实现 adjusts how existing tools are used, such as the oven temperature and the proofing time; it does not change code (from Q18)
- One round is one bake: solve the recipe from the score and the history, run the grill loop for the spec, and bake by it; the learning shows in the next round (from Q20)
- A proof run covers a fixed number of rounds (bake three times) to see whether the spec to tickets path keeps improving the bread (from Q21)
- The templates and the custom tools are stored apart (from Q22)
- The mechanical fallback is built as an interface only; the prototype simulates no mechanical program, because there is no specific device scene (from Q23)
- No conversation with a person is designed; the input is fixed controls such as the oven's buttons (from Q1, Round 3)

## Open

- When one chain run ends: after one pass, after every ticket closes, or at a count bound (from Q19)

## Handed off

- work: Specify the first fast-agent workflow and structured contracts for Observe, Proposer, Grill, Spec/Ticket writing, execution, and verification.
- work: Define the local Issue layout and the small Python Issue read/write tool.
- work: Define the bread-type button input, oven observations/actions, and simulator evaluation.
- work: Define Agent failure detection and the mechanical-flow handoff contract.
