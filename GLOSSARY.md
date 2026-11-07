# Work-weave Domain

Work-weave is a skill set for general team collaboration. It uses waymark as the single tracker and carries goal, task, claim, and acceptance through one chain. This glossary records concepts specific to work-weave. Waymark's own vocabulary (owner, dependency, parent, and so on) is defined in the waymark project's GLOSSARY.md; only work-weave-level additions or changes are recorded here.

## Language

**ticket (local work item)**:
A waymark document inside the repository, the carrier of local work state. Both map and task are tickets. Advancing, claiming, closing, and archiving all act on tickets.
_Avoid_: issue (issues live on GitHub or Gitee, not in the repository)

**issue (remote issue)**:
A problem report on GitHub or Gitee, used for real-time team communication. It is not local state; a discussion's conclusion counts only after it is written back to a ticket.
_Avoid_: ticket (a local work item), task

**comment (synced record)**:
A record synced back from an issue, carrying a discussion conclusion or decision. It uses waymark's comment category for now.
_Avoid_: discussion (when referring to the remote conversation itself)

**weave log (依据记录)**:
A shared, unstructured Markdown file under `weave-logs/` that records longer research, discussion, evidence, or reasoning supporting a map or task. It is not a ticket: it has no ticket frontmatter, is not processed by waymark, and does not enter the target tree, status, frontier, or acceptance. Tickets cite weave logs with relative Markdown links next to the relevant entry.
_Avoid_: log ticket, evidence ticket, attachment (when it implies a ticket relation)

**map (target node)**:
A target node that answers "what I want": the expected outcome or requirement. Each map states its goal, why it is worth doing, its boundaries, and its acceptance direction, and hangs one or more refined targets (child maps or tasks) under it. A map does not cover feasibility or implementation; those belong to tasks. The root map is the overall goal and has no parent; a map's children are more refined targets. Every target node is called a map; there is no separate name for levels.
_Avoid_: goal, plan, project, phase, milestone (when it implies a fixed point in time)

**task (executable target)**:
The finest level of the target tree: a target refined to the point of being executable. It declares one complete execution action and one clearly auditable standard, and it carries implementation: feasibility, method, and effect. Answers "what I will do".
_Avoid_: ticket (when the meaning is broader than this project's unit of work), action item (when it refers to an action without a result)

**target tree (goal tree)**:
The layered refinement from the root map to tasks. Every node is a target (a map); the parent-child relation is part-whole (refinement), not sequence. The tree carries structure, edges carry order. A leaf (task) is the end of the refinement chain: refined from the root to the point of execution. Leaves are parallel refinement branches, not a progression order; ordering is expressed only by dependency edges.
_Avoid_: Gantt chart, flow chart, target chain

**dependency edge**:
A relation between nodes expressing "who waits for whom to finish". It carries the ordering of targets. Order is not a chain of nodes but an edge; adding or removing an edge does not move the tree. Expressed by waymark's dependency mechanism.
_Avoid_: blocked (when referring to a state rather than a relation), prerequisite (when the direction is not made explicit)

**refinement**:
The relation between a parent target and a child target: the child is a more specific statement of the parent. Unrelated to ordering.
_Avoid_: breakdown (when it implies slicing once into executable pieces)

**arrive (到达)**:
The moment a settled decision becomes a child node. It arrives as a task when one complete execution action and one clearly auditable standard can be written and one person can finish and verify it in one go; otherwise it is a child map. Prefer a task over a child map; a child map is used only when the item still has several independent directions, needs its own owner, or needs its own phase.
_Avoid_: graduation, breakdown, splitting (when they mean a fog item becoming a node rather than slicing work)

**split (分裂)**:
The act of turning one map's next layer into child maps or tasks. The split skill decides when to split and which type; it never resolves fog.
_Avoid_: explore (exploring fog is not splitting), breakdown

**hang (挂)**:
The act of opening a child ticket under a node. Hanging is done by split when it creates a child: the child gets its parent and the parent's Children list gains the link.
_Avoid_: attach (when it implies linking, not creating), mount (when it implies a different tree)

**explore (探索)**:
The act of resolving a map's fog: turning an undecided item into a decision, a clearance, or something left for split. The explore skill never creates children.
_Avoid_: split (splitting is not exploring), grill (an interview method, not the act itself)

**advance**:
An operation an owner performs on their own work item: changing title/body/fields/status, adding or removing dependencies, closing, reopening, archiving, transferring ownership. Only the owner can do it.
_Avoid_: update, modify (when the actor is not specified)

**claim**:
Making an open task become something someone is advancing, expressed by waymark's start (open to in_progress). One item has at most one in_progress at a time. A claim is not a change of owner: the owner is the accountable party, the claim is the current advancing state.
_Avoid_: assign (when it implies changing the owner)

**delivery task**:
A task advanced against a committed output; failure is an incident. Acceptance signals and reversibility are made explicit before starting.
_Avoid_: formal task (when contrasted with a probe)

**probe task**:
A task that trades the smallest reversible action for information; failure is a normal result. Answers "does this direction actually work".
_Avoid_: exploration (when referring to a vague phase without concrete actions)

**reversibility**:
The cost of undoing a task after it went wrong. A one-way door cannot be undone, so confirmation is required before acting; a two-way door can be undone, so proceed.
_Avoid_: risk (when referring to probability rather than undo cost)

**acceptance signal**:
An observable criterion written before work starts, used to distinguish done, not done, and cannot judge yet. A map is accepted when all its child maps and tasks are complete and no further children are needed; signals get more specific toward the leaves.
_Avoid_: acceptance criteria (when it is only a checklist), definition of done

**fog (未决内容)**:
An entry in a map's Not yet specified section: in-scope content that is not yet specific enough to become a decision, child map, task, or out-of-scope item. Fog entry types include assumptions, facts to establish, decisions to make, and goals to clarify, and the list is open. A map owns the definition of fog; explore classifies, routes, and lands it.
_Avoid_: todo, backlog, open question (when the content is already scoped to a map)

**frontier**:
The set of nodes with no unfinished dependencies that can be started now. Given by waymark's ready query.
_Avoid_: todo, next actions (when referring to a personal list)
