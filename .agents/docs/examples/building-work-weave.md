# Building work-weave

The first worked example of the skill set's own methods: how the target tree was split, how dependencies were set, and how tasks were defined while work-weave was being designed. It is recorded from the tickets and commits of 2026-11-05 and 2026-11-06. The tickets hold the decisions; this page holds the order and the judgment around them.

## Starting point

The effort began with one root map, [Work-weave 通用团队协作技能](../../../tickets/map/wm-s34t81sb3q5h.md), written with Objective, Investment, Outcome, Acceptance, and Fog sections. It carried the whole design in one body.

On 2026-11-06 that map was archived. Its body did not match the map format the skill was defining, so it was retired and replaced by [Work-weave: general team collaboration skill set](../../../tickets/map/wm-wjwa9081hse1.md). The new destination: an installable skill set under `weave-your-work`, using waymark as the single tracker, carrying a target from map to task, with one owner per item and the owner advancing and accepting. It suits any domain, not only software.

The map format was still moving when the first map was written. Once it changed, the old map could not be edited into shape; archiving and re-charting were cheaper than carrying the mismatch. The archived map stays in the tracker as history.

## Splitting the tree

### First split: one map per category

The first split divides the work by the question each category answers:

- entry: what should I do now? This map holds [ask-me](../../../tickets/map/wm-8wzzh4hp5evp.md).
- environment: is the project ready, and how do we initialize it? This map holds [setup](../../../tickets/map/wm-a08fwanmy5q6.md).
- execution: is the work advancing, who is accountable, where is it stuck? This map holds [map and task](../../../tickets/map/wm-qhd3twqjzhma.md).
- communication: are we aligned remotely? This map holds [issue](../../../tickets/map/wm-25b3q7mg88c7.md).

The root map is an index. It lists the sub-maps, states the destination, and holds cross-category decisions. It does not restate decisions that live in a category map. The split follows function, not phase: the category maps are parallel branches of the destination. If one category must wait for another, that is a dependency edge, not a place in the tree.

### Second split: the execution skills

The execution map settled the semantic model first: every target node is a map; a task is the finest target, stating an action and a verifiable result; parent-child is refinement; order is a dependency edge. With that model in place, three skill maps were cut, plus one setup task:

- [Map skill](../../../tickets/map/wm-0b59r7xfhk73.md) under the execution map.
- [Task skill](../../../tickets/map/wm-87pgn0b75yy5.md) under the execution map.
- [Glossary skill](../../../tickets/map/wm-rq3exm0m5563.md) under the execution map.
- [Initialize the glossary during setup](../../../tickets/task/wm-5b50wr2dkaxw.md) under the environment map.

A skill is a target with several function details still in fog, so each skill gets a map layer of its own. The test for the layer below: a function detail that can be written as a concrete action and a verifiable result becomes a task under the skill map; until then it stays in that map's Not yet specified.

The first cut put the three skill designs directly under the execution map as tasks. That was wrong: it skipped the skill layer and flattened "the skill" and "a function of the skill" into one line. The fix moved each design to a map and left the function details as fog. This is the judgment the example exists to keep: the same test applies at every layer, and the layer is chosen by what can be refined next, not by how important the thing sounds.

### What stayed out of the tree

- The execution map kept these in Not yet specified: phase rules, who may advance, claim semantics, concurrency, handover, acceptance details, git collaboration, and whether the local comment category stays.
- The root map kept cross-category coordination in its own Not yet specified: how ask-me routes to execution and communication, which map owns the glossary, installation and distribution, acceptance scenarios, and later members of each category.
- Fog is not a first draft of the task list. A patch graduates only when its question can be stated sharply; until then it stays prose.

### The tree has two records

The map template says the Children list in a map body mirrors waymark's parent relation, and waymark is the source of truth. In this run the category maps, the three skill maps, and the setup task all carry `parent` in their frontmatter; the root map's Sub-maps list is the reading aid.

The lesson: write the parent relation when the child is created. A body mirror is a reading aid; it is not the tree.

## Setting dependencies

### The model came before the edges

The execution map settled the dependency model before any edge existed: the tree carries structure, the edges carry order. A dependency is a "waits for" relation between two nodes; adding or removing it does not move either node in the tree.

The glossary entry for dependency edge records the same rule, and it was written while the design was being settled. Later tickets use one meaning for the term.

### The first concrete edge

The glossary work exposed an edge: the setup task installs and checks the pieces the glossary skill map produces. Its acceptance signal cannot pass until those pieces exist, so setup initialization waits for the skill design. The edge points from setup to the glossary skill map: setup is blocked by the skill map.

It is not a parent change. The setup task is a refinement of "setup initializes a project", not of "design the glossary skill". Moving it under the execution map would state a refinement that is not true.

The edge was not wired in waymark when the tickets were published. It is wired now: the setup task declares a dependency on the glossary skill map, so the setup work stays blocked until the design delivers its pieces.

The lesson: when two tickets sit in different branches and one consumes the other's output, wire the edge in the same pass that creates them. Otherwise the frontier overstates what can start.

### Edges left unwired

The root map leaves cross-category routing (ask-me to execution and communication) in fog. It is not sharp enough to be an edge yet: the routing rules are not settled. No other edge was added; the category maps are not sequenced.

