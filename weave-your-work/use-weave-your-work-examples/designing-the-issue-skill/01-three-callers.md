# Three callers and one message

### The floor was already set before the map was explored

Three delivered designs needed to send a message, and each fixed one part of the shape:

- [Update skill: change a closed map or task](../../../tickets/map/wm-9sfmaphskg0c.md) files one issue per affected owner after an archive that removed a foreign relation. The issue must name the relation that disappeared, the id that replaced the node, and the decision the owner now has to make. An issue that only says "something changed" fails this caller.
- [Task execution skill](../../../tickets/map/wm-avc7a31tae33.md) records a `Person:` step's wait in `waiting_on` and `Progress`; the notification is an issue, and the answer is recorded in the task's `Result`.
- [Map front matter and dependencies](../../../tickets/map/wm-8zyyyafxbdwr.md) opens an issue when a child wants to hang under a closed map owned by someone else, and keeps the child isolated with `Intended parent: <id>, waiting on <issue URL>` until the owner reopens.

Those three rules agree on the shape: one recipient, the ticket id in the title, the ask in the body, and a named place where the answer lands. The skill did not have to invent a template; it had to write down the one the callers already assumed.

### One issue per recipient, not one thread per ticket

The first alternative was one long thread per ticket, reused for every event. It reads well for a discussion that drifts, and it fails the archive caller: the thread it would reuse was addressed to whoever acted last time, and a second archive concerns a different owner. It also mixes two decisions in one place, so the closing comment cannot say which one landed.

The rule that survived is one issue per recipient per event. A reused thread is for the same question, not for the next one.

### The ticket id is the search key

The remote side cannot read a local path, and the local side cannot rely on remembering a URL. The id in the title is the one handle both sides share: the filer searches for it before opening a second thread, the recipient finds the issue by it, and the ticket carries the URL back.

That is also why the title names the action, not the ticket: `[wm-...] Your "Sync glossary records" needs a re-point` can be read in a list; `[wm-...] Update` cannot.

### The receipt cannot go on the archived node

The receipt rule first said the ticket that made the change carries the issue URL. For the archive caller that is the archived node, and a probe settled it the other way: an archived ticket rejects `body replace` with `<id> is archived and rejects body`. The URL cannot be written after the fact.

So the hand-over's receipt goes on the live ticket that continues the change: the replacement node in a retire-and-replace, or the map or task that made the change. That also matches the update map's rule that an archive and its replacement travel together — an archive with no replacement has nothing to tell the dependents, and no live node to record the telling.
