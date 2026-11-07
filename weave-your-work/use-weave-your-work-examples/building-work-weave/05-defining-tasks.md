# Defining tasks

### When a task was ready

The setup task was created at 11:43 on 2026-11-06, after the map decisions that gave it its outline. The glossary skill map's format details changed later: the map recorded the identity rule, the MCP tools, and the JSONL source format, and the skill map was updated in the same commit that recorded the JSONL decision (`ecbaf2f`). The map and its decisions moved together.

A task template has three sections: What to do, Acceptance signal, Boundaries. The action and the verifiable result sit in one place; the boundaries keep the ticket from growing into the whole skill.

### The glossary skill map

[Glossary skill](../../../tickets/map/wm-rq3exm0m5563.md) is a map. Its Target states the four pieces to design: SKILL.md, an MCP server, hooks, and the merge format and rules. Its Decisions record the identity rule, the four MCP tools, the JSONL source fields, and the generated view format. Its Not yet specified holds the function details that cannot be written as tasks yet.

Its acceptance direction: all child tasks are done and no further child task is needed; the four pieces exist under `weave-your-work/glossary/`; one term written plus a simulated pull shows the term in the generated view; SKILL.md covers the four moves borrowed from matt's domain-modeling.

### The glossary install task

[Initialize the glossary during setup](../../../tickets/task/wm-5b50wr2dkaxw.md) is a task under the glossary map, because its five steps are concrete and its result is visible, and because it installs that skill's pieces. setup provides the flow; the step belongs to the skill it installs.

Its acceptance signal: on a fresh project after setup, the directory exists, the MCP server writes, the post-merge hook is installed, the rules are in place, and the prompt is there. The steps are instructions an AI can follow; mechanical parts may be scripts. Its boundaries exclude setup's other duties, such as dependency checks and waymark initialization.

### The map and task skill maps

[Map skill](../../../tickets/map/wm-0b59r7xfhk73.md) and [Task skill](../../../tickets/map/wm-87pgn0b75yy5.md) split the two skill designs that had been living in the execution map's Decisions section. Each is a map with its function details still in fog, and each checks its rules against an example in `weave-your-work/use-weave-your-work-examples/` (`map-example.md` and `task-example.md`).

The map skill's acceptance direction: all child tasks are done and no further child task is needed; the rules live under `weave-your-work/map/`; a reader can rebuild the example map from the skill without asking; the body index and waymark parent relation agree after a child changes. Its out of scope: task skill design and software-specific workflows.

The task skill's acceptance direction: all child tasks are done and no further child task is needed; the rules live under `weave-your-work/task/`; a reader can rebuild the example task from the skill; both a probe and a delivery task show their reversibility. Its out of scope: map skill design and glossary conflicts.

### Why skill maps, not tasks

A skill is not one action. The map skill has to settle creating a map, the six body sections, children sync, fog graduation, phases, and the acceptance check; the task skill has to settle task design and task execution. Those are distinct targets with their own function details, so each gets a map layer. The rule stays: a child becomes a task only when its action and verifiable result can be written now.

### Splitting the Task skill map

The Task skill map now has two children: [Task design skill](../../../tickets/map/wm-793jrqph1ckv.md) and [Task execution skill](../../../tickets/map/wm-avc7a31tae33.md). This follows the Map skill's pattern: a total skill map routes to focused child skills. Task design defines how to specify a task; task execution defines how an owner advances one. `split-to-task` decides whether and how work becomes tasks based on semantic groupings, then references task design when those task tickets are written. A decision does not have to match exactly one task, just as a decision does not have to match exactly one child map.

### What the skill maps do not cover

The four skill maps cover the skill-level targets; the setup ticket covers the first executable piece. The function details stay in each skill map's Not yet specified until they can be written as tasks. The execution map's category-level questions (phases, claiming, acceptance details, git collaboration) stay in its own fog.
