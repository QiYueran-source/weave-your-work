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

Select the skills and agent environments you want to install when prompted. Include `setup` and `ask-me` to follow the steps below. The command installs from the repository's default branch; it does not require an npm package release. Drop `-g` to install into the current project instead.

## Get started

Ask your agent to run the `setup` skill for your project. Setup guides you through installing and configuring Git, waymark, Node.js and the GitHub CLI, then initializes or joins the project and installs the required rules and tools. Some steps, such as signing in to GitHub, require you to act.

Once setup is complete, ask the agent to use `ask-me` to find the right starting point for your work. For the available skills and their instructions, see [weave-your-work/](weave-your-work/).

## License

[Apache License 2.0](LICENSE).
