---
schema: 1
id: wm-7de24s214ntw
title: 'Grilling: write each round into a testimony'
category: ticket
status: open
owner: frank
creator: frank
created_at: 2026-11-17T07:23:37Z
updated_at: 2026-11-17T07:23:37Z
parent: wm-14axybwpn8xa
dependencies:
  - wm-xap1hkbv3pe0
---
## What to build

A testimony record that holds the discussion. It is created as a testimony record once the subject can be named in one sentence, and its body is written as each round happens rather than at the end.

The body has five sections: `Subject`, `Rounds`, `Settled`, `Open`, `Handed off`. Each question in `Rounds` carries a `Parent` line naming the question it hangs off, or `none`; the design tree is reconstructed from those lines rather than written a second time. `Subject` names the record the discussion serves when there is one, and states only what is being decided when there is not.

An example testimony ships beside the skill, so a writer and a reviewer can see the shape filled in.

## Acceptance criteria

- [ ] The testimony is created as a testimony record, after the subject is named
- [ ] The five sections are named and their contents defined
- [ ] Every question carries a `Parent` line, with `none` for a root question
- [ ] The skill says the body is written per round, not batched
- [ ] An example testimony exists beside the skill and follows the shape
