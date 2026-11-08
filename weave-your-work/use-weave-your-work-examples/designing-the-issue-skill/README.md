# Designing the issue skill

The third worked example: how the communication map became a skill with two platform references. It is recorded from the tickets and commits of 2026-11-08, while the design was still being verified, so its last page says what is not shown yet.

The ticket that holds the design is [Communication skills: issue remote exchange](../../../tickets/map/wm-25b3q7mg88c7.md); the task that builds it is [Write the issue skill](../../../tickets/task/wm-mt3gkedtgvmp.md); the skill is `weave-your-work/issue/`.

## Order

1. [Three callers and one message](01-three-callers.md)
2. [The channel, not the queue](02-the-channel.md)
3. [Splitting the map and defining the task](03-splitting-and-the-task.md)
4. [The two platforms](04-the-two-platforms.md)
5. [What this example does not show](05-gaps.md)

## What made this effort different

The design did not start from a blank page. Three delivered skills already needed to send something to someone — update's archive hand-over, task execution's human step, and the rule for hanging a child under a closed foreign map — and their rules fixed most of the issue's shape before the communication map was explored. The interesting decisions were the ones those callers did not settle: how much of the issue lifecycle the skill owns, and where a decision formed in a thread lands locally.

The second difference is the platform. GitHub and Gitee were chosen together, but Gitee needs a credential this machine does not have. GitHub's five actions were run end to end on a private scratch repository; Gitee's write path still waits on a token, and its read path was checked against a public repository. That is a gap, not a result, and it is written down as one.
