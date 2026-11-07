---
schema: 1
id: wm-793jrqph1ckv
title: Task design skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T06:48:08Z
updated_at: 2026-11-07T12:39:43Z
parent: wm-87pgn0b75yy5
---
## Target

Design the task design skill: define how an executable task is specified and made verifiable.

## Acceptance direction

All children are complete and no further child is needed: the task design skill's entry routes to its three references, `body.md`, `kind.md`, and `properties.md` are written and agree with each other, and `body.md` defines the sections execution writes and what a task's outcome lives in.

## Children

- [Write the task skill entry](tickets/task/wm-qamw233hhpe3.md): SKILL.md entry and routing.
- [Write the task body reference](tickets/task/wm-6sfjje8w0688.md): shared content rules plus the delivery and probe section lists.
- [Write the task properties reference](tickets/task/wm-0sk8rrhz6gsv.md): task_kind, reversibility, and needs_human.
- [Task kind reference](tickets/map/wm-rx7newew73y5.md): choosing the kind, the stage it suits, and what failure means for each; it holds one write task.
- [Check the task design skill against a fresh reader](tickets/task/wm-yx9rckmhnkpm.md): read the four files cold, write a delivery and a probe task, and report what had to be guessed.
- [Write the Progress section into the task body reference](tickets/task/wm-2vphdebar7ph.md): the one section execution writes and closing removes.
- [Declare waiting_on in the task properties reference](tickets/task/wm-ktjm55w7zwk3.md): the fourth task field, written while a task waits.
- [Make Result the shared outcome section](tickets/task/wm-5am6jgx5jyvb.md): one place for what a task produced, for both kinds.
- [Add outcome and Review to the task references](tickets/task/wm-gg4m636xgrxz.md): the section and the field a review writes on a closed ticket.
- The earlier check [wm-f5ddb0342bt1](tickets/task/wm-f5ddb0342bt1.md) was closed without being run and is kept only as history.

## Decisions so far