## Defining tasks

### When a task was ready

The setup task was created at 11:43 on 2026-11-06, after the map decisions that gave it its outline. The glossary skill map's format details changed later: the map recorded the identity rule, the MCP tools, and the JSONL source format, and the skill map was updated in the same commit that recorded the JSONL decision (`ecbaf2f`). The map and its decisions moved together.

A task template has three sections: What to do, Acceptance signal, Boundaries. The action and the verifiable result sit in one place; the boundaries keep the ticket from growing into the whole skill.

### The glossary skill map

[Glossary skill](../../../tickets/map/wm-rq3exm0m5563.md) is a map. Its Target states the four pieces to design: SKILL.md, an MCP server, hooks, and the merge format and rules. Its Decisions record the identity rule, the four MCP tools, the JSONL source fields, and the generated view format. Its Not yet specified holds the function details that cannot be written as tasks yet.

Its acceptance direction: all child tasks are done and no further child task is needed; the four pieces exist under `weave-your-work/glossary/`; one term written plus a simulated pull shows the term in the generated view; SKILL.md covers the four moves borrowed from matt's domain-modeling.

### The setup task

[Initialize the glossary during setup](../../../tickets/task/wm-5b50wr2dkaxw.md) is still a task, because its five steps are concrete and its result is visible. It sits under the environment map, not the execution map: it initializes a project, it does not design the skill.

Its acceptance signal: on a fresh project after setup, the directory exists, the MCP server writes, the post-merge hook is installed, the rules are in place, and the prompt is there. The steps are instructions an AI can follow; mechanical parts may be scripts. Its boundaries exclude setup's other duties, such as dependency checks and waymark initialization.

### The map and task skill maps

[Map skill](../../../tickets/map/wm-0b59r7xfhk73.md) and [Task skill](../../../tickets/map/wm-87pgn0b75yy5.md) split the two skill designs that had been living in the execution map's Decisions section. Each is a map with its function details still in fog, and each checks its rules against an example in `weave-your-work/examples/` (`map-example.md` and `task-example.md`).

The map skill's acceptance direction: all child tasks are done and no further child task is needed; the rules live under `weave-your-work/map/`; a reader can rebuild the example map from the skill without asking; the body index and waymark parent relation agree after a child changes. Its out of scope: task skill design and software-specific workflows.

The task skill's acceptance direction: all child tasks are done and no further child task is needed; the rules live under `weave-your-work/task/`; a reader can rebuild the example task from the skill; both a probe and a delivery task show their reversibility. Its out of scope: map skill design and glossary conflicts.

### Why skill maps, not tasks

A skill is not one action. The map skill has to settle creating a map, the six body sections, children sync, fog graduation, phases, and the acceptance check; the task skill has to settle the body, kinds, reversibility, claiming, dependencies, and closing. Those are several function details, so each skill is a target with fog, not an executable unit. The rule stays: a child becomes a task only when its action and verifiable result can be written now.

### What the skill maps do not cover

The three skill maps cover the skill-level targets; the setup ticket covers the first executable piece. The function details stay in each skill map's Not yet specified until they can be written as tasks. The execution map's category-level questions (phases, claiming, acceptance details, git collaboration) stay in its own fog.

## What changed during the run

- The old map was retired and re-charted in the fixed map format.
- "Goal" was dropped; every target node is a map.
- The tickets were converted to English.
- The map template was fixed to six sections, with only `phase` as a custom field.
- Rule 03 was added: settled details land in the owning ticket immediately.
- The execution map's destination now names three skills: map, task, and glossary.
- The three skill designs were first cut as tasks, then moved to skill maps; the skill layer was missing at the first cut.
- The map and task skill designs became skill maps of their own, with worked examples under `weave-your-work/examples/`.
- The category maps were hung under the root map (`fa46553`), closing the parent gap.
- The setup task now depends on the glossary skill map, closing the unwired edge.
- This rule and example were added on 2026-11-06.

## What this example does not show

The conversation that produced the tickets is not recorded. Only settled decisions reached the tickets, so rejected answers that never made it into one are lost from the record. Two gaps were noted earlier and later closed: the category maps now carry a `parent` pointing at the root map, and the setup task declares its dependency on the glossary skill map.

## Pointers

- [Work-weave: general team collaboration skill set](../../../tickets/map/wm-wjwa9081hse1.md)
- [Entry skills: ask-me routing and questioning](../../../tickets/map/wm-8wzzh4hp5evp.md)
- [Environment skills: setup initialization and checks](../../../tickets/map/wm-a08fwanmy5q6.md)
- [Execution skills: map, task, and glossary](../../../tickets/map/wm-qhd3twqjzhma.md)
- [Communication skills: issue remote exchange](../../../tickets/map/wm-25b3q7mg88c7.md)
- [Glossary skill](../../../tickets/map/wm-rq3exm0m5563.md)
- [Map skill](../../../tickets/map/wm-0b59r7xfhk73.md)
- [Task skill](../../../tickets/map/wm-87pgn0b75yy5.md)
- [Initialize the glossary during setup](../../../tickets/task/wm-5b50wr2dkaxw.md)
