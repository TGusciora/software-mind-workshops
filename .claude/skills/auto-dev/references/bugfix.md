# Route 3: Bug fix

Goal: prove the bug exists, pin it with a test that fails for the right reason, find the cause, fix it, and show the test pass. A fix without a reproduction is a guess.

Follow the project skills for the method. Invoke them with the Skill tool, in this order:

1. `mattpocock-skills:diagnosing-bugs`: the diagnosis loop (reproduce, minimise, hypothesise, instrument, fix, regression-test).
2. `mattpocock-skills:tdd`: red-green discipline for the regression test and the fix.

This route runs in the main thread, because diagnosis is iterative and needs the conversation. Spawn an `executor` only if the fix is large enough to need one, and then follow `small-feature.md` for how to brief it.

## Steps

1. **Branch.** On `main`, create `fix/<slug>`. Record the base: `git rev-parse HEAD`.
2. **Reproduce the exact bug.** Get the real symptom: the error text, the input, the expected versus actual result. Ask the user only for what you cannot find yourself (steps, data, environment). Run it and see it fail. If you cannot reproduce it, say so and stop: do not fix what you cannot see. Report what you tried.
3. **Write the test first.** Add a test that fails because of this bug, in the existing test suite and style of the area (`pizza-creator/server`, `pizza-creator/client`, `maps/test`, `orders-mcp`, `inventory-mcp`). Run it and show the failure. If it fails for a different reason than the reported symptom, the test is wrong: fix the test.
4. **Investigate the root cause.** Find why, not just where. Read the code, trace the data, add temporary instrumentation if needed and remove it afterwards. State the cause in one or two sentences before touching the code. If the cause is a design problem larger than the bug, tell the user and don't hide it behind a patch.
5. **Fix it.** The smallest change that addresses the cause. Read the rules in `.claude/rules/` that match the files you touch (for example `recipes/**` must keep pineapple). No drive-by refactors.
6. **Pass the test, then the suite.** Run the new test and show it green, then run the area's whole suite to check nothing else broke. Report failures as failures.
7. **Size gate.** Run `sh .claude/skills/execution-tidy/scripts/diff-size.sh --base <base>`. A bug fix over the limits means the fix is doing too much: show the report and discuss.
8. **Report**: symptom, reproduction, test name, root cause, the fix (file:line), and the test output. Offer a review (`reviewer` with the base commit) for anything non-trivial.

## Commits

Commit only if the user asks, as `fix(<scope>): <what was wrong>`, with the regression test in the same commit. Never push.
