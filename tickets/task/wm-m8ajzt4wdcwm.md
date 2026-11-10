---
schema: 1
id: wm-m8ajzt4wdcwm
title: Tag every release from changesets
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T05:17:22Z
updated_at: 2026-11-10T05:17:22Z
parent: wm-10np2bs10s0e
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Make every change that lands reach a tag whose release page says what changed, without anyone writing a changelog by hand.

1. Add `package.json` at the repo root: `name` `weave-your-work`, `version` `0.1.0`, `private: true`, `license: "Apache-2.0"`, and scripts `changeset: "changeset"`, `version: "changeset version"`.
2. Add `.changeset/config.json`: default changelog `@changesets/cli/changelog`, `commit: false`, `access: "restricted"`, `baseBranch: "main"`, `privatePackages: {version: true, tag: true}`.
3. Add `.github/workflows/release.yml`, running on push to `main` with `concurrency: ${{ github.workflow }}-${{ github.ref }}` and `permissions: contents: write, pull-requests: write`. It checks out, sets up Node 22 with the `npm` cache, runs `npm ci`, and runs `changesets/action@v1` with `version: npm run version`, `publish: npx changeset tag`, and the commit and PR title `chore: version skills`.
4. Commit `package-lock.json` so `npm ci` in the workflow has something to install from.

The changelog is the default one, not `@changesets/changelog-github`. The GitHub plugin calls the GitHub API at version time and fails without a token; measured locally, it errors with `Please create a GitHub personal access token`. The default changelog writes the same entries with a commit hash instead of a PR link and needs no token.

## Acceptance signal

A pull request carrying one `.changeset/*.md` file, merged to `main`, makes the workflow open a second pull request titled `chore: version skills` whose diff bumps `package.json`'s version and writes the entry into `CHANGELOG.md`. Merging that one runs `npx changeset tag` and leaves an annotated tag `v0.2.0` on the repository, whose release page shows the same changelog entry.

Two evidence points, both openable by a reader who did not do the work: the two pull requests, and `https://github.com/QiYueran-source/weave-your-work/releases/tag/v0.2.0`.

## Boundaries

- Nothing is published to npm. The package is private, and the tag is the release.
- No plugin manifest and no marketplace entry.
- The first version is `0.1.0`, not `1.0.0`: the set is not claiming a stable surface yet.
