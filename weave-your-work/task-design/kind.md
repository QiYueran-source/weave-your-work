# Task kind

Every task is one of two kinds, `delivery` or `probe`. The kind decides which sections the body carries and what failure means. Sections are defined in `body.md`; field-level rules are in `properties.md`. This file covers the choice.

## The question

Ask what the task commits to: an output, or an answer.

A delivery task commits to producing an output the map has already settled on, and you can name that output before the work starts. "Export the September invoice batch as `september-invoices.csv`" commits to a file.

A probe task commits to getting an answer the map does not have yet. You cannot name an output, because the answer depends on what reality turns out to be. "Find out whether reviewers open the checklist before commenting" commits to a finding. You ask three reviewers and watch what they do; which finding comes back is open.

The test is whether you can name the output now. If you can, choose delivery. If naming it needs something the map does not know yet, choose probe, and the answer is what the task leaves behind. Prefer delivery when the answer is genuinely already known. Prefer a probe when the outcome depends on what reality turns out to be.

## What failure means

For a delivery task, failure is an incident. The promised output is missing or does not meet its acceptance signal, so someone has to recover. The body states what the failure costs and what is done about it; `body.md` defines that section.

For a probe task, a negative finding is a normal and complete result. The task is done when the check is complete, whatever the answer, because the map asked for the answer and got one. Only a check that could not be completed calls for anything more, and `body.md` says what the body records then.

## Which stage of a map

Early in a map, `Not yet specified` holds the fog: content in scope but not yet specific enough to become a decision, a child map, a task, or an out-of-scope item. Work that turns fog into an answer leans probe. A map about improving code review might open with fog on whether a checklist helps. The probe asks three reviewers to comment on a sample change without one and notes what they do.

Once that answer lands as a decision, the map has committed to an output, and the work that produces it is a delivery task. After the decision, the same map's next task writes the checklist into the review template.

The boundary is whether the map already has the answer the task needs. While the answer is missing, the task that gets it is a probe. Once the answer is in hand and the output can be named, the task that produces it is delivery. A delivery task written before the answer exists is guessing at the output. A probe written after the answer exists spends a task to learn what the map already knows.

## Once written, the kind stays

The kind is frozen once it is written. If the work later needs the other kind, close the ticket and open a new one with the other kind. The kinds differ in the sections the body carries and in what failure means, so a body written for one does not serve the other. `properties.md` defines the `task_kind` field itself.
