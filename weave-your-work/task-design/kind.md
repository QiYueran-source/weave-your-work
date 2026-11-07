# Task kind

Every task is one of two kinds, `delivery` or `probe`. The kind decides which sections the body carries and what failure means. This file covers the choice. Sections are in `body.md`; the field itself is in `properties.md`.

## The question

Ask what the task commits to: an output, or an answer.

A delivery task commits to producing an output the map has already settled on, and you can name that output before the work starts. "Export the September invoice batch as `september-invoices.csv`" commits to a file.

A probe task commits to getting an answer the map does not have yet. You cannot name an output, because the answer depends on what reality turns out to be. "Find out whether reviewers open the checklist before commenting" commits to a finding. The task asks three reviewers and records what they say; which answer comes back is open.

The test is whether you can name the output now. If you can, choose delivery. If naming it needs something the map does not know yet, choose probe, and the answer is what the task leaves behind. Prefer delivery when the answer is genuinely already known. Prefer a probe when the outcome depends on what reality turns out to be.

## What failure means

For a delivery task, failure is an incident: the promised output is missing or falls short of its acceptance signal, so someone has to recover, and the body says what that costs and what is done about it.

For a probe task, a negative finding is a normal and complete result. The ticket closes when the check is complete, whatever the answer, because the map asked for the answer and got one. Incomplete is different from negative: a check that did not finish, or did not reach everyone it needed, is recorded as incomplete, and the acceptance signal is what draws that line.

## Which stage of a map

A map starts with parts of its target still unsettled. The map skill keeps those in its `Not yet specified` section until they are sharp enough to become a decision, a child map, or a task. Work that turns one of them into an answer leans probe. A map about improving code review might open with whether a checklist helps; the probe asks three reviewers to comment on a sample change without one and records what they say.

Once that answer lands as a decision, the map has committed to an output, and the work that produces it is a delivery task. After the decision, the same map's next task writes the checklist into the review template.

The boundary is whether the map already has the answer the task needs. While the answer is missing, the task that gets it is a probe. Once the answer is in hand and the output can be named, the task that produces it is delivery. A delivery task written before the answer exists is guessing at the output. A probe written after the answer exists spends a task to learn what the map already knows.

## Once written, the kind stays

The kind is frozen once it is written, because a body written for one kind does not serve the other: the section lists differ, and so does the meaning of failure. Changing it means closing the ticket and opening a new one with the other kind.
