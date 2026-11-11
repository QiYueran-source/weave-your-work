---
schema: 1
id: wm-s67b2w6jgta3
title: Write the Chinese intro for the Xiaohongshu skill listing
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T15:21:03Z
updated_at: 2026-11-10T15:21:03Z
parent: wm-wjwa9081hse1
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Publish nothing; write the card text the person will paste into the Xiaohongshu skill listing.

1. Write `docs/xiaohongshu-intro.zh-CN.md` with one Chinese card text of 200 characters or fewer, and state its character count.
2. The card says what the set is, the chain a reader gets (goal and completion standard, one action that can be checked, records left in the project, a person deciding acceptance), the 22 skills, and that it is not only for code.
3. It ends with one sentence: the Xiaohongshu skill does not support JS, so the Node-backed tools are not available there, and the full version is at `QiYueran-source/weave-your-work`.
4. Keep the text in a fenced block so it copies without the notes around it.

## Acceptance signal

The card is 200 characters or fewer counting punctuation and line breaks, reads as plain Chinese, names `QiYueran-source/weave-your-work`, and the count written under the block matches the text. A reader who has never seen the set learns what it does, that the records stay in the project, and that a person decides acceptance.

## Boundaries

- No Chinese translation of the skills or the README; one card only.
- No posting to Xiaohongshu; the person publishes it.
- No install command and no version number in the card; the repository link carries them.
