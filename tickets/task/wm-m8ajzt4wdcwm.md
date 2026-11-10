---
schema: 1
id: wm-m8ajzt4wdcwm
title: Tag every release from changesets
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T05:17:22Z
updated_at: 2026-11-10T12:41:24Z
closed_at: 2026-11-10T12:41:24Z
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

## Result

Changesets now owns the version and the changelog. `package.json` starts at `0.0.0` and carries the changeset scripts plus `@changesets/cli`, `@changesets/changelog-github`, `yaml`, and a pinned `@types/node` (the last one keeps `npm ci` resolving the optional `@types/node` peer of `@inquirer/external-editor`). `.changeset/config.json` points the GitHub changelog at `QiYueran-source/weave-your-work`. `.github/workflows/release.yml` runs on push to `main`, installs with `npm ci`, and calls `changesets/action@v1` with `npm run version` and `npx changeset tag`.

The initial minor changeset went through PR #12; the workflow opened version PR #13, which bumped `package.json` to `0.1.0` and wrote `CHANGELOG.md`. Merging it produced the annotated tag `v0.1.0` and https://github.com/QiYueran-source/weave-your-work/releases/tag/v0.1.0, whose body is the changelog entry for PR #12 and commit `a4dd072`. The release has no assets, and the package stays private.

## Review

passed

- Goal: one changeset merged to `main` made the workflow open a version PR; merging that PR left an annotated `v0.1.0` tag and a release page carrying the same changelog entry. Evidence: PRs #12 and #13, run 42816713288, and the release URL.
- Convention: nothing was published to npm, no assets were attached, and `main` received the work through pull requests.

## Next step

- None. The next release starts from a new changeset on `main` and follows the same two pull requests.
