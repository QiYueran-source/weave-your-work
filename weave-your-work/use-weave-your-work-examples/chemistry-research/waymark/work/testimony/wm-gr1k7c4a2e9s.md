---
schema: 1
id: wm-gr1k7c4a2e9s
title: Whether to wait for nickel before the production scale-up
category: testimony
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T14:00:00Z
updated_at: 2026-11-08T14:30:00Z
closed_at: 2026-11-08T14:30:00Z
soft_links:
  - wm-pr0d8c4a2e9s
---
## Question tree

- [x] Choose the catalyst for production
  - [x] What would a second nickel campaign change — goal
  - [x] Is the 4-bromotoluene gap a ligand problem — fact, checked in `lab/screening-table.csv`
  - [x] What is the cost gap at production scale — fact, the pilot lead
  - [x] Who can approve the reactor week — decision, the pilot lead
    - [x] Can the ligand screen run in that week — fact, the lab lead
  - [x] What happens to the route lock if the campaign slips — fact, the supply team

## Discussion

### Round 1

- Q: What would a second nickel campaign change?
  A: It would tell us whether a different ligand closes the 4-bromotoluene gap. If it does, the catalyst cost drops by about 90%; if it does not, palladium stays.
- Q: Is the 4-bromotoluene gap a ligand problem or a substrate problem?
  A: The screen used dtbbpy, and 4-bromotoluene came in at 64%, 2-bromonaphthalene at 41%, both under the 70% floor. We did not try another ligand; the protocol kept the ligand fixed.
- Q: What is the cost gap at production scale?
  A: Palladium is the largest cost line; nickel is about a tenth of the catalyst cost. The pilot ran at 87% yield and 99.1% purity, so palladium is the benchmark.
- Q: Who can approve the reactor week?
  A: I can approve one week of reactor time, but the supply team needs the production route locked by 15 December.
- Q: What happens to the route lock if the campaign slips?
  A: The route lock moves with the campaign; missing 15 December pushes the supply order and the plant slot.

### Round 2

- Q: Can the ligand screen run in that week?
  A: The ligand is not in the lab. Ordering takes two weeks, so the week is not enough.
- Q: Do we lock palladium now, or delay the route for the nickel campaign?
  A: Lock palladium for production. The nickel ligand work continues in R&D; it is not a production dependency.
- Q: What work leaves the grill?
  A: A probe task: test the nickel ligand on 4-bromotoluene. It belongs in the R&D map, not this one.

- work: Test the nickel ligand on 4-bromotoluene in R&D (the caller creates the probe task; it is outside the production map).
