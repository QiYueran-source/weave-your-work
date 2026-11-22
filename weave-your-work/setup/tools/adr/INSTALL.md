# ADR install

Install the decision-record directories, their tool, and an optional post-merge
hook.

Installing and starting are separate. This file installs. The MCP server starts
only when the harness has it registered; the tool works from the command line
either way.

## What this installs

| Path | Holds | Committed |
|---|---|---|
| `.work-weave/shared/adr/` | the decisions, one file each | yes |
| `.work-weave/personal/adr/` | the tool and its dependencies | no |
| `.git/hooks/post-merge` | the hook that rebuilds `ADR.md` | no |

`ADR.md` at the project root is generated from the records and is ignored by the
root `.gitignore`.

## The tool

Node 20.18 or newer, and the npm that ships with it. Run every command from the
project root; `<setup>` is resolved as `INSTALL.md` says.

```sh
mkdir -p .work-weave/shared/adr .work-weave/personal/adr
cp <setup>/tools/adr/*.js <setup>/tools/adr/*.cjs .work-weave/personal/adr/
cp <setup>/tools/adr/package.json .work-weave/personal/adr/package.json
cd .work-weave/personal/adr && npm ci --omit=dev
```

The tool carries two dependencies, `@modelcontextprotocol/sdk` and `zod`, so the
`npm ci` step is not optional. An earlier version of this install claimed the ADR
tool had no dependencies; that was true before it grew an MCP server.

Read the exit status of `npm ci`. A failed install can leave a partial
`node_modules`, so the directory appearing proves nothing.

The `project-root.cjs` copy must stay byte-identical to
`<setup>/tools/utils/project-root.cjs`. No test compares them; keep them equal by hand.

## The ignore lines

Add each only when absent:

```sh
grep -qxF 'personal/' .work-weave/.gitignore 2>/dev/null || printf '%s\n' 'personal/' >> .work-weave/.gitignore
grep -qxF '/ADR.md' .gitignore 2>/dev/null || printf '%s\n' '/ADR.md' >> .gitignore
```

## The MCP server

`server.js` speaks MCP over stdio. Register it in the harness with the project's
absolute paths.

```json
{
  "mcpServers": {
    "adr": {
      "command": "node",
      "args": ["<project>/.work-weave/personal/adr/server.js", "--project", "<project>"]
    }
  }
}
```

The server answers four tools: `adr_list`, `adr_show`, `adr_write`, and
`adr_merge`. Check 15 of `work-weave-rules-checklist.md` is that answer.

Registering the server is a harness config edit; leave it to the person when the
harness's file is not yours to write.

## The post-merge hook

Optional. It rebuilds `ADR.md` after a pull, so a clone does not read a stale
view.

`post-merge.sh` carries a placeholder, `@ADR_RUNTIME@`, that must be replaced
with the project's absolute ADR runtime path before installing:

```sh
runtime="$(pwd)/.work-weave/personal/adr"
sed "s|@ADR_RUNTIME@|$runtime|" <setup>/tools/adr/post-merge.sh > .git/hooks/post-merge
chmod +x .git/hooks/post-merge
```

Write it only when `.git/hooks/post-merge` is absent. If it exists and differs,
that is a conflict for the person to settle: another tool may own the hook, and a
merge in its place would drop that tool's work.

A project that installs both the glossary and the ADR rebuilds has one hook and
two things to run in it. Merge the two scripts into that one file by hand rather
than letting the second install overwrite the first.

Windows has no native shell for `.git/hooks/post-merge`. Skip the hook there and
run the merge by hand after a pull:

```sh
node .work-weave/personal/adr/adr.js --project <project> merge
```

## Verify

```sh
node .work-weave/personal/adr/adr.js --project <project> list
```

It prints the records in the project's store, an empty list on a fresh install.
