---
"weave-your-work": minor
---

Let the mainline run itself, and let a failed record stay failed.

Every action on the line but `map-review` is now model-invoked, so a split that writes child maps keeps going on each of them and a split that writes tasks hands them to `advance-task` without a person restarting it. Closing a map stays the person's decision. `MAINLINE.md` says both.

The task and the map review tables are rewritten so a verdict is read once, top to bottom: `wrong direction` on either axis fails the record and closes it, `needs discussion` holds it open, and anything else is repaired. A failed task or map leaves nothing to inherit; if the work still matters, the person settles it in `grill` and a new record is written from that.

`README.md`, `README.zh-CN.md`, and `resplit` now describe `whole-review` as the pass a person runs, and `setup` says eight rules in all three places it counts them.
