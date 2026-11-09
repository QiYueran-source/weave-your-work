# The channel, not the queue

### The scope was two actions wider than the map's destination

The map asked for file, view, reply, and write back. A triage state machine was already out of scope; the open question was whether a simplified version belonged in this round.

It does not. A triage role needs labels the repository may not have, an assignee, and a queue that someone watches. That is a maintainer's tool for incoming work, and it changes what the skill is: a two-person channel becomes a place where work waits to be sorted. The test that settled it was the outside proposal — someone opens an issue asking for a retro skill. The channel reads it and answers it; when an owner accepts, split creates the ticket and the closing comment links it. Nothing is labelled, and nothing is queued.

### The write-back went to the ticket, not to a second document

The alternative that looked natural was a `comment` ticket for every synced decision: a separate waymark document, hanging under the ticket, holding the decision and the issue URL. It matches the glossary's `comment` entry and it keeps the discussion record apart from the curated ticket body.

A probe in a scratch project showed the cost. A comment can hang under a task; it then appears in `waymark tree` as a child of that task, and in `waymark ready` as an item of its own. Closing it immediately keeps it out of `ready`, so the discovery half is repairable — but the tree still shows a record where the model says a task has no children, and every decision now has two documents to keep true.

The ticket body already has a place for the decision, and the update skill already records why a changed section changed:

- a map: a `Decisions so far` entry in its concrete form, with the issue URL as the source;
- a task: the affected section, with the URL next to the changed text; a person's answer goes in `Result`;
- a relation: the owner runs the waymark command, and the URL goes in the ticket that records the change.

So the skill does not use the `comment` category. Whether that category stays belongs to the execution map, not to this one.

### The decision test replaced a list of examples

A list was the obvious first answer to "what counts as a decision": an accepted change, a settled question, an agreement to do something later. Lists of examples invite the reader to find the case that is not on them.

The replacement is one test: an answer is a decision when it changes a ticket's text, status, or relations, or settles a fact the ticket already cites. Everything else — agreement, thanks, scheduling, options that lost — stays in the thread. The test is checkable against the ticket in front of the reader, and it makes the write-back rule and the "do not copy the discussion" rule the same rule.

### The outcome lands, the queue does not

The state machine stayed out, but a triage result is still a decision about what the map includes. A rejected proposal writes one line into the map's `Out of scope` — what was declined, why, and the issue URL — and the issue closes as `not planned`. An accepted one becomes a ticket through split, with the issue URL as its source; a `needs info` answer writes nothing and leaves the issue open. The labels and the queue stay remote; the local tracker can still say why an idea is not in the tree.

### The handle is a roster, not a guess

A waymark owner is a local name; a GitHub login is a remote one. Guessing the second from the first is silent when it is wrong: the mention reaches nobody, or reaches a stranger. The first design read `.waymark/handles.toml`, one table per platform, and verified the account before mentioning or assigning it. A missing table, owner, or account means ask the run's owner; the skill never derives a login from a name. The sample roster mapped `frank` to the account the probe used.

### Moving the roster out of waymark

The original roster lived under `.waymark/`, although the issue skill rather than waymark reads it. The later discussion chose the installed skill's `bundle/tools/`: each project commits its own copy, and issue setup asks the person responsible for the owner-to-handle mappings. Repeated setup preserves an existing roster. A skill update can replace the installed directory, so the setup guide calls for backing up the roster and restoring it afterward. The migration plan is in [Write the issue skill](../../../tickets/task/wm-mt3gkedtgvmp.md).

### Checking the queue at session start

A file watcher that pushes messages into a running agent would need a different integration for each harness. The discussion kept the session-start rule as the default and chose a small read-only Node checker for optional session-start hooks. The checker reports queued items without acting on them; adapting it and verifying that its output reaches an agent remains harness-specific. The scope and tests are in [Write the issue skill](../../../tickets/task/wm-mt3gkedtgvmp.md).

### Securing the listener and queue

The listener review found that an empty secret disabled signature checks and remote fields could break the line-based queue format. The proposed fix requires a secret and encodes new records without rewriting existing local queues; the plan and compatibility tests are in [Write the issue skill](../../../tickets/task/wm-mt3gkedtgvmp.md).

### What was rejected: copying the thread

A local mirror of every comment was considered and dropped for the reason the draft's section 6 gives: it duplicates the remote side, goes stale, and there is no owner for the copy. The ticket holds the decision; the issue holds the conversation.
