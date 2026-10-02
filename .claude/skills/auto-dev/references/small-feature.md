# Route 4: Small feature

Goal: implement one bounded feature right away with a single `executor`. No spec, no planner, no coordinator. Speed is the point, so don't build ceremony around it.

## Is it really small?

Proceed only if all of these hold. If any fails, say which one and switch to Route 1 (needs decisions) or Route 2 (tickets exist):

- You can state the feature and 2 to 5 acceptance criteria now, without asking the user product questions.
- It likely touches a handful of files in one area.
- It needs no new dependency and no schema or API change other parts depend on.

One quick clarifying question is fine if the answer changes what gets built. A questionnaire is not.

## Steps

1. **Branch.** On `main`, create `feat/<slug>`. Record the base: `git rev-parse HEAD`.
2. **Write the inline ticket** in your head or in the prompt, using the planner's ticket shape: Context, Scope (files), Acceptance criteria (3 to 6 checkable bullets), Test plan with the command to run, and Out of scope. No ticket file is needed; the prompt is the ticket. Tell the executor so, since its instructions mention a ticket path.
3. **Launch one `executor`** with: the inline ticket, the base commit, and the context pack (SKILL.md section 2: mission, matching rules, guardrails). Point it at the project test commands (`cd pizza-creator/server && npm test`, `cd pizza-creator/client && npm test`, `cd orders-mcp && uv run --with pytest --with "mcp<2" pytest -q`, and so on, whichever fits the area).
4. **Bring the changes in** if the executor reports a worktree path or branch.
5. **Verify.** Read the executor's report, then check it yourself: `git diff <base>`, and run the tests it claims pass. Report failures as failures; send the executor back with the exact failure if needed.
6. **Size gate.** Run `sh .claude/skills/execution-tidy/scripts/diff-size.sh --base <base>`.
   - PASS: the feature was small. Report it, and offer a `reviewer` pass.
   - FAIL: it wasn't small. Show the report and propose a split. Don't ship it as one change.
7. **Report**: what was built, the files changed, the tests and their result, the tidy verdict.

## Commits

Commit only if the user asks, as `feat(<scope>): <what it does>`. Never push.
