# CLAUDE.md

## Mission
This repository supports one goal: **become the dominant pizza restaurant business in Texas.**

## Vision
**Sell $3M of pizza within the next 360 days** (by 2027-09-11).

Every decision, recipe, and piece of work here should move us toward that number. When choosing between options, prefer the one with the clearer impact on revenue.

## Operating mode: autonomous development
We develop autonomously here. Agents decide for themselves and keep moving; a human is pulled in only for **crucial or breaking changes**.

- **Decide, don't ask.** For every open question, weigh each possible answer against the mission and vision above and pick the one that best fits revenue toward $3M by 2027-09-11. Record the choice and a one-line reason as an assumption in the spec or report. "Ask the user" is never the default.
- **Human intervention only for:** breaking changes to existing behaviour, APIs, data or schemas; destructive or irreversible actions; new dependencies with cost or licence; security, secrets or credentials; spending money or anything outward-facing (deploys, pushes, publishing); anything that would remove pineapple from a recipe (`.claude/rules/pineapple.md`); someone else's uncommitted work at risk; or work blocked after 3 failed review rounds.
- **Approval is implicit.** Specs and ticket backlogs need no user sign-off; agents proceed from spec to tickets. Hooks and guardrails still apply (never read `.env`, never `rm -rf`, never push, never commit to `main`).
- **Loops run unattended.** The coordinator works through every ticket without handing back between them. Executor and reviewer report `ESCALATE: <reason>` only for contract-breaking or vision-breaking changes; the coordinator blocks that ticket, continues with the rest, and lists escalations in its final report.
- **Report afterwards.** Summarise the decisions taken so the user can overrule them.

## Repository layout
- `brain.md` — index of every markdown file, grouped by structure, architecture, business plans and recipes. Start here to find a file.
- `recipes/` — all pizza recipes. Look here before creating or changing any recipe.
- `.claude/rules/` — rules Claude must follow when working in this repo. Read the relevant rules before starting a task.

## Testing: the single check
- **Command:** `sh scripts/check.sh`. It is the only way to decide whether code is good to commit. Agents (executor, reviewer, coordinator) run it after any code change and before every commit, and report its result instead of running suites by hand.
- **Pre-commit hook:** `.githooks/pre-commit` runs the same check and blocks the commit if it fails. Enable once per clone: `git config core.hooksPath .githooks`. Never bypass it (`--no-verify`).
- **Keeping it current:** the script auto-discovers suites (any dir with `test_*.py`, any `package.json` with a `test` script), so new tests are picked up automatically. A change that adds a new kind of check (lint, type check, a new language or test runner) must extend `scripts/check.sh` in the same commit.
- A failing check is never "done". Fix the code or the test; don't skip or delete tests to get green.

## Acceptance criteria and evidence
- Every ticket lists its acceptance criteria as markdown checkboxes under `## Acceptance criteria`. The checkboxes are the contract.
- `sh scripts/criteria.sh <ticket> [--save|--verify]` is the deterministic extractor: it lists unticked criteria (ticked `[x]` are skipped), writes `evidence/<ticket>.md` next to the ticket, and verifies every open criterion has evidence.
- Executors fill in the evidence for each criterion (test name and result, `file:line`, or command output). Reviewers run `--verify`, then check the evidence itself before advising `APPROVED`. The coordinator ticks the boxes after approval.
