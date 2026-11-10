# Data analysis: a shop's restock list

This example runs the weave-your-work skills end to end on one small data job: turning a shop's weekly sales export into a restock list the owner can order from. The shop and its numbers are invented. The tickets, the commands, and the files under `work/`, `results/`, and `data/` are real and committed, and the project validates.

The run was unattended. The operator asked for every recommended answer to be accepted and for no interruptions, so the [testimony](work/testimony/wm-dns611g614me.md) records accepted recommendations rather than an exchange with a person. That is the largest limitation of this example, and [what the run showed](07-what-the-run-showed.md) says which paths it could not exercise because of it.

Read in this order:

1. [The map](01-the-map.md): the target, the acceptance direction, and four fog entries.
2. [The grill](02-the-grill.md): the testimony, the decisions it landed, and the fog it cleared.
3. [The split](03-the-split.md): two child maps, one dependency edge, and the task layer.
4. [The tasks](04-the-tasks.md): a probe, three deliveries, and the two lists.
5. [The update](05-the-update.md): an editorial edit, a reopened verdict, a retire-and-replace, and a move.
6. [The review](06-the-review.md): what each map review read and what it wrote.
7. [What the run showed](07-what-the-run-showed.md): the defects, the misses, and the paths left untested.

Check the project with:

```sh
waymark --project weave-your-work/use-weave-your-work-examples/data-analysis validate
```
