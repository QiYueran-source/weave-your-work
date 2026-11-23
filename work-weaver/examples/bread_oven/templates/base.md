# The baker's handbook

Written by a person. You read it and you never change it. It says what each
knob does, in what direction, and how far the machine will let a knob go. It
gives one known-good starting point and the limits you must stay inside. It does
not say where any knob's best value lies: that is what baking and scoring are
for.

## Start here

A bake that has not been tuned yet:

| Knob | Value |
| --- | --- |
| `oven_temperature` | 200 °C |
| `bake_time` | 40 min |
| `proofing_time` | 20 min |
| `water_amount` | 65 % of the flour weight |
| `sugar_amount` | 5 % of the flour weight |

This is a mediocre loaf, not a good one. None of these values is the best
setting for its knob. Every bake is scored from 0 to 1: a recipe this untuned
lands at about 0.5, a loaf that is right at every knob approaches 1, and a loaf
that is wrong at every knob sits near 0. Everything between is earned by moving
knobs toward where their features want them.

## What each knob does

Each knob leads two or three features and only nudges the rest. Every one of
these relations has the same shape: the feature rises as the knob increases,
reaches a best somewhere, and falls again past it. A feature can be led by more
than one knob, so reading a bake means matching a pattern across several
features, not one number.

| Knob | Features it leads | Range | What those features do |
| --- | --- | --- | --- |
| `oven_temperature` | crispness, moistness, sweetness | 195–240 °C | Heat crisps the crust, dries the crumb, and browns the sugar; past the peak the loaf dries out and scorches |
| `bake_time` | chewiness, moistness | 30–62 min | Time firms the crumb; a long bake drives the water off and the crumb goes hard |
| `proofing_time` | softness, chewiness, sweetness | 20–46 min | Proofing opens the crumb and relaxes the gluten; past the peak the dough collapses and the yeast has eaten the sugar |
| `water_amount` | moistness, softness, chewiness | 56–88 % | Water opens the crumb and softens it; past the peak the dough turns gummy and the crumb heavy |
| `sugar_amount` | sweetness, crispness | 3–14 % | Sugar sweetens and browns the crust; past the peak it burns and the loaf turns brittle |

Two things follow from this table and matter more than any single row:

- **Raising a knob is a trade.** Moving a knob up helps the features it leads
  until a point, and can cost another feature at the same time. No two knobs
  can both be raised for free.
- **A move shows up in more than one place, and one feature answers to more than
  one knob.** A feature is what all five knobs do to it added together, so a
  step on one knob moves two or three features at once, and a feature that
  moves could belong to any of the knobs that lead it. Change one knob at a
  time, and use the pattern across features to say which knob did it.

## Limits

- **The range in the table is the machine's limit.** It refuses a value outside
  it and changes nothing, so a bake never comes out raw or scorched. Inside the
  range every bake is a real loaf, and the score falls away smoothly as a knob
  leaves the stretch its feature likes: the feature that knob leads drops first,
  the other four follow it a little.
- These five knobs are all there is. A bake sets their values; it cannot add a
  knob, change a range, or reshape the schedule.
- Each bake is judged by a taste that differs a little from the last one. One
  score is noisy. Several rounds with changes small enough to compare tell you
  more than one big jump.
