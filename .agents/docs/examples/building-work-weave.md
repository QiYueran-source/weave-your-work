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

The execution map settled the semantic model first: every target node is a map; a task is the finest target, stating an action and a verifiable result; parent-child is refinement; order is a dependency edge. With that model in place, four tasks were cut:

- [Design the glossary skill](../../../tickets/task/wm-rq3exm0m5563.md) under the execution map.
- [Design the map skill](../../../tickets/task/wm-0b59r7xfhk73.md) under the execution map.
- [Design the task skill](../../../tickets/task/wm-87pgn0b75yy5.md) under the execution map.
- [Initialize the glossary during setup](../../../tickets/task/wm-5b50wr2dkaxw.md) under the environment map.

The test for task versus map: can you write a concrete action and a verifiable result now? If yes, a task; if not, a map. All four could, so none got a map layer of its own. The map and task skills each produce a SKILL.md and check it against a worked example under `weave-your-work/examples/`; the judgment that they are tickets rather than child maps is the same as for the glossary.

The alternative that lost: keep all three skill designs inside the execution map's Decisions section. That kept the tree flat but left the work invisible as tickets, and the map could not name what each skill must deliver. Splitting also kept the map's destination honest: the category now holds three skills, not two.

The glossary's same-name conflict rule could not be stated sharply. It stayed in the execution map's Not yet specified, then became a boundary on the design task ("deferred"), not a child. Fog does not have to become a ticket; it can become a stated exclusion.

### What stayed out of the tree

- The execution map kept these in Not yet specified: phase rules, who may advance, claim semantics, concurrency, handover, acceptance details, git collaboration, and whether the local comment category stays.
- The root map kept cross-category coordination in its own Not yet specified: how ask-me routes to execution and communication, which map owns the glossary, installation and distribution, acceptance scenarios, and later members of each category.
- Fog is not a first draft of the task list. A patch graduates only when its question can be stated sharply; until then it stays prose.

### The tree has two records

The map template says the Children list in a map body mirrors waymark's parent relation, and waymark is the source of truth. In this run the two tasks carry `parent` in their frontmatter, but the four category maps carry no `parent` field. Their link to the root exists only in the root map's Sub-maps list.

The lesson: write the parent relation when the child is created. A body mirror is a reading aid; it is not the tree.

## Setting dependencies

### The model came before the edges

The execution map settled the dependency model before any edge existed: the tree carries structure, the edges carry order. A dependency is a "waits for" relation between two nodes; adding or removing it does not move either node in the tree.

The glossary entry for dependency edge records the same rule, and it was written while the design was being settled. Later tickets use one meaning for the term.

### The first concrete edge

The glossary work exposed an edge: the setup task installs and checks the pieces the design task produces. Its acceptance signal cannot pass until those pieces exist, so setup initialization waits for the design. The edge points from setup to design: setup is blocked by design.

It is not a parent change. The setup task is a refinement of "setup initializes a project", not of "design the glossary skill". Moving it under the execution map would state a refinement that is not true.

The edge was not wired in waymark when the tickets were published. It is wired now: the setup task declares a dependency on the design task, so the setup work stays blocked until the design delivers its pieces.

The lesson: when two tickets sit in different branches and one consumes the other's output, wire the edge in the same pass that creates them. Otherwise the frontier overstates what can start.

### Edges left unwired

The root map leaves cross-category routing (ask-me to execution and communication) in fog. It is not sharp enough to be an edge yet: the routing rules are not settled. No other edge was added; the category maps are not sequenced.

## Defining tasks

### When a task was ready

Both glossary tasks were created at 11:43 on 2026-11-06, after the map decisions that gave them their outline. The design task's format details changed later: the map recorded the identity rule, the MCP tools, and the JSONL source format, and the task was updated in the same commit that recorded the JSONL decision (`ecbaf2f`). The task and the map moved together.

The task template has three sections: What to do, Acceptance signal, Boundaries. The action and the verifiable result sit in one place; the boundaries keep the ticket from growing into the whole skill.

### The design task

