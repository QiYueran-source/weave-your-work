# Writing across an ownership line

### The first rule was a gate, and it was wrong

The design first had a gate: before archiving a node, list every ticket pointing at it, and if any of them belongs to someone else, stop and hand that branch over. It sounds like the careful answer, and it matches the repository's strongest convention — never edit another owner's ticket.

Then the probe showed what the gate would do. A dependency edge is stored only on the dependent side, so archiving a depended-on node always rewrites the dependent's file. There is no version of the archive that spares it. A soft link is stored on both sides, so `link add` and `link remove` rewrite both files whoever runs them. Two of waymark's own commands cross an ownership line by construction.

A rule that cannot be obeyed in the common case is not a boundary; it is a detour. Applied strictly, it means no node anyone depends on can ever be retired — which is most of the nodes worth retiring.

The user's ruling replaced it: the write proceeds, and the affected owner is told afterwards.

### One rule for both commands, not two

`archive` and `link` are the same situation, so they got the same rule rather than an exception each. The earlier draft had a second test for `archive` — does the retiring operator have any alternative — and it was dropped because the alternative always exists if you are willing to rebuild the replacement under the other owner's tree. A test whose answer is always "no alternative" is not a gate.

The single rule reads: the write runs; the owner gets an issue. What the issue must carry was worked out later, when [the communication map](../../../tickets/map/wm-25b3q7mg88c7.md) took up the shape of an issue: the relation that disappeared, the id that replaced the node, and the decision the owner now has to make. Update became the first caller of that map and set a floor for it.

### The dry-run does not judge

The instinct was that `archive --dry-run` would warn about the other owners. It does not. It computes the full blast radius and puts every affected ticket in the output — `removes dependencies`, `removes soft_links`, one line each in the human output, `id` and `path` in the JSON — and raises `OWNER_MISMATCH` only for the owner of the node being archived. A run that will rewrite three strangers' files can print a completely clean envelope.

That finding changed the step from "let the tool check" to "compare the affected ids yourself". The tool can say what it will touch; only the operator knows whose tickets those are. The skill now says to read the human output for the relation names, because the JSON `affected` array carries neither a relation name nor an owner.

### The part no file shows

Archiving a node that another ticket was blocked on takes that ticket from `blocked` to `ready`, silently. The diff shows two deleted lines in a front matter block; the other owner's plan has moved. That is why the issue is part of the operation and not a courtesy at the end of it, and why the archive gets its own commit — a cross-owner edit buried among five other changes is one nobody finds.

The measured version of this is in the design map: carol's ticket depending on kim's node, the archive, the status change, and no message anywhere.
