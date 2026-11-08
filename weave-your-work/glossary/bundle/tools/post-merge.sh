#!/bin/sh
# Rebuild GLOSSARY.md after a merge. The setup replaces @GLOSSARY_SKILL@ with
# the absolute path to this skill and installs the result as .git/hooks/post-merge.
root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
[ -d "$root/glossary" ] || exit 0
exec node "@GLOSSARY_SKILL@/bundle/tools/glossary.js" --project "$root" merge >/dev/null
