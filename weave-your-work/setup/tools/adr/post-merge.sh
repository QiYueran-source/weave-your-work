#!/bin/sh
# Rebuild ADR.md after a merge. The setup replaces @ADR_RUNTIME@ with the
# project's absolute runtime path and installs the result as .git/hooks/post-merge.
root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
[ -d "$root/.work-weave/shared/adr" ] || exit 0
exec node "@ADR_RUNTIME@/adr.js" --project "$root" merge >/dev/null
