---
schema: 1
id: wm-bzhv0mrkga2w
title: Remove the lookup command and tool
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T07:06:51Z
updated_at: 2026-11-17T07:07:45Z
closed_at: 2026-11-17T07:07:45Z
parent: wm-w8p1a8by9ang
---
## Action

Take `lookup` out of the command line and `glossary_lookup` out of the MCP server. Remove the exact-match search they shared, because nothing else used it.

The reason is in the spec: a lookup that answers "not found" for a word the view lists as a rejected name is worse than no lookup, because the reader treats the answer as complete. The view holds every fact a lookup could return.

## Acceptance signal

Three checks:

- Running `lookup` through the command line prints usage and exits with the usage status, rather than answering.
- The MCP server registers `glossary_list`, `glossary_write`, and `glossary_merge`, and nothing else.
- The suite still passes, because no test used the lookup.

## Result

Done. `lookup` was removed from the command line and its usage line was updated. `glossary_lookup` was removed from the server. `find` was removed from the store, because the lookup was its only caller.

Verified: running `lookup` prints the usage text and exits with status 2. The server registers three tools. Twelve tests pass, unchanged, because none of them used the lookup.
