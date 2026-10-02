# Route 1: Discovery

Goal: turn an idea into a spec and an ordered ticket backlog. Nothing gets built in this route.

## Steps

1. **Branch.** Stay on the current branch if it is not `main`; on `main` you only write docs, so a branch is optional here. Note `git status`.
2. **Launch `discovery`.** Give it the user's request verbatim plus the context pack (see SKILL.md section 2). Name these files for it to read:
   - `.claude/skills/user-story-creator/SKILL.md` (used when the idea is vague about users and needs)
   - `.claude/skills/spec-creator/SKILL.md` (the spec structure and questionnaire)
   - existing `docs/specs/`, `docs/stories/`, `plans/` that relate to the idea
   Tell it to decide every open question itself by weighing each possible answer against the vision, and to record each choice as an assumption. It saves `docs/specs/<slug>.md` and returns the path, the status, the assumptions and any "Needs human" items.
3. **Check the result yourself.** Read the spec. Check that each assumption fits the vision. If discovery returned `BLOCKED` with "Needs human" items (only crucial or breaking changes), put exactly those to the user, then continue the same agent with SendMessage. Otherwise don't ask anyone: send discovery back yourself if the spec has gaps.
4. **Launch `planner`.** Give it the spec path and the context pack. It writes `docs/tickets/<slug>/INDEX.md` and one `T-NNN-*.md` per ticket, and returns the ticket count and open questions.
5. **Review the backlog.** Read `INDEX.md`. Sanity-check that tickets are small (S or M), vertical, ordered with the revenue-critical path first, and cite requirement ids. Send the planner back for any that are not.
6. **Report.** Show the user the spec path, the ticket table, and the assumptions and decisions taken. Then continue into Route 2 (execute the tickets) unless a stop condition from SKILL.md applies or a precondition (e.g. an unmerged branch) blocks execution; say which.

## Commits

Commit the spec and tickets together as `docs(<slug>): add spec and tickets` only if the user asks. Never push.

## Failure modes

- Open question with no clear best answer: pick the smaller, reversible option, record it as an assumption, and list it in the report.
- The idea turns out to be a bug or a one-file change: say so and switch to the matching route.
