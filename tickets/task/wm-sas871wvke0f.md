---
schema: 1
id: wm-sas871wvke0f
title: Repair the map and task references against the audit findings
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-09T15:55:18Z
updated_at: 2026-11-09T15:58:07Z
closed_at: 2026-11-09T15:58:07Z
parent: wm-3tbfbj0g5827
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Make the two reference families agree, one rule at a time. Change wording where the audit points; change no heading, no section name, no verdict name, and no field.

1. **Task body order** — `task-design/body.md`. Three statements disagree: `:7` says sections follow the order the file lists them, the two kind lists (`:95`, `:121`) put `Result` and `Review` before `Failure recovery`, and the shared-section intro (`:23`) puts `Boundaries` before the kind's own sections while both lists put it last. Keep the two kind lists as the order, say the file explains the sections in reading order, and say that `Action` and `Acceptance signal` open the body while `Boundaries` follows the kind's sections.
2. **Fog completion** — `map/body.md` (`:9`, `:103`), `map/procedure.md` (`:19`, `:41`), `fog-explore/SKILL.md` (`:8`, `:14`, `:16`). A resolved entry stays in place struck through, so the section is never empty, and three places use "empty" as the completion test. Define the marker as a section with no entries and the completion test as no unresolved entry remaining.
3. **A childless map with a specific result** — `map/body.md:263` describes a map that `procedure.md:78` and `map-review:12` say is never reviewed. Rewrite `:263` so the choice between the default clause and a specific result depends on whether the target has its own observable outcome, and let `procedure.md:31` state a settled specific result at creation.
4. **A missing map output at task review** — `task-review:40` returns the task to the owner with `Progress` and no verdict, against its own four verdicts and `task-design/body.md:186`. Make it `needs discussion` with `waiting_on` set to the owner.
5. **The invocation flag** — delete `disable-model-invocation` from `execute-all`, `execute-one-task`, `task`, `issue`, and `use-weave-your-work-examples`; delete the sentence at `task-review:10`; add the guard sentence to `execute-all/SKILL.md`.
6. **Broken names** — `grill/SKILL.md:13` names `review`; `split/SKILL.md:58`, `split/submap.md:85`, and `map-review:71` say `explore`. Name the skills.
7. **Unresolved pointers** — `map-review` (`:26`, `:34`, `:52`, `:72`) and `split/SKILL.md:54`, `split/submap.md:9` and `:84` name `body.md` and `frontmatter.md` with no owner. Write them as the `map` skill's files, the form the rest of the set already uses.
8. **`needs_human`** — `task-design/properties.md:33` says to leave it unset; `split/task.md:38` says to write it explicitly. Say the split writes it, and a hand-written ticket may leave it unset.
9. **A script-safe scan** — `update/SKILL.md:82` says `list` carries the same five relations per row; it omits an empty one, so a root row has no `item.parent`. Say so.
10. **A write a subagent cannot use** — `execute-all/dispatch.md:22` lets a subagent write `waiting_on`, which `:59` forbids it to use. Drop it from the list.

## Acceptance signal

For every pair named above, the two lines read as one rule together. A search of the repository finds no bare `body.md`, `frontmatter.md`, `explore`, or `review` outside `weave-your-work/map/`, and no `SKILL.md` carrying `disable-model-invocation`. `waymark validate` reports no findings.

## Result

Every pair named in `Action` now reads as one rule. The changed files are under `weave-your-work/` in commit `3e73296`; the ticket records, including the root map decision and the four superseded bullets, are in `d0c58f8`.

Read the pairs directly: `task-design/body.md` (`:7`, `:23`, and the two kind lists), `map/body.md` (`:9`, `:100`-`:104`, `:40`, the closing note), `map/procedure.md` (`:19`, `:31`, `:38`, `:41`), `fog-explore/SKILL.md` (`:8`, `:14`, `:16`), `task-review/SKILL.md` (`:35`), `map-review/SKILL.md` (`:26`, `:34`, `:38`, `:52`, `:71`, `:72`), `split/SKILL.md` (`:23`, `:54`, `:58`), `split/submap.md` (`:9`, `:84`, `:85`), `grill/SKILL.md` (`:13`), `task-design/properties.md` (`:33`), `update/SKILL.md` (`:82`), `execute-all/dispatch.md` (`:22`), `execute-all/SKILL.md`, and the five `SKILL.md` front matters.

The checks:

- `grep -rn 'disable-model-invocation' weave-your-work` returns nothing.
- `grep -rn -E '\`(explore|review)\`'` outside `node_modules` returns nothing.
- A search for `body.md` and `frontmatter.md` in the seven skills that do not own them finds no unqualified name; every one names the skill or follows a sentence that loaded it.
- `waymark validate` reports no findings, run after the last write.
- All fifteen `SKILL.md` front matters parse as YAML and carry `name` and `description`.

Three deviations from the written `Action`:

- Item 2 needed one more line than listed. Tying the marker to "the section holds no entries" made a freshly created map owe `(none; the fog is cleared)`, which it cannot honestly write, because `procedure.md:31` requires only `Target` and `Acceptance direction` at creation. The marker is now tied to "the fog has been settled", and `body.md:9`, `:102`, and `:104` say so.
- Item 3 also changed `procedure.md:31`, which now lets a created map state a specific result the discussion already settled.
- Item 5 also struck four decision bullets on closed tickets, in `d0c58f8`. They are ticket records, not reference text.

The acceptance signal asks for no bare `body.md` outside `weave-your-work/map/`. Taken literally that cannot hold: `task-design` owns its own `body.md`, and its references say so correctly. The check was applied as "no unqualified reference to another skill's file", and it returns nothing.

## Review

passed

- Goal: the ten pairs named in `Action` read as one rule each. A search for `disable-model-invocation` and for backticked `explore` and `review` returns nothing, no unqualified `body.md` or `frontmatter.md` remains in the seven skills that do not own them, and `waymark validate` reports no findings. All run after the last write.
- Convention: no heading, section, verdict name, or field changed, and the task's own body runs Action, Acceptance signal, Result, Review, Boundaries as `task-design/body.md` states. The run stayed inside `Boundaries` and wrote only the reference files, this ticket, and the records in `d0c58f8`.

## Boundaries

- No section, heading, verdict name, or field changes shape.
- The design tickets are not reopened or re-reviewed here; the root map decision and their stale bullets are recorded separately.
- `wm-87pgn0b75yy5` keeps its own fog entries; that is a ticket repair, not a reference repair.
