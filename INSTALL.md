# Install

How to install the skill set. This file is the one place the command is
written; `README.md`, `README.zh-CN.md`, and the rules point here.

## What it needs

- Node.js 22.20 or newer, with the npm that ships with it.
- Git, and a Git repository to work in.
- The [GitHub CLI](https://cli.github.com/) signed in (`gh auth login`) when the
  project uses issues to talk between owners.

`setup` installs and signs in what is missing for the project it configures.
`setup`'s `check-project.md` reports what is still missing.

## Install the skills

Once per machine:

```sh
npx skills add qiyueran-source/weave-your-work -g
```

Select the whole set, and select the agent environment you work in. Drop `-g`
to install into the current project instead of the machine.

The command installs from the repository's default branch, so it does not wait
for a release. It copies the skills' files; it runs nothing and touches no
project's data.

The flags of `skills add` change from one version to the next. This file does
not copy them: run `npx skills add --help` for the one you have.

## After installing

Ask your agent to run the `setup` skill in the project. It confirms the project
root, installs what its checks find missing, initializes or joins the tracker,
copies the rules into `.agents/rules/`, installs the runtimes a project uses,
and writes the `AGENTS.md` pointer.

Some steps, such as signing in to GitHub or creating a remote, need a person.
Setup stops there and says so rather than doing them.

## Checking an install

`check-project.md` in the setup skill runs the checks and reports each one with
its repair; it changes nothing. Run it after an install and after a clone,
before trusting that the project can run the set.

## Updating

Run `npx skills update`, or the same `add` command again, to take a newer set.
A skill installed for the machine still uses the project it was started in, and
its data stays in that project's `.work-weave/`; `rules-install.md` is the rule
that says so.