[Design the glossary skill](../../../tickets/task/wm-rq3exm0m5563.md) lists four deliverables: SKILL.md, an MCP server, hooks, and the merge format and rules.

Its acceptance signal: the four pieces live under `weave-your-work/glossary/`; one term written and a simulated pull shows the term in the generated view; SKILL.md covers the four moves borrowed from matt's domain-modeling. Its boundaries: same-name conflict rules are deferred, and identity is the operator with git `user.name` as fallback.

The task kind is `delivery`: it delivers a committed output, and failure is an incident rather than a normal result.

### The setup task

[Initialize the glossary during setup](../../../tickets/task/wm-5b50wr2dkaxw.md) lists five steps, from creating `.glossary/` to adding the AGENTS.md prompt.

Its acceptance signal: on a fresh project after setup, the directory exists, the MCP server writes, the post-merge hook is installed, the rules are in place, and the prompt is there. The steps are instructions an AI can follow; mechanical parts may be scripts. Its boundaries exclude setup's other duties, such as dependency checks and waymark initialization.

This task is also `delivery`.

### The map and task design tasks

[Design the map skill](../../../tickets/task/wm-0b59r7xfhk73.md) and [Design the task skill](../../../tickets/task/wm-87pgn0b75yy5.md) split the two skill designs that had been living in the execution map's Decisions section. Each is `delivery`: it produces a SKILL.md under `weave-your-work/` and checks its rules against an example in `weave-your-work/examples/` (`map-example.md` and `task-example.md`).

The map task's acceptance signal: the rules live under `weave-your-work/map/`; a reader can rebuild the example map from the skill without asking; the body index and waymark parent relation agree after a child changes. Its boundaries: task design is a sibling ticket, and the example stays domain-agnostic.

The task task's acceptance signal: the rules live under `weave-your-work/task/`; a reader can rebuild the example task from the skill; both a probe and a delivery task show their reversibility. Its boundaries: map design is a sibling ticket, and glossary conflicts are out of scope.

### Why tasks, not maps

Each of the four has one owner, a concrete action, and one acceptance signal. A map adds a layer only when something is left to refine. Here nothing was.

### What the tasks do not cover

The four tickets cover the first executable pieces: the glossary skill, its setup step, and the map and task skills. The category maps are still exploring their remaining fog; the rest stays in the maps until it can be stated as an action.

## What changed during the run

- The old map was retired and re-charted in the fixed map format.
- "Goal" was dropped; every target node is a map.
- The tickets were converted to English.
- The map template was fixed to six sections, with only `phase` as a custom field.
- Rule 03 was added: settled details land in the owning ticket immediately.
- The execution map's destination now names three skills: map, task, and glossary.
- The map and task skill designs became tickets of their own, with worked examples under `weave-your-work/examples/`.
- The category maps were hung under the root map (`fa46553`), closing the parent gap.
- The setup task now depends on the design task, closing the unwired edge.
- This rule and example were added on 2026-11-06.

## What this example does not show

The conversation that produced the tickets is not recorded. Only settled decisions reached the tickets, so rejected answers that never made it into one are lost from the record. Two gaps were noted earlier and later closed: the category maps now carry a `parent` pointing at the root map, and the setup task declares its dependency on the design task.

## Pointers

- [Work-weave: general team collaboration skill set](../../../tickets/map/wm-wjwa9081hse1.md)
- [Entry skills: ask-me routing and questioning](../../../tickets/map/wm-8wzzh4hp5evp.md)
- [Environment skills: setup initialization and checks](../../../tickets/map/wm-a08fwanmy5q6.md)
- [Execution skills: map and task collaboration](../../../tickets/map/wm-qhd3twqjzhma.md)
- [Communication skills: issue remote exchange](../../../tickets/map/wm-25b3q7mg88c7.md)
- [Design the glossary skill](../../../tickets/task/wm-rq3exm0m5563.md)
- [Design the map skill](../../../tickets/task/wm-0b59r7xfhk73.md)
- [Design the task skill](../../../tickets/task/wm-87pgn0b75yy5.md)
- [Initialize the glossary during setup](../../../tickets/task/wm-5b50wr2dkaxw.md)
