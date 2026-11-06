# Record the Construction as an Example

Building this skill set is a run of its own methods. Keep that run under `.agents/docs/examples/` as a worked example: how the target tree was split, how dependencies were set, and how tasks were defined.

## What to do

1. Write one file per effort at `.agents/docs/examples/<effort>.md`. Name it after the effort, not the lesson: `building-work-weave.md` reads better than `how-to-split-a-tree.md`.
2. Record while the tickets are fresh. The tickets hold each decision; the example holds the order the decisions were made in and the alternatives that lost.
3. Write down the judgment, not only the outcome:
   - **Splitting the tree**: what became a child map, what became a task, what stayed in Not yet specified, and why. Include splits you rejected.
   - **Setting dependencies**: each edge, the direction it points, and why the relation is a dependency rather than a parent. Include edges you considered and did not add.
   - **Defining tasks**: the action, its verifiable result, the acceptance signal, the boundaries, and the task kind.
4. Link the tickets by title and path. Do not paste their bodies. The ticket is the source of truth; the example is the story around it.
5. When the example and a ticket disagree, the ticket wins. Fix the example.
6. Write in English and use the glossary's terms: map, task, target tree, dependency edge, refinement, frontier, acceptance signal.

Treat the example as part of finishing the work, not as optional cleanup.

## Why

An example written after the fact keeps the tidy version: the split that worked, the edge that held. The dead ends are where the judgment shows, and they are the first thing memory drops.
