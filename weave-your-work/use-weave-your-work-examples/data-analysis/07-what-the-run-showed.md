# What the run showed

## The plan log was not written

`split/task.md` asks for the count and one line per task in the discussion testimony before the first ticket is created. This run skipped it, so nothing records how the layer was cut. No skill noticed, and that is by design: the entry is a log for traceability, not an input to a review. `map-review` reads the map, its children, and the rules, and it should not need a testimony to judge whether the tasks are right — once the tickets exist, the tree is what a reader checks.

The same miss appeared in the first chemistry audit. Two runs in a row is evidence about the step, not about the reviews: writing the log is easy to skip because nothing downstream reads it. A future skill that reads a testimony to see why a layer was split the way it was would make the log worth keeping and would catch its absence; no such skill exists today.

## Setup friction

Three configuration facts cost a failed command each, and none is spelled out where the run first needs it:

- `waymark init` declares one category per call; the others are added with `waymark config add category <key> <path>`, which needs the path as a second argument.
- Custom fields must be declared before a ticket sets them; `split_as`, `task_kind`, `reversibility`, `needs_human`, `waiting_on`, and `outcome` are not built in.
- The category paths and the storage root have to agree, or the first `create` lands in an undeclared directory.

These belong in the setup skill, which does not exist yet.

## Paths not exercised

- **`execute-all`.** The run advanced one task at a time. A batch needs subagents, and this exercise had one operator.
- **`one_way` work and `needs_human`.** Every task was `two_way` with `needs_human: false`, because no person was available to confirm a plan or perform a step. The `waiting_on` field and the `Progress`-on-a-person-wait path were therefore not exercised either.
- **A dependency that closes failed.** Both maps closed normally.
- **Cross-owner writes.** One owner wrote every ticket, so no archive crossed an ownership line and no issue was filed.

## Smaller observations

- **`waymark archive` strips soft links.** A retire-and-replace cannot leave a link between the old and new tickets, because the archive removes the link from the other end. The replacement id lives in the old ticket's body, which is the only durable pointer.
- **A text-mode copy is not byte-identical.** The first copy of the second list changed CRLF line ends to LF. The acceptance signal said "byte-identical", and `cmp` caught it; without that wording the difference would have passed as an equal file.
- **The move left the old map's body true.** Moving the replacement probe to the process map changed neither map's target, so neither reopened. That is the case `move.md` describes, and it needed no edit.

## What held

The freeze held: both child maps kept `submap`, both task layers kept `task`, and no split mixed types. The dependency gate held: the process map was not reviewable until the list map closed, and `waymark ready` showed it only afterwards. The archive order held: the replacement existed and was named before the old ticket was archived. The review axes held: each map review answered the goal and the convention separately, and the two lists were recomputed rather than trusted.
