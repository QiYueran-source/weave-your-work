# Categories

Three categories, and what each one is for. The category is the record's kind: it decides which body sections the record may hold.

| Category | Is | Body defined in | Written when |
|---|---|---|---|
| `map` | a target, refined by child maps or tasks | `res/map.md` | a target is opened, or one that has not split changes |
| `task` | one action that ends at a checkable result | `res/task.md` | a settled layer is written down as work |
| `testimony` | the record of one discussion | `res/testimony.md` | a discussion is held |

A testimony is a record item, not a work item: it has an owner and a body, it never carries `split_as`, `task_kind`, or `waiting_on`, and no one accepts it as work.

## Assertions

- A category outside the three above. [waymark]
- A body section that belongs to another category. [review]
- A testimony carrying a field that belongs to a map or a task. [check-records]
- A task hanging under anything but a map. [check-records]
