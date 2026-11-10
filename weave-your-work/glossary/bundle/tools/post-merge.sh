#!/bin/sh
# Rebuild GLOSSARY.md after a merge. The setup replaces @GLOSSARY_RUNTIME@ with
# the project's absolute runtime path and installs the result as .git/hooks/post-merge.
root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
[ -d "$root/.work-weave/glossary" ] || exit 0
exec node "@GLOSSARY_RUNTIME@/glossary.js" --project "$root" merge >/dev/null
