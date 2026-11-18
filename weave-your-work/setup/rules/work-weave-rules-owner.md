# Advance Only What You Own

A record has one owner: the person accountable for it. Changing a record's
content, status, relations, or ownership is the owner's work. The creator only
wrote it down.

## What to do

1. **Read the owner before writing.** Before changing any testimony, spec, or
   ticket's body, status, `Review`, or `owner`, read its `owner` field. When it
   names someone other than your own operator, stop and ask the person before
   writing anything.

2. **A non-owner reports and does not advance.** A non-owner who finds a
   problem writes nothing on that record: no `Review`, no status change, no
   close. Report to the owner, or send them a communicate issue, and stop there.

3. **Change another person's record only by asking its owner.** Ownership moves
   as the owner's own act. To get another person's record changed, ask its owner
   to transfer it to you, then wait. To hand a record over, transfer it to the
   new owner first, then tell them it is theirs. Send a communicate issue for
   both messages. Converting another person's record (a spec into tickets, a
   testimony into a spec) and implementing another person's ticket follow the
   same rule: after the owner has transferred it to you, it is yours to advance;
   before that, you only ask.

4. **`needs_human` does not change who owns the ticket.** It says whether a
   person or an agent works the ticket, not who owns it. A ticket another person
   owns is not yours to advance even when an agent could work it, and a ticket
   you own is yours to advance even when it takes a person.

5. **Relations are one-way, with no `--cascade`.** Add a `link` or a
   `dependency` without `--cascade`, even between two records you own. The other
   end lists nothing; a one-sided edge is the whole record of the relation.
   `--cascade` is never part of this set's practice.

## Why

The tracker records the owner and reports `OWNER_MISMATCH`, but every write
proceeds anyway: `owner transfer`, `link add`, and `dependency add` all land on a
record another owner holds. Nothing here is enforced below this rule, so the
check in step 1 is the whole mechanism.

An edge written on both ends makes two records agree on something neither owner
separately agreed to. Keeping the edge on the writer's side alone means the
record shows who made the claim, and the other owner's record stays untouched
until they decide for themselves.
