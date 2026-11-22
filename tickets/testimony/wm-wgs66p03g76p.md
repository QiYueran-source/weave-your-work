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
  - Answer: 分析分析。我理解 tickets 就是给到 implement 一份明确的待做清单，让上下文不至于过大，所以我觉得还是得有一个类似的东西；但也不排除直接在 spec 里写清。哪种比较好？
  - Parent: Q1

- **Q3** What the bread machine's input can carry
  - Question: Does the person press anything besides start-bake? The new description says the only input is a button carrying a fixed signal such as start-bake. The earlier records had bread-type buttons, a stop signal, and an acknowledge signal. Which signals exist on this machine?
  - Recommended: Start bake is the only press; the person has no way to name a bread type, stop a bake, or acknowledge anything, and every round bakes without a person in it.
  - Answer: This is a simulation experiment; it does not need to be taken that seriously, and our own design comes first.
  - Parent: Q1

- **Q4** What the machine's controls accept
  - Question: The earlier records gave implement a temperature set point, a hold duration, a proofing time, and start and abort. With one start button and no bread-type input, which of these can implement set, and which are fixed by the machine? The answer settles whether implement's output is a schedule in time or a fixed set of values.
  - Recommended: A named set of numeric controls with declared ranges, the same shape as before; the machine decides which exist, and implement may set only those.
  - Answer: Use a numerical simulation. Four or five knobs controlling temperature, bake time, proofing time and so on; each setting affects several features, the effect is quadratic or an absolute-value shape with an optimum, and for now the knobs do not interact.
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

### Round 2

- **Q7** Where a round's feedback comes from
  - Question: The observe node needs a result to read after each bake. Should every round be scored by a person, by machine-readable signals only (oven temperature, ambient temperature, water and flour weight, a networked camera measuring how far the dough rose), or by a person scoring once with the rest machine-readable?
  - Recommended: Machine-readable signals for every round, with the score coming from the taste program; a person is not in the loop.
  - Answer: Design a few features (crispness, moistness, softness, chewiness, sweetness and so on), score each from 0 to 1, then weight them.
  - Parent: Q6

- **Q8** How a bake is simulated
  - Question: Should implement drive a numerical simulation instead of a real machine, or a real bread machine?
  - Recommended: A numerical simulation, behind the same control interface a real machine would present.
  - Answer: Use a numerical simulation. Four or five knobs control temperature, bake time, proofing time and so on; each setting affects several features, the effect is quadratic or an absolute-value shape with a single optimum, and for now the knobs do not interact.
  - Parent: Q7

- **Q9** How the features become one score
  - Question: Should the features be combined by fixed weights, by weights drawn from a distribution per bake, or by per-person weights plus a softmax to model how tastes vary?
  - Recommended: A fixed weight vector for the proof, with a random one as a later variant.
  - Answer: The weighting uses several independent random distributions plus a softmax to simulate the random variation in people's tastes.
  - Parent: Q8

- **Q10** Whether a real machine is in scope
  - Question: Should the proof drive a simulation or a real machine? The recommendation was to prove the chain on a mock device and a seeded simulation first, and decide about a real machine afterwards.
  - Recommended: Simulation first; a real machine is a later question.
  - Answer: This is only a simulation experiment; it does not need to be taken that seriously, and our own design comes first.
  - Parent: Q6

### Round 3

- **Q11** Whether tickets stays
  - Question: Keep tickets as a node whose job is reduced to implement's short to-do list (three to six steps), drop it and let implement read a spec that already holds the steps, or keep it as a step inside implement?
  - Recommended: Keep it as a node, owning the short to-do list: the spec says what this bake should reach and why, the tickets say what implement should do, and next round's reading of the records can still tell intent from steps.
  - Answer: 保留 tickets 节点.
  - Parent: Q2

