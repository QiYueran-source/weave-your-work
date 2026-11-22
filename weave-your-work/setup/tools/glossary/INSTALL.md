# Glossary install

Install the glossary's directories, its tool, and an optional post-merge hook.

Installing and starting are separate. This file installs. The MCP server starts
only when the harness has it registered; the tool works from the command line
either way.

## What this installs

| Path | Holds | Committed |
|---|---|---|
| `.work-weave/shared/glossary/` | the sources, `<operator>.jsonl` and `_header.md` | yes |
| `.work-weave/personal/glossary/` | the tool and its dependencies | no |
| `.git/hooks/post-merge` | the hook that rebuilds `GLOSSARY.md` | no |

`GLOSSARY.md` at the project root is generated from the sources and is ignored by
the root `.gitignore`.

## The tool

Node 20.18 or newer, and the npm that ships with it. Run every command from the
project root; `<setup>` is resolved as `INSTALL.md` says.

```sh
mkdir -p .work-weave/shared/glossary .work-weave/personal/glossary
cp <setup>/tools/glossary/*.js <setup>/tools/glossary/*.cjs .work-weave/personal/glossary/
cp <setup>/tools/glossary/package.json <setup>/tools/glossary/package-lock.json .work-weave/personal/glossary/
cd .work-weave/personal/glossary && npm ci --omit=dev
```

Read the exit status of `npm ci`. A failed install can leave a partial
`node_modules`, so the directory appearing proves nothing. A cache directory the
user cannot write is the usual cause; `npm ci --cache <a directory you own> --omit=dev`
gets past it.

The `project-root.cjs` copy must stay byte-identical to
`<setup>/tools/utils/project-root.cjs`. No test compares them; keep them equal by hand.

## The ignore lines

Add each only when absent:

```sh
grep -qxF 'personal/' .work-weave/.gitignore 2>/dev/null || printf '%s\n' 'personal/' >> .work-weave/.gitignore
grep -qxF '/GLOSSARY.md' .gitignore 2>/dev/null || printf '%s\n' '/GLOSSARY.md' >> .gitignore
```

## The MCP server

`server.js` speaks MCP over stdio. Register it in the harness with the project's
absolute paths; a relative path breaks as soon as the harness starts somewhere
else.

```json
{
  "mcpServers": {
    "glossary": {
      "command": "node",
      "args": ["<project>/.work-weave/personal/glossary/server.js", "--project", "<project>"]
    }
  }
}
```

The server answers three tools: `glossary_list`, `glossary_write`, and
`glossary_merge`. Check 16 of `work-weave-rules-checklist.md` is that answer.

Registering the server is a harness config edit; leave it to the person when the
harness's file is not yours to write.

## The post-merge hook

Optional. It rebuilds `GLOSSARY.md` after a pull, so a clone does not read a stale
view.

`post-merge.sh` carries a placeholder, `@GLOSSARY_RUNTIME@`, that must be replaced
with the project's absolute glossary runtime path before installing:

```sh
runtime="$(pwd)/.work-weave/personal/glossary"
sed "s|@GLOSSARY_RUNTIME@|$runtime|" <setup>/tools/glossary/post-merge.sh > .git/hooks/post-merge
chmod +x .git/hooks/post-merge
```

Write it only when `.git/hooks/post-merge` is absent. If it exists and differs,
that is a conflict for the person to settle: another tool may own the hook, and a
merge in its place would drop that tool's work.

The hook exits 0 without doing anything when the project has no
`.work-weave/shared/glossary/`, so a clone without the glossary stays quiet.

Windows has no native shell for `.git/hooks/post-merge`. Skip the hook there and
run the merge by hand after a pull:

```sh
node .work-weave/personal/glossary/glossary.js --project <project> merge
```

## Verify

```sh
node .work-weave/personal/glossary/glossary.js --project <project> list
```

It prints the terms in the project's sources, an empty list on a fresh install.
