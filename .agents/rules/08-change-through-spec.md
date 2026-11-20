# Change Through a Spec and a Ticket

Every change to this set goes through a spec and then a ticket. An agent does not edit a skill file because the change seemed small or obvious.

## What to do

1. **Write the change down as a spec first.** A change to what a skill does, which skills exist, what a record holds, or how a flow runs is decided in a `spec` record, not in the file being changed. The spec carries the same shape the `to-spec` skill writes: the problem, the solution, the decisions, and what is out of scope.
2. **Get the person to confirm the spec.** The question is what the change is, not how to do it. Nothing is edited until the person has read the spec and agreed to it.
3. **Cut the spec into tickets, then do the work.** The change is carried by tickets that the `to-tickets` skill writes. Each ticket names what it delivers and its acceptance criteria, and the work follows the ticket.
4. **Edit the file only inside a ticket.** A file edited outside a ticket is a change the tracker does not know about: no spec decided it, and no ticket records what it was for.

Read-only investigation, a status check, and a question answered in conversation are not changes; none of them needs a ticket. The line is whether a file in the set changes.

## Why

The set is rebuilt by reading one skill at a time, and a rebuild that edits as it reads leaves no record of why a file changed. A reader arriving later sees the new file and cannot tell a decision from a shortcut. The spec is where the decision is made; the ticket is where the work is placed; the file is the last thing to change, not the first.
