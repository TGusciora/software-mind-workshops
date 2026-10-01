# CLAUDE.md

## Mission
This repository supports one goal: **become the dominant pizza restaurant business in Texas.**

## Vision
**Sell $3M of pizza within the next 360 days** (by 2027-09-11).

Every decision, recipe, and piece of work here should move us toward that number. When choosing between options, prefer the one with the clearer impact on revenue.

## Repository layout
- `brain.md` — index of every markdown file, grouped by structure, architecture, business plans and recipes. Start here to find a file.
- `recipes/` — all pizza recipes. Look here before creating or changing any recipe.
- `.claude/rules/` — rules Claude must follow when working in this repo. Read the relevant rules before starting a task.

## Testing: the single check
- **Command:** `sh scripts/check.sh`. It is the only way to decide whether code is good to commit. Agents (executor, reviewer, coordinator) run it after any code change and before every commit, and report its result instead of running suites by hand.
- **Pre-commit hook:** `.githooks/pre-commit` runs the same check and blocks the commit if it fails. Enable once per clone: `git config core.hooksPath .githooks`. Never bypass it (`--no-verify`).
- **Keeping it current:** the script auto-discovers suites (any dir with `test_*.py`, any `package.json` with a `test` script), so new tests are picked up automatically. A change that adds a new kind of check (lint, type check, a new language or test runner) must extend `scripts/check.sh` in the same commit.
- A failing check is never "done". Fix the code or the test; don't skip or delete tests to get green.
