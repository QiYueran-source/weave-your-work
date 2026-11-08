# Work-weave Domain

Work-weave is a skill set for general team collaboration. It uses waymark as the single tracker and carries goal, task, claim, and acceptance through one chain. This glossary records concepts specific to work-weave. Waymark's own vocabulary (owner, dependency, parent, and so on) is defined in the waymark project's GLOSSARY.md. Where work-weave narrows one of those words or rules it out for some node, the entry here records the narrower meaning.

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

**testimony (口供)**:
The record of a grill: what a person said while a decision was being discussed — their answers, the ideas raised along the way, the alternatives that lost — written down as the discussion happens. It holds nothing else: research findings, what an agent did during a run, and a ticket's conclusions are not part of it. A testimony is not a ticket: it has no ticket frontmatter, is not processed by waymark, and does not enter the target tree, status, frontier, or acceptance. Tickets cite a testimony with a relative Markdown link next to the relevant entry.
_Avoid_: log, weave log, evidence record, attachment (when it implies a ticket relation)

**map (target node)**:
A target node that answers "what I want": the expected outcome or requirement. Each map states its goal, why it is worth doing, its boundaries, and its acceptance direction, and hangs one or more refined targets (child maps or tasks) under it. A map does not cover feasibility or implementation; those belong to tasks. The root map is the overall goal and has no parent; a map's children are more refined targets. Every target node is called a map; there is no separate name for levels.
_Avoid_: goal, plan, project, phase, milestone (when it implies a fixed point in time)