- **Q12** Knobs against features
  - Question: Five features (crispness, moistness, softness, chewiness, sweetness) and four or five knobs (temperature, bake time, proofing time and the rest). Should each feature have one dominant knob, with other knobs moving it by less, or should three or four knobs each move several features with no dominant pairing?
  - Recommended: Five knobs, one dominant per feature, and other knobs moving each feature by a lesser amount.
  - Answer: 五个旋钮，一一对应五个特征的主导旋钮.
  - Parent: Q8

- **Q13** Where randomness enters
  - Question: Beside the knobs, should the simulation carry a hidden environment parameter, observation noise, and per-bake drawn taste weights, or only a small random perturbation on each feature's output?
  - Recommended: A small random perturbation on each feature's output, kept simple.
  - Answer: 那让每一个面包特征输出时带一个小的随机扰动吧，不用太复杂.
  - Parent: Q12

### Round 4

- **Q14** How often the taste weights are drawn
  - Question: One round is one bake. Should the random taste weights be drawn once per round and held for that round, drawn per bake, or drawn several times per round and averaged?
  - Recommended: Drawn once per bake, so each round is judged by one user's taste.
  - Answer: 一炉抽一次，可设定这个口味为这一炉的用户的平均口味.
  - Parent: Q9

- **Q15** Whether the chain can change the action set
  - Question: The knobs are fixed at five and do not interact, so what the chain can learn is adjusting their values. Should it also be able to change the set of knobs or the structure of the bake (a second temperature stage, a quick-slow-quick schedule), which is where self-evolution parts from tuning, or is fixed-knob tuning the thing this proof tests?
  - Recommended: Fixed knobs for this proof; changing the action set is a later design.
  - Answer: 先不做，先用固定旋钮把「调参」验证清楚.
  - Parent: Q12

### Round 5

- **Q16** What the knowledge gives
  - Question: The base knowledge is a pair of human-written handbooks: one on the fixed target, the bake's quality features and the knobs; one on the chain's own constraints. Should it hold qualitative priors only, the simulator's real parameters, or nothing?
  - Recommended: Qualitative priors only, with no numeric optimum and no simulator parameter.
  - Answer: 不能给仿真器参数，因为现实世界没有一个确切的面包建模，是不可计算的，不能给 ai。提供的知识可看作人类面包师的经验，如每个旋钮会影响哪些特征，每个特征的变化和某个旋钮之间的关系（如 温度升高，酥度先变大后变小），一些底线（如至少要烤制 3min，不然是生的，最多烤制 5min，不然就糊了，可对应先增后减函数的两个零点）。
  - Parent: Q13

- **Q17** What the proof can see
  - Question: Beside the three rounds of records, should the proof keep the knob values and the per-round score table?
  - Recommended: Keep both, so a reader can see whether the third round adjusts near the second instead of moving at random.
  - Answer: spec 和 tickets 会记录 agent 的操作，testimony 会记录 agent 的思考，知识手册沉淀他的知识。还有系统提示词（不可变）用来规定目标和 RSI 约束，最后是可调用的接口信息。其他不可见。
  - Parent: Q15

- **Q18** How the chain is orchestrated
  - Question: fast-agent's declarative workflows (chain, evaluator-optimizer, orchestrator, router) send a message to the next agent and keep no state; none of them chooses the next node by the event a node produced. Should the chain be a code state machine over fast-agent nodes, a fast-agent workflow graph, or does the shape not matter as long as it runs?
  - Recommended: A code state machine whose nodes are fast-agent agents.
  - Answer: 这个我要研究一下，这是重点。
  - Parent: Q12

### Round 6

- **Q19** Where the machine's knobs live
  - Question: Should the machine's capabilities sit behind an interface of get-state, set-knob, and bake, one MCP server for the machine, a single read/write state file, or only writes with a fixed injection?
  - Recommended: A small set of typed calls: read the machine's state, set a knob, bake.
  - Answer: 我没说清楚，可调用的接口信息是 炉子 的旋钮信息。其他的工具我们只提供 读 testimony、写 testimony、读 spec、读 tickets、写 spec、写 tickets、读手册、写手册、改手册 的能力.
  - Parent: Q17

