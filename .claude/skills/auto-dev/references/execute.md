# Route 2: Execute tickets

Goal: take one ticket, a list of tickets, or a whole `docs/tickets/<slug>/` backlog from `todo` to committed. The delivery loop is defined in `.claude/agents/coordinator.md`. This route launches `coordinator` as a subagent; the coordinator in turn launches `executor` and `reviewer` (one extra layer of subagents is allowed, and that is the only nesting this route uses).

## Steps

1. **Resolve the scope.** Find the tickets the user means: a single `T-NNN` path, a list, or `docs/tickets/<slug>/INDEX.md`. If there are none but a spec exists, run Route 1 step 4 (planner) first; no user go-ahead is needed. If neither exists, this is Route 1.
2. **Prepare the branch.** `git status`, `git branch --show-current`. On `main`, create `feat/<slug>`. Stop and ask only if the tree has unrelated uncommitted work that the change could overwrite. Do this yourself, before launching, so the coordinator starts from a clean, named branch.
3. **Launch `coordinator`.** Subagents start with an empty context, so the prompt must carry everything:
   - the scope: ticket paths, or the `INDEX.md` path, and whether to run all runnable tickets or only the named ones;
   - the branch name and the starting base commit (`git rev-parse HEAD`);
   - the context pack (SKILL.md section 2: mission, rules matching the files the tickets touch, guardrails), with the instruction to repeat it in every `executor` and `reviewer` prompt it writes, because those agents don't inherit it either;
   - the project test commands (`cd pizza-creator/server && npm test`, `cd pizza-creator/client && npm test`, and so on) for the executors;
   - the size gate: after each executor finishes and before launching `reviewer`, run `sh .claude/skills/execution-tidy/scripts/diff-size.sh --base <that ticket's base commit>`. On FAIL, set the ticket `status: blocked`, include the report in its final answer, propose a split, and don't review it. On PASS, continue. It must never edit `limits.conf` to make a change pass;
   - the commit convention: after `APPROVED`, one Conventional Commit per ticket naming the ticket id (`feat(map): load stores from JSON (T-002)`, or `fix`, `test`, `docs`, `chore` where they fit better);
   - the report it should end with: done, blocked and why, anything that needs a human.
4. **Relay questions.** Tell the coordinator to decide product questions itself and record them as assumptions. It stops only for crucial or breaking changes (see SKILL.md). If it returns with such a question, put it to the user, then continue the same coordinator with SendMessage so it keeps its state, including the answer.
5. **Verify; don't just trust the report.** When the coordinator finishes, check it yourself: `git log --oneline <start-base>..HEAD` shows one commit per approved ticket, ticket `status` fields and `INDEX.md` match what was reported, `git status` is clean apart from known leftovers, and spot-check one commit with `git show --stat`. If the coordinator reports an agent worktree path or branch whose changes did not reach the working branch, say so and bring them in before declaring done. Run the relevant test suite once on the final tree.
6. **Report to the user**: tickets done and their commits, blocked tickets and why, size-gate failures with the split you propose, and anything that needs a human (deploys, secrets, design decisions).

## Rules

- You don't write product code in this route, and neither does the coordinator. Only `executor` does.
- Tickets run sequentially: parallel executors on one tree step on each other.
- Never push, never force anything, never commit to `main`.
- After 3 failed review rounds on a ticket the coordinator marks it `blocked` and asks; relay that to the user instead of retrying yourself.
