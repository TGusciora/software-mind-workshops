---
name: spec-creator
allowed-tools: AskUserQuestion, Read, Write, Bash
description: Turn a rough idea or prompt into a written project specification by running a short goals-and-vision questionnaire and proposing a technology stack. Use whenever the user wants a spec, PRD, requirements doc, project brief, or says things like "I want to build X, help me plan it", "write a spec for...", or "spec this out", even if they don't say "specification".
---

# Spec Creator

Turn a vague idea into a spec the user has actually thought through. The questionnaire matters more than the document: a spec written from guesses just hides the open decisions.

## Workflow

### 1. Restate the idea
Read the user's prompt and restate it in 1-2 sentences. Check the repo (README, CLAUDE.md, existing code) for context so you don't ask what is already answered.

If `docs/stories/` has a stories file for this idea (made by the `user-story-creator` skill), use it as the main input. Take users from its personas, scope from its epics and out-of-scope list, and requirements from its stories, keeping the `US-xx` IDs for traceability. Carry over its assumptions and open questions. Then skip the questionnaire questions it already answers, which usually leaves only the Technology round.

### 2. Run the questionnaire
Use AskUserQuestion, at most 4 questions per round, 2-3 rounds. Offer concrete options and put your recommendation first. Skip any question the prompt or repo already answers.

**Round 1 - Goals and vision**
- What problem does this solve, and for whom (target users)?
- What does success look like (measurable outcome, e.g. revenue, users, time saved)?
- What is the vision beyond v1 (where should this be in 6-12 months)?
- Timeline / deadline?

**Round 2 - Scope**
- Must-have features for v1 vs. explicitly out of scope
- Key user flows
- Constraints: budget, team size, compliance, existing systems to integrate

**Round 3 - Technology**
- Propose a stack (frontend, backend, data, hosting) with a one-line reason for each choice, tied to the constraints above. Prefer boring, well-known tech unless the goals demand otherwise.
- Ask the user to accept, swap, or say what they already use.

If an answer is "I don't know", pick a sensible default, mark it as an assumption, and move on.

### 3. Write the spec
Save to `docs/specs/<kebab-case-name>.md` (create the folder if needed) using this structure:

```
# <Project name>
## Summary            (2-3 sentences)
## Goals & vision     (goals, success metrics, long-term vision)
## Users              (who, and their key needs)
## Scope
### In scope (v1)
### Out of scope
## Requirements       (numbered, testable, each with priority: must/should/could)
## Technology         (chosen stack + rationale, alternatives considered)
## Constraints & assumptions
## Risks & open questions
## Milestones         (rough phases with target dates)
```

Keep requirements specific and testable ("user can pay by card in under 3 clicks", not "easy checkout"). Record every assumption you made explicitly so the user can challenge it.

### 4. Confirm
Give the user the file path and a 3-line summary, and list the open questions. Ask if anything should change; revise the file in place.
