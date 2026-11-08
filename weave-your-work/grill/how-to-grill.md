# How to grill

A grill is a dependency-ordered interview. It finds the questions that can be answered now, asks them in one round, and moves outward as the answers settle.

## The question tree

Start with the subject: the thing being decided. Each node is one open question. A node is one of:

- a decision the person must make;
- a fact to establish;
- a goal to clarify;
- an assumption to confirm.

A child question refines its parent: it is a narrower part of the parent question. Siblings are parallel; the tree says nothing about order.

Refine a question when it is too broad to answer as one decision. Do not refine a question that is already answerable; ask it.

The question tree is not the target tree. Its nodes are questions, not maps or tasks; the target tree's `split` creates child maps or tasks and is a different act.

## The askable set

A node is askable when its children are settled. The askable set is every such node. Ask the whole set in one round.

- Number each question and give a recommended answer. Word it so "yes" accepts the recommendation.
- Use the harness's choice prompt when the question has a few options; otherwise ask in text.
- Wait for the answers before the next round. Then mark what settled, refine what is still broad, and compute the next askable set.

A question that depends on another open question in the same round waits for the next round.

## Facts, people, unknowns

- A fact the agent can check (files, tools, public sources): look it up. Dispatch a subagent when it takes real reading.
- A fact only a person knows: ask that person. The person in the conversation may need to ask someone else; record who and wait.
- A fact nobody knows: turn it into an assumption or a probe. Do not force an answer.

The person in the conversation may not be the decider. "I need to ask X" is a wait, not a decision: record who decides and what they need; the node stays open.

## Recommend

Give a recommendation when you have a basis. Say the basis in one line: the project's existing decisions, the goal, the cost of being wrong, or the smallest reversible choice. If you have no basis, say what you would need to know.

## Hand work off

When a question becomes work — someone must do something and it must be checked — hand it off. Write `work: <what>` in the testimony and let the caller create the map or task. The grill does not create work items; the caller's `split` skill does.

A question that needs only a decision, a term, or an ADR stays in the testimony or goes to the glossary or ADR skill; those are records, not work.

## Finish

The grill ends when the askable set is empty: every branch is settled, deferred to a named person, handed off as work, or out of scope. Ask the user to confirm the shared understanding. Then close the testimony.

Do not start the work the decisions imply; the caller does that.

## A short example

Subject: launch in Q1.

Round 1 asks: what counts as ready (goal), is the contract signed (fact, agent checking), who approves (decision, ask the user). The user answers the goal and says approval is the VP's; the contract is not in the repo, so it becomes `work: contract review`. Round 2 asks the questions the answers unblocked: the launch date and the sales sign-off. The testimony holds the tree and the answers; the work item hangs under the launch map, not under the testimony.
