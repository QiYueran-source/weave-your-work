# entry, tree, and update: where this set and Matt's differ

Three questions about how this set compares to [`mattpocock/skills`](https://github.com/mattpocock/skills), asked together because they turn out to be one question in three places: what a reader has to decide during a normal run, and what the files let them look up instead.

The sources read for this file, from the vendored copy in `.inbox/.agents-skills/`:

- `ask-matt/SKILL.md` — his router and the flow it draws
- `wayfinder/SKILL.md` — his map, its decision tickets, and the fog
- `to-spec/SKILL.md` and `to-tickets/SKILL.md` — where a ticket's content is written
- `implement/SKILL.md` and `implement-spec/SKILL.md` — what running a ticket looks like
- `grill-with-docs/SKILL.md`, `grilling/SKILL.md`, and `setup-matt-pocock-skills/SKILL.md` — the pieces the flow leans on

On this side, the whole of `weave-your-work/`, with the closest reading given to `what-is-the-mainline`, `ask-me`, `fog-explore`, `split`, `update`, `map/res/body.md`, and `task/res/body.md`.

## 1. Which skills a route names, and what decides a step

**Question.** Why does his route name six skills where this set's mainline names seven actions plus a router, and why is it never unclear when one of them starts?

**Answer.** His route names few skills because each named one is the entry to a phase a person starts: `ask-matt` draws idea → `/grill-with-docs` → `/to-spec` → `/to-tickets` → `/implement` or `/implement-spec`, with `/wayfinder` as the on-ramp for an effort one session cannot hold. Each of them is `disable-model-invocation: true`, so it starts when the person types it and not before. What runs inside them is named too, but as part of running them: `grilling`, `domain-modeling`, `tdd`, `code-review`, `research`. Those are model-invoked and their caller names the point of call. `grill-with-docs` is the shortest example: "Call the Skill tool twice, for 'grilling' and 'domain-modeling'."

The flag is what makes this predictable. Every entry to a phase carries `disable-model-invocation: true` — `ask-matt`, `grill-with-docs`, `to-spec`, `to-tickets`, `implement`, `implement-spec`, `wayfinder`, and the standalone skills — while `grilling`, `domain-modeling`, `tdd`, `code-review`, `research`, `prototype`, `wizard`, and `pr` do not, so the agent reaches for them and the caller names where.

The rest of his set is standalone (`/prototype`, `/research`, `/wizard`, `/teach`) or vocabulary underneath (`/codebase-design`). Apart from the on-ramps, none of it joins the route.

**What this repository does.** `ask-me` and `what-is-the-mainline` do the same job as `ask-matt`: one route, named in order, with branch points stated as conditions. The difference is what a step is. Seven actions are on this set's line — `open-map`, `split`, `fog-explore`, `advance-task`, `task-review`, `map-review`, `open-task` — and every one but `map-review` is model-invoked, so the line runs from its first step to its last without a person restarting it. Which step runs next is the agent's reading of the map.

`fog-explore` is where that reading fails. Its trigger is "the section holds an open entry and the next layer cannot be written without it", which asks the agent to judge how sharp a question is; the test for that sharpness is in `map/res/body.md`, and it is a judgement, not a state. His wayfinder makes the same judgement ("can you state the question precisely now, not answer it now"), so the criterion is his. What makes it work there is the entry: wayfinder is a drawer the person opens for an effort one session cannot hold, and `wayfinder/SKILL.md` says so — "save it for exactly that, never a well-scoped feature". The person decides once that the effort is foggy; the agent never decides, run by run, whether fog has arrived.

In this set the same judgement is made on every pass of the line. A child map's fog appears after its split, the branch passes through `fog-explore` again, and a person watching the run cannot tell from the outside why that action started or why it did not.

**What this repository could do.** Give `fog-explore` one entry the person or the opening step controls, rather than leaving it to the line's own reading. Two shapes fit:

- **Fold it into the walk.** `open-map` already walks the whole target and writes the fog. A child map's fog is written by its own `open-map`, and `fog-explore` stays only for an entry that turns out to block the layer after the child exists.
- **Keep the action, name its trigger as a state.** A map with an open `Not yet specified` entry that names a part of the next layer is the condition, and `split` refuses to cut that part until the entry is struck. Then the action starts because a step asked for it, the way `advance-task` starts after a split.

Neither is settled here; the first is the smaller change, and the second keeps the action's own job.

## 2. What a tree node holds, and where content is written

**Question.** He says his tree is the text of tickets rather than tickets, and that refinement happens inside one ticket instead of opening child tickets. Is that so, and what does it say about this set?

**Answer.** Half of it, and the half worth copying is the other one. His tree is the tracker's: a wayfinder map is an issue labelled `wayfinder:map`, its decision tickets are child issues, and blocking is the tracker's native relation, so the tree is names, edges, and frontier queries. Where content is written depends on which of his two layers the ticket is in:

- **A wayfinder decision ticket holds a question and nothing else.** Its body is one `## Question` section, its type is a label, and the answer is a resolution comment on the issue, plus one gist line appended to the map's `Decisions so far`. The map points at the tickets and never restates them: "a decision lives in exactly one place, its ticket".
- **A `to-tickets` ticket holds the work.** Its body is `## What to build` and `## Acceptance criteria` with checkboxes, plus `## Parent` and `## Blocked by` where the tracker has no native edges. It is written once, when the ticket is published, and what changes afterwards is the state the tracker already tracks.

So refinement inside a ticket is real, and it happens in the layer that produces deliverables. His planning layer is deliberately thin: one ticket per decision, one decision per session, and the map closes when nothing is left to decide. It is the opposite direction from "refine the ticket", and it is what makes the answers cheap to find.

The tree is also shallow. A map's children are decision tickets, and when the way is clear the map hands to `/to-spec` and `/to-tickets`; there are no child maps under child maps. His recursion is one level of mapping followed by one level of tickets.

**What this repository does.** A map's children are child maps or tasks, at any depth, and a map carries its fog, its decisions, its exclusions, and its review in one body. `map/res/body.md` gives entries one rule — a new fact adds a line beside the old one, and an overturned one is struck with `Superseded on <date>` — so a child map is edited in place throughout its life, and every edit leaves its history in the body.

That thickness is what `PRINCIPLES.md` rule one and `rules-task.md` ask for: one fact in one place, and a settled decision written into its map as it settles. A child map is read by a later session that does not have the conversation, so the decision has to be in the map. Taking his thin map would need the decisions to live somewhere else that a child map can point at, and this set has nowhere to put them.

Where his layer can be copied is the task. `task/res/body.md` already gives a task one `Result` and one `Acceptance signal` that must separate done, not done, and cannot judge yet, which is the same idea as his checkboxes with a stricter test. A task is written once by `open-task` and then only gains `Progress`, `Result`, and `Review`; it is not refined by opening children. That is his shape, and it is already here.

What is not here, and should not be copied, is the thin ticket at the map level. The depth is the cost of the durability rule, not an extra layer somebody chose.

## 3. How much a change costs

**Question.** His update path is a few short actions; this set's is `update`, eight steps and three dispositions. Is the difference complexity nobody needs?

**Answer.** His updates are per scenario, and each one is one action:

- A decision lands: post an answer comment, close the ticket, append one line to the map's `Decisions so far`, and graduate whatever fog it made specifiable.
- Something sits past the destination: close the ticket and leave one line in `Out of scope`.
- A decision invalidates other tickets: "update or delete those tickets", one sentence.
- A ticket in the build layer: a checkbox, and the tracker's own state.

He also caps how much can change at once — "never resolve more than one ticket per session", research tickets excepted — so a session's change to the tree is one ticket's worth by construction.

None of that has to answer two questions this set's `update` has to: an ancestor's verdict counted a child, and a sibling may be someone else's record. His maps do not have verdicts that depend on their children's state, and his sessions work one owner's tickets.

**What this repository does.** `update` runs one procedure for every case: scan what relies on the record, apply two tests, pick one of the three dispositions in `waymark/res/disposition.md`, carry the change to children and dependents, reopen the ancestors whose acceptance counted it, add before splitting, leave a cross-owner conflict to its owner, and tell a foreign owner. The width comes from three things the model has and his does not: nested maps, an acceptance direction that can be read line by line rather than a fixed "all children are complete", and owners who can differ.

What is wider than it needs to be is the trigger. All of those steps run for every change to a map that has split, including the ones that add a decision or rule something out — changes that touch no child. The reopening test and the scan are needed when the **target or acceptance direction** moves, because that is when children refined the old text and a verdict counted it. A decision added to `Decisions so far`, or a line added to `Out of scope`, changes no promise a child was written against.

**What this repository could do.** Split the trigger instead of the skill:

| The change | What runs |
|---|---|
| a decision or an exclusion added to a split map's body | the body's own entry rule: one line added |
| the target or acceptance direction moved | `update` as written |
| a task's result short of its signal | `task-review` sends the gap back, and the map is not touched |
| work found beyond the target | `Out of scope`, and the child it belonged to closes as out of scope |

Whether `update` then becomes two skills or stays one with two triggers is a design question for the map that owns `update`; this file records only where the cost is.

## What did not hold up

Two of the three readings that started this file needed correcting, and the corrections matter more than the agreement.

- **"His tree is the text of tickets, not tickets."** Not so. The tree is issue parentage and native blocking; what is unusual is that the planning ticket holds a question and the answer lives in a comment.
- **"The whole tree is refined inside one ticket."** Only in the build layer, and even there the ticket is written whole and then checked off. His planning layer refines nothing; it answers one decision per ticket and stops.
- **"His updates are simpler."** Yes, and the reason is structural. He changes one ticket per session, has no verdict that counts children, and has one owner per run. The steps this set adds answer those three conditions, and dropping them would lose the conditions, not the steps.
