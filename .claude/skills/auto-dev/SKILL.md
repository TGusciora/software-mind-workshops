---
name: auto-dev
allowed-tools: Agent, AskUserQuestion, Read, Write, Edit, Grep, Glob, Bash, Skill
description: Single entry point for development work in this repo. Routes the user's intent to one of four flows - discovery (decide the open questions autonomously, write a spec, plan tickets), ticket execution (coordinator, executors, reviewers, conventional commits), bug fixing (reproduce, failing test, root cause, fix) or small feature (one executor, immediately) - and hands each flow every relevant rule, skill and playbook. Use whenever the user wants to build, add, change, fix, plan, spec or implement anything, says "I want X", "add Y", "fix Z", "it's broken", "build this", "work through the tickets", or "auto-dev", even when they don't say which kind of work it is.
---

# Auto-dev

One door for all development work. Your job is to decide which of four routes the user's request belongs to, load that route's playbook, and make sure every agent you launch is given the repo's rules and skills. Subagents start with an empty context and do not inherit skills, so what you don't pass them, they don't know.

## 1. Classify the intent

| Route | Pick it when | Playbook |
|---|---|---|
| **Discovery** | The idea is new, vague or large ("I want a loyalty program", "we should do online ordering"); no spec exists; the user is unsure what they want | `references/discovery.md` |
| **Execute** | A spec or tickets already exist, or the user names tickets / "the backlog" / "everything in docs/tickets/x" | `references/execute.md` |
| **Bug fix** | Something that used to work or should work doesn't: errors, wrong output, regressions, "it's broken" | `references/bugfix.md` |
| **Small feature** | One clear, bounded addition or change the user can already describe in a sentence or two, with no open product decisions | `references/small-feature.md` |

Decide from the request plus a quick look at the repo (`docs/specs/`, `docs/tickets/`, `git status`). Tie-breakers, in order:

1. Anything broken beats everything else: bug fix.
2. Existing tickets or a spec the user points to: execute.
3. Open product decisions, or more than a handful of files likely: discovery. A "small" feature that needs scope decisions isn't small.
4. Otherwise: small feature.

If two routes fit equally, pick the one that best serves the mission, say which in one line, and go. Don't ask the user (see section 3, "Autonomy").

Read only the playbook for the chosen route. A request can change route midway (a "small feature" that turns out to need decisions becomes discovery, a bug fix that reveals a missing feature does too). Say so to the user, then switch playbooks.

## 2. Build the context pack

Before launching any agent, assemble a context pack and paste it into the agent's prompt. Build it from the repo as it is now, so new rules and skills are picked up without editing this file:

1. **Mission.** One line from `CLAUDE.md`: every choice moves us toward $3M of pizza by 2027-09-11.
2. **Rules.** List `.claude/rules/`. For each rule whose `paths` match the files the work will touch, include its path and its one-line obligation. Today that is `pineapple.md` for anything under `recipes/**`. If no rule matches, say "no rules apply".
3. **Skills to follow.** The route's playbook names which skill files each agent should read. Give the agent the file path (project skills live in `.claude/skills/<name>/SKILL.md`), because agents cannot call the Skill tool for you.
4. **Facts only you have.** The base commit (`git rev-parse HEAD` recorded before work starts), the branch, the ticket path or inline ticket, the previous agent's report, open questions.
5. **Guardrails** the hooks enforce: never read `.env` files, never `rm -rf`, never push, never commit to `main`.

Agents see none of this conversation. If it matters, it goes in the prompt.

## 3. Cross-cutting rules

- **Autonomy.** This repo is developed autonomously (see `CLAUDE.md`, "Operating mode"). Decide open questions yourself by weighing each answer against the vision, record the choice as an assumption, and keep going. Specs and backlogs need no user approval. Tell every agent you launch the same. Involve the human only for crucial or breaking changes (listed below under "Stop for the user").

- **Branch first.** On `main`, create a branch before any code is written (`feat/<slug>` or `fix/<slug>`). If the tree holds someone else's uncommitted work, stop and ask.
- **Size gate.** Before any review, run `sh .claude/skills/execution-tidy/scripts/diff-size.sh --base <base-commit>`. It passes or fails on size. A FAIL means the change is too big to review in one go: don't send it to the reviewer, have the planner split the ticket and continue, and mention it in the final report. Never raise limits in `limits.conf` to make a change pass.
- **Worktrees.** The `planner`, `executor` and `reviewer` agents run in isolated worktrees. When an agent reports a worktree path or branch, bring its changes into the working branch before the next step (`git merge`, or copy the files), and run the size gate on that tree.
- **Commits.** Conventional Commits (`feat(scope): …`, `fix(scope): …`, `docs(scope): …`), naming the ticket id when there is one. Commit only reviewed or verified work, and only when the route's playbook says to. Never push.
- **Honest reports.** If tests fail, a gate fails or a step was skipped, say so with the output. Don't report "done" on a failing test.
- **Stop for the user** only on crucial or breaking changes: breaking changes to existing behaviour, APIs, data or schemas; destructive or irreversible actions; new dependencies with cost or licence; security, secrets or credentials; deploys, pushes or other outward-facing actions; anything that would remove pineapple from a recipe; someone else's uncommitted work at risk. Everything else is yours to decide.

## 4. Finish

End with a short report: route taken, what was produced (spec, tickets, commits, test names), what was verified and how, and the decisions and assumptions you made (so the user can overrule them), and anything that needs a human. If the work naturally leads to another route (spec written, tickets planned), carry on into it without asking, unless a stop condition applies.
