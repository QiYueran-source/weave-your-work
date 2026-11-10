# Glossary rules

Write a term when it resolves during a discussion, one term at a time.

- One term per line in `.work-weave/glossary/<operator>.jsonl`.
- Only terms this project coins or narrows. General vocabulary stays out.
- Define what the term is, not what it does. One or two sentences.
- The glossary is a vocabulary, not a spec. Do not write commands, file paths, or step lists. If a definition needs a command or more than two sentences, it is a spec; move the detail to the ticket or reference.
- List the words that mean the same thing under `avoid`.
- Keep one canonical name per concept. If two names exist, pick one and list the other under `avoid`.
- Write only your own source file. Never edit another operator's file and never edit `GLOSSARY.md` by hand.
- Use `group` only when terms form a cluster; leave it out otherwise.
- Check the existing glossary and the project's actual behavior before adding a term; a definition that contradicts the work is not settled.
