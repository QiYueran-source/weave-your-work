# Testimony example

One discussion, from the first round to a closed testimony. The case is an
office move, so nothing here depends on code.

## What the discussion was

A team needs to move an office in six weeks. Nobody has decided where the
reception desk goes, whether the old furniture comes along, or who signs off on
the lease. The person holding the move asked for a discussion, and the first
round asks the three questions that can be answered now.

## Round 1, as asked

```
❓ **Q1** - **Furniture**: does the existing furniture move with us, or do we
buy new? The lease allows either.

➡️ Move what we have. Buying new is four weeks of lead time we cannot hold.

---

❓ **Q2** - **Reception desk**: where does it sit in the new floor plan? The
plan has two options: by the entrance, or by the windows.

➡️ By the entrance, so visitors are met before they are in the work area.

---

❓ **Q3** - **Lease sign-off**: who signs?

➡️ Finance signs; that is who signed the current one.
```

## Round 2, after the answers

Q2's answer changed what could be asked. Q1's answer did not, so nothing
downstream of it opened. One new question hangs off Q2:

```
❓ **Q4** - **Visitors before the desk**: with the desk by the entrance, do
visitors wait in the open, or does the layout need a waiting area?

➡️ A waiting area. Visitors standing in the entrance make the desk's job
harder, not easier.
```

## The testimony

````markdown
## Subject

How the team's office moves in six weeks: what comes along, where the reception
desk sits, and who signs the lease.

## Rounds

### Round 1

- **Q1** Furniture
  - Question: does the existing furniture move with us, or do we buy new? The lease allows either.
  - Recommended: Move what we have.
  - Answer: Move what we have. The new desks are the wrong height anyway.
  - Parent: none

- **Q2** Reception desk
  - Question: where does it sit in the new floor plan, by the entrance or by the windows?
  - Recommended: By the entrance.
  - Answer: By the entrance, but check whether visitors need a waiting area.
  - Parent: none

- **Q3** Lease sign-off
  - Question: who signs the lease?
  - Recommended: Finance. (from the current lease, clause 7)
  - Answer: Finance. 一直是财务签，流程没变过。
  - Parent: none

### Round 2

- **Q4** Visitors before the desk
  - Question: with the desk by the entrance, do visitors wait in the open, or does the layout need a waiting area?
  - Recommended: A waiting area.
  - Answer: A waiting area, and it needs to seat three.
  - Parent: Q2

## Settled

- The existing furniture moves; only the desks are replaced (from Q1)
- The reception desk sits by the entrance (from Q2)
- Finance signs the lease (from Q3)
- The layout needs a waiting area that seats three (from Q4)

## Open

Whether the waiting area fits the budget Finance already approved.

## Handed off

- work: book the movers for the existing furniture
- work: order three replacement desks
- work: draw the waiting area into the floor plan
````

## What the testimony does not hold

The rounds above are the discussion. The four `Settled` lines are the decisions
it reached, each naming the question that settled it and nothing more: which
record writes a decision down is decided after the discussion, by whoever asked
for it. The testimony does not restate any record's content, and it holds no
checklist: checking off work is a ticket's job.
