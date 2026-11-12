# The action that writes a record also changes what it wrote

`split` sets a map's `split_as` and starts the map when it first cuts a layer; `fog-explore` strikes the fog entry it cleared; `advance-task` writes `Result`. Each of them both decides and writes, and each stays one action doing one job.

The alternative was read/write separation: one action decides, another writes, and a skill never writes what it judged. This set had that shape for a while and it was worse. An action that decides without writing has to hand its result to a second action in the same run, and the second one has no way to check the hand: `open-map` was asked to write `split_as` from a caller who alone knew the layer's type, and the field's writer and its judge were then two files that could disagree. Reading, deciding, and writing the field each answer for is one job, because the decision and its write cannot be checked apart.

What the split-by-job rule keeps is that no action writes a *record* it did not create. A record's body belongs to the action that opened it; `update` is the one other way in, and it exists because a record others rely on cannot be rewritten by whoever notices first.

So "the writer" is not a role reserved for `open-map`, `open-task`, and `grill`. Those three are the writers of whole records. An action that owns one field of a record it already works on writes that field itself, and that is still one job.
