# Weave Your Work

[简体中文](README.zh-CN.md)

Weave Your Work is a set of AI agent skills for organizing and carrying out work with a team. Inspired by [Matt Pocock's software engineering skills](https://github.com/mattpocock/skills), it adapts ideas from that work to projects in any domain, not only software development.

The project explores AI-native ways of working: describe a goal in natural language, and work with an agent that uses waymark to record targets and tasks, Git to track changes, and the GitHub CLI to communicate. People retain decisions and acceptance; the records stay in the project.

For team collaboration, each waymark item has one owner who advances and accepts it. Teammates exchange requests and results through GitHub issues; the issue listener routes messages to the intended recipient. Ownership is a working convention, not an access-control boundary.

## Install

Install Node.js 22.20 or newer and npm, then run this once for your machine:

```sh
npx skills add qiyueran-source/weave-your-work -g
```

Select the skills and agent environments you want to install when prompted. Select the whole set to follow the steps below; at minimum include `setup`, `ask-me`, and the record references `waymark`, `map`, and `task`. The command installs from the repository's default branch; it does not require an npm package release. Drop `-g` to install into the current project instead.

## Get started

Ask your agent to run the `setup` skill for your project. Setup guides you through installing and configuring Git, waymark, Node.js and the GitHub CLI, then initializes or joins the project and installs the required rules and tools. Some steps, such as signing in to GitHub, require you to act.

Once setup is complete, ask the agent to use `ask-me` to find the right starting point for your work. The set is built two ways: records are defined once under each record skill's `res/`, and actions follow the mainline in [MAINLINE.md](weave-your-work/MAINLINE.md). Every rule is an assertion with the check that decides it; [ASSERTIONS.md](weave-your-work/ASSERTIONS.md) indexes them.

## What a review does now

A task or a map is judged on two axes, and each gives its own verdict: **goal** asks whether the acceptance signal or direction was met, **convention** asks whether the work followed the rules. Both have to pass for the record to close, and the record keeps both verdicts as they stand. A map's children are read as a set by `whole-review` before the map is judged, so two children that contradict each other are reported instead of both passing alone.

A record's decisions, review, and exclusions are never rewritten in place: a new fact adds an entry beside the old one, and an entry that no longer holds is struck with `Superseded on <date>` and replaced under it.

## License

[Apache License 2.0](LICENSE).
