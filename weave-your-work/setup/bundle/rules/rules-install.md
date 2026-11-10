# Resolve the Project Before Installing

The skills may be installed globally or in a project. Project data, runtime files, dependencies, and rules belong to the project they serve. Resolve one project root before setup or normal use so a globally installed skill cannot use its own location or an enclosing project by accident.

## What to do

1. **First-time setup:** Before `.work-weave/` exists, show the current directory and ask the person to confirm it or name the project root. Do not silently select an enclosing Git repository. The setup flow creates any missing project markers only after confirmation. If the selected directory is inside an enclosing Git repository but has no Git worktree root of its own, stop and ask whether to use the enclosing root or create an independent repository; do not run `git init` automatically. If the selected root has no local Waymark configuration but an ancestor does, stop and ask whether to use the enclosing project or initialize a separate tracker there.

2. **Normal discovery:** From the working directory, search upward for the nearest `.work-weave/` and validate that project. If none exists, stop and ask the person to run setup or provide an explicit project. Do not fall through to a more distant project when the nearest marker is invalid. Nested projects use the closest marker. An explicit project path means that exact directory: validate it without searching upward.

3. **Validate the root:** `.git`, `.waymark/config.toml`, and `.work-weave/` must all belong directly to the selected project root. The Git marker may be a `.git` directory or a `.git` file for a worktree. Confirm that Git's worktree root is the selected directory. Do not use Git, Waymark, or work-weave markers found only in different ancestor directories. Resolve physical paths before comparing them.

4. **Keep shared and local files in their settled locations:**
   - Shared project data lives in Git. `.work-weave/issue/handles.toml` and `.work-weave/glossary/` are shared. The generated `GLOSSARY.md` stays at the project root and is ignored by `/GLOSSARY.md` in the root `.gitignore`.
   - Checkout-specific files live under `.work-weave/` and stay out of Git. Its `.gitignore` ignores `pending/`, `runtime/`, and `local/`. This covers the pending queue, per-checkout issue and glossary tool copies and dependencies, and local service configuration.
   - `AGENTS.md` stays at the project root, and rules stay in `<project>/.agents/rules/`. A global skill install changes only where skill files live. It does not move project rules into `~/.agents/`.

5. **Use the selected project's runtime and data:** When both project-local and globally installed skills are present, the harness chooses which skill it loads. Do not impose a precedence. The selected skill uses the current project's `.work-weave/`; do not resolve its project data relative to the installed skill directory. Services and MCP registrations use the project path confirmed during setup.

6. **Keep secrets local:** Do not put Smee channel URLs in Git, tickets, or logs. A listener rejects and logs an event whose repository is missing or does not match its configured repository; this check isolates repositories but does not authenticate the sender.

## Why

A nearest-marker search and exact validation keep nested projects separate and prevent missing local configuration from being supplied silently by an enclosing project. Shared files remain available to every clone, while each checkout keeps its queue, runtime copies, dependencies, and service configuration separate.
