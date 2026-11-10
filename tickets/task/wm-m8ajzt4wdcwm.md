---
schema: 1
id: wm-m8ajzt4wdcwm
title: Tag every release from changesets
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T05:17:22Z
updated_at: 2026-11-10T12:27:12Z
parent: wm-10np2bs10s0e
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Make every change that lands reach a tag whose release page says what changed, without anyone writing a changelog by hand.

1. Add `package.json` at the repo root: `name` `weave-your-work`, `version` `0.0.0`, `private: true`, `license: "Apache-2.0"`, and scripts `changeset: "changeset"`, `version: "changeset version"`. Dev dependencies: `@changesets/cli` and `@changesets/changelog-github`.
2. Add `.changeset/config.json`: changelog `@changesets/changelog-github` with `repo: "QiYueran-source/weave-your-work"`, `commit: false`, `access: "restricted"`, `baseBranch: "main"`, `privatePackages: {version: true, tag: true}`.
3. Add `.github/workflows/release.yml`, running on push to `main` with `concurrency: ${{ github.workflow }}-${{ github.ref }}` and `permissions: contents: write, pull-requests: write`. It checks out, sets up Node 22 with the `npm` cache, runs `npm ci`, and runs `changesets/action@v1` with `version: npm run version`, `publish: npx changeset tag`, and the commit and PR title `chore: version skills`. Set `GITHUB_TOKEN` on that step: the GitHub changelog plugin reads pull requests at version time.
4. Commit `package-lock.json` so `npm ci` in the workflow has something to install from.

`package.json` starts at `0.0.0`; the first changeset is a minor one, so the first tag is `v0.1.0`. The release page carries the generated changelog, the tag is annotated, and there are no assets: nothing is published to npm.

The workflow needs the repository setting "Allow GitHub Actions to create and approve pull requests"; it is enabled for this repository.

Local `npm run version` needs `GH_TOKEN` because the changelog plugin calls the GitHub API. Versioning normally runs in CI, where the token exists.

## Acceptance signal

A pull request carrying one `.changeset/*.md` file, merged to `main`, makes the workflow open a second pull request titled `chore: version skills` whose diff bumps `package.json`'s version and writes the entry into `CHANGELOG.md`. Merging that one runs `npx changeset tag` and leaves an annotated tag `v0.1.0` on the repository, whose release page shows the same changelog entry.

Two evidence points, both openable by a reader who did not do the work: the two pull requests, and `https://github.com/QiYueran-source/weave-your-work/releases/tag/v0.1.0`.

## Boundaries

- Nothing is published to npm. The package is private, and the tag is the release.
- No release assets, no plugin manifest, no marketplace entry.
