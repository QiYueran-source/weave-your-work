# Splitting the map and defining the task

### The map kept no child maps

The fog was five design questions — platforms, filing shape, write-back, triage, and the discussion/decision boundary — and all five could be settled in one conversation against one deliverable. None had its own owner, its own phase, or a second independent direction, so none became a child map. The map that is left is the one in the repository.

The rejected split was one child map per question. It would have produced five maps whose acceptance was a paragraph each, and the answers would still have had to agree with each other in the skill; keeping them in one map is what let the decision test replace the write-back list and the scope at the same time.

### One build task, not two

The split that was considered and rejected was two tasks, one per platform. It fails the size rule in both directions: the neutral rules — trigger, title, body, decision test, write-back, failures — would be written twice or owned by neither, and the acceptance would be two walkthroughs that can each pass while disagreeing about the shape.

One task carried the whole skill. At the time, the platform detail was separated inside the deliverable into `github.md` and `gitee.md`, so a run that filed one issue read one reference. That split did not hold: on 2026-11-09 the two files were replaced by one `usage.md` for GitHub, because the operations are the same on any host and `gh` documents its own syntax. [The two platforms](04-the-two-platforms.md) records why.

### No dependency edge

The map hangs one task and carries no edges. Tasks never carry one, and there is nothing for the map to wait on.

The edge that was considered and not added is the one to [Update skill: change a closed map or task](../../../tickets/map/wm-9sfmaphskg0c.md). It would say this work waits on update, or the reverse, and both are false: update already files its hand-over issue by hand today, and the issue skill does not wait for update to exist. The update map's `Out of scope` already says an edge there is the communication map's decision, not a fog item left on a closed map; the communication map decided not to draw it.

### The task

[Write the issue skill](../../../tickets/task/wm-mt3gkedtgvmp.md) is a delivery task with `reversibility: two_way`, because the skill is files that a later commit can replace, and `needs_human: true`, because two inputs are only a person's to give: a Gitee token and a scratch repository to file the test issues in.

Its action has ten steps: the trigger, the five actions, the issue shape, the decision test, the write-back, the two platform references, the verification, the install check, and what the skill does not do. Its acceptance signal is a reader walking three tickets through all five actions on both platforms, every reference command run against a scratch repository, and an install with no YAML parse error. Its boundaries keep it from growing into triage, ticket creation, automatic sync, or a write to a ticket the run does not own.
