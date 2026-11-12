# What the principle review left unresolved

The state after `088819f` on `v2-resources-and-actions`. Everything here is open; the records named carry the detail.

## Checked and confirmed open

- **`npm run check:records` is red on this branch.** Against the baseline it reads 0 new and 213 known across 155 records; without the baseline it fails with those 213. The recorded cause is that the tracker declares `split_as` as a field but 55 of the 57 maps that have children carry no value, and 149 records predate the current shapes. `.waymark/config.toml` does declare all six custom fields, so the earlier guess that the field was undeclared was wrong: the records are what is missing. Migrating them is `wm-t2zhf370jy0j` (its `split_as` item) and a migration that no record owns yet. What is verified: the config file, the two counts, and the findings. The per-cause breakdown is recorded in `docs/principle-review.md`, not re-measured here.
- **`scripts/test.mjs` runs 81 of the 96 tests, not 86 of 86.** Adding up each file run on its own: 5 + 14 + 2 + 11 + 8 + 6 + 6 + 4 + 9 + 21 = 86 tests are written, and 8 of them are `t.ok` assertions inside parent tests, so 78 top-level tests exist. The runner reports 81 passes against 10 files. Running every file and directory the runner collects in one command reports 86 tests, all passing. Two tests stand out as possibly missing from the count — the lock take-over pair — but I did not confirm which ones. Fixing the runner means either passing each file to its own `--test` invocation or moving to `--test-isolation`; I did not change it.
- **No batch has walked every skill end to end.** The batch was a real open task before this review: `wm-5nz6m9f8n7a4`, under `wm-p4r56pz7v480`. The review added `wm-wgzv0x38ce0y` to plan it in the current tree and `wm-0789yf2qh646` to bring the READMEs and the two documents in line with it. Neither is done.
- **Principle three is stated and never exercised.** No document names the `mattpocock/skills` skill any change followed. Recorded on `wm-yb9eswa9esj6` as fog.
- **The six faults a rule-by-rule read found are not repaired.** The `Source:` line, the `Action` shape written twice, the layout copies in `open-map`, where the `split_as` rule is decided, what each of the three checks in `.github/workflows/verify.yml` is for, and the stale row in `docs/v2-conformance.md`. All on `wm-t2zhf370jy0j`.

## Recorded in the review, needing a decision

- Where a field's "when to write" lives, since `PRINCIPLES.md` gives it to the record and `waymark/res/fields.md` holds it.
- Whether an action restating one clause of the `parent` rule is a second copy.
- Whether the `Transformation` blocks are a machine contract, since no check reads them.
- Whether `use-weave-your-work-examples/` should be migrated or retired; it predates v2 and its own `SKILL.md` says so.

## Not yet checked

- **The install gate.** `npx skills add ./weave-your-work` was not run in this session. `AGENTS.md` says an unquoted description with a colon-space fails parsing; the three front matters I touched were edited in place and `check-references.mjs` reads `family` and `invocation`, but neither proves the install. Run it before release.
- **`check-setup.mjs --starred` / `--all`.** Not run in this session either; it reads this checkout's state, not the skills, but a failing check would change what `setup` reports to a person.
- **The second branch `check-9-plan-gate` and the unmerged `main`.** The review ran on `v2-resources-and-actions` only. Whether these four commits belong on `main`, and whether that branch's check protection would accept `check:records` red, is a review of the branch, not of the skills.