- `Result` is the one section where a task's outcome lives, for both kinds: a delivery records where the deliverable is and how to open it, and a probe records the finding and its verdict. The outcome is written on the ticket, not in a separate record (user confirmed).
- Execution opens no separate records. What a person hands back, the wait, and the evidence all land on the task ticket: `Result` for what the work produced, `Progress` and `waiting_on` while it runs (user confirmed).
- A task body carries one section that execution writes, not the designer: `Progress`, holding where the work stands so another run can pick the task up without asking anyone. It is written while the task is in progress and removed before the ticket closes, so a closed ticket keeps only what the task promised (user confirmed).
- Task design owns three references: `body.md` for section content, `kind.md` for choosing the kind and its failure meaning, and `properties.md` for the custom fields (user confirmed).
- Task design defines the task specification; it does not decide which tasks to create when splitting a map. The split skill decides whether and how work should split into tasks, then references task design when creating them (user confirmed).
- A task must be classified as delivery or probe using `task_kind` (user confirmed).
- A task carries exactly one complete action: one goal, which may take several steps (user confirmed).
- Verifiable result is not a separate section. The action states the work, and the acceptance signal states how the result is checked (user confirmed).
- `body.md` has a shared part plus one part per task kind (user confirmed).
- Delivery body sections: Action, Acceptance signal, Failure recovery. Boundaries is optional (user confirmed).
- A delivery task must state what it produces; the Action says what work is done and what it delivers (user confirmed).
- A probe task must state the hypothesis or question it verifies; the Action says what is checked and how (user confirmed).
- `reversibility` stays a required front matter field with `one_way` and `two_way` values (user confirmed).
- Failure recovery is required for a `one_way` task and optional for a `two_way` task. It states the consequence of failure and the remediation (user confirmed).
- Probe body sections: Action, Acceptance signal, `Result`, and `Next step`. Boundaries is optional. Failure recovery is added only when the check could not be completed and a retry or abandonment needs recording (user confirmed).
- `Result` records what the check found and whether the hypothesis holds. It is written after the check by the task owner; when the check was not completed, it says so and gives the reason (user confirmed).
- `Next step` is required for every probe task and covers both outcomes: what to do when the hypothesis holds and what to do when it does not (user confirmed).
- A probe task is done when the check is complete; its acceptance signal distinguishes the possible verification results rather than requiring a particular one (user confirmed).
- Unused sections are omitted entirely, not written as `none` (user confirmed).
- Every section in `body.md` is described with its purpose, its format, and a directly usable example, following the map body reference (user confirmed).
- `properties.md` covers only `task_kind`, `reversibility`, and `needs_human`. Waymark's core fields are left to `waymark --help` instead of being repeated (user confirmed).
- `reversibility` is declared in waymark as an optional string; `needs_human` is declared as an optional boolean. Accepted values live in `properties.md`, not in the config (user confirmed).
- `needs_human` is a separate boolean property, not a task kind. Whether to set it is judged by AI and handled by the split skill when the task is created (user confirmed).
- Human participation is marked inside the Action with the prefix `Person:` at the start of the step. The prefix is always written in English, even when the task is written in another language. No separate `Human step` section is added (user confirmed).
- The field and the body must agree: when `needs_human` is true at least one Action step carries the `Person:` prefix, and when it is false no step does (user confirmed).
- A task is accepted by its owner. Acceptance is not limited to a non-executor (user confirmed). The review, execution, and root maps all say the owner judges acceptance.
- Evidence for a human step is written back as a comment with a link to the evidence. A probe task also records the finding in `Result` (user confirmed).
- Evidence for a human step follows the acceptance signal's rule: someone else can check it. This is the same observability requirement, not a separate rule.
- For `one_way`, task design requires the task to name who confirms and what they confirm. The actual block before starting is enforced by task execution (user confirmed).
- A task carries no dependency edges. The tasks under one map are parallel branches, and where order is real either the work is one action with several steps or the map splits into child maps that carry the edge (user confirmed). This replaced an earlier decision that left dependency writing to the split skill or the owner.
- Task design adopts the vertical slice from `to-tickets` without its vocabulary: a task ends at a result that can be handed over whole, even when the action crosses several stages. A slice that finishes one stage and waits for a sibling is a step, not a task. The earlier decision against tracer-bullet slicing was reversed: the slicing idea applies to any work, only the engineering layer words do not (user confirmed).
- A task hangs under exactly one map, so a task under a task is an error. A task may link to items outside its map for provenance or shared subject; a link never expresses order and does not affect readiness (user confirmed).
- A task carries no date fields. The start is the moment the ticket is claimed, and a deadline would need an overdue check this layer does not have; a hard external date goes into Action or Boundaries (user confirmed).
- A cold read by a reader with no other context is the check this skill is accepted against. The first such read found eleven contradictions, four of them blocking a ticket from being written correctly; all were fixed and the files now show a whole ticket, section order, and heading level (user confirmed).
- The skill lives at `weave-your-work/task-design/` as a flat directory: `SKILL.md`, `body.md`, `kind.md`, and `properties.md`. Skills are siblings on disk even when one builds on another, so no nesting (user confirmed).
- `task_kind` is frozen once written. Changing it means closing the task and opening a new one with the other kind, because the two kinds differ in section list and failure meaning (user confirmed).
- Examples are written in a later pass and are not children of this map. The planned file names are `task-example-delivery.md` and `task-example-probe.md`; `SKILL.md` links them once they exist (user confirmed).

- The repository root `GLOSSARY.md` stays the one place that fixes the words these skills use. It is authoring material and does not ship, so skill text that leans on a word defines it where it is used (user confirmed).
- Skill text must stand on its own once installed. `npx skills add` copies the skill's own directory and nothing beside it, and it skips a symlink that points outside that directory, so a reference to a file elsewhere becomes a dead link. The entry dropped its pointer to the root glossary, and `properties.md` defines `owner` in place (user confirmed).
- The older `task-example.md` under `use-weave-your-work-examples/` still teaches a shape this skill no longer allows: it has a `Verifiable result` section, puts kind and reversibility in the body instead of front matter, says `two-way door`, and says author. It is left as it is for now, and the worked examples for this skill wait for a later pass (user confirmed).

- Review writes two things on a task ticket, and both belong to this skill's references: `## Review`, a section holding the verdict and one line per axis with its source, written before the close and kept on the closed ticket; and `outcome=failed`, set only when the verdict is `wrong direction`. `outcome` therefore joins the task properties even though it was first defined for maps: an optional string whose one accepted value is `failed`. Source: user confirmation, recorded in [Task review skill](tickets/map/wm-3kaftv6fzfx2.md).

## Not yet specified

(none; the design is settled, and the reference update is filed as a child)

## Out of scope

- Writing the delivery and probe examples.
- Deciding which tasks to create when splitting a map.
- Claiming, execution, dependency handling, and closing tasks.