**task (executable target)**:
The finest level of the target tree: a target refined to the point of being executable. It declares one complete execution action and one clearly auditable standard, and it carries implementation: feasibility, method, and effect. Answers "what I will do".
_Avoid_: ticket (when the meaning is broader than this project's unit of work), action item (when it refers to an action without a result)

**target tree (goal tree)**:
The layered refinement from the root map to tasks. Every node is a target (a map); the parent-child relation is part-whole (refinement), not sequence. The tree carries structure, edges carry order. A leaf (task) is the end of the refinement chain: refined from the root to the point of execution. Leaves are parallel refinement branches, not a progression order; ordering is expressed only by dependency edges between maps, because a task carries none.
_Avoid_: Gantt chart, flow chart, target chain

**dependency edge**:
A relation between maps expressing "who waits for whom to finish". It carries the ordering of targets. Order is not a chain of nodes but an edge; adding or removing an edge does not move the tree. Expressed by waymark's dependency mechanism. Tasks never carry one: the tasks under a single map run in parallel. The edge gates the waiting map's acceptance, not every task under it; an executor checks whether a task actually uses the blocker's output.
_Avoid_: prerequisite (when the direction is not made explicit)

**blocked**:
A map whose own dependency edge is unfinished. The edge gates the map's acceptance; it does not automatically freeze every task under the map. A task stops when it needs the blocker's output; if a person must supply it, `waiting_on` names them; otherwise the split is wrong. Waymark reports the per-item state.
_Avoid_: blocked (for a task waiting on a person; that is `waiting_on`)

**refinement**:
The relation between a parent target and a child target: the child is a more specific statement of the parent. Unrelated to ordering.
_Avoid_: breakdown (when it implies slicing once into executable pieces)

**arrive (到达)**:
The moment a settled decision becomes a child node. It arrives as a task when one action and one clearly auditable standard can be written and the action ends at a result that can be handed over and checked on its own; otherwise it is a child map. Prefer a task over a child map; a child map is used only when the item still has several independent directions, needs its own owner, or needs its own phase.
_Avoid_: graduation, breakdown, splitting (when they mean a fog item becoming a node rather than slicing work)

**split (分裂)**:
The act of turning one map's next layer into child maps or tasks. The split skill decides when to split and which type; it never resolves fog. A map with an unfinished dependency is not split; wait for the dependency to close. Independent early work belongs under a sibling map, not under the blocked map.
_Avoid_: explore (exploring fog is not splitting), breakdown

**hang (挂)**:
The act of opening a child ticket under a node. Hanging is done by split when it creates a child: the child records its parent in its own front matter, and nothing is written on the parent ticket. The tree reads the parent field; a map body carries no children list.
_Avoid_: attach (when it implies linking, not creating), mount (when it implies a different tree), add to Children (there is no such list)

**explore (探索)**:
The act of resolving a map's fog: turning an undecided item into a decision, a clearance, or something left for split. The explore skill never creates children.
_Avoid_: split (splitting is not exploring), grill (an interview method, not the act itself)

**advance**:
An operation an owner performs on their own work item: changing title/body/fields/status, adding or removing dependencies, closing, reopening, archiving, transferring ownership. Only the owner can do it. Update is the branch of advance that changes the content of a closed or split node.
_Avoid_: modify (when the actor is not specified)

**update**:
The branch of advance that changes a node other nodes already rely on: its content on a closed node or an already-split map, or its position in the tree. Two tests decide what happens — does it still answer the same question, and does the recorded acceptance still hold — and they sort the change into one of three dispositions: edit in place, strike the old text and reopen, or retire and replace. An update carries the consequences: the children that refined the old content, the dependents that waited on it, and the verdict judged against it.
_Avoid_: advance (when such a node's content is meant), edit (when the consequences are meant), move (a move is one kind of update, not a synonym)

**move (迁移)**:
Relocating a subtree under another parent without changing its content. Written by `waymark parent set` on the moved node alone; every descendant follows and the old parent's ticket is not touched. The moved node keeps its status; the two parents reopen only when their own acceptance no longer holds. Distinct from retire-and-replace, which is for a node whose subject changed.
_Avoid_: migrate (when the means is a rebuild), re-parent (of a whole subtree — only the top node is written)

**owner**:
The accountable party of a ticket: the person who advances it and decides whether it passes. Waymark records one owner per item. The owner of a task is the person who accepts it; a link is added by the owner; a person who merely did the work is not, by that fact, the owner.
_Avoid_: author (when the accountable party is meant), assignee (a claim changes who is advancing, not who owns)

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

**slice (切片)**:
One stage of a result, finished before anything downstream can use it. A slice needs a sibling to mean anything, which is how it is told apart from a task: a task ends at a result that can be handed over whole and checked on its own. Named as the shape to avoid when defining a task.
_Avoid_: layer, phase (when describing work that has no result of its own)

**step**:
One numbered line inside a task's Action. A step is not a unit of work: it has no acceptance signal of its own and is never hung in the target tree. Distinct from a slice, which is a piece of work that looks like a task but cannot stand alone.
_Avoid_: sub-task, action item

**incident**:
What a delivery task's failure is. The promised output is missing or falls short of its acceptance signal, so someone has to recover, and the cost is named in advance in the task's Failure recovery section. A probe's failure is not an incident: a negative finding is a normal result.
_Avoid_: bug, error (when describing the contractual weight of a failed delivery)

**readiness**:
Whether an item can be started now. A map is ready when every map it waits on is closed. A task is ready when its ticket is open and the executor finds no unfinished dependency whose output the task uses; a blocked map above it does not by itself freeze the task. If the missing output belongs to another task or map, the split is wrong. Waymark's ready query reports only the item's own edges, not that judgment.
_Avoid_: priority, scheduling (readiness is about waiting, not about order of importance)

**waiting_on**:
An optional task field naming the one person whose answer the task waits on now. A run stops on a `Person:` step and writes it; the task stays `in_progress`. The owner clears it after handling the answer, before the task is selected again. It is not a status and not a dependency edge. Waiting on another task or map is a split error, not a `waiting_on` value.
_Avoid_: blocked (a map's dependency state), status, assign (the field names a wait, not an owner)

**link (soft link)**:
A symmetric association between two items, recorded by `waymark link`. It marks something worth following, such as a task whose output was used elsewhere or two items covering one subject. It never carries order: it does not block, does not make anything wait, and does not change readiness.
_Avoid_: dependency (a link orders nothing), relation (when the ordering is meant)

**front matter (frontmatter)**:
The YAML header block of a ticket, carrying the structured fields (schema, id, title, category, status, owner, creator, created_at, updated_at, parent, dependencies, custom fields, and the retired-state archived_at and archive_reason) while the five map sections are body text. Ordering lives here: dependencies are front matter only, never mirrored in the body. Every front matter change goes through a waymark command, never a hand edit.
_Avoid_: header (when it means the body's heading), metadata block (when the actor is not specified)