- **Q20** Whether the machine is an MCP server
  - Question: Should the machine be a separate MCP server that the nodes call as tools, or a plain local function?
  - Recommended: A separate MCP server, so the taste program stays behind a tested function and replacing it with a real machine changes only that layer.
  - Answer: 面包机能力在独立 MCP server 里.
  - Parent: Q19

- **Q21** Whether a round's own records are readable
  - Question: May the chain read what it writes in the same round?
  - Recommended: Yes, with writes constrained.
  - Answer: 当前记录也可见，我说的是所有的记录这些都是可见的，但改受约束.
  - Parent: Q17

### Round 7

- **Q22** Which node may write which record
  - Question: Should each record be writable only by the node that owns it and frozen once the next node starts, the handbook be readable but not writable, and every record append-only?
  - Recommended: Each node writes only its own record; the handbook is read-only to the chain.
  - Answer: 简单起见，1. testimony、spec、tickets 每次只能改自己的，不能增删改之前的，一旦到下一个节点后这份记录就不可变了；2. 人工提供的初始手册不能改，自己有一个进化的手册可以改，可以删之前的内容.
  - Parent: Q19

- **Q23** What a round's writes are visible to
  - Question: May a node read what it wrote this round but not what has not been produced yet?
  - Recommended: Yes: what this round has written so far is readable, what the round has not produced yet is not.
  - Answer: 能读到自己本轮已写的，但读不到本轮尚未产生的东西.
  - Parent: Q22

- **Q24** Where a failure is caught
  - Question: Should failure be judged by a rule checker over the records, or should the tools be narrow enough that an overreach cannot happen?
  - Recommended: Narrow tools; an overreach cannot happen because no tool allows it.
  - Answer: 我们工具就创建的严格一点，从工具端避免越权吧.
  - Parent: Q22

### Round 8

- **Q25** Whether each edge carries a typed event
  - Question: Should every node boundary carry a typed object with fixed fields, which the receiving node's code validates before it runs, instead of free markdown?
  - Recommended: Yes; each boundary has one model, and a value that does not fit stops the chain at that edge.
  - Answer: 啥叫 pydantic.
  - Parent: Q17

- **Q26** What the spec and the tickets each hold
  - Question: Should the spec say what this bake should reach and why, and the tickets list three to six steps that carry the knob values?
  - Recommended: Yes; the spec carries goal and reasons, the tickets carry three to six steps with knob values.
  - Answer: spec = 目标与理由，tickets = 3-6 步带旋钮值.
  - Parent: Q25

- **Q27** Who confirms a round, and how many
  - Question: Should a run be three rounds that finish without a person, or stop after each round for a person to read?
  - Recommended: Three rounds that finish on their own.
  - Answer: 端侧情景，无法人类交互，只提供启动新一炉面包的开关.
  - Parent: Q11

### Round 9

- **Q28** What pydantic means here
  - Question: pydantic is a Python library for declaring which fields a value has and of what type, so a model's output that lacks a field or carries one it should not fails the check. Is that the intended meaning of the typed boundary?
  - Recommended: Yes.
  - Answer: 行，按这个理解.
  - Parent: Q25

- **Q29** What one press starts
  - Question: Does one press run one entire round, observe through implement, with the next round needing another press, or do three rounds follow one press?
  - Recommended: One press is one round.
  - Answer: 一个开关一炉：每按一次跑一整轮.
  - Parent: Q27

- **Q30** Whether a person sees anything during a run
  - Question: Should there be a read-only panel outside the chain, or does the person read the records on disk after the run?
  - Recommended: No panel; the results are files a person opens afterwards.
  - Answer: 我们只是仿真实验，目前结果都放文件系统吧，我自己打开看，不用面板了.
  - Parent: Q27

