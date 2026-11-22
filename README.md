![Weave Your Work: a woven blue cube mark on a dark background](assets/weave-your-work-banner-1280x400.jpg)

# Weave Your Work

[简体中文](README.zh-CN.md)

Weave Your Work is a set of AI agent skills for carrying work through with a
team: settle what is being decided, write it down as a spec, cut the spec into
tickets, do the work, and read the results. It is adapted from [Matt Pocock's
software engineering skills](https://github.com/mattpocock/skills), whose set is
written for code; this one is for office work of any kind, so its reviewers read
records rather than diffs and its tickets may be a person's to do.

The records live in the repository. Waymark keeps the specs and tickets, Git
keeps the changes, and the GitHub CLI carries messages between owners. People
hold the decisions and the acceptance; the agent does the work and writes down
what it found.

For team work, each record has one owner, who advances it and decides whether it
passes. Teammates send requests and results as GitHub issues, and an issue
listener queues what arrived for the next session. Ownership is a working
convention, not an access-control boundary.

## Install

Run this once per machine, then ask your agent to run `setup` in your project:

```sh
npx skills add qiyueran-source/weave-your-work -g
```

[INSTALL.md](INSTALL.md) is the one place that holds the command, what it needs,
and how to check a project afterwards.

## The mainline

The line this set promises runs in four steps. Each step is one skill, and the
next one reads what the last wrote.

| Step | Skill | What it does |
|---|---|---|
| 1. Write the spec | `to-spec` | Turns the conversation into a spec and publishes it: the problem, the solution, what is handed over, and how a reader tells it was |
| 2. Cut the tickets | `to-tickets` | Cuts the spec into whole tasks, each worked by one arranger and each naming the tickets that block it |
| 3. Do the work | `implement`, or `implement-spec` for a whole spec | `implement` does one ticket and stops at a ticket that is a person's; `implement-spec` works each batch of the frontier at once and closes the batch |
| 4. Read the results | `review` | Judges each ticket's result against its acceptance, and the work against the problem the spec names, on two axes |

A discussion that produces the spec happens before step 1, and `grilling` and
`grill-with-docs` run it. What enters the line is the spec; a goal that is not
yet settled is settled in conversation before there is one.

When you do not know where you are on the line, `ask-me` names the skill, or the
sequence, that fits the situation you describe.

A ticket that is a person's to do comes back through `hand-back`: the person
reports what they finished, its result is written, and the ticket closes.

## What is in the set

Fourteen skills. `setup` configures a project. The mainline is the four skills
in the table above. The rest support them:

| Skill | What it does |
|---|---|
| `ask-me` | Names the skill or sequence that fits the situation you describe, and stops |
| `grilling` | Interviews the person round by round until a plan is clear, and writes each round into a testimony as it happens |
| `grill-with-docs` | Runs `grilling`, then records the terms it fixed with `glossary` and the decisions that pass the three gates with `adr` |
| `glossary` | Keeps one vocabulary for the project; each operator writes their own source and the view is generated from all of them |
| `adr` | Records a decision that is hard to reverse, surprising without context, and the result of a real trade-off |
| `hand-back` | Records what a person finished on their own ticket, closes it, and names the next ticket |
| `communicate-with-issue` | Sends one owner a message as a GitHub issue, and answers one in its thread |
| `feed-me-back` | Reports a skill problem, or a good word, to the set's repository, once you approve the text |

## How a review works

A ticket's result is read on two axes and each gets its own verdict: whether it
meets its own acceptance, and whether the work addresses the problem the spec
names. `review` changes nothing: it reports findings, and each finding names the
ticket, who worked it, and whose it is to fix.

A result that cannot be checked is a finding, not a pass. A ticket closed with
no result at all is a finding of its own.

## Where the set departs from Matt's

The skills whose names match his are taken from his files and edited, and
`weave-your-work/UPSTREAM.md` records the commit they were taken from. What is
different, and why:

- **Records, not diffs.** His `code-review` reads a diff against a fixed point.
  This set's `review` reads a spec's tickets, because an edit made in place
  leaves nothing to fix a point against.
- **Tickets may be a person's.** His flow assumes an agent does the work alone.
  Here a ticket has one arranger, a person or an agent, and `hand-back` is how a
  person's ticket returns.
- **The tracker is in the repository.** His set lets you choose an issue tracker
  and writes tickets to it. This set keeps specs and tickets as records under
  `tickets/`, written through waymark, so a clone carries them.
- **Messages are issues.** `communicate-with-issue` replaces his `handoff`
  between people with a GitHub issue, so a request and its answer stay in one
  thread.

## Working in this repository

This repository is the source of the set, not a project that uses it.

```sh
npm test                      # the tool runtimes' tests
node scripts/check-references.mjs .
node scripts/check-records.mjs . --baseline scripts/check-records-baseline.json
```

The checks also run in CI on every pull request
(`.github/workflows/verify.yml`), which installs the set the way a stranger
would and checks what the install produced.

## License

[Apache License 2.0](LICENSE).
