# The baker's handbook

Written by a person. You read it and you never change it. It says what each
knob does, in what direction, and where the loaf stops being bread. It gives
one known-good starting point and the limits you must stay inside. It does not
say where any knob's best value lies: that is what baking and scoring are for.

## Start here

A bake that has not been tuned yet:

| Knob | Value |
| --- | --- |
| `oven_temperature` | 200 °C |
| `bake_time` | 40 min |
| `proofing_time` | 60 min |
| `water_amount` | 65 % of the flour weight |
| `sugar_amount` | 5 % of the flour weight |

This is a workable loaf, not a good one. None of these values is the best
setting for its knob; each sits somewhere in the middle of what the feature it
drives responds to.

## What each knob does

Each knob is judged by one feature above all the others, and it also nudges the
other four a little. Every one of these relations has the same shape: the
feature rises as the knob increases, reaches a best somewhere, and falls again
past it.

| Knob | Feature it leads | Range | What its feature does |
| --- | --- | --- | --- |
| `oven_temperature` | crispness | 150–250 °C | Rises as the oven heats, peaks, then falls as the loaf dries and scorches |
| `bake_time` | chewiness | 20–70 min | Rises with time to a firm peak, then a long bake dries the crumb hard |
| `proofing_time` | softness | 20–120 min | Rises as the dough proofs, peaks, then over-proofed dough collapses and bakes dense |
| `water_amount` | moistness | 50–90 % | Rises with water, peaks where the crumb is open but not wet, then turns gummy |
| `sugar_amount` | sweetness | 0–15 % | Rises with sugar, peaks where the crust browns evenly, then falls as it burns |

Two things follow from this table and matter more than any single row:

- **Raising a knob is a trade.** Moving a knob up helps the feature it leads
  until a point, and can cost another feature at the same time. No two knobs
  can both be raised for free.
- **The best setting of one knob depends on where the others stand.** A feature
  is what all five knobs do to it added together, so changing one changes what
  the others are worth. Change one knob at a time before changing two.

## Limits

- A bake much shorter than bread needs, or an oven much lower, leaves the loaf
  raw. Much above, it scorches. **The machine will bake a run this short or this
  hot anyway**: it refuses only values outside the range in the table above. A
  bake inside the range but inside a bad stretch still bakes, and scores badly:
  the feature that knob leads comes out far lower than the others would. Treat a
  poor score near an end of a range as the boundary showing itself, not as bad
  luck, and a feature ruined at one end cannot be rescued by raising another
  knob.
- These five knobs are all there is. A bake sets their values; it cannot add a
  knob, change a range, or reshape the schedule.
- Each bake is judged by a taste that differs a little from the last one. One
  score is noisy. Several rounds with changes small enough to compare tell you
  more than one big jump.