### Round 10

- **Q31** The knobs and features
  - Question: Are the five knobs oven temperature, bake time, proofing time, water amount, and sugar amount, with the ranges 150-250 °C, 20-70 min, 20-120 min, 50-90 % of the flour weight, and 0-15 %, and the five features crispness, moistness, softness, chewiness, and sweetness, each dominated by one of them?
  - Recommended: Yes; temperature dominates crispness, bake time chewiness, proofing time softness, water amount moistness, and sugar amount sweetness.
  - Answer: 按这个表：五个特征、五个主导旋钮、初始范围.
  - Parent: Q26

- **Q32** How much taste varies between bakes
  - Question: How large should the per-bake taste deviation be: mostly small, mostly large, or nearly none?
  - Recommended: A deviation drawn per bake on top of the average weights, mostly small and in about three bakes out of ten leaning clearly toward one feature.
  - Answer: Δ 控制大小，约三成面包有明显偏重.
  - Parent: Q14

- **Q33** How much the feature perturbation may blur the trend
  - Question: Should the perturbation stay small, around five percent, with a fixed taste deviation so scores can be compared across rounds, or be larger and accept the noise?
  - Recommended: Small perturbation, about five percent, and a seeded run so the comparison can be repeated.
  - Answer: 特征扰动取小（±5% 量级），且固定的口味偏差让均分可比较.
  - Parent: Q13

### Round 11

