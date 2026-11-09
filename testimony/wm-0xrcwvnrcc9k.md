---
schema: 1
id: wm-0xrcwvnrcc9k
title: Map skill audit design discussion
category: testimony
status: open
owner: frank
creator: frank
created_at: 2026-11-09T04:41:22Z
updated_at: 2026-11-09T05:05:00Z
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
- [ ] When a dependency closes as failed, may the waiting map proceed?
- [ ] How is uncovered acceptance work kept visible across partial splits?
- [ ] What evidence and timing does a map reviewer check before recording a verdict?
- [ ] How should a review gap be repaired without violating the frozen child type?

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
