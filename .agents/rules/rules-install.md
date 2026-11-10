# Install Skills Globally, Keep Dependencies and Rules in the Project

The skill set is a tool for every project on the machine, so it may be installed once, outside any project. What it needs in order to run is not a tool: dependencies belong to the project that uses them, and rules are read out of the project. A global install that also puts dependencies or rules in the home directory breaks the next project silently, because nothing there is ever read.

## What to do

1. **Resolve the project root before any step runs.** From the directory the person means:

   ```sh
   git rev-parse --show-toplevel 2>/dev/null || pwd
   ```

   Print the absolute path and ask the person to confirm it is the project they mean. Every later step runs from there. This is the one value the flow cannot infer: the same skill may start in a subdirectory, in a directory above two nested projects, or outside a project entirely.

2. **Skill files may live outside the project.** `npx skills add <repo> -g` writes to `~/.agents/skills/`. That is allowed and needs no workaround. The skill set is a tool, not a project file.

3. **Dependencies live inside the project.** A package that a bundle tool imports is installed under the project root, and `node_modules` is gitignored there. Do not run `npm install` against any directory under `~/.agents/skills/`: a restored `node_modules` is stale the moment the set is upgraded, it is invisible to the project's own lock file, and it is never removed. A tool that needs a package resolves it from the root found in step 1, for example:

   ```js
   import { createRequire } from 'node:module'
   const require = createRequire(path.join(root, 'noop.js'))
   const entry = require.resolve('<package>')
   ```

   `NODE_PATH` does not do this for ES modules. Do not build a step on it.

4. **Every absolute path is written once, at setup.** The MCP registration's `--project`, the service unit's `WorkingDirectory`, and a hook's skill path each record the value from step 1. Nothing recomputes it at run time, and a relative path in a skill is never read against the current directory.

5. **Rules land in the project, never under `~/.agents/`.** A global install changes where the skill files live and nothing else. The source of a rule becomes `~/.agents/skills/<skill>/bundle/rules/`, the copy still goes to `<project>/.agents/rules/`, and the pointer still sits at `<project>/AGENTS.md`. `~/.agents/rules/` has no reader. The harness discovers `.agents/skills/` on its own, but `.agents/rules/` takes effect only because `AGENTS.md` tells the agent to read it. For the same reason `AGENTS.md` belongs at the project root: `<project>/.agents/AGENTS.md` is never read, and `~/.agents/AGENTS.md` is read by every project on the machine, so it must not carry one project's rules.

## Why

The failure this rule prevents does not announce itself. A globally installed set with dependencies under `~/.agents/skills/` runs correctly on the machine where it was installed and fails on the next one with a module that cannot be found. A rule copied into `~/.agents/rules/` is written, appears installed, and is never read. Both look like success until someone tries to work in a fresh project.
