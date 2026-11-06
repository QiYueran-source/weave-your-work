# Splitting the tree

### First split: one map per category

The first split divides the work by the question each category answers:

- entry: what should I do now? This map holds [ask-me](../../../tickets/map/wm-8wzzh4hp5evp.md).
- environment: is the project ready, and how do we initialize it? This map holds [setup](../../../tickets/map/wm-a08fwanmy5q6.md).
- execution: is the work advancing, who is accountable, where is it stuck? This map holds [map and task](../../../tickets/map/wm-qhd3twqjzhma.md).
- communication: are we aligned remotely? This map holds [issue](../../../tickets/map/wm-25b3q7mg88c7.md).

The root map is an index. It lists the sub-maps, states the destination, and holds cross-category decisions. It does not restate decisions that live in a category map. The split follows function, not phase: the category maps are parallel branches of the destination. If one category must wait for another, that is a dependency edge, not a place in the tree.

### Second split: the execution skills

The execution map settled the semantic model first: every target node is a map; a task is the finest target, stating an action and a verifiable result; parent-child is refinement; order is a dependency edge. With that model in place, four skill maps were cut under the execution map, a setup skill map under the environment map, and one task under the glossary map:

- [Map skill](../../../tickets/map/wm-0b59r7xfhk73.md) under the execution map.
- [Task skill](../../../tickets/map/wm-87pgn0b75yy5.md) under the execution map.
- [Glossary skill](../../../tickets/map/wm-rq3exm0m5563.md) under the execution map.
- [Explore skills: fog exploration](../../../tickets/map/wm-8m5cckpf4tc2.md) under the execution map.
- [Setup skill](../../../tickets/map/wm-ygnttse5hd5k.md) under the environment map.
- [Initialize the glossary during setup](../../../tickets/task/wm-5b50wr2dkaxw.md) under the glossary map.

A skill is a target with several function details still in fog, so each skill gets a map layer of its own. The test for the layer below: a function detail that can be written as a concrete action and a verifiable result becomes a task under the skill map; until then it stays in that map's Not yet specified.

The first cut put the three skill designs directly under the execution map as tasks. That was wrong: it skipped the skill layer and flattened "the skill" and "a function of the skill" into one line. The fix moved each design to a map and left the function details as fog. This is the judgment the example exists to keep: the same test applies at every layer, and the layer is chosen by what can be refined next, not by how important the thing sounds.

### What stayed out of the tree

- The execution map kept these in Not yet specified: phase rules, who may advance, claim semantics, concurrency, handover, acceptance details, git collaboration, and whether the local comment category stays.
- The root map kept cross-category coordination in its own Not yet specified: how ask-me routes to execution and communication, which map owns the glossary, installation and distribution, acceptance scenarios, and later members of each category.
- Fog is not a first draft of the task list. A patch graduates only when its question can be stated sharply; until then it stays prose.

### The tree has two records

The map template says the Children list in a map body mirrors waymark's parent relation, and waymark is the source of truth. In this run the category maps, the three skill maps, and the setup task all carry `parent` in their frontmatter; the root map's Sub-maps list is the reading aid.

The lesson: write the parent relation when the child is created. A body mirror is a reading aid; it is not the tree.
