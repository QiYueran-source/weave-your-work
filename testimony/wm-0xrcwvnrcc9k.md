---
schema: 1
id: wm-0xrcwvnrcc9k
title: Map skill audit design discussion
category: testimony
status: open
owner: frank
creator: frank
created_at: 2026-11-09T04:41:22Z
updated_at: 2026-11-09T05:16:41Z
soft_links:
  - wm-hy12yjm0yn9g
---
## Question tree

- [x] Where should the task count and task-by-task plan from a split discussion be recorded?
- [x] What may the first split write to the parent map?
- [x] How should successive task layers cover the parent acceptance direction?
- [x] How should map review inspect child type, outcome, and evidence?
- [x] How should incomplete or ambiguous acceptance standards reach explore and review?
- [x] What is the meaning of dependencies when a later map needs an earlier output?
- [x] When a dependency closes as failed, may the waiting map proceed?
- [x] How is uncovered acceptance work kept visible across partial splits?
- [x] What is the cost of adding a map Review section, and should the map have one?
  - [x] Which verdicts produce a Review section?
  - [x] How are old reviews marked on reopen?
  - [ ] Does a struck-through review remain after re-review?
  - [x] How are interrupted writes and mismatched status handled?
- [x] How should a review gap be repaired without violating the frozen child type?

## Discussion

### Round 1

- Q: Should the number of tasks and the one-line plan for each task be recorded in the discussion testimony instead of a child list on the parent map, with the actual children read from the tree?
  A: "1 放 testimony吧". The user chose testimony.

### Round 2

- Q: At the first split, should the parent move from open to in_progress and get split_as, while child creation leaves its body alone? Should later splits leave its status and split_as unchanged?
- Q: Should completed and planned task layers cumulatively cover the acceptance direction, with uncovered work visible and no early review?
- Q: Should map review compare the actual child types with split_as, inspect failed outcomes and replacements, and check task Result, Review, and deliverables against the map's acceptance direction? Waymark validate is a structural check, not a substitute.
- Q: Should a standard already known to be ambiguous go to explore before review, while ambiguity first discovered in review returns needs discussion and goes to grill?
- Q: Should dependency edges allow a later map to require an earlier map's output, with only tasks needing the missing output waiting, while unrelated tasks can run? Parent-child is not a dependency edge; tasks carry no dependency edges.
- A: "都按推荐吧". The user accepted all five recommendations.

### Round 3

- Q: If a dependency closes as failed, should the owner check whether the required output actually exists and is usable, keeping execution or acceptance waiting when it does not, and decide whether to wait for a replacement or adjust the target and dependency without automatically changing the edge?
- Q: Should the full acceptance direction remain on the parent, unclear uncovered work remain in Not yet specified, and the reviewer require actual evidence for all requirements rather than count planned tasks as completed?
- Q: If review finds a gap already required by a task's acceptance signal, should update determine whether to reopen, fix, and review that task; if the task met its own signal but the parent omitted a new requirement, should the owner discuss the target or structure instead of automatically creating a sibling task dependent on its output?
- A: "其他按推荐". The user accepted these three recommendations.
- Q: Should the map keep no Review section and report the checks outside its body?
  A: "9.map如果加review章节，成本如何". The user asked for the cost of adding a Review section; this decision remains open.

### Round 4

- Q: Should maps have a short Review section with the verdict, goal and convention checks, and evidence, while status remains the lifecycle state and existing maps are not bulk backfilled?
  A: "9.可以". The user agreed.

### Round 5

- Q: Should all four verdicts write Review?
- Q: On reopen, should the prior Review be invalidated with a reason and a new review written after re-review, without inventing old reviews for legacy maps?
- Q: Should the owner recheck children and evidence when Review and status disagree, rather than treating the mismatch as a pass or mechanically changing status?
- A: "11可以 12 可以，用~~划掉旧的吧，13可以". The user accepted all three and specified strikethrough for the old review. Whether it remains after re-review needs clarification.
