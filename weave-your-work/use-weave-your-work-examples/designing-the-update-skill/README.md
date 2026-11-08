# Designing the update skill

The second worked example: how one design map turned into a skill with three files. It is recorded from the tickets and commits of 2026-11-07 and 2026-11-08, and it is shorter than [Building work-weave](../building-work-weave/README.md) not because less happened but because more of it was reversals.

The ticket that holds the design is [Update skill: change a closed map or task](../../../tickets/map/wm-9sfmaphskg0c.md); the skill it produced is `weave-your-work/update/`.

## Order

1. [Three dispositions](01-three-dispositions.md)
2. [Writing across an ownership line](02-cross-owner-writes.md)
3. [The move that is one command](03-the-move.md)
4. [What this example does not show](04-gaps.md)

## What made this effort different

The map opened with a question the user asked in one sentence: changing a closed or split node breaks the things relying on it, so what should the update look like. Four of its entries were later struck through and rewritten, and every one of those reversals came from probing waymark rather than from argument. That is the lesson worth keeping: the design moved when a measurement arrived, and did not move while two of us reasoned about it.

The second thing worth keeping is a fault. The skill was written and the map closed before a ticket for the build existed under it; the user caught it, and the map was reopened to hang one. Every other design map in this repository already had such a ticket, so the pattern was there to copy and was not copied. The artifacts were fine; what was missing was the record that the work happened, which is the only thing tickets are for.