- **Q34** How the record tools are cut
  - Question: Should the record tools be listed per record kind (write this round's testimony, read testimony, list testimonies, write and read spec, write and read tickets, read the base handbook, read and write the evolving handbook), with each node given only its own write, or be one tool taking a kind argument?
  - Recommended: One tool per operation, so a node without the write tool cannot overreach.
  - Answer: testimony 也可以读之前的吧.
  - Parent: Q22

- **Q35** How the evolving handbook is shaped
  - Question: Should the evolving handbook hold at most thirty experience entries that the chain may add, change, and delete, each tagged with the round that produced it, or be free markdown the chain rewrites whole?
  - Recommended: At most thirty entries, each tagged with its round.
  - Answer: 30 条以内的经验条目，可增删改，每条带轮次标签.
  - Parent: Q22

- **Q36** The order the work is built in
  - Question: Build the tools and the record store first, then the simulation MCP, then the chain, then the three-round run, or write tests first?
  - Recommended: Records and tools, simulation, chain, then the three-round run.
  - Answer: 按顺序：工具/记录库 → 仿真 MCP → 链路 → 三轮验收.
  - Parent: Q29

### Round 12

- **Q37** How fast-agent holds memory
  - Question: The person asked to understand fast-agent-mcp's memory before deciding the chain's shape. Should the chain rely on fast-agent's own conversation history (a per-agent in-memory conversation, with `use_history` on by default and an optional file save), or keep each node's context built by the chain from the records?
  - Recommended: Keep the node's context built by the chain from the records; fast-agent's history per agent is short-term and in-memory, and its long-term memory would be an MCP memory server that this design's record tools already stand in for.
  - Answer: 我想先了解 fast-agent-mcp 定义的 agent 的短期长期记忆，工具等机制.
  - Parent: Q18

- **Q38** How each node gets its tools
  - Question: fast-agent gives an agent its tools through MCP servers it is configured with, and can filter them per server. Should each node get only the tool subset its job owns, or every node get the same full tool set?
  - Recommended: Each node gets only its own write tool plus the read tools it needs, and implement additionally gets the machine server alone.
  - Answer: (no answer yet)
  - Parent: Q37

### Round 13

- **Q39** How the chain is orchestrated, source-level
  - Question: fast-agent's declarative workflows (chain, evaluator-optimizer, orchestrator) pass free text between agents and keep no typed state; none routes by the event a node produced. Should the chain be a code loop whose nodes are each a `@fast.agent` definition, with pydantic models on the edges, or a fast-agent workflow graph?
  - Recommended: A code loop over typed edges, with each node still defined by `@fast.agent`.
  - Answer: 也就是说我们不用 chain 这些，而是自己写 flow，每个节点用它定义好的这样？
  - Parent: Q18

- **Q40** Which loop the grill uses
  - Question: Should the grill node be fast-agent's evaluator-optimizer, or a small loop the chain writes around two fast-agents? The evaluator-optimizer keeps its refinement count inside a branch that breaks before the increment (so `max_refinements` never fires), and its `EvaluationResult` schema (a four-level rating) does not match the three verdicts the grill needs.
  - Recommended: A loop the chain writes: a proposer and a grill, a verdict of accept, revise, or stop, a fixed round limit, and the last draft kept when the limit is reached.
  - Answer: 自己写循环：proposer + grill，三态裁决，固定上限.
  - Parent: Q39

- **Q41** Whether the round ends with a digest node
  - Question: Should the round end with a node that reads everything and settles the learned knowledge, placed after implement, before observe, or before spec? After the person's answer: should the round keep such a node at all, or should the knowledge be written where it is learned?
  - Recommended: No extra node; the evolving handbook is written by the proposer inside the grill, where the knowledge actually forms.
  - Answer: 参考 2；那要不按之前分工，grill 那里写，那里讨论的效果应该比直接沉淀好，不要最后一个节点了.
  - Parent: Q39

- **Q42** Whether a run keeps anything in the process
  - Question: Session history, trajectory saving, and mid-turn compaction are on or off by default in fast-agent. Should the run turn all three off, keep `use_history` on only for the steps inside one agent's tool loop, and let every round reload its context from the records when the process starts?
  - Recommended: Yes: no session snapshot, no trajectory, no compaction; the process starts with empty agents and reads the records.
  - Answer: 关掉 session 快照、轨迹、压缩；use_history 只保在单个 agent 的循环内.
  - Parent: Q21

- **Q43** How many grill rounds are allowed
  - Question: Should the grill's round limit be fixed now, or left to the implementation?
  - Recommended: Left to the implementation; the loop is capped either way.
  - Answer: 上限先不定，实现时再调.
  - Parent: Q40

## Settled

- This design starts again: the earlier testimony and draft spec are input only and do not constrain it (from Q1)
- The score of a bake comes from a linear-programming-style program the person supplies; its details are still to be given (from Q5)
- The criterion for a failed proof is deferred until after the runs have shown what a three-bake result looks like (from Q6)
- The proof is a simulation experiment rather than a real machine; the design being tested comes first (from Q10)
- A bake is scored by a set of named features, each from 0 to 1, combined into one score (from Q7)
- The simulation exposes five knobs — oven temperature (150-250 °C), bake time (20-70 min), proofing time (20-120 min), water amount (50-90 % of the flour weight), and sugar amount (0-15 %) — and each moves several features along a single-peaked curve that is quadratic or absolute in shape; the knobs do not interact for now (from Q8, Q31)
- The features are weighted by weights drawn from several independent random distributions passed through a softmax, which stands for the variation in people's tastes (from Q9)
- Tickets stays a node; its job reduced to implement's short to-do list, three to six steps, with the spec holding what the bake should reach and why (from Q11)
- Five features — crispness, moistness, softness, chewiness, sweetness, each scored from 0 to 1 — face the five knobs: temperature dominates crispness, bake time chewiness, proofing time softness, water amount moistness, and sugar amount sweetness, with the other knobs moving each feature by a lesser amount (from Q7, Q12, Q31)
- Randomness is a perturbation of about five percent on each feature's output, and a run uses fixed seeds so a comparison can be repeated; there is no hidden environment parameter, no observation noise layer, and no drift between rounds (from Q13, Q33)
- The taste weights are drawn once per bake and read as that bake's user's average taste; a per-bake deviation sits on top of the average, mostly small, and about three bakes in ten lean clearly toward one feature (from Q14, Q32)
- The action set is fixed for this proof: the chain adjusts knob values and does not add, remove, or restructure the bake (from Q15)
- The base knowledge is a baker's handbook: which knobs move which features, the shape of each knob-to-feature relation such as crispness rising then falling as temperature rises, and hard limits such as a bake shorter than three minutes being raw and one longer than five burning; it never holds the simulator's parameters (from Q16)
- What the chain reads: its two handbooks (the fixed target with its features and knobs, the chain's own constraints), an immutable system prompt stating the goal and the self-evolution limits, and the callable interface; what it writes: spec and tickets for its actions, testimony for its reasoning, and its learned knowledge in the handbook it is allowed to edit (from Q17)
- The simulator's parameters and the score's internals are not visible to the chain (from Q17)
- The interface the chain is told about is the machine's knobs; the chain's tools are read and write for testimony, spec, tickets, and the handbook (from Q19)
- Each node writes only its own record — testimony, spec, or tickets — with no change to earlier records, and a record freezes once the next node starts (from Q22)
- The chain reads every record of this and earlier rounds; it is the writes that are bounded (from Q34)
- The person's initial handbook is read-only to the chain; the chain keeps an evolving handbook of its own, at most thirty experience entries tagged with the round that produced them, which it may add, change, or delete (from Q22, Q35)
- The record tools are one tool per operation — write this round's testimony, read testimony, list testimonies, write and read spec, write and read tickets, read the base handbook, read and write the evolving handbook — and each node holds only the write its job allows (from Q34)
- The chain is a code loop over typed edges; each node is still defined with `@fast.agent`, but the framework's chain, orchestrator, and evaluator-optimizer decorators are not used to route it (from Q39)
- The grill is a loop the chain writes: a proposer and a grill agent, three verdicts (accept, revise, stop), a fixed round limit, and the last draft kept when the limit is reached (from Q40)
- The grill's round limit is set at implementation time, and the loop is capped either way (from Q43)
- Session snapshots, trajectory saving, and mid-turn compaction are off; `use_history` is kept only for the steps inside one agent's tool loop (from Q42)
- The round has no digest node; the evolving handbook is written by the proposer inside the grill, where the knowledge forms, and not settled once at the end (from Q41)
- The chain builds each node's context from the records rather than relying on a node's in-memory conversation to carry state from round to round; fast-agent's per-agent history is short-term only (from Q37)
- The work is built in order: records and tools, the simulation MCP server, the chain, the three-round run (from Q36)
- A node reads what this round has written so far and not what the round has not produced yet (from Q23)
- Validation is programmatic: every node boundary carries a fixed set of fields, the receiving program checks them before its node runs, and a value that does not fit stops the chain at that edge, so no model's judgement guards its own input (from Q25)
- The spec carries what this bake should reach and why; the tickets carry three to six steps, each with its knob values (from Q26)
- One press of the switch is one round, observe through implement; the next round needs the next press, and nothing inside a round asks a person anything (from Q29)
- The proof's results are files on disk that a person opens afterwards; there is no panel and no view into a running round (from Q30)
- Overreach is prevented by narrow tools rather than judged after the fact (from Q24)
- The machine is its own MCP server, so the taste program stays behind a tested function and a real machine would replace only that layer (from Q20)
- Every record is readable, the current round's included; what it may write is constrained (from Q21)

## Open

- Whether the earlier design's other signals (stop, acknowledge) exist on this machine, now that one press is one round (from Q3)
- What the taste program computes and what its inputs and outputs are (from Q5)
- What evidence counts as a failed proof (from Q6)

## Handed off

- work: Write the chain from observe to implement as a fast-agent workflow the prototype can run.
- work: Build the taste program once the person gives its design.
