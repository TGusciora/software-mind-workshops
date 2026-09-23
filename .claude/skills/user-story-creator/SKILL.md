---
name: user-story-creator
allowed-tools: AskUserQuestion, Read, Write, Glob, Grep
description: Turn a rough product idea or feature request into a set of user stories (personas, epics, "As a... I want... so that..." stories with Given/When/Then acceptance criteria and MoSCoW priorities) by interviewing the user with AskUserQuestion. The output is the input for a later specification. Use whenever the user asks for user stories, a backlog, epics, acceptance criteria, "who needs what", or says things like "break this idea down", "what should users be able to do", "I want to build X, where do I start", or wants groundwork before writing a spec/PRD, even if they never say "user story".
---

# User Story Creator

Turn a rough idea into user stories the user has actually agreed with. They are the base for a spec (see the `spec-creator` skill), so every story has to be specific enough that a requirement and a test can be written from it.

The interview matters more than the document. Stories written from guesses look complete but hide the decisions nobody made. Your job is to surface those decisions cheaply, with concrete options the user can pick from in a few seconds.

## Workflow

### 1. Understand what is already known
- Restate the idea in 1-2 sentences.
- Check the repo for context before asking anything: `CLAUDE.md`, README, `docs/` (especially `docs/stories/` and `docs/specs/`), and relevant code. Business goals in CLAUDE.md, for example, tell you what "so that" should usually point to.
- If a stories file for this idea already exists, update it rather than starting over, and tell the user.
- From the prompt and the repo, note what is already answered, so you do not ask about it.

### 2. Interview in 2 rounds, using AskUserQuestion
Each round has at most 4 questions. Every question offers 2-4 concrete options that fit this product (not generic ones), with your recommendation first and marked "(Recommended)". Concrete options are faster to answer than open questions, and they show the user what you would assume.

**Round 1: who and why**
- **Users / personas**: who uses this? Offer plausible role sets (e.g. "customer + store staff + owner"). Use multiSelect when several can be true.
- **Core goal**: the single most important outcome for v1 (e.g. more orders, less manual work). This becomes the "so that" of the key stories.
- **Scope of v1**: which capability areas are in (multiSelect). These become the epics.
- **Constraint or context** that changes the stories most: devices, existing systems, compliance, deadline. Pick whichever matters most for this idea.

**Round 2: targeted follow-ups**
Draft personas and epics in your head first, then ask only about the gaps that would change a story:
- A behaviour choice inside a key epic (e.g. "Can guests order without an account?")
- Unhappy paths and edge cases (payment fails, item unavailable, offline)
- Priority conflicts: which of two epics is Must vs. Should
- Non-functional needs users would notice (speed, accessibility, languages, privacy)

Skip any question the prompt or repo already answers. If the user answers "not sure" or skips, choose a sensible default, record it as an assumption, and move on. Do not run a third round unless answers contradicted each other.

If AskUserQuestion is not available, for example when you run non-interactively, write the questions you would have asked, answer each with your recommended option, and record every answer as an assumption.

### 3. Write the stories
Save to `docs/stories/<kebab-case-name>.md` (create the folder if needed) using the template below.

Qualities to aim for (INVEST):
- **Independent and small**: one user-visible capability per story. If a story needs "and", or would take more than a few days, split it.
- **Valuable**: the "so that" names a real benefit to that persona, not a restatement of the feature ("so that I can use the reorder button" is not a benefit).
- **Testable**: acceptance criteria are concrete Given/When/Then with real values ("within 2 seconds", "up to 10 items"), including at least one unhappy path for every Must story.
- **No implementation detail**: describe behaviour, not tech ("stored in Postgres" belongs in the spec, not in a story).

Aim for 3-6 epics and roughly 8-25 stories in total. Enough to cover v1, but not every conceivable feature. Put ideas you consciously left out under "Out of scope". Knowing what is not built is as useful to the spec as knowing what is.

Give each story a stable ID (`US-01`, `US-02`, ...) numbered across the whole file, so the spec can refer to it.

```markdown
# <Product / feature name>: User stories

## Context
<2-3 sentences: the idea, the core goal, and how v1 success is measured>

## Personas
| Persona | Who they are | What they need most |
|---|---|---|

## Epics overview
| Epic | Goal | Stories | Priority |
|---|---|---|---|

## Epic 1: <name>
<one line on the goal of this epic>

### US-01 <short title>
**As a** <persona>
**I want** <capability>
**so that** <benefit>

Priority: Must | Should | Could · Size: S | M | L

**Acceptance criteria**
- Given <context>
  When <action>
  Then <observable outcome>
- Given <unhappy path context>
  When <action>
  Then <observable outcome>

**Notes:** <optional: open detail, dependency on US-xx>

## Non-functional stories
<stories for performance, accessibility, security, etc., same format>

## Out of scope (v1)
- <idea>: <why it is deferred>

## Assumptions
- <every default you picked without the user confirming it>

## Open questions
- <decisions still needed, with who should answer them if known>

## Interview log
<the questions asked and the answers given, briefly, so the spec author can see where each decision came from>
```

Personas must match the "As a" lines exactly. Do not introduce a persona in a story that is not in the table.

### 4. Confirm and hand off
Reply with:
- the file path
- counts: personas, epics, stories (split into Must/Should/Could)
- the 2-3 assumptions most worth challenging
- the open questions

Ask whether anything should change, and revise the file in place. Once the user is happy, offer the next step: "Want me to turn these into a spec?" (spec-creator reads `docs/stories/` automatically).
