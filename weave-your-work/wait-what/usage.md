# Using wait-what

One worked pass over this repository. The person had lost the thread while the root map's session-skills branch was being split, and asked where the work stood.

## What was read

```bash
waymark tree --root wm-wjwa9081hse1
waymark list --parent wm-wjwa9081hse1
waymark show wm-s4tvr121g3tv
waymark show wm-v2trg1ekayxp
waymark show wm-4t2jjm21af74
```

The tree gave the shape: fourteen children under the root, ten of them closed. The list gave the status of each. `show` on the three that are still moving gave `Progress`, `Review`, and `waiting_on` — none of them set, which is itself the answer: nothing is waiting on a person, so the next step is work rather than a question.

Ten of the root's fourteen children are closed. Each was read as a status and a title and then dropped, because closed rows are not in the table.

## The table that was reported

| Node | Status | Waiting on | Next |
|---|---|---|---|
| `wm-s4tvr121g3tv` Session skills | `in_progress` | — | me: the two children below |
| `wm-v2trg1ekayxp` Write the handoff skill | `open` | — | me |
| `wm-4t2jjm21af74` Write the wait-what skill | `open` | — | me |
| `wm-10np2bs10s0e` Publish the set | `in_progress` | — | me: four children open |
| `wm-8wzzh4hp5evp` Entry skills | `open` | — | me: no children yet, still fog |
| `wm-a08fwanmy5q6` Environment skills | `open` | — | me: one child open |

Two lines under it:

`wm-10np2bs10s0e` carries four open children and had not been touched in this session, so it is not "next" in the same sense as the two above it — it is the largest piece of unfinished work under the root and nothing is blocking it.

`wm-8wzzh4hp5evp` has no children, so it is still in explore. Its `Not yet specified` holds the routing question, and that question needs the person, which the table has no column for.

## Why the table looked like that

- Ten closed children of the root never appeared. They are done; listing them would have pushed the six live rows off the screen.
- `wm-13pnvh9d6n44` and `wm-0jc0gzrgv7z0` are closed child maps with closed children. Nothing under them is read.
- The two session tasks were read with `show` rather than inferred from the list, because `waiting_on` and `Review` are only in the body. Both were empty, which is why the table says "me" and not a person's name.
- The `Next` column names `me` for every live row here. That is a real answer for a one-operator project, not a placeholder; on a shared checkout some of those rows would name the owner instead.

## What it did not do

The report did not start the handoff task, did not clear any fog, and did not change a status. The person read the table and chose what to do next.
